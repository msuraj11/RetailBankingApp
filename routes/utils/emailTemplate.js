const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (toEmail, name, dynamicValue) => {
  const fromMail = 'vaishnavimatchings.mamidi77@gmail.com';
  const toMail = toEmail;
  const subject = 'Welcome to BOS';
  const text = `Hi ${name},\nWelcome to Bank of Suraj(BOS). Please note down your ${dynamicValue}. Note that this is confidential.\n\nThanks,\nBOS`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: fromMail,
      pass: config.get('password')
    }
  });

  const mailOptions = {
    from: {
      name: 'Retail Banking App',
      address: fromMail
    },
    to: toMail,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to user: ${toMail} successfully.`);
    return Promise.resolve(`Email sent to user: ${toMail} successfully.`);
  } catch (error) {
    console.log('error sending email to user:', error);
    //return Promise.reject(error);
  }
};

module.exports = sendEmail;
