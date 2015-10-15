/**
 * Created by schiappacassed on 15/10/2015.
 */
var currentBackground = 0;
var backgrounds = [];
backgrounds[0] = '../images/header1.jpg';
backgrounds[1] = '../images/header2.jpg';
backgrounds[2] = '../images/header3.jpg';

function changeBackground() {
    currentBackground++;
    if(currentBackground > 2) currentBackground = 0;

    $('body#home h1#siteH1').fadeOut(100,function() {
        $('body#home h1#siteH1').css({
            'background-image' : "url('" + backgrounds[currentBackground] + "')"
        });
        $('body#home h1#siteH1').fadeIn(100);
    });


    setTimeout(changeBackground, 2000);
}

$(document).ready(function() {
    setTimeout(changeBackground, 2000);
});