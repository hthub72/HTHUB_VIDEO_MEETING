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
  const today = dayjs();
  const twoWeeksFromNow = today.add(15, 'day');

  for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day'); date = date.add(1, 'day')) {
    const isToday = date.isSame(today, 'day');
    const isWeekend = date.day() === 0 || date.day() === 6;
    const isSelectable = (date.isAfter(today) || date.isSame(today, 'day')) && 
                         date.isBefore(twoWeeksFromNow) && 
                         !isWeekend;

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

export const generateTimeRangeButtons = (
  interval: number, 
  startTime: string, 
  endTime: string, 
  includeAMPM: boolean,
  date: Dayjs
): string[] => {
  const times: string[] = [];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = dayjs().tz(timezone);
  const start = date.isSame(now, 'day') ? now : date.hour(parseInt(startTime.split(':')[0])).minute(parseInt(startTime.split(':')[1]));
  const end = date.hour(parseInt(endTime.split(':')[0])).minute(parseInt(endTime.split(':')[1]));

  let currentTime = roundToNearest(start, interval);

  while (currentTime.isBefore(end) || currentTime.isSame(end, "minute")) {
    let formattedTime = includeAMPM ? currentTime.format("h:mm A") : currentTime.format("HH:mm");
    times.push(formattedTime);
    currentTime = currentTime.add(interval, "minute");
  }

  return times;
};

export const roundToNearest = (time: Dayjs, minutes: number) => {
  const remainder = minutes - (time.minute() % minutes);
  return time.add(remainder, "minute");
};

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];