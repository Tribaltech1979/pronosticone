/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    $(":input").each(function(i,el){
       if(el.val()==null){
           el.val('');
       }
        else if (el.val() == 'null'){
           el.val('');
       }
    });

});



function checkSubmit(){

}