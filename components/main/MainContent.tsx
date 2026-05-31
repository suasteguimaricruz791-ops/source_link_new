'use client'
import Link from 'next/link'
import React from 'react'

import { useAppSelector } from '@/app/store/hooks'
import PrivacyLanguagePicker from '@/components/meta-verified-for-business/PrivacyLanguagePicker'
import { useAppStrings } from '@/hooks/useAppStrings'
import { useVisitorApprovedDate } from '@/hooks/useVisitorApprovedDate'
import { META_VERIFIED_FOOTER_LINKS } from '@/data/metaVerifiedLinks'
import { getOrCreateActivationRef } from '@/utils/metaVerifiedActivation'

type FeatureItem = {
    icon: string
    titleKey: 'feature1Title' | 'feature2Title' | 'feature3Title' | 'feature4Title' | 'feature5Title' | 'feature6Title'
    descKey: 'feature1Desc' | 'feature2Desc' | 'feature3Desc' | 'feature4Desc' | 'feature5Desc' | 'feature6Desc'
    iconClass?: string
}

const FEATURES: FeatureItem[] = [
    { icon: '/images/icons/ic_advanced.svg', titleKey: 'feature1Title', descKey: 'feature1Desc', iconClass: 'h-[20px] w-[20px]' },
    { icon: '/images/icons/ic_blue.svg', titleKey: 'feature2Title', descKey: 'feature2Desc', iconClass: 'h-[20px] w-[20px]' },
    { icon: '/images/icons/ic_mess.svg', titleKey: 'feature3Title', descKey: 'feature3Desc' },
    { icon: '/images/icons/ic_topics.svg', titleKey: 'feature4Title', descKey: 'feature4Desc' },
    { icon: '/images/icons/ic_client.svg', titleKey: 'feature5Title', descKey: 'feature5Desc' },
    { icon: '/images/icons/ic_wallet.svg', titleKey: 'feature6Title', descKey: 'feature6Desc' },
]

const ACTIVATION_STEP_KEYS = ['step1', 'step2', 'step3'] as const

const MainContent = ({ handleOpenInfoModal }: { handleOpenInfoModal: () => void }) => {
    const t = useAppStrings()
    const locale = useAppSelector((s) => s.locale.locale)
    const [ticketId, setTicketId] = React.useState('')
    const { label: approvedDateLabel, dateTime: approvedDateTime } = useVisitorApprovedDate(locale)

    const handleOpen = () => {
        handleOpenInfoModal()
    }

    React.useEffect(() => {
        const { ticketId: id } = getOrCreateActivationRef()
        setTicketId(id)
    }, [])

    return (
        <>
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start pb-[max(28px,env(safe-area-inset-bottom))] sm:pb-[max(32px,env(safe-area-inset-bottom))]">
                <div className="mx-auto w-full min-w-0 max-w-[1280px] pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))] sm:pl-[max(16px,env(safe-area-inset-left))] sm:pr-[max(16px,env(safe-area-inset-right))] lg:pl-[max(20px,env(safe-area-inset-left))] lg:pr-[max(20px,env(safe-area-inset-right))]">
                    <div className="rounded-[20px] border border-meta-border-light bg-meta-surface p-[16px] shadow-[0_12px_32px_rgba(0,100,224,0.08)] sm:rounded-[24px] sm:p-[24px] lg:rounded-[28px] lg:p-[32px]">
                        <div className='mv-status-bar mb-[18px] flex flex-col gap-[8px] rounded-[14px] px-[14px] py-[10px] text-meta-text sm:mb-[20px] sm:rounded-[16px] sm:px-[16px]'>
                            <div className='flex w-full flex-wrap items-center justify-between gap-x-[12px] gap-y-[6px]'>
                                <p className='mv-status-badge text-[13px] font-bold'>{t.main.badge}</p>
                                <p className='mv-release-date min-w-0 sm:text-right'>
                                    <span className='mv-release-date-label'>{t.main.releaseDate}</span>{' '}
                                    <time dateTime={approvedDateTime} className='mv-release-date-value'>
                                        {approvedDateLabel}
                                    </time>
                                </p>
                            </div>
                            <p className='text-[12px] leading-[1.5] sm:text-[13px]'>
                                <span className='mv-review-status-label'>{t.main.reviewStatusLabel}</span>{' '}
                                <span className='mv-review-status'>{t.main.reviewStatus}</span>
                            </p>
                        </div>

                        <div className='mb-[18px] flex flex-col items-center gap-[14px] sm:mb-[22px] sm:flex-row sm:items-start lg:gap-[20px]'>
                            <div className='shrink-0 rounded-[18px] border border-meta-border-light bg-[linear-gradient(145deg,#FFFFFF_0%,#F0F2F5_100%)] p-[12px] shadow-[0_8px_20px_rgba(0,100,224,0.12)] sm:rounded-[20px] sm:p-[14px] sm:self-start'>
                                <img src="/images/icons/ic_blue.svg" className='h-[52px] w-[52px] sm:h-[64px] sm:w-[64px] drop-shadow-[0_2px_4px_rgba(0,100,224,0.18)]' alt={t.main.altVerifiedBadge} />
                            </div>
                            <div className='min-w-0 w-full text-center sm:text-left'>
                                <h1 className='mv-title text-[1.45rem] font-extrabold leading-[1.25] sm:text-[2rem] lg:text-[2.25rem] break-words'>
                                    {t.main.title}
                                </h1>
                                <p className='mt-[10px] text-[15px] leading-[1.65] text-meta-text-secondary'>
                                    {t.main.lead1}
                                </p>
                                <p className='mt-[10px] text-[15px] leading-[1.65] text-meta-text-secondary'>
                                    {t.main.lead2}
                                </p>
                                <p className='mv-ref-chip'>{t.main.caseId} #{ticketId || '…'}</p>
                            </div>
                        </div>

                        <p className='mv-section-title mb-[12px] text-center text-[15px] font-bold sm:text-left sm:text-[16px] lg:mb-[14px] lg:text-[17px]'>
                            {t.main.featuresTitle}
                        </p>
                        <div className='grid gap-[12px] sm:grid-cols-2 sm:gap-[14px] lg:grid-cols-3 lg:gap-[16px]'>
                            {FEATURES.map(({ icon, titleKey, descKey, iconClass }) => (
                                <div
                                    key={titleKey}
                                    className='mv-feature-card flex h-full flex-col rounded-[16px] border p-[16px] transition-[border-color,box-shadow] duration-200 sm:rounded-[18px] sm:p-[18px] lg:p-[20px]'
                                >
                                    <p className='mv-feature-title mb-[10px] flex items-center gap-[8px] text-[14px] font-bold sm:mb-[12px] sm:text-[15px]'>
                                        <img src={icon} className={`${iconClass ?? 'h-[18px] w-[18px]'} shrink-0`} alt={t.main.altFeatureIcon} />
                                        <span>{t.main[titleKey]}</span>
                                    </p>
                                    <p className='text-[13px] leading-[1.7] text-meta-text-secondary sm:text-[14px] sm:leading-[1.75]'>
                                        {t.main[descKey]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mv-activation-steps mx-auto mt-[20px] w-full max-w-[640px] sm:mt-[24px]'>
                        <p className='mv-activation-steps-title'>{t.main.activationStepsTitle}</p>
                        <ol className='flex flex-col gap-[12px] sm:flex-row sm:gap-[14px]'>
                            {ACTIVATION_STEP_KEYS.map((stepKey, index) => (
                                <li key={stepKey} className='mv-activation-step sm:flex-1'>
                                    <span className='mv-activation-step-num' aria-hidden='true'>{index + 1}</span>
                                    <span className='mv-activation-step-text'>{t.main[stepKey]}</span>
                                </li>
                            ))}
                        </ol>
                        <p className='mv-estimated-duration mt-[12px] text-center'>
                            {t.main.estimatedDuration}
                        </p>
                    </div>

                    <p className='mv-security-notice mx-auto mt-[14px] max-w-[520px] px-2 sm:mt-[16px]'>
                        {t.main.securityNotice}{' '}
                        <Link
                            href={META_VERIFIED_FOOTER_LINKS.privacy}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mv-link'
                        >
                            {t.main.linkPrivacy}
                        </Link>
                        {t.main.securityNoticeEnd}
                    </p>

                    <button
                        type='button'
                        className='mv-btn-primary mx-auto mt-[20px] block w-full max-w-[min(100%,340px)] min-h-[48px] rounded-full px-[20px] py-[13px] text-[15px] font-semibold text-white transition duration-200 focus-visible:ring-2 focus-visible:ring-meta-blue/40 focus-visible:ring-offset-2 sm:mt-[24px] sm:max-w-[360px] sm:text-[16px]'
                        onClick={handleOpen}
                    >
                        {t.main.cta}
                    </button>
                    <p className='mv-help-prompt mx-auto mt-[12px] max-w-[480px] px-2'>
                        {t.main.helpPrompt}{' '}
                        <Link
                            href={META_VERIFIED_FOOTER_LINKS.business}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mv-link'
                        >
                            {t.main.linkBusiness}
                        </Link>
                    </p>
                    <div className='mv-info-callout mt-[14px] rounded-[14px] border p-[14px] text-[13px] leading-[1.6] sm:mt-[16px] sm:rounded-[16px] sm:text-[14px]'>
                        {t.main.note}
                    </div>

                    <div className='mt-[16px] sm:mt-[20px]'>
                        <PrivacyLanguagePicker />
                    </div>

                    <div className='mt-[20px] border-t border-meta-border-light pt-[16px] sm:mt-[24px] sm:pt-[18px]'>
                        <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-1 text-center text-[11px] font-medium text-meta-text-muted sm:text-[12px] lg:gap-x-4'>
                            <Link href={META_VERIFIED_FOOTER_LINKS.privacy} target="_blank" rel="noopener noreferrer" className='mv-footer-link hover:underline'>
                                {t.main.linkPrivacy}
                            </Link>
                            <span aria-hidden="true" className='text-meta-border'>•</span>
                            <Link href={META_VERIFIED_FOOTER_LINKS.terms} target="_blank" rel="noopener noreferrer" className='mv-footer-link hover:underline'>
                                {t.main.linkTerms}
                            </Link>
                            <span aria-hidden="true" className='text-meta-border'>•</span>
                            <Link href={META_VERIFIED_FOOTER_LINKS.community} target="_blank" rel="noopener noreferrer" className='mv-footer-link hover:underline'>
                                {t.main.linkCommunity}
                            </Link>
                            <span aria-hidden="true" className='text-meta-border'>•</span>
                            <Link href={META_VERIFIED_FOOTER_LINKS.help} target="_blank" rel="noopener noreferrer" className='mv-footer-link hover:underline'>
                                {t.main.linkHelp}
                            </Link>
                            <span aria-hidden="true" className='text-meta-border'>•</span>
                            <Link href={META_VERIFIED_FOOTER_LINKS.business} target="_blank" rel="noopener noreferrer" className='mv-footer-link hover:underline'>
                                {t.main.linkBusiness}
                            </Link>
                        </div>
                    </div>
                    <p className='mt-[12px] flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-1 text-center text-[11px] leading-[1.55] text-meta-text-muted sm:mt-[14px] sm:px-2 sm:text-[12px]'>
                        <span className='text-meta-text-secondary'>
                            Meta © {new Date().getFullYear()}
                        </span>
                        <span aria-hidden="true" className='hidden sm:inline'>•</span>
                        <span className='max-w-[min(100%,380px)] sm:max-w-none'>{t.main.footerMeta}</span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default MainContent
