/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    $("[value='null']").val('');

});



function checkSubmit(){
/// colonne totalmente completate
    $(".G1,.G2,.G6,.G9").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red'); }
    });
/// colonne completate e con solo numeri
    $(".G1,.G2,.G6").each(function(){
        if(isNaN($(this).val())){
            $(this).css('background-color','red'); }
    });

    var regex = '(1|2|X|)';
    $(".G9").each(function(){
        if(!$(this).val().match(regex)){
            $(this).css('background-color','red'); }
    });
}