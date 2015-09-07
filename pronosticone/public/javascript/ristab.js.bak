/**
 * Created by Daniele on 05/09/2015.
 */
$(document).ready(function () {
    $("[value='null']").val('');
    $("td").css('width',$("img").width()/13+"px");
    $(".alert").hide();

    if($(".G3").html()) {
        colora();
    }


    $(".G5,.G14,.G15").each(function(){if($(this).html() && $(this).html()== 0){$(this).html('X');}})
});

function colora(){
    ////segno
    $(".G5").each(function () {

        if( $(this).html() == $(this).parents("tr").find(".G14").html())  {
            $(this).parents("tr").find(".G14").css('background-color','green');
            if( $(this).parents("tr").find(".G16").html()){
                $(this).parents("tr").find(".G16").css('background-color','green');
            }
        }

        if( $(this).html() == $(this).parents("tr").find(".G15").html())  {
            $(this).parents("tr").find(".G15").css('background-color','green');
        }

    });
//// SOMMA GOL
    $(".G11").each(function(){
        if(($(this).html()*1) == (($(this).parents("tr").find(".G3").html()*1)+($(this).parents("tr").find(".G4").html()*1))){
            $(this).css('background-color','green');
            if( $(this).parents("tr").find(".G13").html()){
                $(this).parents("tr").find(".G13").css('background-color','green');
            }
        }
    });

    $(".G12").each(function(){
        if(($(this).html()*1) == (($(this).parents("tr").find(".G3").html()*1)+($(this).parents("tr").find(".G4").html()*1))){
            $(this).css('background-color','green');
        }
    });

/// RISULTATO ESATTO
    $(".G6").each(function(){
        if($(this).html()==$(this).parents("tr").find(".G3").html() && $(this).parents("tr").find(".G7").html()==$(this).parents("tr").find(".G4").html()){
            $(this).css('background-color','green');
            $(this).parents("tr").find(".G7").css('background-color','green');
            if( $(this).parents("tr").find(".G10").html()){
                $(this).parents("tr").find(".G10").css('background-color','green');
            }
        }
    });
    $(".G8").each(function(){
        if($(this).html()==$(this).parents("tr").find(".G3").html() && $(this).parents("tr").find(".G9").html()==$(this).parents("tr").find(".G4").html()){
            $(this).css('background-color','green');
            $(this).parents("tr").find(".G9").css('background-color','green');
        }
    });
}