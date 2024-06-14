import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { loginUser, referralUser, spinWheelByUser } from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';
import DeviceCheckingScreen from '../../features/device-checking-screen/DeviceCheckingScreen';
import MobileDetect from 'mobile-detect';

//@ts-ignore
const tg: any = window?.Telegram?.WebApp;

export interface UserData {
    bonusSpins: number;
    createdAt: string;
    referralCode: string;
    referredBy: null | any;
    referredUsers: any[];
    spinsAvailable: number;
    points: number;
    unclaimedWhisks: number;
    userTonAddress: string;
    updatedAt: string;
    lastSpinTime: string[];
    userId: string;
    __v: number;
    _id: string;
}

export interface TelegramUserData {
    allows_write_to_pm: boolean;
    first_name: string;
    id: number;
    is_premium: boolean;
    language_code: string;
    last_name: string;
    username: string;
}

interface AppContextType {
    userData: UserData | null;
    isFreeSpins: boolean | null;
    isMobile: boolean;
    isAvailableToSpin: boolean;
    tgUser: TelegramUserData | null;
    updateFreeSpins: () => void;
    updateUnclaimedWhisks: () => void;
    updateBonusSpins: (countSpins?: number) => void;
    updateTempWinScore: (score: number, delay: number) => void;
}

const fetchAndUpdateUserData = async (userId: string, setUserData: (user: UserData) => void) => {
    try {
        const res = await loginUser(userId); // Adjust the endpoint and method as needed
        if (res) {
            setUserData((prev: UserData): UserData => {
                return { ...prev, lastSpinTime: res?.user?.lastSpinTime };
            });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// const FAKE_USER = {
//     _id: '664df59323d74ce23ab961f5',
//     userId: '574813379',
//     unclaimedTokens: 60,
//     countSpins: 3,
//     spinsAvailable: 2,
//     bonusSpins: 0,
//     referralCode: '6910180d-d5b0-4093-a4b0-268a999c4ac2',
//     referredBy: null,
//     referredUsers: [],
//     lastSpinTime: ['2024-05-21T19:02:04.007+00:00', '2024-05-22T04:24:11.639+00:00', '2024-05-22T10:17:34.732+00:00'],
//     createdAt: '2024-05-21T11:33:49.389+00:00',
//     updatedAt: '2024-05-22T10:17:34.733+00:00',
//     __v: 5,
// } as any;

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export const AppContextProvider: React.FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [tgUser, setTgUser] = useState<TelegramUserData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [isFreeSpins, setIsFreeSpins] = useState<boolean | null>(false);
    const [isAvailableToSpin, setIsAvailableToSpin] = useState<boolean>(false);
    const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false);
    const uriParams = parseUriParamsLine(window.location.href?.split('?')?.[1]);
    const userAgent = navigator.userAgent;
    const md = new MobileDetect(userAgent);
    const isMobileDevice = md.mobile() !== null;
    const isTelegramWebApp = userAgent.includes('Telegram');

    useEffect(() => {
        return () => {
            onExitFromApp();
        };
    }, []);

    useEffect(() => {
        //@ts-ignore
        if (window.Telegram && window.Telegram.WebApp) {
            //@ts-ignore
            tg.ready();
            // Get user data from the Telegram Web App context
            const user = tg.initDataUnsafe.user;
            setTgUser(user);
        } else {
            console.error('Telegram WebApp is not initialized or running outside of Telegram context.');
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (tgUser?.id?.toString()) {
                    const res = await loginUser(tgUser?.id?.toString());
                    if (res) {
                        setUserData(res.user);
                        if (uriParams?.tgWebAppStartParam) {
                            await referralUser(res.user.userId, {
                                referredById: uriParams?.tgWebAppStartParam?.split('#')?.[0],
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [tgUser?.id, uriParams?.startapp]);

    useEffect(() => {
        //@ts-ignore
        if (userData?.bonusSpins > 0) {
            setIsFreeSpins(false);
            setIsAvailableToSpin(true);
            //@ts-ignore
        } else if (userData?.spinsAvailable > 0) {
            setIsFreeSpins(true);
            setIsAvailableToSpin(true);
        } else {
            setIsFreeSpins(null);
            setIsAvailableToSpin(false);
        }

        setTimeout(() => {
            setIsAppLoaded(true);
            setIsLoading(false);
        }, 4000);
    }, [userData?.spinsAvailable, userData?.bonusSpins]);

    useEffect(() => {
        if (userData && userData?.lastSpinTime?.length > 0) {
            const checkSpinTimes = () => {
                const now = new Date();
                userData.lastSpinTime.forEach(async (spinTime) => {
                    if (new Date(spinTime) <= now) {
                        if (tgUser?.id?.toString()) {
                            await fetchAndUpdateUserData(tgUser?.id?.toString(), setUserData);
                        }
                    }
                });
            };

            const interval = setInterval(checkSpinTimes, 1000);

            return () => clearInterval(interval);
        }
    }, [tgUser?.id, userData?.lastSpinTime]);

    if (!isMobileDevice || isTelegramWebApp) {
        return <DeviceCheckingScreen />;
    }

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    // Actions
    const updateTempWinScore = (score: number, delay: number) => {
        if (userData?.userId) {
            spinWheelByUser(userData?.userId, {
                winScore: score,
                isFreeSpin: isFreeSpins,
            }).then(async (res) => {
                if (res && res.status && res?.status === 200) {
                    if (tgUser?.id?.toString()) {
                        await fetchAndUpdateUserData(tgUser?.id?.toString(), setUserData);
                    }
                    setTimeout(() => {
                        setUserData((prevUserData: any) => ({
                            ...prevUserData,
                            points: prevUserData.points + score,
                            unclaimedWhisks: prevUserData.unclaimedWhisks + score,
                        }));
                    }, delay); // because a little delay in animation
                }
            });
        }
    };

    const updateFreeSpins = async () => {
        if (userData) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                spinsAvailable: prevUserData.spinsAvailable > 0 ? prevUserData.spinsAvailable - 1 : 0,
            }));
        }
    };

    const updateBonusSpins = (countSpins?: number) => {
        if (countSpins) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: (prevUserData.bonusSpins += countSpins),
            }));
        } else {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: prevUserData.bonusSpins - 1,
            }));
        }
    };

    const updateUnclaimedWhisks = () => {
        setUserData((prevUserData: any) => ({
            ...prevUserData,
            points: 0,
            unclaimedWhisks: 0,
        }));
    };

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                isFreeSpins,
                isAvailableToSpin,
                isMobile,
                updateTempWinScore,
                updateFreeSpins,
                updateBonusSpins,
                updateUnclaimedWhisks,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

