import { Typography } from '../../shared/components/typography';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timeIcon from '../../assets/images/time_icon.png';
import { Button } from '../../shared/components/button';
import { UserData } from '../../app/providers/AppContext';

import styles from './extra-spins.module.scss';
import { getTimeLeftFromTimestamp } from '../../shared/libs/getTimeLeft';

interface Props {
    userData: UserData | null;
    isMobile: boolean;
}

export const ExtraSpins: FC<Props> = ({ userData, isMobile }): ReactElement => {
    const navigate = useNavigate();
    const [rotateIcon, setRotateIcon] = useState<boolean>(false);
    const timeIconRef = useRef<HTMLImageElement>(null);
    const lastSpinTime = userData?.lastSpinTime;

    useEffect(() => {
        const interval = setInterval(() => {
            setRotateIcon((prevRotate) => !prevRotate);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const onNavigateToBuyPage = () => {
        navigate('/buy');
    };

    const correctedLastTime = () => {
        const res = getTimeLeftFromTimestamp(lastSpinTime?.[0] || '');

        console.log('res', res);

        if (res.includes('NaN')) {
            return '...';
        } else {
            return res;
        }
    };

    return (
        <div className={styles.app__extra_spins}>
            <div className={styles.app__extra_spins__free_spin}>
                <Typography fontSize={isMobile ? '16px' : '40px'}>Free spins</Typography>
                <div className={styles.app__extra_spins__free_spin__score}>
                    <Typography
                        className={styles.app__extra_spins__free_spin__score_p}
                        color={userData?.spinsAvailable === 0 ? '#73747f' : '#fff'}
                        fontSize={isMobile ? '28px' : '50px'}
                        fontFamily="Roundy Rainbows, sans-serif"
                    >
                        {userData?.spinsAvailable}
                    </Typography>

                    {/*@ts-ignore */}
                    {userData?.spinsAvailable < 2 ? (
                        <div className={styles.app__extra_spins__free_spin__recharge}>
                            <img
                                ref={timeIconRef}
                                className={`${styles.app__extra_spins__free_spin__time_icon} ${rotateIcon ? styles.rotate : ''}`}
                                src={timeIcon}
                            />
                            <Typography
                                className={styles.app__extra_spins__free_spin__time_text}
                                fontSize={isMobile ? '12px' : '23px'}
                                fontFamily="Montserrat, sans-serif"
                            >
                                New spin in <br /> {correctedLastTime()}
                            </Typography>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className={styles.app__extra_spins__bonus_spin}>
                <div className={styles.app__extra_spins__bonus_spin__text_wrapper}>
                    <Typography fontSize={isMobile ? '16px' : '40px'}>Bonus spins</Typography>
                    <div className={styles.app__extra_spins__bonus_spin__buy_spins}>
                        <Typography
                            color={userData?.bonusSpins === 0 ? '#73747f' : '#fff'}
                            fontSize={isMobile ? '28px' : '50px'}
                            fontFamily="Roundy Rainbows, sans-serif"
                        >
                            {userData?.bonusSpins}
                        </Typography>
                        <Button
                            onClick={onNavigateToBuyPage}
                            fontFamily={'Montserrat, sans-serif'}
                            fontSize="16px"
                            height={isMobile ? '34px' : '43px'}
                            width="fit-content"
                            textTransform={'none'}
                            text={'Buy spins'}
                            fontWeight={'bolder'}
                            borderRadius={'30px'}
                            stylesForTexts={{
                                main: { fontSize: isMobile ? '16px' : '32px', fontWeight: 'normal' },
                                sub: { fontSize: isMobile ? '18px' : '32px', fontWeight: 'normal' },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

