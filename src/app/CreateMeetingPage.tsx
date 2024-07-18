"use client";

import React, { useState, useCallback, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { generateDate, generateTimeRangeButtons, months, DateObject } from "./calendar";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useUser } from "@clerk/nextjs";
import { Call, MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import WebhookICSHandler from '../app/api/WebhookICSHandler';

const CreateMeetingPage: React.FC = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showFinalPanel, setShowFinalPanel] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [interviewType, setInterviewType] = useState<string>("");
  const WEBHOOK_URL = 'https://hook.us1.make.com/kuv3qlh73j567ewhj5vacs1rk9dfzil7';

  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();

  // Get the current user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dates = useMemo(
    () => generateDate(today.month(), today.year()),
    [today],
  );

  const handleDateClick = useCallback((date: Dayjs, selectable: boolean) => {
    if (selectable) {
      setSelectDate(date);
    }
  }, []);

  const handleTimeClick = useCallback((time: string) => {
    setSelectedTime(time);
    setShowFinalPanel(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowFinalPanel(false);
    setSelectedTime(null);
  }, []);

const handleConfirm = useCallback(async () => {
  if (!client || !user || !selectedTime || !interviewType) {
    return;
  }

  try {
    const id = crypto.randomUUID();
    const callType = "private-meeting";
    const call = client.call(callType, id);

    const starts_at = selectDate
      .hour(parseInt(selectedTime.split(":")[0]))
      .minute(parseInt(selectedTime.split(":")[1]))
      .toDate();
    const ends_at = dayjs(starts_at).add(15, "minute").toDate();

    const members: MemberRequest[] = [
      { user_id: user.id, role: "call_member" },
    ];

    await call.getOrCreate({
      data: {
        starts_at: starts_at.toISOString(),
        members,
        custom: { description: notes, interviewType },
      },
    });

    setCall(call);

    // Generate meeting URL
    const meetingUrl = process.env.NEXT_PUBLIC_BASE_URL+`/meeting/`; // Replace with your actual meeting URL format

    // Send webhook for ICS file creation
    const webhookHandler = new WebhookICSHandler(WEBHOOK_URL);
    const icsData = WebhookICSHandler.generateICSData(
      starts_at,
      ends_at,
      interviewType,
      notes,
      user,
      id,
      meetingUrl
    );
    await webhookHandler.sendWebhook(icsData);

    alert("Appointment confirmed successfully!");
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again later.");
  }
}, [client, user, selectDate, selectedTime, notes, interviewType]);

  const interval = 15; // Interval in minutes
  const startTime = "09:00"; // Start time of the day
  const endTime = "17:00"; // End time of the day
  const includeAMPM = true; // Configuration to include AM/PM

  const timeRangeButtons = useMemo(
    () =>
      generateTimeRangeButtons(
        interval,
        startTime,
        endTime,
        includeAMPM,
        selectDate,
      ),
    [interval, startTime, endTime, includeAMPM, selectDate],
  );

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col justify-center gap-2 rounded-xl bg-gray-200 p-4 md:flex-row">
      {/* Left Panel */}
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
        <p className="mb-2 text-xs text-gray-500">{userTimeZone}</p>
      </div>

      {!showFinalPanel ? (
        <>
          {/* Central Panel */}
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
                    ${!selectable ? "pointer-events-none opacity-50" : ""}
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
                ),
              )}
            </div>
          </div>

          {/* Right Panel */}
          <RightPanel
            selectDate={selectDate}
            timeRangeButtons={timeRangeButtons}
            handleTimeClick={handleTimeClick}
          />
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
          <select
            className="mb-4 w-full rounded border p-2"
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
          >
            <option value="">Select Interview Type</option>
            <option value="E1 - Senior Data Engineer">
              E1 - Senior Data Engineer
            </option>
          </select>
          <div className="flex gap-4">
            <button
              className="rounded bg-gray-300 px-4 py-2"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className={`rounded px-4 py-2 text-white ${interviewType ? "bg-blue-500" : "cursor-not-allowed bg-gray-400"}`}
              onClick={handleConfirm}
              disabled={!interviewType}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RightPanel: React.FC<{
  selectDate: Dayjs;
  timeRangeButtons: string[];
  handleTimeClick: (time: string) => void;
}> = React.memo(({ selectDate, timeRangeButtons, handleTimeClick }) => {
  return (
    <div className="fade-in flex-1 rounded-xl bg-gray-100 p-4">
      <div>
        <h1 className="text-center font-semibold md:text-left">
          Schedule for {selectDate.format("MMMM D, YYYY")}
        </h1>
        <div className="time-buttons-container mt-4 max-h-64 overflow-y-auto md:max-h-96">
          {timeRangeButtons.length > 0 ? (
            timeRangeButtons.map((time, index) => (
              <button
                key={index}
                className="mb-2 block w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </button>
            ))
          ) : (
            <p>No available time slots for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
});

RightPanel.displayName = 'RightPanel';

export default CreateMeetingPage;