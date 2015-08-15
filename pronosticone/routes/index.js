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
                if(rows[0]) {
                    console.log(rows[0]);
                    req.session.utente = rows[0].UTE_COD_UTENTE;
                    res.redirect('/utente');
                }
                else{
                    res.redirect('/login');
                }
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
  var pool = req.pool;
    var tid = req.query.tid;

    var class_query = 'select * from Torneo where TOR_COD_TORNEO = ' + tid ;

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
                var admin = false;
                if(req.session.utente){
                    if(req.session.utente == rows[0].TOR_COD_MASTER){
                        admin = true;
                    }
                }

                res.render('ttorneo',{
                    "title" : rows[0].TOR_DESCR_TORNEO,
                    "tid" : tid,
                    "admin" : admin
                });
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });



});

router.get('/gettorneo/:tid', function(req, res){
    var pool = req.pool;
    var mtid = req.params.tid;

    var class_query = 'select nome_squadra as Squadra, giocate as Giocate, punti as Punti, vinte as Vinte, pareggiate as Pareggiate, perse as Perse, gol_fatti as Fatti, gol_subiti as Subiti from classifica where cod_torneo = ' + mtid ;

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
////////////////////
//// PARTITA
/////////////////////

router.get('/partita*', function(req, res){
    var pool = req.pool;
    var tid = req.query.tid;
    var ngio = req.query.ngio;
    var npar = req.query.npar;


    var check1= 'SELECT if (sysdate() < GIO_DATA_INIZIO, 1,0) as CH1, if (sysdate()> GIO_DATA_FINE,1,0) as CH2  FROM Giornate where GIO_COD_TORNEO = '+ tid + ' and GIO_NRO_GIORNATA = '+ngio;
    var check2= 'SELECT * FROM Calendario where CAL_COD_TORNEO = ' + tid + ' and CAL_NRO_GIORNATA = '+ngio+' and CAL_NRO_PARTITA = '+ npar;

    var pron = 'SELECT * FROM v_pronostico where cod_torneo = '+tid+' and nro_giornata = '+ngio+' and pr_squadra = '+ req.session.id_squadra;

    if (req.session.utente){
        if(req.session.id_squadra){
            if(tid && ngio){
                pool.getConnection(function(err,connection){
                    if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                    }

                    console.log('connected as id ' + connection.threadId);

                    connection.query(check1,function(err,rows){
                        connection.release();
                        if(!err) {
                            if(rows[0].CH1 == 1){
 //////////////////////////////////// SIAMO PRIMA DELL'INIZIO
                                pool.getConnection(function(err,connection){
                                    if (err) {
                                        connection.release();
                                        res.json({"code" : 100, "status" : "Error in connection database"});
                                        return;
                                    }

                                    console.log('connected as id ' + connection.threadId);

                                    connection.query(check2,function(err2,rows2){
                                        connection.release();
                                        if(!err2) {
                                            if(rows2[0].CAL_COD_HOME == req.session.id_squadra){
                                                //////////// E' la squadra di casa
                                                pool.getConnection(function(err,connection){
                                                    if (err) {
                                                        connection.release();
                                                        res.json({"code" : 100, "status" : "Error in connection database"});
                                                        return;
                                                    }

                                                    console.log('connected as id ' + connection.threadId);

                                                    connection.query(pron,function(err4,rows4){
                                                        connection.release();
                                                        if(!err4) {
                                                            res.render('compila2',{
                                                                'htab' : rows4,
                                                                'cod_torneo' : tid,
                                                                'nro_giorn' : ngio
                                                            });
                                                        }
                                                    });

                                                    connection.on('error', function(err) {
                                                        res.json({"code" : 100, "status" : "Error in connection database"});

                                                    });
                                                });
                                            }
                                            else if (rows2[0].CAL_COD_AWAY == req.session.id_squadra){
                                                //////////// E' la squadra in transferta
                                                pool.getConnection(function(err,connection){
                                                    if (err) {
                                                        connection.release();
                                                        res.json({"code" : 100, "status" : "Error in connection database"});
                                                        return;
                                                    }

                                                    console.log('connected as id ' + connection.threadId);

                                                    connection.query(pron,function(err4,rows4){
                                                        connection.release();
                                                        if(!err4) {
                                                            res.render('compila2',{
                                                                'htab' : rows4,
                                                                'cod_torneo' : tid,
                                                                'nro_giorn' : ngio
                                                            });
                                                        }
                                                    });

                                                    connection.on('error', function(err) {
                                                        res.json({"code" : 100, "status" : "Error in connection database"});

                                                    });
                                                });

                                            }
                                            else{
                                                /////////// E' uno spettatore prima dell'inizio
                                                res.render('aspetta');
                                            }
                                        }
                                    });

                                    connection.on('error', function(err) {
                                        res.json({"code" : 100, "status" : "Error in connection database"});

                                    });
                                });
                            }
                            else{
 //////////////////////////////////// SIAMO DOPO L'INIZIO
                                res.render('risultato');
                            }
                        }
                    });

                    connection.on('error', function(err) {
                        res.json({"code" : 100, "status" : "Error in connection database"});

                    });
                });
            }
            else{
                res.redirect(req.session.backURL || '/')
            }

        }
        else{
            res.redirect('/login');
        }
    }
    else{
        res.redirect('/login');
    }



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

//////////////////
//// POST SALVA PRONOSTICO
////////////////
router.post('/salvapron',function(req, res){
    console.log(req.body.torneo);
    console.log(req.body.giorn);
    console.log(JSON.parse(req.body.tab1));
    console.log(JSON.parse(req.body.tab2));
    console.log(JSON.parse(req.body.tab3));
    console.log(JSON.parse(req.body.tab4));
    console.log(req.body.tab5);
});


module.exports = router;
