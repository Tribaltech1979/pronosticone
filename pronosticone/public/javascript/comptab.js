/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
$.each($("input").serializeArray(), function(i, field){
    window.alert(field.value.toString);
    if (field.value == null){

        field.value = '';
    }
});


});

function checkSubmit(){

}