/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
$.each($("input").serializeArray(), function(i, field){
   window.alert(field.val());
    if (field.val() == null){

        field.val('');
    }
});


});

function checkSubmit(){

}