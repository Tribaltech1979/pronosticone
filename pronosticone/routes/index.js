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
///// CAMBIO PASSWORD
router.get('/cambiop',function(req,res){
	if(req.session.utente){
			res.render('cambiopass');
		}
	else{res.redirect('/login');}

});
///////////////
/// CAMBIO PASSWORD
///////////////////

router.post('/cambiop',function(req,res){
		var passo = req.body.passold;
		var passn = req.body.passnew;
		var pool = req.pool;
		
		    var usrquery =  "select UTE_COD_UTENTE from Utenti where UTE_COD_UTENTE = " + req.session.utente + " and UTE_PASS = '" + passo+"'" ;

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
								var updquery = "UPDATE Utenti set UTE_PASS = '"+passn+"' where UTE_COD_UTENTE = "+req.session.utente+" ;";
								pool.getConnection(function(err,connection){
					            if (err) {
					                connection.release();
					                res.json({"code" : 100, "status" : "Error in connection database"});
					                return;
					            }
					
					            console.log('connected as id ' + connection.threadId);
					
					            connection.query(updquery,function(err,rows){
					                connection.release();
					                if(!err) {
															res.sendStatus(200);
					                }
					                else{
					                		res.sendStatus(500);
					                	}
					            });
					
					            connection.on('error', function(err) {
					                res.json({"code" : 100, "status" : "Error in connection database"});
					
					            });
					        });
            }
            else{
                res.sendStatus(400);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });
		
		
	});
//////////////////
//// CAMBIO NOME SQUADRA
/////////////////

router.post('/cambiosq', function(req,res){
    var pool = req.pool;
    var nomesq = req.body.sqnew;

    if(req.session.id_squadra)
    {
        var upd_sq = "UPDATE Squadre set SQ_NOME_SQUADRA = '"+nomesq+"' where SQ_ID_SQUADRA = "+req.session.id_squadra;
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(upd_sq,function(err,rows){
                connection.release();
                if(!err) {
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(500);
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login');
    }
});

///////////////
//// MAIL
//////////////

router.post('/cmail', function(req,res){
    var pool = req.pool;
    var nmail = req.body.smail;
    var avv = req.body.avv;

    if(req.session.id_squadra)
    {
        var upd_sq = "UPDATE Squadre set SQ_MAIL = '"+nmail+"', SQ_AVVISO = '"+avv+"' where SQ_ID_SQUADRA = "+req.session.id_squadra;
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(upd_sq,function(err,rows){
                connection.release();
                if(!err) {
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(500);
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login');
    }
});

/////////////
//// UTENTE
/////////////
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
                            var cal_query = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where punti_home is null and ( cod_home = " + rows[0].id_squadra + " or cod_away = " + rows[0].id_squadra +" ) order by dt_inizio";
                            connection.query(cal_query, function (err3, rows3) {

                                if (!err3) {
                                    var cal_past = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where punti_home is not null and ( cod_home = " + rows[0].id_squadra + " or cod_away = " + rows[0].id_squadra +" ) order by dt_inizio desc";
                                    connection.query(cal_past,function(err4,rows4) {
                                        connection.release();
                                        if(!err4) {
                                            console.log('connessione di ' + rows[0].nome_squadra);
                                            req.session.id_squadra = rows[0].id_squadra;
                                            res.render('user', {"user": rows[0].nome_squadra,
                                                title: rows[0].nome_squadra + ' Homepage',
                                                "torneo": rows2,
                                                "calendario": rows3,
                                                "pastcal":rows4
                                            });
                                        }
                                    });

                                }
                                else{
                                    connection.release();
                                    res.redirect('/login');
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
///////////////////
//// LOGOFF
/////////////////
router.get('/logoff', function(req,res){
	delete req.session.utente;
	delete req.session.id_squadra;
	res.redirect('/');
	});

////////////////////
///// TORNEO
///////////////////
router.get('/torneo*', function(req, res){
  var pool = req.pool;
    var tid = req.query.tid;

    var class_query = 'select * from Torneo where TOR_COD_TORNEO = ' + tid ;
    var past = "select * from v_global_calen where cod_torneo = "+tid;
    var q_massimo = "select max(GIO_NRO_GIORNATA)'tot_gio' from Giornate where GIO_COD_TORNEO = "+tid;
    var q_currgio = "select max(nro_giornata)'cur_gio' from v_global_calen where cod_torneo = "+tid+" and punti_home is not null";

    if (req.session.id_squadra) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                res.json({"code": 100, "status": "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(class_query, function (err, rows) {

                if (!err) {
                    var admin = false;
                    var padre = {};
                    var massimo = 1;
                    var mgio = 1;

                    if(rows[0].TOR_COD_PADRE){
                        var q_padr = " select * from Torneo where TOR_COD_PADRE = "+rows[0].TOR_COD_PADRE + " order by TOR_COD_TORNEO";
                        connection.query(q_padr, function (err4, rows4) {
                            padre = rows4;
                        });
                    }

                    connection.query(q_massimo, function(err5,rows5){
                        massimo = rows5[0].tot_gio;
                    });

                    connection.query(q_currgio, function(err6,rows6){
                        if(!err6){
                            mgio = rows6[0].cur_gio;
                        }
                        else{
                            mgio = 1;
                        }

                    });

                   // console.log(mgio);

                    if (req.session.utente == rows[0].TOR_COD_MASTER) {
                        admin = true;
                    }

                    connection.query(past, function (err3, rows3) {


                        var cal_query = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where cod_torneo = " + tid + " and dt_inizio > sysdate() and ( cod_home = " + req.session.id_squadra + " or cod_away = " + req.session.id_squadra + " ) order by dt_inizio";
                        connection.query(cal_query, function (err2, rows2) {
                            connection.release();
                            res.render('ttorneo', {
                                "title": rows[0].TOR_DESCR_TORNEO,
                                "image": rows[0].TOR_IMAGE,
                                "numgiorn": massimo,
                                "curgio" : mgio,
                                "padre": padre,
                                "tid": tid,
                                "admin": admin,
                                "calen": rows2,
                                "pcalen": rows3
                            });
                        });


                    });
                }

            });

            connection.on('error', function (err) {
                res.json({"code": 100, "status": "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/');
    }


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


    var check1= "SELECT if ( convert_tz(sysdate(),'-1:00','+1:00') < addtime(GIO_DATA_INIZIO, GIO_ORA_INIZIO), 1,0) as CH1, if (sysdate()> GIO_DATA_FINE,1,0) as CH2  FROM Giornate where GIO_COD_TORNEO = "+ tid + " and GIO_NRO_GIORNATA = "+ngio;
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
                                                            		'title': "Inserimento risultati",
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
                                                            		'title': "Inserimento risultati",
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
                                                res.render('aspetta',{
                                                	'title':"Partita ancora da disputare"
                                                	});
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
                                var t_query = "Select * from v_global_calen where cod_torneo = "+tid+" and nro_giornata = "+ngio+" and nro_partita = "+npar+" ;";
                                pool.getConnection(function(err,connection){
                                    if (err) {
                                        connection.release();
                                        res.json({"code" : 100, "status" : "Error in connection database"});
                                        return;
                                    }

                                    console.log('connected as id ' + connection.threadId);

                                    connection.query(t_query,function(err,rows){
                                        if(!err) {
                                        var p_query_h = "Select * from v_pronostico where cod_torneo = "+tid+" and nro_giornata = "+ngio+" and pr_squadra = "+rows[0].cod_home+" ;";
                                        var p_query_a = "Select * from v_pronostico where cod_torneo = "+tid+" and nro_giornata = "+ngio+" and pr_squadra = "+rows[0].cod_away+" ;";

                                            connection.query(p_query_h,function (err2,rows2){
                                                connection.query(p_query_a,function(err3,rows3){
                                                    connection.release();
                                                    res.render('risultato',{
                                                    		"title" : rows[0].sq_home+" VS "+rows[0].sq_away,
                                                        "cod_torneo" : tid,
                                                        "tes": rows[0],
                                                        "home": rows2,
                                                        "away": rows3
                                                    });
                                                });
                                            });

                                        }
                                        else{
                                            connection.release();
                                            res.redirect('/utente');
                                        }
                                    });

                                    connection.on('error', function(err) {
                                        res.json({"code" : 100, "status" : "Error in connection database"});

                                    });
                                });


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
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
    var t3 = JSON.parse(req.body.tab3);
    var t4 = JSON.parse(req.body.tab4);
    var t5 = JSON.parse(req.body.tab5);
    var t6 = JSON.parse(req.body.tab6);
    var t7 = JSON.parse(req.body.tab7);
    var t8 = JSON.parse(req.body.tab8);
    var t9 = JSON.parse(req.body.tab9);
    var t10 = JSON.parse(req.body.tab10);
    var t11 = JSON.parse(req.body.tab11);
    var q_pp = "SELECT * FROM Partite_Pronostico  WHERE PP_COD_TORNEO = " + tid + " AND PP_NRO_GIORNATA = "+ngio;

   // console.log(t10);

    if (req.session.id_squadra){
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(q_pp,function(err,rows){
                connection.release();
                if(!err) {
                    var upd_q = '';
                    var index;
                    for (index = 0; index < rows.length; index++){
                        var part = rows[index].PP_COD_PARTITA;
                        var q_up = "UPDATE Pronostico SET PRO_GOL_HOME = "+ t1[part]+ ", PRO_GOL_AWAY = "+ t2[part]+", PRO_GOL_HOME2 = "+ t3[part];
                        var q_up2 = ", PRO_GOL_AWAY2 = "+t4[part]+", PRO_GOL_J = "+t5[part]+", PRO_SEGNO = "+t9[part]+", PRO_SEGNO2 = "+t10[part]+", PRO_SEGNOJ = "+t11[part]+", PRO_NRO_GOL = "+t6[part]+", PRO_NRO_GOL2 = "+t7[part]+", PRO_NRO_GOL_J = " +t8[part];
                        var wh = " WHERE PRO_COD_TORNEO = " + tid + " AND PRO_COD_PARTITA = "+part +" AND PRO_COD_UTENTE = "+  req.session.id_squadra;
                        var upd = q_up + q_up2+ wh;
                        upd_q = upd_q + upd + ";"
                    }
                   // console.log(upd_q);
                    pool.getConnection(function(err,connection){
                        if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                        }
                        connection.query(upd_q,function(err2) {
                            connection.release();
                            if (!err2) {
                                res.send('OK');
                            }
                        });
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }




});

router.get('/ristorneo*', function(req, res, next) {
    var pool = req.pool;
    var tid = req.query.tid;



    if(req.session.utente){
        var check1 = "select * from Torneo where TOR_COD_TORNEO = "+tid+" AND TOR_COD_MASTER = "+req.session.utente;
        var gior = "select * from v_insris where cod_torneo = "+tid+" and nro_giornata = (select min(nro_giornata) from v_insris where cod_torneo = "+tid +" and g_home is null)";
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(check1,function(err,rows){

                if(!err) {

                    connection.query(gior,function(err2,rows2) {

                        connection.release();
                        if(!err2) {
                            res.render('insertris', {
                                "list": rows2,
                                "descr": rows[0].TOR_DESCR_TORNEO
                            });
                        }
                    });
                }
                else{
                    connection.release();
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login')
    }


});

router.post('/salvaris',function(req,res){
    var pool = req.pool;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
    var t3 = JSON.parse(req.body.tab3);
    var t4 = JSON.parse(req.body.tab3);

    var uquery = '';
    var count;
    for(count = 0; count < t4.length; count++){
        var part = t4[count];
        var upd = 'UPDATE Partite set PAR_GOL_HOME = '+t1[part]+' , PAR_GOL_AWAY = '+t2[part]+' , PAR_SEGNO = '+t3[part]+' WHERE PAR_COD_PARTITA = '+part+' ;';

        uquery = uquery + upd;
    }

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(uquery,function(err,rows){
            connection.release();
            if(!err) {
                res.send('OK');
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });

});
//////////////////////////
////////// GESTIONE SQUADRA
//////////////////////////
router.get('/gestsq',function(req,res){
    var pool = req.pool;
if(req.session.id_squadra) {
    var sq_query = 'select * from Squadre where SQ_ID_SQUADRA = '+req.session.id_squadra;
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(sq_query, function (err, rows) {
            connection.release();
            if (!err) {
                res.render('gestsq', {
                    "user": rows[0]
                });
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});

        });
    });
}
    else{
    res.redirect('/login');
}

});

//////////////////////////
//////////// ELAB TORNEO
/////////////////////////
router.get('/elabtorneo*', function(req, res) {
    var pool = req.pool;
    var tid = req.query.tid;

    var check1 = "SELECT * FROM v_punti2 WHERE cod_torneo = "+tid+" AND nro_giornata = ( SELECT min(CAL_NRO_GIORNATA) from Calendario where CAL_COD_TORNEO = "+ tid+" AND CAL_PUNTI_HOME is null ) ";

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
                res.render('elabtorneo',{
                    "list" : rows
                });
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });

});

router.post('/salvatorneo', function(req,res){
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;

    var q1 = "SELECT * FROM v_punti2 WHERE cod_torneo = "+tid+" AND nro_giornata = "+ngio;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(q1,function(err,rows){
            connection.release();
            if(!err) {
                var upd_q = '';
                var index;
                for (index = 0; index < rows.length; index++){
                    var upd = "UPDATE Calendario set CAL_PUNTI_HOME = "+rows[index].punti_casa+" , CAL_PUNTI_AWAY = " +rows[index].punti_away+" , CAL_GOL_HOME = "+rows[index].gol_casa+" , CAL_GOL_AWAY = "+rows[index].gol_away;
                    var wh = " WHERE CAL_COD_TORNEO = "+tid+" AND CAL_NRO_GIORNATA = "+ngio+" AND CAL_NRO_PARTITA = "+ rows[index].nro_partita+" ;";
                    var gir = upd +wh ;

                    upd_q = upd_q + gir;

                }

                pool.getConnection(function(err,connection){
                    if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                    }

                    console.log('connected as id ' + connection.threadId);

                    connection.query(upd_q,function(err,rows){
                        connection.release();
                        if(!err) {
                            res.send('OK');
                        }
                    });

                    connection.on('error', function(err) {
                        res.json({"code" : 100, "status" : "Error in connection database"});

                    });
                });
            }

        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });


});

module.exports = router;
