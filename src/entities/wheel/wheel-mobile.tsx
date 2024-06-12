import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import kitty from '../../assets/images/kitty.png';
import loaderIcon from '../../assets/images/loader.png';
import { useAppContext } from '../../app/providers/AppContext';
import soundWheel from '../../assets/sounds/Fortune-Prize-Wheel-01.mp3';
import { Typography } from '../../shared/components/typography';

import styles from './wheel.module.scss';
import { LottieAnimation } from '../lottie-animation/lottie-animation';
// import coinAnimation from '../../assets/animations/coin-dollar.json';
import WinAnimation10 from '../../assets/animations/10-points-win-animation.json';
import WinAnimation5 from '../../assets/animations/5-points-win-animation.json';
import WinAnimation50 from '../../assets/animations/50-points-win-animation.json';
import WinAnimation100 from '../../assets/animations/100-points-win-animation.json';
import { Flip, toast } from 'react-toastify';
import { SectorData, sectorsData } from './constants';
import { WHEEL_SPINNING_SECONDS } from '../../shared/libs/constants';
import { useAudio } from '../../app/providers/AudioProvider';
import muteMusicImage from '../../assets/images/no-sound.png';
import enableMusicImage from '../../assets/images/medium-volume.png';
import fastForwardButton from '../../assets/images/fast-forward-button.png';

interface WheelMobileProps {
    isAvailableToSpin: boolean;
    isUserLoggedIn: boolean;
}

type WinAnimation = 5 | 10 | 50 | 100;

const WinAnimations: { [key in WinAnimation]: any } = {
    5: WinAnimation5,
    10: WinAnimation10,
    50: WinAnimation50,
    100: WinAnimation100,
};

export const WheelMobile: FC<WheelMobileProps> = ({ isAvailableToSpin, isUserLoggedIn }): ReactElement => {
    const { isFreeSpins, updateFreeSpins, updateBonusSpins, updateTempWinScore } = useAppContext();
    const { startAudio, stopAudio, isPlaying } = useAudio();
    const [isDisplayAnimation, setIsDisplayAnimation] = useState<boolean>(false);
    const [winAnimation, setWinAnimation] = useState<WinAnimation | null>(100);
    const [isNeedRotateSpinIcon, setIsNeedRotateSpinIcon] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const image = useRef(new Image());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    //constants
    const increaseCoeff = 4; //for canvas better quality

    const pictureParams = {
        image: image,
        x: 138.25 * increaseCoeff,
        y: 131.25 * increaseCoeff,
        w: 73.5 * increaseCoeff,
        h: 80.5 * increaseCoeff,
    };

    const width = 350; //canvas observable width
    const height = 350;
    const dpiWidth = width * increaseCoeff; //canvas real width
    const dpiHeight = height * increaseCoeff;
    const centerX = Math.floor(dpiWidth / 2); //center point of wheel
    const centerY = Math.floor(dpiHeight / 2);
    const radius1 = 158 * increaseCoeff; //biggest radius
    const radiusMicroPointCircle = 148.4 * increaseCoeff;
    const radius2 = 138.5 * increaseCoeff;
    const radius3 = 128.8 * increaseCoeff;
    const radiusText = 100 * increaseCoeff;
    const radius4 = 44.8 * increaseCoeff;
    const radius5 = 37.8 * increaseCoeff;
    const radius6 = 35.7 * increaseCoeff; //smallest radius
    const radiusMicroPoint = 4 * increaseCoeff;
    const circleColour1 = '#1d3649';
    const circleColour2 = 'rgba(0,0,0,0.15)';
    const circleColour4 = '#1d3749';
    const circleColour5 = '#f4f4f4';
    const circleColour6 = '#0594d3';
    const circleColourMicro = '#f4f4f4';
    const textFontSize = 28;
    const dpiTextFontSize = textFontSize * increaseCoeff;
    const textStyles = {
        fillColor: '#fff',
        textFont: `${dpiTextFontSize}px Roundy Rainbows, sans-serif`,
    };
    const turns = 4; //number of turns for one spin
    const oneSectorAngle = 1 / sectorsData.length;
    const beginTwistAngleRef = useRef(-0.25);
    const winAngleRef = useRef(0);
    const spinCountRef = useRef(0);

    useEffect(() => {
        image.current.onload = () => {
            setImageLoaded(true);
        };
        image.current.src = kitty;

        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                setCtx(context);
            }
        }

        return () => {
            cleanUpFunc();
        };
    }, []);

    useEffect(() => {
        if (canvasRef.current && imageLoaded && ctx) {
            InitializeWheel();
        }
    }, [imageLoaded, ctx]);

    function cleanUpFunc() {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsDisplayAnimation(false);
        setIsNeedRotateSpinIcon(false);
    }

    function InitializeWheel() {
        drawWheel(beginTwistAngleRef.current, sectorsData);
    }

    const handleSpinButtonClick = () => {
        if (isUserLoggedIn) {
            if (isNeedRotateSpinIcon || !isAvailableToSpin) return; //

            if (isDisplayAnimation) setIsDisplayAnimation(false);

            if (!isFreeSpins) {
                updateBonusSpins();
            } else {
                updateFreeSpins();
            }

            twistWheel();

            setIsNeedRotateSpinIcon(true);

            if (audioRef.current) {
                audioRef.current.play();
            }

            setTimeout(() => {
                setIsDisplayAnimation(true);
            }, WHEEL_SPINNING_SECONDS);

            // setTimeout(() => {
            //     if (audioRef.current) {
            //         audioRef.current.pause();
            //     }
            // }, 7_000);

            setTimeout(() => {
                setIsNeedRotateSpinIcon(false);
            }, 10_500);

            setTimeout(() => {
                setIsDisplayAnimation(false);
            }, 10_500);
        } else {
            toast.error(`Cannot spin it`, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Flip,
            });
        }
    };

    function twistWheel() {
        const randomSectorValue = randomSector();

        const randomSectorCenter = -(oneSectorAngle * ((randomSectorValue as number) + 0.5)).toFixed(4);

        if (spinCountRef.current) beginTwistAngleRef.current = winAngleRef.current;

        spinCountRef.current++;

        winAngleRef.current = randomSectorCenter;

        if (winAngleRef.current >= 1) winAngleRef.current--;
        if (winAngleRef.current < 0) winAngleRef.current++;

        animate({
            duration: 5000,
            timing: timing,
        });
    }

    //get random sector according to sectors probabilities
    function randomSector() {
        const randomNumber = Math.floor(Math.random() * 360) + 1; // 1...360

        for (let i = 0, upperBorder = 0; i < sectorsData?.length; i++) {
            upperBorder += sectorsData?.[i]?.probability as number;
            if (randomNumber < upperBorder) {
                setWinAnimation(sectorsData?.[i]?.value as WinAnimation);
                updateTempWinScore(sectorsData?.[i]?.value); // add score setter and make request here
                return i;
            }
        }
    }

    function animate({ timing, duration }: { timing: (fraction: number) => number; duration: number }) {
        const start = performance.now();
        const raf = requestAnimationFrame(function animate(time) {
            // timeFraction from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const progress =
                beginTwistAngleRef.current +
                timing(timeFraction) * (-beginTwistAngleRef.current + winAngleRef.current + turns);
            redrawWheel(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(raf);
            }
        });
    }

    function timing(timeFraction: number) {
        if (timeFraction < 0.25) {
            return timeFraction * 2;
        } else {
            return Math.pow(timeFraction, 1 / 2);
        }
    }

    function redrawWheel(beginTwistAngle: number) {
        ctx?.clearRect(0, 0, dpiWidth, dpiHeight);
        drawWheel(beginTwistAngle, sectorsData);
    }

    function drawWheel(beginAngle: number, sectorsData: SectorData[]) {
        drawOuterWheelPart();
        drawMiddleWheelPart(beginAngle, sectorsData);
        drawInnerWheelPart();

        const { image, x, y, w, h } = pictureParams;
        ctx?.drawImage(image.current, x, y, w, h);
        drawTriangle();
    }

    function drawOuterWheelPart() {
        drawCircleBorder(centerX, centerY, radius1, radius2, circleColour1);
        drawPointsOnCircle(
            centerX,
            centerY,
            radiusMicroPointCircle,
            radiusMicroPoint,
            oneSectorAngle,
            circleColourMicro,
        );
    }

    function drawMiddleWheelPart(beginAngle: number, sectorsData: SectorData[]) {
        let currentAngle = beginAngle;

        sectorsData?.map((sector) => {
            drawWholeSector(
                radius2,
                radiusText,
                currentAngle,
                currentAngle + oneSectorAngle,
                sector.colour,
                sector.value,
            );

            currentAngle += oneSectorAngle;
        });

        drawCircleBorder(centerX, centerY, radius2, radius3, circleColour2);
    }

    function drawInnerWheelPart() {
        drawCircleBorder(centerX, centerY, radius5, radius4, circleColour4);
        drawCircleBorder(centerX, centerY, radius6, radius5, circleColour5);
        drawCircle(centerX, centerY, radius6, circleColour6);
    }

    function drawCircleBorder(
        centerX: number,
        centerY: number,
        radiusExternal: number,
        radiusInternal: number,
        colour: string,
    ) {
        ctx?.save();

        if (ctx) {
            ctx.fillStyle = colour;
        }

        ctx?.beginPath();
        ctx?.arc(centerX, centerY, radiusExternal, 0, 2 * Math.PI, false);
        ctx?.arc(centerX, centerY, radiusInternal, 0, 2 * Math.PI, true);
        ctx?.closePath();
        ctx?.fill();

        ctx?.restore();
    }

    function drawCircle(centerX: number, centerY: number, radius: number, colour: string) {
        ctx?.save();

        if (ctx) {
            ctx.fillStyle = colour;
        }

        ctx?.beginPath();
        ctx?.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx?.closePath();
        ctx?.fill();

        ctx?.restore();
    }

    function drawPointsOnCircle(
        circleCenterX: number,
        circleCenterY: number,
        circleRadius: number,
        pointRadius: number,
        angle: number,
        colour: string,
    ) {
        let centerX, centerY;
        let currentAngle = 0;

        while (currentAngle < 1) {
            centerX = circleCenterX + circleRadius * Math.cos(currentAngle * 2 * Math.PI);
            centerY = circleCenterY + circleRadius * Math.sin(currentAngle * 2 * Math.PI);

            if (currentAngle < 0.625 || currentAngle > 0.875) {
                drawCircle(centerX, centerY, pointRadius, colour);
            }

            currentAngle += angle;
        }
    }

    function drawTriangle() {
        const side = 20 * increaseCoeff;
        ctx?.save();

        if (ctx) {
            ctx.strokeStyle = '#f4f4f4';
            ctx.fillStyle = '#f4f4f4';
            ctx.lineWidth = 10 * increaseCoeff;
            if (ctx) {
                ctx.lineCap = 'round';
            }
        }

        ctx?.beginPath();
        ctx?.moveTo(centerX + 140 * increaseCoeff, centerY);
        ctx?.lineTo(centerX + 140 * increaseCoeff + (side * Math.sqrt(3)) / 2, centerY + side / 2);
        ctx?.lineTo(centerX + 140 * increaseCoeff + (side * Math.sqrt(3)) / 2, centerY - side / 2);

        ctx?.closePath();
        ctx?.stroke();
        ctx?.fill();

        ctx?.restore();
    }

    function drawWholeSector(
        radius: number,
        radiusText: number,
        startAnglePart: number,
        endAnglePart: number,
        sectorFillColor: string,
        text: number,
    ) {
        const startAngle = startAnglePart * 2 * Math.PI;
        const endAngle = endAnglePart * 2 * Math.PI;
        const midAngle = ((startAnglePart + endAnglePart) / 2) * 2 * Math.PI;

        drawSector(radius, startAngle, endAngle, sectorFillColor);
        drawSectorText(midAngle, radiusText, text);
    }

    function drawSector(radius: number, startAngle: number, endAngle: number, sectorFillColor: string) {
        ctx?.save();

        if (ctx) {
            ctx.fillStyle = sectorFillColor;
        }

        ctx?.beginPath();
        ctx?.moveTo(centerX, centerY);
        ctx?.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx?.closePath();
        ctx?.fill();

        ctx?.restore();
    }

    function drawSectorText(middleAngle: number, radius: number, text: number) {
        ctx?.save();

        if (ctx) {
            ctx.fillStyle = textStyles.fillColor;
            ctx.font = textStyles.textFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        }

        ctx?.translate(centerX, centerY);
        ctx?.rotate(middleAngle);
        ctx?.fillText(String(text), radius, 0);

        ctx?.restore();
    }

    return (
        <>
            {isDisplayAnimation && winAnimation && (
                <div className={styles.app__coin_icon_animation}>
                    <LottieAnimation animationData={WinAnimations[winAnimation]} loop={0} autoplay={true} />
                </div>
            )}
            <audio ref={audioRef}>
                <source src={soundWheel} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <canvas
                ref={canvasRef}
                width={dpiWidth}
                height={dpiHeight}
                style={{ width: `${width}px`, height: `${height}px` }}
                id="canvas"
            />
            <div className={styles.app__fast_forward}>
                <img onClick={startAudio} className={styles.app__fast_forward__icon} src={fastForwardButton} />
            </div>
            <div className={styles.app__enable_or_disable_music}>
                {isPlaying ? (
                    <img
                        onClick={stopAudio}
                        className={styles.app__enable_or_disable_music__icon}
                        src={muteMusicImage}
                    />
                ) : (
                    <img
                        onClick={startAudio}
                        className={styles.app__enable_or_disable_music__icon}
                        src={enableMusicImage}
                    />
                )}
            </div>
            <div
                onClick={handleSpinButtonClick}
                className={`${styles.app__spin_button} ${!isAvailableToSpin || isNeedRotateSpinIcon ? styles.disable : ''}`}
            >
                <img
                    className={`${styles.app__spin_button__loader} ${isNeedRotateSpinIcon ? styles.rotate : ''}`}
                    src={loaderIcon}
                />
                <Typography fontSize={'42px'} fontFamily="Roundy Rainbows, sans-serif">
                    SPin
                </Typography>
            </div>
        </>
    );
};

