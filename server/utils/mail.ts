import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();
interface IEmail {
  email: string;
  subject: string;
  html: string;
  data: { [key: string]: any };
}

const sendMail = async (option: IEmail): Promise<void> => {
  const transPort: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, html, data } = option;

  const htmlPath = path.join(__dirname, "../mailHtml", html);

  const mailHtml: string = await ejs.renderFile(htmlPath, data);

  const mailOptrions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: mailHtml,
  };

  await transPort.sendMail(mailOptrions);
};

export default sendMail;
