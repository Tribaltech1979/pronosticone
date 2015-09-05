/**
 * Created by Daniele on 05/09/2015.
 */
$(document).ready(function () {
    $("[value='null']").val('');
    $("td").css('width',$("img").width()/13+"px");
    $(".alert").hide();


    $(".G9,.G10").each(function(){if($(this).val() && $(this).val()== 0){$(this).val('X');}})
});