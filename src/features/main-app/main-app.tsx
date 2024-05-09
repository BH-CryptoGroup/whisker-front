import { FC, ReactElement } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';
import fakeSpin from '../../assets/images/spin_mock.png';
import loaderIcon from '../../assets/images/loader.png';
import { Typography } from '../../shared/components/typography';
import { Button } from '../../shared/components/button';
import giftIcon from '../../assets/images/gift_icon.png';

import styles from './main-app.module.scss';

const MainApp: FC = (): ReactElement => {
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

    return (
        <div className={styles.app__wrapper}>
            <div className={styles.app__container}>
                <div className={styles.app__spin}>
                    <div className={styles.app__title_and_logo}>
                        <Logo fontSize={isMobile ? '35px' : '70px'} />
                        <span className={styles.app__title}>
                            <Heading className={styles.app__heading} level="h1">
                                Spin&Earn
                            </Heading>
                        </span>
                    </div>
                    <img className={styles.app__spin_img} src={fakeSpin} />
                    <div className={styles.app__spin_button}>
                        <img className={styles.app__spin_button__loader} src={loaderIcon} />
                        <Typography fontSize={isMobile ? '50px' : '120px'} fontFamily="Roundy Rainbows, sans-serif">
                            SPin
                        </Typography>
                    </div>
                </div>

                <div className={styles.app__exta_spins}>
                    <div className={styles.app__exta_spins__free_spin}>
                        <Typography fontSize={isMobile ? '20px' : '40px'}>Free spins</Typography>
                        <div className={styles.app__exta_spins__free_spin__score}>
                           <Typography fontSize={isMobile ? '40px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                                    2
                                </Typography>
                            <Typography fontSize={isMobile ? '40px' : '50px'} fontFamily="Roundy Rainbows, sans-serif" color="grey">
                                    |
                                </Typography>
                            <Typography fontSize={isMobile ? '40px' : '50px'} fontFamily="Roundy Rainbows, sans-serif" color="grey">
                                    2
                                </Typography>
                        </div>
                                
                    </div>
                    <div className={styles.app__exta_spins__bonus_spin}>
                        <Typography fontSize={isMobile ? '20px' : '40px'}>Bonus spins</Typography>
                        <Typography fontSize={isMobile ? '40px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                                0
                            </Typography>
                    </div>
                </div>


                <div className={styles.app__invitation}>
                    <Button
                    imageLeft={giftIcon}
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '100px' : '200px'}
                    textTransform={'none'}
                    text={'Refer A Friend'}
                    subText={'Get 3 bonus spins'}
                    fontWeight={'bolder'}
                    borderRadius={'30px'}
                    />
                    
                </div>




                <div className={styles.app__footer_connect}>
                    <div className={styles.app__footer_connect_container}>
                        <div className={styles.app__footer_connect_score}>
                            <Typography fontSize={isMobile ? '20px' : '40px'}>Unclaimed whisk</Typography>
                            <Typography fontSize={isMobile ? '40px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                                10200
                            </Typography>
                        </div>
                        <Button
                            fontFamily={'Montserrat, sans-serif'}
                            height={isMobile ? '50px' : '70px'}
                            fontSize={isMobile ? '20px' : '40px'}
                            text={'Connect wallet'}
                            fontWeight={'normal'}
                            width={'fit-content'}
                            textTransform={'none'}

                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainApp;
