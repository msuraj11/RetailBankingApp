const nodemailer = require('nodemailer');

const sendEmail = (toEmail, name, dynamicValue) => {
    const fromMail = 'vaishnavimatchings.mamidi77@gmail.com';
    const toMail = toEmail;
    const subject = 'Welcome to BOS';
    const text = `Hi ${name},

Welcome to Bank of Suraj(BOS). Please note down your ${dynamicValue}. Note that this is confidential.


Thanks,
BOS`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromMail ,
            pass: 'jaibhavani'
        }
    });

    const mailOptions = {
        from: fromMail,
        to: toMail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log('error:',error);
            return res.status(404).json({msg: 'E-mail is not valid'});
        }
        console.log('response', response)
        });

};

module.exports = sendEmail;
