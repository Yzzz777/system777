import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || "SYSTEM 777 <noreply@jrsystem7777.com>";

function getClient() {
  if (!resendKey) return null;
  return new Resend(resendKey);
}

interface PaymentEmailProps {
  to: string;
  name: string;
  type: "course" | "subscription";
  planOrCourse?: string;
  amount: number;
}

export async function sendPaymentConfirmation({ to, name, type, planOrCourse, amount }: PaymentEmailProps) {
  const client = getClient();
  if (!client) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  const subject = type === "course"
    ? `Compra confirmada - Curso ${planOrCourse?.replace(/-/g, " ")}`
    : `Suscripción activada - Plan ${planOrCourse?.charAt(0).toUpperCase()}${planOrCourse?.slice(1)}`;

  const planNames: Record<string, string> = {
    starter: "Starter ($9.99/mes)",
    pro: "Pro ($29.99/mes)",
    enterprise: "Enterprise ($99.99/mes)",
  };

  const content = type === "course"
    ? `
      <h2 style="color: #ffffff; font-size: 24px;">Compra Confirmada!</h2>
      <p style="color: #9ca3af; font-size: 16px;">Hola ${name},</p>
      <p style="color: #9ca3af; font-size: 16px;">Tu compra ha sido procesada exitosamente. Ya tienes acceso al curso.</p>
      <div style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="color: #00FF88; font-size: 14px; margin: 0;">Curso</p>
        <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 5px 0;">${planOrCourse?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
        <p style="color: #9ca3af; font-size: 14px; margin: 5px 0 0 0;">Monto: $${amount.toFixed(2)} USD</p>
      </div>
      <p style="color: #9ca3af; font-size: 16px;">Accede a tu curso desde tu <a href="https://jrsystem7777.com/dashboard" style="color: #00FF88;">Dashboard</a>.</p>
    `
    : `
      <h2 style="color: #ffffff; font-size: 24px;">Suscripción Activada!</h2>
      <p style="color: #9ca3af; font-size: 16px;">Hola ${name},</p>
      <p style="color: #9ca3af; font-size: 16px;">Tu suscripción premium ha sido activada. Ya puedes disfrutar de todos los beneficios.</p>
      <div style="background-color: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="color: #7C3AED; font-size: 14px; margin: 0;">Plan</p>
        <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 5px 0;">${planNames[planOrCourse || "pro"] || planOrCourse}</p>
        <p style="color: #9ca3af; font-size: 14px; margin: 5px 0 0 0;">Monto: $${amount.toFixed(2)} USD/mes</p>
      </div>
      <p style="color: #9ca3af; font-size: 16px;">Gestiona tu suscripción desde tu <a href="https://jrsystem7777.com/dashboard/subscription" style="color: #7C3AED;">Dashboard</a>.</p>
    `;

  return client.emails.send({
    from: fromEmail,
    to,
    subject,
    html: `
      <div style="background-color: #0A0A0A; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00FF88; font-size: 28px; margin: 0;">SYSTEM 777</h1>
          </div>
          <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 30px;">
            ${content}
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #4b5563; font-size: 12px;">
              Este es un correo automático. Si tienes dudas, contáctanos en
              <a href="mailto:rksagmita@jrsystem7777.com" style="color: #00FF88;">rksagmita@jrsystem7777.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

interface ZoomEmailProps {
  to: string;
  name: string;
  date: string;
  time: string;
  topic: string;
  zoomLink: string;
}

export async function sendZoomConfirmation({ to, name, date, time, topic, zoomLink }: ZoomEmailProps) {
  const client = getClient();
  if (!client) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  return client.emails.send({
    from: fromEmail,
    to,
    subject: `Clase Zoom Agendada - ${date}`,
    html: `
      <div style="background-color: #0A0A0A; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00FF88; font-size: 28px; margin: 0;">SYSTEM 777</h1>
          </div>
          <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 30px;">
            <h2 style="color: #ffffff; font-size: 24px;">Clase Zoom Agendada!</h2>
            <p style="color: #9ca3af; font-size: 16px;">Hola ${name},</p>
            <p style="color: #9ca3af; font-size: 16px;">Tu sesión de Zoom ha sido confirmada.</p>
            <div style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; color: #9ca3af; font-size: 14px;">
                <tr><td style="padding: 4px 0;">Fecha:</td><td style="color: #ffffff; font-weight: bold;">${date}</td></tr>
                <tr><td style="padding: 4px 0;">Hora:</td><td style="color: #ffffff; font-weight: bold;">${time}</td></tr>
                <tr><td style="padding: 4px 0;">Tema:</td><td style="color: #ffffff; font-weight: bold;">${topic}</td></tr>
                <tr><td style="padding: 4px 0;">Plataforma:</td><td style="color: #ffffff; font-weight: bold;">Zoom</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${zoomLink}" style="display: inline-block; background-color: #00FF88; color: #000000; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Unirse a Zoom
              </a>
            </div>
            <p style="color: #6b7280; font-size: 13px; text-align: center;">Si no puedes asistir, por favor cancela con 24h de anticipación.</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #4b5563; font-size: 12px;">
              SYSTEM 777 - Academia Tecnológica Profesional
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

interface MeetingInviteProps {
  to: string;
  hostName: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
}

export async function sendMeetingInvite({ to, hostName, title, date, time, duration, meetingLink }: MeetingInviteProps) {
  const client = getClient();
  if (!client) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  return client.emails.send({
    from: fromEmail,
    to,
    subject: `Reunión agendada: ${title}`,
    html: `
      <div style="background-color: #0A0A0A; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00FF88; font-size: 28px; margin: 0;">SYSTEM 777</h1>
          </div>
          <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 30px;">
            <h2 style="color: #ffffff; font-size: 22px;">Reunión Agendada!</h2>
            <p style="color: #9ca3af; font-size: 16px;">Hola,</p>
            <p style="color: #9ca3af; font-size: 16px;">Se ha creado una nueva reunión:</p>
            <div style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; color: #9ca3af; font-size: 14px;">
                <tr><td style="padding: 4px 0;">Título:</td><td style="color: #ffffff; font-weight: bold;">${title}</td></tr>
                <tr><td style="padding: 4px 0;">Fecha:</td><td style="color: #ffffff; font-weight: bold;">${date}</td></tr>
                <tr><td style="padding: 4px 0;">Hora:</td><td style="color: #ffffff; font-weight: bold;">${time}</td></tr>
                <tr><td style="padding: 4px 0;">Duración:</td><td style="color: #ffffff; font-weight: bold;">${duration} minutos</td></tr>
                <tr><td style="padding: 4px 0;">Anfitrión:</td><td style="color: #ffffff; font-weight: bold;">${hostName}</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${meetingLink}" style="display: inline-block; background-color: #00FF88; color: #000000; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Unirse a la Reunión
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #4b5563; font-size: 12px;">SYSTEM 777 - Academia Tecnológica Profesional</p>
          </div>
        </div>
      </div>
    `,
  });
}

interface AdminNotificationProps {
  to: string;
  name: string;
  subject: string;
  message: string;
}

export async function sendWhatsAppNotification({ to, name, subject, message }: AdminNotificationProps) {
  const client = getClient();
  if (!client) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  return client.emails.send({
    from: fromEmail,
    to,
    subject: `[SYSTEM 777] ${subject}`,
    html: `
      <div style="background-color: #0A0A0A; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00FF88; font-size: 28px; margin: 0;">SYSTEM 777</h1>
          </div>
          <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 30px;">
            <h2 style="color: #ffffff; font-size: 20px;">${subject}</h2>
            <p style="color: #9ca3af; font-size: 16px;">Hola ${name},</p>
            <p style="color: #9ca3af; font-size: 16px; line-height: 1.6;">${message}</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #4b5563; font-size: 12px;">SYSTEM 777 - Academia Tecnológica Profesional</p>
          </div>
        </div>
      </div>
    `,
  });
}
