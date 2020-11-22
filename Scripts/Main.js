let nav_float_state;
let all_notes_data;
// each note_data: note_heading_name, youtube_id, video_time, notes_text_array, notes_time_array, current_text
function $(selector){
    return document.querySelector(selector);
}


function extract_youtube_id(str){

    let arr = str.match(/^https:\/\/www\.youtube\.com\/watch\?v=(?<id>[^?]+)/);
    if(arr != null){
        return arr[1];
    }
    else{
        return null;
    }
}

// initialize new note in the all_notes_data array
function add_new_note(){
    let youtube_link = $('#search_input').value;
    let note_heading_name = $('#heading_input').value;
    if(youtube_link != "" && note_heading_name != ""){
        let youtube_id = extract_youtube_id(youtube_link);
        
        if(youtube_id != null){
            
        }
        else{
            alert("Invalid link inputted. Only input a valid youtube link such as: https://www.youtube.com/watch?v=uE1QkcG1-AM");
        }
    }
    else{
        alert("Some fields were left empty. Please fill all of the fields.");
    }
    
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
    $('#note_add_new').onclick = function(ev){
        $(".modall").style.display = "flex";
    }
    $('#close_modall').onclick = function(ev){
        $(".modall").style.display = "none";
    }
    $('#create_note_btn').onclick = function(){
        add_new_note();
    }
    $("#body_wrapper").style.visibility = "visible";
}



document.addEventListener("DOMContentLoaded", function(ev){
    init();
})