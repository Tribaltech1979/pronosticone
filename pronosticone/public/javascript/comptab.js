/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    $("[value='null']").val('');

});



function checkSubmit(){

    if($(".G1[value='']").length ||$(".G2[value='']").length || $(".G6[value='']").length || $(".G9[value='']").length){
        window.alert('cella vuota');

        return false;

    }

}