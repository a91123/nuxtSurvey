import { format, formatDistanceToNow } from 'date-fns'
import { zhTW, enUS } from 'date-fns/locale'

export const useDateFormatter = () => {
  const { locale } = useI18n()

  const localeMap = {
    'zh-TW': zhTW,
    'en': enUS
  }

  const getDateLocale = () => {
    return localeMap[locale.value as keyof typeof localeMap] || zhTW
  }

  const formatDateTime = (date: string | Date) => {
    return format(new Date(date), 'yyyy/MM/dd HH:mm', { locale: getDateLocale() })
  }

  const formatDate = (date: string | Date) => {
    const dateLocale = getDateLocale()
    if (locale.value === 'en') {
      return format(new Date(date), 'MMM dd, yyyy', { locale: dateLocale })
    }
    return format(new Date(date), 'yyyy年MM月dd日', { locale: dateLocale })
  }

  const formatTime = (date: string | Date) => {
    return format(new Date(date), 'HH:mm')
  }

  const formatRelativeTime = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: getDateLocale() })
  }

  const formatShortDate = (date: string | Date) => {
    return format(new Date(date), 'MM/dd')
  }

  const formatFullDate = (date: string | Date) => {
    const dateLocale = getDateLocale()
    if (locale.value === 'en') {
      return format(new Date(date), 'EEEE, MMMM dd, yyyy', { locale: dateLocale })
    }
    return format(new Date(date), 'yyyy年MM月dd日 EEEE', { locale: dateLocale })
  }

  const createTimeStamp = () => {
    return new Date().toISOString()
  }

  return {
    formatDateTime,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatShortDate,
    formatFullDate,
    createTimeStamp
  }
}
