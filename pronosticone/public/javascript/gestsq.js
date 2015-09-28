/**
 * Created by Schiappacassed on 19/09/2015.
 */
$(document).ready(function () {
    $(".G2").attr('disable','true');
    $(".alert").hide();

})

function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;

    $(".G1,.G2,.G3").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });

    if( $(".G2").val() != $(".G3").val()){

        $(".G2").css('background-color','red');
        $(".G3").css('background-color','red');
        good = false;
    }

    return good;
}

function invia(){
    $.post("/cambiop",{
            passold : $(".G1").val(),
            passnew : $(".G2").val()
        },
        function(data,status){        if(status=='success'){
            $(".alert-success").show();
        }
        else{
            $(".alert-danger").show();
        }
        }
    );
}

function validate1() {
    $(".alert").hide();
    if($(".G1").val() && $(".G1").val().length < 50){
        $.post("/cambiosq",{
            sqnew : $(".G1").val()
        },
            function(data,status){        if(status=='success'){
                $(".alert-success").show();
            }
            else{
                $(".alert-danger").show();
            }
            })
    }
    else {
        $(".alert-danger").show();
    }

}

function validate2(){}

function validate3(){
    $(".alert").hide();
    if($(".G3").val()){
        var checkb = '';

       if($(".G4").is(':checked')){
           checkb = 'X';
       }


        $.post("/cmail",{
                smail : $(".G3").val(),
                avv : checkb
            },
            function(data,status){        if(status=='success'){
                $(".alert-success").show();
            }
            else{
                $(".alert-danger").show();
            }
            })
    }
    else{
        $(".alert-danger").show();
    }
}