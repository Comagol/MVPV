import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.BREVO_SMTP_KEY,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // Fallback a Gmail si no está configurado Brevo
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Configuracion de email incompleta. Verificar las variables de entorno.');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    }
  });
};