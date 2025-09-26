export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PasswordResetData {
  email: string;
  resetToken: string;
  userName: string;
}

export interface VoteThankYouData {
  email: string;
  userName: string;
  playerName: string;
  playerImagen: string;
  matchInfo: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}