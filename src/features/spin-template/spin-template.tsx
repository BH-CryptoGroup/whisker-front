import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';
import { WheelMobile } from '../../entities/wheel/wheel-mobile';

import styles from './spin-template.module.scss';
import { FC, ReactElement } from 'react';

interface Props {
    isMobile: boolean;
    isAvailableToSpin: boolean;
    isUserLoggedIn: boolean;
}

export const SpinTemplate: FC<Props> = ({ isMobile, isAvailableToSpin, isUserLoggedIn }): ReactElement => {
    return (
        <div className={styles.app__spin}>
            <div className={styles.app__title_and_logo}>
                <Logo fontSize={isMobile ? '32px' : '70px'} />
                <span className={styles.app__title}>
                    <Heading className={styles.app__heading} level="h1">
                        Spin&Earn
                    </Heading>
                </span>
            </div>

            <WheelMobile isUserLoggedIn={isUserLoggedIn} isAvailableToSpin={isAvailableToSpin} />
        </div>
    );
};

