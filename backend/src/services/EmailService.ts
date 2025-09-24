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

 // Template para recuperación de contraseña
 private createPasswordResetTemplate(data: PasswordResetData): EmailTemplate {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}`;
  
  return {
    subject: 'Recuperación de Contraseña - Sistema de Votación',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .button { display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🔐 Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>Has solicitado recuperar tu contraseña en el Sistema de Votación.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Recuperar Contraseña</a>
            </p>
            <p><strong>⏰ Este enlace expira en 1 hora.</strong></p>
            <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
          </div>
          <div class="footer">
            <p>Sistema de Votación © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Recuperación de Contraseña
      
      Hola ${data.userName},
      
      Has solicitado recuperar tu contraseña.
      Visita este enlace para crear una nueva contraseña: ${resetUrl}
      
      Este enlace expira en 1 hora.
      
      Si no solicitaste este cambio, puedes ignorar este email.
    `
  };
}

// Template para agradecimiento por voto
private createVoteThankYouTemplate(data: VoteThankYouData): EmailTemplate {
  return {
    subject: '🗳️ ¡Gracias por tu voto!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .vote-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #27ae60; }
          .player-section { text-align: center; margin: 20px 0; }
          .player-image { max-width: 150px; height: 150px; border-radius: 10px; margin: 10px auto; display: block; object-fit: cover; border: 3px solid #27ae60; }
          .footer { padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🏆 ¡Gracias por participar!</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${data.userName}!</h2>
            <p>Tu voto ha sido registrado exitosamente.</p>
            <div class="vote-info">
              <h3>📊 Detalles de tu voto:</h3>
              
              <div class="player-section">
                <h4>🏃‍♂️ Jugador Votado:</h4>
                ${data.playerImagen ? 
                  `<img src="${data.playerImagen}" alt="Foto de ${data.playerName}" class="player-image" onerror="this.style.display='none';">` 
                  : ''
                }
                <p><strong>${data.playerName}</strong></p>
              </div>
              
              <p><strong>🏉 Partido:</strong> ${data.matchInfo}</p>
              <p><strong>📅 Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            </div>
            
            <p>Tu participación es muy importante para nosotros. ¡Gracias por ser parte de nuestra comunidad!</p>
            <p>Recuerda que podrás votar nuevamente en 24 horas.</p>
          </div>
          <div class="footer">
            <p>Sistema de Votación © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ¡Gracias por tu voto!
      
      Hola ${data.userName},
      
      Tu voto ha sido registrado exitosamente.
      
      Detalles:
      - Jugador: ${data.playerName}
      - Partido: ${data.matchInfo}
      - Fecha: ${new Date().toLocaleString('es-ES')}
      
      ¡Gracias por participar!
    `
  };
}

// Método público para enviar email de recuperación
async sendPasswordReset(data: PasswordResetData): Promise<void> {
  const template = this.createPasswordResetTemplate(data);
  await this.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

// Método público para enviar agradecimiento por voto
async sendVoteThankYou(data: VoteThankYouData): Promise<void> {
  const template = this.createVoteThankYouTemplate(data);
  await this.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

// Método para testing
async sendTestEmail(to: string): Promise<void> {
  await this.sendEmail({
    to,
    subject: 'Test - Sistema de Votación',
    html: '<h1>✅ Email configurado correctamente</h1><p>Si recibes este email, la configuración funciona bien.</p>'
  });
}
}