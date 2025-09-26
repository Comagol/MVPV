import nodemailer from 'nodemailer';
import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

export const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'brevo') {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY no está configurado');
    }
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    return apiInstance;
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