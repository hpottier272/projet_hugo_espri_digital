import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  });

  async sendCode(to: string, code: number) {
    await this.transporter.sendMail({
      from: '"test 2FA via mail" <toto@cmoi>',
      to,
      subject: 'Votre code de connexion pour appli nestJs hugo',
      text: 'Voici votre code de vérification :'+ code,
    });
  }
}