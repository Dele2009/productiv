// import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or use your SMTP config
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

async function sendEmailFromTemplate(
  to: string,
  subject: string,
  templateName: string,
  variables: Record<string, string>
) {
  const filePath = path.resolve(
    process.cwd(),
    "templates",
    "emails",
    `${templateName}.html`
  );
  const source = fs.readFileSync(filePath, "utf8");
  const compiledTemplate = handlebars.compile(source);
  const html = compiledTemplate(variables);

  //   const mailOptions = {
  //     from: process.env.EMAIL_USER,
  //     to,
  //     subject,
  //     html,
  //   };

  //   await transporter.sendMail(mailOptions);
  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}
export async function sendVerificationEmail(
  to: string,
  variables: Record<string, string>
) {
  await sendEmailFromTemplate(
    to,
    "Verify Your Account",
    "verify_account",
    variables
  );
}
