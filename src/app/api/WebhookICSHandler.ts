import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface ICSData {
  startTime: string;
  endTime: string;
  summary: string;
  description: string;
  organizer: string;
  attendees: string[];
  uid: string;
  created: string;
  lastModified: string;
  status: string;
  sequence: number;
  meetingUrl: string;
  candidateName?: string;
  interviewType: string;
}

class WebhookICSHandler {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  public async sendWebhook(icsData: ICSData): Promise<void> {
    try {
      const icsContent = this.generateICSContent(icsData);
      await axios.post(this.webhookUrl, { icsContent, ...icsData });
      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw new Error('Failed to send webhook');
    }
  }

  private generateICSContent(data: ICSData): string {
    const formatDate = (date: string) => {
      return date.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const enrichedDescription = this.generateEnrichedDescription(data);

    const icsContent = `BEGIN:VCALENDAR
PRODID:-//HTHUB//HTHUB Calendar//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:${formatDate(data.startTime)}
DTEND:${formatDate(data.endTime)}
DTSTAMP:${formatDate(new Date().toISOString())}
ORGANIZER;CN=${data.organizer.split('<')[0].trim()}:mailto:${data.organizer.split('<')[1].split('>')[0]}
UID:${data.meetingUrl}${data.uid}
${data.attendees.map(attendee => `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE;CN=${attendee}:mailto:${attendee}`).join('\n')}
CREATED:${formatDate(data.created)}
DESCRIPTION:${enrichedDescription}
LAST-MODIFIED:${formatDate(data.lastModified)}
LOCATION:Online
SEQUENCE:${data.sequence}
STATUS:${data.status}
SUMMARY:${data.summary}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  }

  private generateEnrichedDescription(data: ICSData): string {
    const startTime = dayjs(data.startTime).utc();
    const greeting = data.candidateName ? `Dear ${data.candidateName},` : 'Dear Candidate,';
    
    const description = `${greeting}
    
Please consider the next details:

- Meeting Link: ${data.meetingUrl}${data.uid}
- Meeting Start Time: ${startTime.format('MMMM D, YYYY, at HH:mm')} UTC
- Meeting Duration: 15 minutes

Your additional notes: ${data.description}`;

    // Replace newlines with \\n for ICS format
    return description.replace(/\n/g, '\\n');
  }

  public static generateICSData(
    startDate: Date,
    endDate: Date,
    interviewType: string,
    notes: string,
    user: any,
    callId: string,
    meetingUrl: string
  ): ICSData {
    const now = new Date().toISOString();
    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      summary: `${interviewType}`,
      description: notes,
      organizer: `HTHUB Recruitment <apphthub@gmail.com>`,
      attendees: [user.primaryEmailAddress?.emailAddress, 'apphthub@gmail.com'],
      uid: callId,
      created: now,
      lastModified: now,
      status: 'CONFIRMED',
      sequence: 0,
      meetingUrl: meetingUrl+callId,
      candidateName: user.firstName, // Assuming user object has a firstName property
      interviewType: interviewType
    };
  }
}

export default WebhookICSHandler;