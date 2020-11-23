let nav_float_state;
let all_notes_data;


function $(selector){
    return document.querySelector(selector);
}

// each note_data: note_heading_name, youtube_id, video_time, notes_text_array, notes_time_array, current_text
class note{
    constructor(note_heading_name, youtube_id){
        this.note_heading_name = note_heading_name;
        this.youtube_id = youtube_id;
        this.video_time = 0;
        this.notes_text_array = [];
        this.notes_time_array = [];
        this.current_text = "";
    }
}

// retrieve all notes data;
function get_notes_data(){
    let notes_data = localStorage.getItem("all_notes_data");
    if(notes_data === null){
        notes_data = "[]";
    }
    notes_data = JSON.parse(notes_data);
    return notes_data;
}

// add new entry to all_notes_data
function add_notes_data(note){
    if(all_notes_data != null){
        all_notes_data.push(note);
    }
    else{
        all_notes_data = [note];
    }
}

// set all notes data;
function set_notes_data(){
    let jsoned_data = JSON.stringify(all_notes_data);
    localStorage.setItem("all_notes_data", jsoned_data);
}

// extract youtube id from a youtube link, return null if bad url
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
            let new_note = new note(note_heading_name, youtube_id);
            add_notes_data(new_note);
            set_notes_data();
            $(".modall").style.display = "none";
            add_notes_to_nav();

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

// Add all notes to nav menu
function add_notes_to_nav(){
    $('#notes_container').innerHTML = "";
    let add_note_string = `
    <div class="note nav_item" id="note_add_new">
        <svg viewBox="0 0 16 16" class="bi bi-journal-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
        </svg>
        <span>Add new</span>
    </div>
    `;
    let delete_note_string = `
    <div class="note nav_item" id="note_delete">
        <svg viewBox="0 0 16 16" class="bi bi-journal-minus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            <path fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <span>Delete one</span>
    </div>
    `;
    let dom_string = ``;
    for(let i = 0; i < all_notes_data.length; i += 1){
        let note_data = all_notes_data[i];
        dom_string += `
        <div class="note nav_item" id="note_${i}">
            <span>${note_data.note_heading_name}</span>
        </div>
        `;
    }
    dom_string += add_note_string;
    dom_string += delete_note_string;
    $('#notes_container').innerHTML = dom_string;

        
    
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
    all_notes_data = get_notes_data();
    add_notes_to_nav();
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


// app entry point
document.addEventListener("DOMContentLoaded", function(ev){
    init();
})