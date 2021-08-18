import { isToday, isYesterday, format, differenceInCalendarDays } from 'date-fns';

export const getErrorMessage = (err) => {
    if(err.graphQLErrors[0]?.message) {
        return err.graphQLErrors[0].message;
    } else {
        return err.message;
    }
};

export const truncateString = (string, maxCharLimit) => {
    return string.length < maxCharLimit
      ? string
      : string.slice(0, maxCharLimit) + '...';
};

const isSameWeek = (date) => {
    const result = differenceInCalendarDays(new Date(), new Date(date)) <= 6 ? true : false;
    return result;
}

export const formatRecentDate = (date) => {
    const day = isToday(new Date(date))
        ? format(new Date(date), 'h:mm a')
        : isYesterday(new Date(date))
        ? 'Yesterday'
        : isSameWeek(new Date(date))
        ? format(new Date(date), 'EEEE')
        : format(new Date(date), 'dd/MM/yy')
    return day;
}

export const formatDateInWords = (date) => {
    return format(new Date(date), 'do MMM, yyyy')
}