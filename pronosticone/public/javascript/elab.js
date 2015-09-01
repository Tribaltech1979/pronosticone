/**
 * Created by Daniele on 31/08/2015.
 */
function save(){

    $.post("/salvatorneo", {
        torneo: $("input").filter("[name='torneo']").val(),
        giorn: $("input").filter("[name='giorn']").val()
    },
    function(data,status){
        if(status=='success'){
            $(".alert-success").show();
        }}
        );

}