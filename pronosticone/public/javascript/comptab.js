/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    window.alert('loop');
    $('input').each(function(i){
        window.alert(this.val());
       if(this.val()==null){
          this.val('');
       }
        else if (this.val() == 'null'){
           this.val('');
       }
    });

});



function checkSubmit(){

}