import dayjs from 'dayjs';

export const generateTimeRangeButtons = (
  interval: number,
  startTime: string,
  endTime: string
): string[] => {
  const start = dayjs().hour(parseInt(startTime.split(':')[0])).minute(parseInt(startTime.split(':')[1]));
  const end = dayjs().hour(parseInt(endTime.split(':')[0])).minute(parseInt(endTime.split(':')[1]));
  
  const times: string[] = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    times.push(current.format('HH:mm'));
    current = current.add(interval, 'minute');
  }

  return times;
};
