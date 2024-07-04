import dayjs, { Dayjs } from "dayjs";

export interface DateObject {
  currentMonth: boolean;
  date: Dayjs;
  today?: boolean;
  weekend?: boolean;
  selectable: boolean; 
}

export const generateDate = (month: number, year: number): DateObject[] => {
  const today = dayjs();
  const startOfMonth = dayjs().set("year", year).set("month", month).startOf("month");
  const endOfMonth = dayjs().set("year", year).set("month", month).endOf("month");

  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const totalDays = endDate.diff(startDate, "days") + 1;

  const dates: DateObject[] = [];
  let currentDate = startDate;

  for (let i = 0; i < totalDays; i++) {
    let dateObj: DateObject; // Declarar dateObj aquí para evitar el error
    dateObj = {
      date: currentDate,
      currentMonth: currentDate.month() === month,
      today: currentDate.isSame(today, "day"),
      weekend: currentDate.day() === 0 || currentDate.day() === 6,
      selectable: currentDate.isSame(today, "day") || (currentDate.isAfter(today, "day") && currentDate.isBefore(today.add(2, "week"), "day") && !(currentDate.day() === 0 || currentDate.day() === 6)), // Bloquear días anteriores a hoy y posteriores a dos semanas
    };
    dates.push(dateObj);
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

export const generateTimeRangeButtons = (
  interval: number, // intervalo de tiempo en minutos (15, 30, 60, etc.)
  startTime: string, // hora de inicio del día en formato "HH:mm"
  endTime: string // hora de fin del día en formato "HH:mm"
): string[] => {
  const start = dayjs().set("hour", parseInt(startTime.split(":")[0])).set("minute", parseInt(startTime.split(":")[1]));
  const end = dayjs().set("hour", parseInt(endTime.split(":")[0])).set("minute", parseInt(endTime.split(":")[1]));

  const buttons: string[] = [];
  const currentTime = dayjs().startOf('hour').add(2, 'hour').startOf('minute'); // Solo horas a partir de 2 horas después de la hora actual

  while (currentTime.isBefore(end)) {
    if (currentTime.isAfter(dayjs())) {
      buttons.push(currentTime.format("h:mm A"));
    }
    currentTime.add(interval, "minute");
  }

  return buttons;
};

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
