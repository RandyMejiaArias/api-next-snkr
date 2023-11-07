import nodemailer from 'nodemailer';
import config from '../config.js';

export const sendMail = async (senderName, senderAddress, receiverAddress, subject, template) => {
  const transporter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const infoMail = await transporter.sendMail({
    from: `"${senderName}" <${senderAddress}>`, // sender address
    to: receiverAddress, // list of receivers
    subject, // Subject line
    html: template // html body
  });

  return infoMail.messageId;
};
