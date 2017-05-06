var nodemailer = require('nodemailer');

module.exports.sendEmailNotification = function(user) {

    /* Create transporter obj using SMTP transporter*/
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'microservices.blog@gmail.com',
            pass: 'nod3blog97!'
        }
    });

    /* Verify transporter */
    transporter.verify(function(error, success) {
       if (error) {
            console.log(error);
       } else {
            console.log('Server is ready to take our messages');
       }
    });

    /* Prepare the HTML message */
    var html = `
      <p>Hey ${user.name},</p><br>
      <p>Thank you for joining our club. Feel free to like, post, share & comment
        everything you want!
      </p>
      <p>If you encounter some issues, or you just wanna say <i>Hello!</i>
        feel free to contact me here at <b>b.g.nuryyev@gmail.com</b></p>
      <br>
      <p>Your sincerely,</p>
      <p>Batya</p>
    `;

    /* Specify mail options -> from, to whom, subject, text/html */
    var mailOptions = {
      from: '"Ultimate Blog" <microservices.blog@gmail.com>', // sender address
      to: `${user.email}`, // list of receivers
      subject: `Hello ${user.name} ✔`, // Subject line
      html: html //html body
    };

    /* Send mail with defined transport object */
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });

    return;
}
