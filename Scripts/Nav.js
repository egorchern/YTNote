function $(selector){
    return document.querySelector(selector);
}

function init(){
    $("#expand_nav_btn").onclick = function(){
        $("nav").classList.toggle("collapsed");
    }
    $("#collapse_nav_btn").onclick = function(){
        $("nav").classList.toggle("collapsed");
    }
    $("#nav_float_left").onclick = function(){
        $("nav").classList.toggle("float_left");
        $("nav").classList.toggle("float_right");
    }
    $("#nav_float_right").onclick = function(){
        $("nav").classList.toggle("float_left");
        $("nav").classList.toggle("float_right");
    }
}



document.addEventListener("DOMContentLoaded", function(ev){
    init();
})