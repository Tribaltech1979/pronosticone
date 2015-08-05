var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.utente){
        res.redirect('/utente');
    }
    else {res.render('index', { title: 'Pronosticone' });}
});
//// LOGIN
router.get('/login', function(req,res){
    if(req.session.utente){
        res.redirect('/utente');
    }
    else {res.render('login');}
});
//// UTENTE
router.get('/utente',function(req,res){
    if(req.session.utente){
        var pool = req.pool;
        var tmquery = "select * from v_squadre where cod_ute = "+req.session.utente;


        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(tmquery,function(err,rows){
                if(!err) {
                    var tor_query = "select * from v_torneo where cod_squadra = "+rows[0].id_squadra;
                    connection.query(tor_query,function(err2,rows2) {
                        if(!err2) {
                            var cal_query = "select * from v_global_calen where cod_home = " + rows[0].id_squadra + " or cod_away = " + rows[0].id_squadra ;
                            connection.query(cal_query, function (err3, rows3) {
                                connection.release();
                                if (!err3) {
                                    console.log('connessione di ' + rows[0].nome_squadra);
                                    req.session.id_squadra = rows[0].id_squadra;
                                    res.render('user', {"user": rows[0].nome_squadra,
                                        title: rows[0].nome_squadra + ' Homepage',
                                        "torneo": rows2 ,
                                        "calendario" : rows3
                                    });

                                }
                            });
                        }
                        else {
                            connection.release();
                            res.redirect('/login');
                        }
                    });
                }
                else{
                    connection.release();
                    res.redirect('/login');
                }
            });


            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else {res.redirect('/login');}
});
//////////////////////
///// POST LOGIN
///////////////////////
router.post('/login',function(req,res){
    var pool = req.pool;
    var username = req.body.username;
    var password = req.body.password;

    var usrquery =  "select UTE_COD_UTENTE from Utenti where UTE_MAIL = '" + username + "' and UTE_PASS = '" + password+"'" ;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(usrquery,function(err,rows){
            connection.release();
            if(!err) {
                console.log(rows[0]);
                req.session.utente = rows[0].UTE_COD_UTENTE;
                res.redirect('/utente');
            }
            else{
                res.redirect('/login');
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });



});

////////////////////
///// TORNEO
///////////////////
router.get('/torneo*', function(req, res){
  //  var pool = req.pool;
    var tid = req.query.tid;

    if(tid){
        res.render('ttorneo',{
            "title" :'Torneo',
            "tid" : mtid
        });
    }
/*
    var class_query = 'select * from classifica where cod_torneo = ' + mtid ;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(class_query,function(err,rows){
            connection.release();
            if(!err) {
                res.render('torneo',{
                    "classifica" : rows,
                    "title" : 'Torneo'
                });
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });
*/


});

router.get('/gettorneo/*', function(req, res){
    var pool = req.pool;
    var mtid = req.params.tid;

    var class_query = 'select * from classifica where cod_torneo = ' + mtid ;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(class_query,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });
});



///////////////////////
/////USER LIST TEST
/////////////////////

router.get('/userlist',function(req,res){
        var pool = req.pool;

        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("select * from Utenti",function(err,rows){
                connection.release();
                if(!err) {
                    res.render('userlist',{
                        "userlist" : rows
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
);

module.exports = router;
