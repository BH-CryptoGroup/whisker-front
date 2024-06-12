import { createContext, useContext, FC, ReactNode, useRef, useState } from 'react';
import BackgroundSound from '../../assets/sounds/Casino Background Loop.mp3';

interface AudioContextType {
    startAudio: () => void;
    stopAudio: () => void;
    isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAudio = async () => {
        let audioContext = audioContextRef.current;
        if (!audioContext) {
            //@ts-ignore
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
        }

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }

        const response = await fetch(BackgroundSound);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(audioContext.destination);
        source.start(0);
        audioSourceRef.current = source;
        setIsPlaying(true);
    };

    const stopAudio = () => {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }
        setIsPlaying(false);
    };

    return <AudioContext.Provider value={{ startAudio, stopAudio, isPlaying }}>{children}</AudioContext.Provider>;
};

