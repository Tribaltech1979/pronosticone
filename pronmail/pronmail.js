/**
 * Created by Schiappacassed on 22/09/2015.
 */
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAJ2GLFGBG26V3C2WQ',
    secretAccessKey: 'AoMV3cmk57qlcXTBwQh0GTo+gjJ4AL8bBRq/pbOx0LCt'
}));

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Pronosticone <pronosticon.net@gmail.com>', // sender address
    to: 'tribaltech@gmail.com', // list of receivers
    subject: 'Hello', // Subject line
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