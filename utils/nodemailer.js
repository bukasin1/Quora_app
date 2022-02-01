const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.USERNAME,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
const sendMail = async(to, subject, body) => {
  try{
    const mailOptions = {
      from: 'bukasin1@gmail.com',
      to,
      subject,
      html: body,
    };
    const mailDetails = await transporter.sendMail(mailOptions);
    return { mailDetails }
  }catch(error){
    return { mailDetails, error }
  }
};
module.exports =  sendMail;
