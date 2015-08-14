/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    $("[value='null']").val('');

});




function checkSubmit(){
    var good = true;
    $("input").css("background-color","white");
    good = true;
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

    return good;
}

function validate() {
    if(checkSubmit()){
        document.form.submit();
    }
    else{
        window.alert('Completare il modulo');
    }
}