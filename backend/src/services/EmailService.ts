import { createEmailTransporter } from "../config/email";
import { EmailOptions, 
  PasswordResetData, 
  VoteThankYouData, 
  EmailTemplate 
} from "../types/email.types";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = createEmailTransporter();
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `Sistema de votacion <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado con exito:', result.messageId);
    } catch (error) {
      console.error('Error al enviar el email:', error);
      throw error;
    }
  }
}