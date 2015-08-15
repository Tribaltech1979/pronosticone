/**
 * Created by Daniele on 09/08/2015.
 */

window.addEventListener("resize",function(){
    $("input").css('width',$("img").width()/13+"px")
})

$(document).ready(function () {
    $("[value='null']").val('');
    $("input").css('width',$("img").width()/13+"px")
    $(".alert").hide();

});


function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;
    var count;
    count = 0;

/// colonne totalmente completate
    $(".G1,.G2,.G6,.G9").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });
/// colonne completate e con solo numeri
    $(".G1,.G2,.G6").each(function(){
        if(isNaN($(this).val())){
            $(this).css('background-color','red');
            good = false;
        }
    });

    var regex = '[12X]';
    $(".G9").each(function(){
        if(!$(this).val().match(regex)){
            $(this).css('background-color','red');
            good = false;
        }
    });

////////////// DOPPIE
    //// RISULTATO ESATTO
    $(".G3").each(function(){
        if($(this).val()){
            count = count +1;
            ////solo una doppia
            if(count > 1){
                $(this).css('background-color','red');
                good = false;
            }
            ///deve essere un numero
            if(isNaN($(this).val())){
                $(this).css('background-color','red');
                good = false;
            }
            ///deve essere accoppiata all'altra cella
            if(!$(this).parents("tr").find(".G4").val() || isNaN($(this).parents("tr").find(".G4").val())){
                $(this).parents("tr").find(".G4").css('background-color','red');
                good = false;
            }

        }
    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G3,.G4").css('background-color','red');
        good = false;
    }
    ///////SOMMA GOL
    count = 0;
    $(".G7").each(function(){
        if($(this).val()) {
            count = count + 1;
            ////solo una doppia
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un numero
            if (isNaN($(this).val())) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }

    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G7").css('background-color','red');
        good = false;
    }

    count = 0;
    ///// SEGNO
    $(".G10").each(function(){
        if($(this).val()) {
            count = count + 1;
            ////solo una doppia
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un segno
            if (!$(this).val().match(regex)) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }

    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G10").css('background-color','red');
        good = false;
    }
///// JOLLY
    var regex2 = '[*]';
    count = 0;
    ///// RISULTATO ESATTO
    $(".G5").each(function() {
        if ($(this).val()) {
            count = count + 1;
            ////solo un jolly
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un segno
            if (!$(this).val().match(regex2)) {
                $(this).css('background-color', 'red');
                good = false;
            }
            /// non si gioca il jolly sulla doppia
            if ($(this).parents("tr").find(".G3").val()) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }
    });
        if (count == 0){
            ///se nessuna è valorizzata va in errore
            $(".G5").css('background-color','red');
            good = false;
        }
        count = 0;
        ///// NUMERO GOL
        $(".G8").each(function() {
            if ($(this).val()) {
                count = count + 1;
                ////solo un jolly
                if (count > 1) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                ///deve essere un segno
                if (!$(this).val().match(regex2)) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                /// non si gioca il jolly sulla doppia
                if ($(this).parents("tr").find(".G7").val()) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
            }
        });

    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G8").css('background-color','red');
        good = false;
    }
        count = 0;
        ///// SEGNO
        $(".G11").each(function(){
            if($(this).val()) {
                count = count + 1;
                ////solo un jolly
                if (count > 1) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                ///deve essere un segno
                if (!$(this).val().match(regex2)) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                /// non si gioca il jolly sulla doppia
                if($(this).parents("tr").find(".G10").val()){
                    $(this).css('background-color', 'red');
                    good = false;
                }
            }
            if (count == 0){
                ///se nessuna è valorizzata va in errore
                $(".G11").css('background-color','red');
                good = false;
            }

        });
        if (count == 0){
            ///se nessuna è valorizzata va in errore
            $(".G8").css('background-color','red');
            good = false;
        }



////// tutto ok si può salvare
    return good;
};

function validate() {
    if (checkSubmit()) {
        document.getElementById("compila").submit();
    }
    else {
        $(".alert").show();
    }
}