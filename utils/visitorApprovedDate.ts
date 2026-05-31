import type { AppLocale } from '@/i18n'
import { LOCALE_BCP47 } from '@/i18n'

export function getBrowserTimeZone(): string {
  if (typeof Intl === 'undefined') return 'UTC'
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function resolveVisitorTimeZone(ipTimeZone?: string | null): string {
  if (ipTimeZone && ipTimeZone.trim()) return ipTimeZone.trim()
  return getBrowserTimeZone()
}

export function formatVisitorApprovedDate(
  locale: AppLocale,
  timeZone: string,
  options?: { includeWeekday?: boolean },
): string {
  return new Date().toLocaleDateString(LOCALE_BCP47[locale], {
    weekday: options?.includeWeekday ? 'long' : undefined,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  })
}

/** YYYY-MM-DD in the visitor timezone — for `<time datetime>` */
export function getVisitorDateIso(timeZone: string): string {
  return new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  })
}
