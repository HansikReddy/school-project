const nodemailer=require("nodemailer");

const sendEmail=(emailData)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hansikreddy1252@gmail.com',
          pass: 'informatica@852'
        }
      });
      var mailOptions = {
        from: 'hansikreddy1252@gmail.com',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports={sendEmail};