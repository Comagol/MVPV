import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Configuracion de email incompleta. Verificar las variables de entorno.');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};  
//Configuracion para testing de conexion
export const testEmailConnection = async (): Promise<Boolean> => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ Conexion de email exitosa');
    return true;
  } catch (error) {
    console.error('Error al verificar la conexion de email:', error);
    console.log('❌ Conexion de email fallida');
    return false;
  }
}