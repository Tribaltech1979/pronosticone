/**
 * Created by Schiappacassed on 22/09/2015.
 */
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(ses({
    AWSAccessKeyID: "AKIAJE5O3UWTELCJ4ZXQ",
    AWSSecretKey: "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",
    ServiceUrl:"https://email-smtp.us-west-2.amazonaws.com"
}));

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Pronosticone <pronosticone.net@gmail.com>', // sender address
    to: 'tribaltech@gmail.com', // list of receivers
    subject: 'Prova', // Subject line
    text: 'Hello world', // plaintext body
    html: '<b>Hello world</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});