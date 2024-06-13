import { FC, ReactElement } from 'react';
import { Typography } from '../../shared/components/typography';
import styles from './footer.module.scss';
import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';
import { Button } from '../../shared/components/button';

interface Props {
    points: number | undefined;
    isMobile: boolean;
}

export const Footer: FC<Props> = ({ points, isMobile }): ReactElement => {
    return (
        <div className={styles.app__footer_connect}>
            <div className={styles.app__footer_connect_container}>
                <div className={styles.app__footer_connect_score}>
                    <Typography fontSize={isMobile ? '18px' : '40px'}>Unclaimed whisk</Typography>
                    <div className={styles.app__footer_connect_tokens}>
                        <Typography fontSize={isMobile ? '30px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                            {points || 0}
                        </Typography>
                        <Button
                            fontFamily={'Montserrat, sans-serif'}
                            height={isMobile ? '24px' : '42px'}
                            fontSize={isMobile ? '16px' : '40px'}
                            backgroundColor="#0080bb"
                            text={'Claim tokens'}
                            fontWeight={'normal'}
                            width={'fit-content'}
                            textTransform={'none'}
                            borderRadius="24px"
                        />
                    </div>
                </div>
                <div className={styles.app__footer_connect_wallet}>
                    <TonConnectModal />
                </div>
            </div>
        </div>
    );
};

