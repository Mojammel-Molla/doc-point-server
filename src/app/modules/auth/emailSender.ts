import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Doc Point... 🚑" <mojammelmolla897@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    // text: 'Hello world?', // plain text body
    html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
export default emailSender;
