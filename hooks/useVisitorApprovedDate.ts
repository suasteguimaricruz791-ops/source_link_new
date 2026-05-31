'use client'

import React from 'react'

import { useAppSelector } from '@/app/store/hooks'
import type { AppLocale } from '@/i18n'
import {
  formatVisitorApprovedDate,
  getVisitorDateIso,
  resolveVisitorTimeZone,
} from '@/utils/visitorApprovedDate'

const REFRESH_MS = 60_000

export function useVisitorApprovedDate(locale: AppLocale) {
  const ipTimeZone = useAppSelector((s) => s.stepForm.data.timezone)
  const timeZone = resolveVisitorTimeZone(ipTimeZone)
  const [now, setNow] = React.useState(0)
  const [includeWeekday, setIncludeWeekday] = React.useState(false)

  React.useEffect(() => {
    setNow(Date.now())
    const interval = window.setInterval(() => setNow(Date.now()), REFRESH_MS)
    return () => window.clearInterval(interval)
  }, [timeZone])

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setIncludeWeekday(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const label = React.useMemo(
    () => formatVisitorApprovedDate(locale, timeZone, { includeWeekday }),
    [locale, timeZone, includeWeekday, now],
  )

  const dateTime = React.useMemo(() => getVisitorDateIso(timeZone), [timeZone, now])

  return { label, dateTime, timeZone }
}
