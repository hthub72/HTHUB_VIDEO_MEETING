"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { generateDate, months, DateObject, generateTimeRangeButtons } from "./calendar";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useUser } from "@clerk/nextjs";
import { Call, MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { getUserIds } from "./actions"; 
import { Router } from "next/router";


const App: React.FC = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showFinalPanel, setShowFinalPanel] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [clientTimeZone, setClientTimeZone] = useState<string>("");

  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();

  const dates = generateDate(today.month(), today.year());

  useEffect(() => {
    fetchClientTimeZone();
  }, []);

  const fetchClientTimeZone = async () => {
    try {
      const response = await axios.get("https://ipinfo.io/json");
      const timezone = response.data.timezone;
      setClientTimeZone(timezone);
    } catch (error) {
      console.error("Error fetching client timezone:", error);
    }
  };

  const handleDateClick = (date: Dayjs, selectable: boolean) => {
    if (selectable) {
      setSelectDate(date);
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setShowFinalPanel(true);
  };

  const handleBack = () => {
    setShowFinalPanel(false);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!client || !user || !selectedTime) {
      return;
    }

    try {
      const id = crypto.randomUUID();

      const callType = "private-meeting";
      const call = client.call(callType, id);

      const memberEmails = ['apphthub@gmail.com']; // Puedes agregar más correos si es necesario
      const memberIds = await getUserIds(memberEmails);

      const members: MemberRequest[] = memberIds
        .map((id) => ({ user_id: id, role: "call_member" }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i,
        );

      const starts_at = selectDate
        .set('hour', parseInt(selectedTime.split(':')[0]))
        .set('minute', parseInt(selectedTime.split(':')[1]))
        .toISOString();

      await call.getOrCreate({
        data: {
          starts_at,
          members,
          custom: { description: notes },
        },
      });

      setCall(call);

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const interval = 15; // Intervalo en minutos
  const startTime = "6:00"; // Hora de inicio del día
  const endTime = "18:00"; // Hora de fin del día

  const timeRangeButtons = generateTimeRangeButtons(
    interval,
    startTime,
    endTime,
  );

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-gray-200">
      {/* Panel Izquierdo */}
      <div className="flex-1 p-4 rounded-xl bg-gray-100">
        <h5 className="mb-2 text-sm text-gray-500">HTHUB</h5>
        <h1 className="mb-4 text-lg font-semibold">HTHUB - Screening interview</h1>
        <p className="mb-8 text-base">
          Welcome to our <b>HTHUB Screening Interview Scheduler</b>. Please use
          this tool to schedule your screening interview with our HR team.
          Select a convenient date and time. We look forward to meeting you and
          discussing how you can contribute to our team.
        </p>
        <p className="mb-2 text-xs text-gray-500">15 minutes</p>
        <p className="mb-2 text-xs text-gray-500">{clientTimeZone}</p>
      </div>

      {!showFinalPanel ? (
        <>
          {/* Panel Central */}
          <div className="flex-1 p-4 rounded-xl bg-white fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="font-semibold select-none">
                {months[today.month()]}, {today.year()}
              </h1>
              <div className="flex items-center gap-4 md:gap-10">
                <GrFormPrevious
                  className="h-5 w-5 cursor-pointer transition-all hover:scale-105"
                  onClick={() => setToday(today.month(today.month() - 1))}
                />
                <h1
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setToday(currentDate)}
                >
                  Today
                </h1>
                <GrFormNext
                  className="h-5 w-5 cursor-pointer transition-all hover:scale-105"
                  onClick={() => setToday(today.month(today.month() + 1))}
                />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <h1
                  key={index}
                  className="grid h-10 w-10 text-center text-xs text-gray-500 place-content-center select-none md:h-14 md:w-14 md:text-sm"
                >
                  {day}
                </h1>
              ))}
              {dates.map(({ date, currentMonth, today, weekend, selectable }: DateObject, index: number) => (
                <div
                  key={index}
                  className={`
                    grid h-10 place-content-center border-t p-1 text-center text-xs md:h-14 md:p-2 md:text-sm
                    ${!currentMonth ? "text-gray-400" : ""}
                    ${weekend ? "pointer-events-none opacity-50" : ""}
                    ${!selectable ? "opacity-50" : ""}
                  `}
                  onClick={() => handleDateClick(date, selectable)}
                >
                  <h1
                    className={`
                      ${currentMonth ? "" : "text-gray-400"}
                      ${today ? "bg-red-600 text-white" : ""}
                      ${selectDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-black text-white" : ""}
                      grid h-8 w-8 cursor-pointer select-none place-content-center rounded-full transition-all hover:bg-black hover:text-white md:h-10 md:w-10
                    `}
                  >
                    {date.date()}
                  </h1>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="flex-1 p-4 rounded-xl bg-gray-100 fade-in">
            <div>
              <h1 className="font-semibold text-center md:text-left">
                Schedule for {selectDate.toDate().toDateString()}
              </h1>
              <div className="time-buttons-container mt-4 max-h-96 overflow-y-auto">
                {timeRangeButtons.map((time, index) => (
                  <button
                    key={index}
                    className="mb-2 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-4 rounded-xl bg-white fade-in">
          <h1 className="mb-4 font-semibold">Appointment Details</h1>
          <p className="mb-4">{`${selectDate.format("dddd, MMMM D, YYYY")} ${selectedTime}`}</p>
          <textarea
            className="mb-4 w-full rounded border p-2"
            placeholder="Additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="rounded bg-gray-300 px-4 py-2"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
