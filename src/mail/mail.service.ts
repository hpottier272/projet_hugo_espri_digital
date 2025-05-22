import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hugo272@espridigital.fr',
      pass: '***',
    },
  });

  async sendCode(to: string, code: number) {
    await this.transporter.sendMail({
      from: '"test 2FA via mail" <hugo.pottier@espridigital.fr>',
      to,
      subject: 'Votre code de connexion pour appli nestJs hugo',
      text: 'Voici votre code de vérification :'+ code,
    });
  }
}
