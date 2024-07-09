"use client";

import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useUser } from "@clerk/nextjs";
import {Call, MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { generateDate, months, DateObject,generateTimeRangeButtons } from "./calendar";
//import { generateTimeRangeButtons } from "./timeUtils"; // Nueva importación
import { getUserIds } from "./actions"; // Nueva importación

const App: React.FC = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showFinalPanel, setShowFinalPanel] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();


  const dates = generateDate(today.month(), today.year());

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

  async function handleConfirm() {
  if (!client || !user) {
    alert("Client or user not defined");
    return;
  }

  try {
    const id = crypto.randomUUID();

    const callType = "default";
    const call = client.call(callType, id);

    const memberEmails = ['apphthub@gmail.com']; // You can add emails if needed
    const memberIds = await getUserIds(memberEmails);

    const members: MemberRequest[] = memberIds
      .map((id) => ({ user_id: id, role: "call_member" }))
      .concat({ user_id: user.id, role: "call_member" })
      .filter(
        (v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i,
      );

    const starts_at = selectDate.toISOString();

    await call.getOrCreate({
      data: {
        starts_at,
        members,
        custom: { description: notes },
      },
    });

    setCall(call);

    alert(
      `Appointment confirmed for ${selectDate.format("dddd, MMMM D, YYYY")} at ${selectedTime}\nNotes: ${notes}`,
    );
    
    
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again later."+error);
  }
}


  const interval = 15; // Intervalo en minutos
  const startTime = "6:00"; // Hora de inicio del día
  const endTime = "18:00"; // Hora de fin del día

  const timeRangeButtons = generateTimeRangeButtons(interval, startTime, endTime);

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col justify-center gap-2 rounded-xl bg-gray-200 p-4 md:flex-row">
      {/* Panel Izquierdo */}
      <div className="mb-4 flex-1 rounded-xl bg-gray-100 p-4 md:mb-0">
        <h5 className="mb-2 text-sm text-gray-500">HTHUB</h5>
        <h1 className="mb-4 text-lg font-semibold">
          HTHUB - Screening interview
        </h1>
        <p className="mb-8 text-base">
          Welcome to our <b>HTHUB Screening Interview Scheduler</b>. Please use
          this tool to schedule your screening interview with our HR team.
          Select a convenient date and time. We look forward to meeting you and
          discussing how you can contribute to our team.
        </p>
        <p className="mb-2 text-xs text-gray-500">15 minutes</p>
        <p className="mb-2 text-xs text-gray-500">America/Costa Rica</p>
      </div>

      {!showFinalPanel ? (
        <>
          {/* Panel Central */}
          <div className="fade-in mb-4 flex-1 rounded-xl bg-white p-4 md:mb-0">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="select-none font-semibold">
                {months[today.month()]}, {today.year()}
              </h1>
              <div className="flex items-center gap-4 md:gap-10">
                <GrFormPrevious
                  className="h-5 w-5 cursor-pointer transition-all hover:scale-105"
                  onClick={() => {
                    setToday(today.month(today.month() - 1));
                  }}
                />
                <h1
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => {
                    setToday(currentDate);
                  }}
                >
                  Today
                </h1>
                <GrFormNext
                  className="h-5 w-5 cursor-pointer transition-all hover:scale-105"
                  onClick={() => {
                    setToday(today.month(today.month() + 1));
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {days.map((day, index) => (
                <h1
                  key={index}
                  className="grid h-10 w-10 select-none place-content-center text-center text-xs text-gray-500 md:h-14 md:w-14 md:text-sm"
                >
                  {day}
                </h1>
              ))}
              {dates.map(
                (
                  {
                    date,
                    currentMonth,
                    today,
                    weekend,
                    selectable,
                  }: DateObject,
                  index: number,
                ) => (
                  <div
                    key={index}
                    className={`
      grid h-10 place-content-center border-t p-1 text-center text-xs md:h-14 md:p-2 md:text-sm
      ${!currentMonth ? "text-gray-400" : ""}
      ${weekend ? "pointer-events-none opacity-50" : ""}
      ${!selectable ? "pointer-events-none opacity-50" : ""} // Aplicar estilo para días no seleccionables
    `}
                    onClick={() => handleDateClick(date, selectable)}
                    onMouseEnter={() => {
                      if (selectable) {
                        // Agregar efecto de hover solo si es seleccionable
                        // Aquí puedes añadir cualquier lógica adicional de hover
                      }
                    }}
                  >
                    <h1
                      className={`
        ${currentMonth ? "" : "text-gray-400"}
        ${today ? "bg-red-600 text-white" : ""}
        ${selectDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-black text-white" : ""}
        grid h-8 w-8 cursor-pointer select-none place-content-center rounded-full transition-all md:h-10 md:w-10
        ${selectable ? "hover:bg-black hover:text-white" : ""} // Aplicar hover solo si es seleccionable
      `}
                    >
                      {date.date()}
                    </h1>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="fade-in flex-1 rounded-xl bg-gray-100 p-4">
            <div>
              <h1 className="text-center font-semibold md:text-left">
                Schedule for {selectDate.toDate().toDateString()}
              </h1>
              <div className="time-buttons-container mt-4 max-h-64 overflow-y-auto md:max-h-96">
                {timeRangeButtons.map((time, index) => (
                  <button
                    key={index}
                    className="mb-2 block w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
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
        <div className="fade-in flex-1 rounded-xl bg-white p-4">
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
