import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;

    const mailOptions = {
      from:
        process.env.SMTP_FROM || '"SetConnection" <noreply@setconnection.com>',
      to,
      subject: '🔑 Recuperación de contraseña - SetConnection',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <span style="background-color: #CCFF00; color: #000000; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">
            SETCONNECTION AUTH
          </span>
          <h2 style="font-size: 24px; text-transform: uppercase; margin-top: 16px; color: #ffffff;">Recupera tu acceso</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
            Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar. Este enlace expira en <strong>1 hora</strong>.
          </p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #ffffff; color: #000000; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; display: inline-block;">
              Restablecer Contraseña ➔
            </a>
          </div>
          <p style="color: #52525b; font-size: 11px; margin-top: 24px;">
            Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
          </p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📧 Correo enviado a: ${to}`);

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`🔗 LINK PARA VER CORREO: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error al enviar correo SMTP a ${to}:`, error);
      throw error;
    }
  }
}
