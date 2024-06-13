import { FC, ReactElement } from 'react';
import { Heading } from '../../shared/components/heading';
import deviceCheckingIcon from '../../assets/images/device-checking.png';
import { Logo } from '../../shared/components/logo';
import { Typography } from '../../shared/components/typography';

import styles from './device-checking-screen.module.scss';

const DeviceCheckingScreen: FC = (): ReactElement => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.logo_and_heading}>
                    <Logo />
                    <div className={styles.heading_wrapper}>
                        <Heading level="h1">Spin&Earn</Heading>
                    </div>
                </div>
                <img src={deviceCheckingIcon} className={styles.device_checking_icon} alt="device checking" />
                <Typography className={styles.sub_text} fontSize="28px" fontFamily="Montserrat, sans-serif">
                    This game is availiable only on mobile.
                </Typography>
            </div>
        </div>
    );
};

export default DeviceCheckingScreen;

