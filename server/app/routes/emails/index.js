'use strict';
const router = require('express').Router();
const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport('smtps://scorestore%40gmx.com:supersecure@mail.gmx.com');
const transporter = nodemailer.createTransport({
  service: 'OpenMailBox',
  auth: {
    user: 'scorestore@openmailbox.org',
    pass: 'supersecure'
  }
});

router.put('/confirmation', function (req, res, next) {
  console.log(req.session.guest)
  let user = req.user || req.session.guest;
  let mailOptions = {
    from: 'scorestore@openmailbox.org',
    to: user.email,
    subject: 'Order Confirmation',
    text: 'Thank you for your order! Your confirmation number is ' + req.body.confirmationNumber
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        next(error);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
