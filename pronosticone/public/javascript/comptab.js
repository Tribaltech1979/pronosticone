/**
 * Created by Daniele on 09/08/2015.
 */



$(document).ready(function () {
    window.alert('loop');
    $('#compila *').filter(':input').each(function(){
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