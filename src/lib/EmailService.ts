import nodemailer from 'nodemailer';
import { EventAttributes } from 'ics';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configura aquí tu servicio de correo electrónico
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmailWithICS(to: string, eventDetails: EventAttributes, icsData: string) {
    const { title, description, start } = eventDetails;
    
    if (!Array.isArray(start) || start.length < 5) {
      throw new Error('Invalid start date format');
    }

    const [year, month, day, hour, minute] = start;
    const startDate = new Date(year, month - 1, day, hour, minute);
    
    // Assuming the duration is always 15 minutes as per the original code
    const durationMinutes = 15;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    const dateString = startDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    });

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h1 style="color: #4a4a4a;">Interview Confirmation</h1>
            <p>Dear ${to.split('@')[0]},</p>
            <p>Your interview has been scheduled successfully. Here are the details:</p>
            <ul>
              <li><strong>Event:</strong> ${title}</li>
              <li><strong>Date and Time:</strong> ${dateString}</li>
              <li><strong>Duration:</strong> ${durationMinutes} minutes</li>
              <li><strong>Description:</strong> ${description}</li>
            </ul>
            <p>Please find attached the calendar invite for this interview.</p>
            <p>If you need to make any changes or have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>HTHUB Team</p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Interview Scheduled: ${title}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'interview.ics',
          content: icsData,
          contentType: 'text/calendar'
        }
      ]
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}