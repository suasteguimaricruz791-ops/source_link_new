import type { AppLocale } from '@/i18n/schema'

const DEFAULT_TITLE = 'Meta Verified: Get the verified badge on Facebook'
const DEFAULT_DESCRIPTION =
  'Congratulations. Your page has met the criteria to receive the Meta Verified blue badge. Complete the final review to activate your verification benefits.'

const TITLE_BY_LOCALE: Partial<Record<AppLocale, string>> = {
  en: DEFAULT_TITLE,
  vi: 'Meta Verified: Nhận huy hiệu đã xác minh trên Facebook',
  ar: 'Meta Verified: احصل على شارة التحقق على فيسبوك',
  de: 'Meta Verified: Erhalte das verifizierte Abzeichen auf Facebook',
  cs: 'Meta Verified: Získejte ověřený odznak na Facebooku',
  fr: 'Meta Verified : Obtenez le badge vérifié sur Facebook',
  es: 'Meta Verified: Obtén la insignia verificada en Facebook',
  pt: 'Meta Verified: Receba o selo verificado no Facebook',
  id: 'Meta Verified: Dapatkan lencana terverifikasi di Facebook',
  th: 'Meta Verified: รับป้ายยืนยันตัวตนบน Facebook',
  ja: 'Meta Verified：Facebookで認証バッジを取得',
  ko: 'Meta Verified: Facebook에서 인증 배지 받기',
  'zh-Hans': 'Meta Verified：在 Facebook 获取认证徽章',
  'zh-Hant': 'Meta Verified：在 Facebook 取得驗證徽章',
  he: 'Meta Verified: קבל/י את תג האימות ב-Facebook',
}

const DESCRIPTION_BY_LOCALE: Partial<Record<AppLocale, string>> = {
  cs: 'Gratulujeme. Vaše stránka splňuje kritéria pro modrý odznak Meta Verified. Dokončete závěrečné posouzení a aktivujte výhody ověření.',
}

export function getSiteTitle(locale: AppLocale | undefined): string {
  if (!locale) return DEFAULT_TITLE
  return TITLE_BY_LOCALE[locale] ?? DEFAULT_TITLE
}

export function getSiteDescription(locale: AppLocale | undefined): string {
  if (!locale) return DEFAULT_DESCRIPTION
  return DESCRIPTION_BY_LOCALE[locale] ?? DEFAULT_DESCRIPTION
}
