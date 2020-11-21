let nav_float_state;

function $(selector){
    return document.querySelector(selector);
}

// Retrieve preffered float type for nav from local storage
function get_user_preffered_float(){
    let preffered = localStorage.getItem("preffered_nav_float");
    if(preffered != null){
        return preffered;
    }
    else{
        localStorage.setItem("preffered_nav_float", "right");
        preffered = "right";
        return preffered;
    }
}

//Set user preffered float type for nav in local storage
function set_user_preffered_float(preffered){
    localStorage.setItem("preffered_nav_float", preffered);
}

//Bind events for expanding, collapsing and changing float types on nav
function init(){
    let preffered = get_user_preffered_float();
    if(preffered === "left"){
        $("nav").classList.toggle("float_left");
        nav_float_state = "left";
    }
    else{
        $("nav").classList.toggle("float_right");
        nav_float_state = "right";
    }
    if(nav_float_state === "left"){
        
        $("#collapse_nav_btn").id = "expand_nav_btn";
        $("#expand_nav_btn").id = "collapse_nav_btn";
        
    }
    $("#expand_nav_btn").onclick = function(){
        $("nav").classList.toggle("collapsed");
    }
    $("#collapse_nav_btn").onclick = function(){
        $("nav").classList.toggle("collapsed");
    }
    $("#nav_float_left").onclick = function(){
        $("nav").classList.toggle("float_left");
        $("nav").classList.toggle("float_right");
        nav_float_state = "left";
        set_user_preffered_float(nav_float_state);
        $("#collapse_nav_btn").id = "expand_nav_btn";
        $("#expand_nav_btn").id = "collapse_nav_btn";


    }
    $("#nav_float_right").onclick = function(){
        $("nav").classList.toggle("float_left");
        $("nav").classList.toggle("float_right");
        nav_float_state = "right";
        set_user_preffered_float(nav_float_state);
        $("#expand_nav_btn").id = "collapse_nav_btn";
        $("#collapse_nav_btn").id = "expand_nav_btn";
        
    }
    $("#expand_notes").onclick = function(ev){
        $("#notes_container").classList.toggle("shown");
    }
    $("#body_wrapper").style.visibility = "visible";
}



document.addEventListener("DOMContentLoaded", function(ev){
    init();
})