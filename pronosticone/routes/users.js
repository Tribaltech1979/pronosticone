var express = require('express');
var router = express.Router();

/* GET users listing. */
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

router.get('/elabtorneo*', function(req, res, next) {


});
module.exports = router;
