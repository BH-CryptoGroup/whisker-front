import { useNavigate } from 'react-router-dom';
import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';
import styles from './buy-template.module.scss';
import { BUY_ROWS_DATA } from './constants';
import { BuyTokenRow } from '../../entities/buy-token-row/but-token-row';
import { Typography } from '../../shared/components/typography';
import { Button } from '../../shared/components/button';
import { useMediaQuery } from 'react-responsive';
import { FC, ReactElement } from 'react';
import backIcon from '../../assets/images/back-arrow.png';
import { useAppContext } from '../../app/providers/AppContext';
import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';
import { claimWhisks } from '../../shared/api/user/thunks';
import { Flip, toast } from 'react-toastify';

export const BuyTemplate: FC = (): ReactElement => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const { userData, updateUnclaimedWhisks } = useAppContext();

    const onNavigateToMainScreen = () => {
        navigate(-1);
    };

    const onClaimWhisks = () => {
        if (userData?.userId) {
            claimWhisks(userData.userId)
                .then((res) => {
                    updateUnclaimedWhisks();
                    if (res.status === 200) {
                        toast.success(`You claimed ${userData?.unclaimedWhisks} whisks`, {
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
                })
                .catch(() => {
                    toast.error(`Cannot claim whisks. Try again`, {
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
                });
        }
    };

    return (
        <div className={styles.buy__wrapper}>
            <div className={styles.buy__container}>
                <div className={styles.buy__title_and_logo}>
                    <Logo fontSize={'42px'} />
                    <span className={styles.buy__title}>
                        <Heading className={styles.buy__heading} level="h1">
                            Spin&Earn
                        </Heading>
                    </span>
                </div>
                <Typography fontSize={'16px'} fontFamily="Montserrat, sans-serif">
                    Buy bonus spins with WHISK
                </Typography>
                <div className={styles.buy__buy_rows}>
                    {BUY_ROWS_DATA &&
                        BUY_ROWS_DATA.map((buyRow) => (
                            <BuyTokenRow
                                key={buyRow.id}
                                id={buyRow.id}
                                countSpin={buyRow.countSpins}
                                countWhisk={buyRow.countWhisks}
                                userId={userData?.userId}
                            />
                        ))}
                </div>
                <div className={styles.buy__balance}>
                    <div onClick={onNavigateToMainScreen} className={styles.buy__back}>
                        <img src={backIcon} className={styles.buy__back_icon} alt="back to main screen" />
                        <Typography>Back</Typography>
                    </div>

                    <div className={styles.buy__balance_value}>
                        <Typography fontSize={'14px'} fontFamily="Montserrat, sans-serif">
                            Wallet balance
                        </Typography>
                        <Typography fontSize={'16px'} fontFamily="Montserrat, sans-serif">
                            1.345.584 WHISK
                        </Typography>
                    </div>
                </div>
                <div className={styles.buy__footer_connect}>
                    <div className={styles.buy__footer_connect_container}>
                        <div className={styles.buy__footer_connect_score}>
                            <Typography fontSize={isMobile ? '18px' : '40px'}>Unclaimed whisk</Typography>
                            <div className={styles.buy__footer_connect_tokens}>
                                <Typography
                                    fontSize={isMobile ? '30px' : '50px'}
                                    fontFamily="Roundy Rainbows, sans-serif"
                                >
                                    {userData?.points || 0}
                                </Typography>
                                <Button
                                    onClick={onClaimWhisks}
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
                        <div className={styles.buy__footer_connect_wallet}>
                            <TonConnectModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

