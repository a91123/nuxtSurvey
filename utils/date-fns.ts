import { format, formatDistanceToNow } from 'date-fns'
import { zhTW, enUS } from 'date-fns/locale'

const localeMap = {
  'zh-TW': zhTW,
  'en': enUS
}

export const formatDateTime = (date: string | Date, locale: string = 'zh-TW') => {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || zhTW
  return format(new Date(date), 'yyyy/MM/dd HH:mm', { locale: dateLocale })
}

export const formatDate = (date: string | Date, locale: string = 'zh-TW') => {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || zhTW
  if (locale === 'en') {
    return format(new Date(date), 'MMM dd, yyyy', { locale: dateLocale })
  }
  return format(new Date(date), 'yyyy年MM月dd日', { locale: dateLocale })
}

export const formatTime = (date: string | Date) => {
  return format(new Date(date), 'HH:mm')
}

export const formatRelativeTime = (date: string | Date, locale: string = 'zh-TW') => {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || zhTW
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: dateLocale })
}

export const formatShortDate = (date: string | Date) => {
  return format(new Date(date), 'MM/dd')
}

export const formatFullDate = (date: string | Date, locale: string = 'zh-TW') => {
  const dateLocale = localeMap[locale as keyof typeof localeMap] || zhTW
  if (locale === 'en') {
    return format(new Date(date), 'EEEE, MMMM dd, yyyy', { locale: dateLocale })
  }
  return format(new Date(date), 'yyyy年MM月dd日 EEEE', { locale: dateLocale })
}

export const createTimeStamp = () => {
  return new Date().toISOString()
}
