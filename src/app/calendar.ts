// calendar.ts

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateObject {
  date: Dayjs;
  currentMonth: boolean;
  today: boolean;
  weekend: boolean;
  selectable: boolean;
}

export const generateDate = (month: number, year: number): DateObject[] => {
  const dates: DateObject[] = [];
  const startOfMonth = dayjs().year(year).month(month).startOf("month");
  const endOfMonth = dayjs().year(year).month(month).endOf("month");

  for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day'); date = date.add(1, 'day')) {
    const isToday = date.isSame(dayjs(), 'day');
    const isWeekend = date.day() === 0 || date.day() === 6;
    const isSelectable = date.isAfter(dayjs().subtract(1, 'day')) && date.isBefore(dayjs().add(2, 'week'));

    dates.push({
      date,
      currentMonth: date.month() === month,
      today: isToday,
      weekend: isWeekend,
      selectable: isSelectable
    });
  }

  return dates;
};

export const generateTimeRangeButtons = (interval: number, startTime: string, endTime: string, selectDate: Dayjs): string[] => {
  const times: string[] = [];
  const startOfDay = dayjs().startOf('day');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = dayjs().tz(timezone);
  const start = dayjs().startOf('day').add(7, 'hour');
  const end = dayjs().startOf('day').add(19, 'hour');

  let currentTime = selectDate.isSame(now, 'day') ? dayjs().startOf('hour').add(now.hour(), 'hour').add(now.minute(), 'minute') : start;

  // Función para redondear al intervalo más cercano
  const roundToNearest = (time: Dayjs, minutes: number) => {
    const remainder = minutes - (time.minute() % minutes);
    return time.add(remainder, 'minute');
  };

  while (currentTime.isBefore(end) || currentTime.isSame(end, 'minute')) {
    const roundedTime = roundToNearest(currentTime, interval);
    if (roundedTime.isAfter(startOfDay.add(7, 'hour')) && roundedTime.isBefore(startOfDay.add(19, 'hour'))) {
      times.push(roundedTime.format("HH:mm"));
    }
    currentTime = currentTime.add(interval, "minute");
  }

  return times;
};

export const filterPastTimes = (times: string[], selectDate: Dayjs): string[] => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = dayjs().tz(timezone);
  const selectedDayStart = selectDate.startOf("day");

  if (now.isBefore(selectedDayStart)) {
    return times;
  }

  return times.filter(time => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = selectDate.hour(hours).minute(minutes);
    return dateTime.isAfter(now);
  });
};

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
