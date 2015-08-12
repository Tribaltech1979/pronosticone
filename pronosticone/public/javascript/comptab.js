/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    window.alert('loop');
    $(":input").each(function(i,el){
        window.alert(el.val());
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