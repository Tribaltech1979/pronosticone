/**
 * Created by Schiappacassed on 22/09/2015.
 */
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var fs = require('fs');
var mysql = require("mysql");

var dbfile = 'db.sk';

var configuration = JSON.parse(fs.readFileSync(dbfile));

var mailfile = 'mail.sk';
var mailconf = JSON.parse(fs.readFileSync(mailfile));

var acc = mailconf.acc;
var secret = mailconf.secret;

var connection = mysql.createConnection({
    host     : configuration.database,
    user     : configuration.username,
    password : configuration.password,
    database : 'pronosticone'
});

connection.connect(function(err){
   // console.log(configuration);
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(ses({
    AWSAccessKeyID: acc,
    AWSSecretKey: secret,
    ServiceUrl:"https://email-smtp.us-west-2.amazonaws.com"
}));

connection.query('select * from v_mail1', function(err, rows) {
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
  //  console.log(rows);
    var i;
if(!err) {
    for(i=0; i < rows.length; i++) {
        var mailOptions = {
            from: 'Pronosticone <pronosticone.net@gmail.com>', // sender address
            to: rows[i].mail, // list of receivers
            subject: 'Avviso, pronostico mancante', // Subject line
            text: "Ciao "+ rows[i].n_squadra+", ti ricordiamo che non hai ancora inserito il pronostico per la partita del "+rows[i].data_inizio+". Collegati a http://www.pronosticone.net/partita?tid="+rows[0].cod_torneo+"&ngio="+rows[0].nro_giornata+"&npar="+rows[0].nro_partita, // plaintext body
            html: '<html></script><link rel="stylesheet"href=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"><body><header><img src="http://www.pronosticone.net/img/bannerp.jpg" alt="banner" class="img-responsive"><h1> Attenzione '+rows[i].n_squadra+'</h1><p> Non risulta ancora inserito il pronostico per la partita del giorno '+rows[i].data_inizio+'</p><p> Per inserire il pronostico clicca <a href="http://www.pronosticone.net/partita?tid='+rows[0].cod_torneo+'&ngio='+rows[0].nro_giornata+'&npar='+rows[0].nro_partita+'"> qui. </p></html>' // html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
        }
});

process.exit(0);