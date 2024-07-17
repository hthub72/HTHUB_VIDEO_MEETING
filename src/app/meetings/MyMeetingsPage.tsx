"use client";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyMeetingsPage() {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [upcomingCalls, setUpcomingCalls] = useState<Call[]>([]);
  const [pastCalls, setPastCalls] = useState<Call[]>([]);

  useEffect(() => {
    async function loadCalls() {
      if (!client || !user?.id) return;
      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
      });
      
      const now = new Date();
      setUpcomingCalls(calls.filter(call => new Date(call.state.startsAt!) > now));
      setPastCalls(calls.filter(call => new Date(call.state.startsAt!) <= now));
    }
    loadCalls();
  }, [client, user?.id]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-center text-3xl font-bold mb-8">My Meetings</h1>
      {!upcomingCalls && !pastCalls && <Loader2 className="mx-auto animate-spin" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MeetingList title="Upcoming Meetings" calls={upcomingCalls} />
        <MeetingList title="Past Meetings" calls={pastCalls} />
      </div>
    </div>
  );
}

interface MeetingListProps {
  title: string;
  calls: Call[];
}

function MeetingList({ title, calls }: MeetingListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {calls.length === 0 && <p className="text-gray-500">No meetings found</p>}
      <ul className="space-y-4">
        {calls.map((call) => (
          <MeetingItem key={call.id} call={call} />
        ))}
      </ul>
    </div>
  );
}

interface MeetingItemProps {
  call: Call;
}

function MeetingItem({ call }: MeetingItemProps) {
  const meetingLink = `/meeting/${call.id}`;
  const hasEnded = !!call.state.endedAt;

  return (
    <li className="border-b pb-4 last:border-b-0">
      <Link href={meetingLink} className="hover:underline font-semibold">
        {call.state.startsAt?.toLocaleString()}
        {hasEnded && " (Ended)"}
      </Link>
      <p className="text-gray-600 mt-1">{call.state.custom.description}</p>
    </li>
  );
}
