// TODO: FIX IMPORTING NOT DELETING PREVIOUS DATA
let nav_float_state;
let all_notes_data;
let current_note_index_displayed = -1;
let current_note;
let player, player_time_interval;
let selected_indexes = [];
let times_to_display = [];
let selected_dom_note_id = "";
let interval_before_opacity = 150;
let appear_animation_time = "0.5s";

function $(selector){
    return document.querySelector(selector);
}

function $all(selector){
    return document.querySelectorAll(selector);
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
function import_notes_data(){
    load_help_page();
    let element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("id", "file_dialog")
    element.style.display = "none";
    element.onchange = function(){
        let file = this.files[0];
        
            let text = file.text().then(
                text => {
                    try{
                        let parsed = JSON.parse(text);
                        let sample = parsed[0];
                        
                        let defs = Object.keys(sample);
                        if(defs.includes("note_heading_name") === true && defs.includes("youtube_id") === true && defs.includes("video_time") === true && defs.includes("notes_text_array") && defs.includes("notes_time_array") === true && defs.includes("current_text") === true){
                            all_notes_data = parsed;
                            set_notes_data();
                            add_notes_to_nav();
                        }
                        else{
                            alert("File corrupted, some headings missing.")
                        }
                    }
                    catch(err){
                        alert("Selected file is not supported by this webpage. Please only select the file that you have previously exported from this page.")
                    }
                }
            )
        
        
        
    }
    document.body.appendChild(element);
    
    element.click();
    


    
    
}
function export_notes_data(){
    load_help_page();
    
    let text = JSON.stringify(all_notes_data, null, "\t");
    let filename = "YTNote_data.txt";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
function bind_appear_animation(element_id){
    let element = $(element_id);
    
    element.style.animationName = "appear";
    element.style.animationDuration = appear_animation_time;
    element.style.animationFillMode = "forwards";

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
            $("#add_modall").style.display = "none";
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
    <div class="nav_item" id="note_add_new">
        <svg viewBox="0 0 16 16" class="bi bi-journal-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
        </svg>
        <span>Add new</span>
    </div>
    `;
    let delete_note_string = `
    <div class="nav_item" id="note_delete">
        <svg viewBox="0 0 16 16" class="bi bi-journal-minus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            <path fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <span>Delete</span>
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
    bind_events_on_nav();
        
    
}

// Add all notes to modall delete menu
function add_notes_to_delete_menu(){
    $('#notes_to_delete_container').innerHTML = "";
    let dom_string = ``;
    for(let i = 0; i < all_notes_data.length; i += 1){
        let note_data = all_notes_data[i];
        dom_string += `
        <div class="note_to_delete nav_item" id="note_delete_${i}">
            <span>${note_data.note_heading_name}</span>
            
        </div>
        `;
    }
    $('#notes_to_delete_container').innerHTML = dom_string;
}

// Delete notes at indexes
function delete_notes_at_indexes(indexes){
    let new_list = [];
    for(let i = 0; i < all_notes_data.length; i += 1){
        if(indexes.includes(i) === false){
            new_list.push(all_notes_data[i]);
        }
    }
    all_notes_data = new_list;

}
/*
function get_nearest_note_index(){
    let video_time = current_note.video_time;
    let distances = [];
    let least_dist_index = 0;
    let arr_a = current_note.notes_time_array;
    for(let i = 0; i < arr_a.length; i += 1){
        let temp = Math.abs(arr_a[i] - video_time);
        distances.push(temp);
        
    }
    console.log(distances);
    for(let i = 0; i < distances.length; i += 1){
        if(distances[i] < distances[least_dist_index]){
            least_dist_index = i;
        }
    }
    return least_dist_index;
}
*/
/*
function set_video_time_interval(){
    clearInterval(player_time_interval);
    player_time_interval = setInterval(function(){
        current_note.video_time = player.getCurrentTime();
        

    }, 200)
}
*/
/*
function select_note_on_index(index){

    if(individual_note.id != selected_dom_note_id || selected_dom_note_id === ""){
        $all(".individual_note").forEach(individual_note_temp => {
            individual_note_temp.classList.remove("selected");
            $("#" + individual_note_temp.id + " .delete_main_note_btn").style.display = "none";
        })
        individual_note.classList.toggle("selected");
        let {groups : {index}} = /main_note_(?<index>\d+)/.exec(individual_note.id);
        index = Number(index);
        player.seekTo(current_note.notes_time_array[index]);
        selected_dom_note_id = individual_note.id;
        $("#" + individual_note.id + " .delete_main_note_btn").style.display = "inline";
    }
}
*/
function save_current_note(){
    let text_to_save = $("#note_input").value;
    current_note.current_text = text_to_save;
    current_note.video_time = player.getCurrentTime();
    all_notes_data[current_note_index_displayed] = current_note;
    set_notes_data();
}

function remove_note_instance_from_current(index){
    current_note.notes_text_array.splice(index, 1);
    current_note.notes_time_array.splice(index, 1);
    times_to_display.splice(index, 1);
    add_notes_to_main();
}
function load_help_page(){
    if(current_note_index_displayed != -1){
        save_current_note();
    }
    current_note = null;
    current_note_index_displayed = -1;
    let player_text = `
    <div id="player_div" style="display:flex; flex-flow: column; align-items: center; overflow:auto; opacity:0">
        <p>To create a note-project, click on "Notes" button in the navigation menu and then click on "Add new" button. In the menu displayed, please enter a heading name for your note-project and a youtube link. After that, press "Create" button.</p>
        <p>To open a specific note-project, click on "Notes" button in the navigation menu and then click on the individual note-project that you want to open. They will have the same name, as the one you inputted in the note-project creating menu.</p>
        <p>To delete one or more note-projects, click on "Notes" button in the navigation menu and then click on the "Delete" button. In the menu displayed, click on note-project(s) that you want to delete. Then press "Delete button". This process is irreversible, and if you have not exported your data before doing this, notes for those specific note-projects that you selected will be lost! </p>
        <p>This webpage utilizes LocalStorage to store all the data. Please note that cleaning browser's cache might erase the localStorage, but it depends on the browser. LocalStorage is unique to every browser, so you will not see any notes made when visiting this website from a different browser. You can export your data by clicking "Export" button in the navigation menu, this would let you download your notes data in JSON. You can then Import note data by pressing the "Import" button in the navigation Menu</p>
        <p>You can exit or reload the page whenever you need to. All of the data (video time, currently typed text and notes) will be saved automatically</p>
        <p>After launching a note-project, YouTube video will be here</p>
        <img src="Images/video_pic.webp" style="max-width:95%">
    </div>
    `;
    let notes_text = `
    <div id="notes_body_container" style="display:flex; flex-flow: column; align-items: center; overflow:auto; opacity:0">
        <p>Your notes will be here</p>
        <img src="Images/note_pic.webp" style="max-width:95%">
    </div>
    `;
    let input_text = `
    <div id="input_container" style="display:flex; flex-flow: column; align-items: center; overflow:auto; opacity:0">
        <p>You will be able to type a note here</p>
        <img src="Images/input_pic.webp" style="max-width:95%">
    </div>
    `;
    $("#player_container").style.overflow = "auto";
    $("#player_container").innerHTML = player_text;
    $("#notes_div").innerHTML = notes_text;
    $("#input_div").innerHTML = input_text;
    
    
}
function add_notes_to_main(){
    $("#notes_div").innerHTML = `
    <div id="notes_body_container">

    </div>
    `;
    let dom_string = ``;
    for(let i = 0; i < current_note.notes_text_array.length; i += 1){
        dom_string += `
        <div class="individual_note" id="main_note_${i}" style="position:relative">
            <img src="Images/delete_icon.webp" class="delete_main_note_btn" title="delete this note">
            <div>
                <span class="individual_note_time">
                    [${times_to_display[i]}]
                </span>
            </div>
            <div style="margin-top:4px;">
                <span class="individual_note_text">
                    ${current_note.notes_text_array[i]}
                </span>
            </div>
            
        </div>
        `
    }
    
    $('#notes_body_container').innerHTML = dom_string;
    
    $all(".individual_note").forEach(individual_note => {
        
        individual_note.onclick = function(ev){
            
            $all(".individual_note").forEach(individual_note_temp => {
                individual_note_temp.classList.remove("selected");
                $("#" + individual_note_temp.id + " .delete_main_note_btn").style.display = "none";
            })
            individual_note.classList.toggle("selected");
            let {groups : {index}} = /main_note_(?<index>\d+)/.exec(individual_note.id);
            index = Number(index);
            player.seekTo(current_note.notes_time_array[index]);
            
            $("#" + individual_note.id + " .delete_main_note_btn").style.display = "inline";
            
            selected_dom_note_id = individual_note.id;

            
            
            
            
            
        }
        
        
    })
    $all(".delete_main_note_btn").forEach(temp => {
        temp.onclick = function(ev){
            ev.stopPropagation()
            let {groups : {index}} = /main_note_(?<index>\d+)/.exec(selected_dom_note_id);
            index = Number(index);
            remove_note_instance_from_current(index);
        }
        
    })
    
}

// Load a note
function load_note(id){
    let {groups : {index}} = /note_(?<index>\d+)/.exec(id);
    index = Number(index);
    if (index != current_note_index_displayed){
        if(current_note_index_displayed != -1){
            save_current_note();
        }
        $("#player_container").style.overflow = "unset";
        current_note_index_displayed = index;
        current_note = all_notes_data[index];
        compile_times_to_display();
        add_notes_to_main();
        player = null;
        
        $('#input_div').innerHTML = `
        <div id="input_container"style="opacity:0; display:flex; flex-direction:column; height:100%;" >
            <textarea id="note_input"></textarea>
            <div id="controls_container">
                <div id="submit_note">
                    <svg viewBox="0 0 16 16" class="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                </div>
            </div>
        </div>
        `;
        
        
        $('#note_input').value = current_note.current_text;
        $("#notes_body_container").style.opacity = "0";
        
        $('#submit_note').onclick = record_note;
        $('#player_container').innerHTML = `
        <div id="player_div">

        </div>
        `;
        $("#player_div").style.opacity = "0";
        window.YT.ready(function() {
            player = new YT.Player('player_div', {
                height: '1',
                width: '1',
                videoId: current_note.youtube_id,
                playerVars: { 'autoplay': 1, 'controls': 1,'autohide':1,'wmode':'opaque' },
                events: {
                    "onReady": function(event){
                        player.seekTo(current_note.video_time);
                        
                        
                        player.pauseVideo();
                        
                        
                        
                    },
                    "onStateChange": function(event){
                        let status = event.data;
                        if(status === 0){
                            player.seekTo(0);

                        }
                    }
                    
                
                }
            });
            
            
        });
        
        


        window.onbeforeunload = function(){
            
            if(current_note_index_displayed != -1){
                save_current_note();
            }
            return null;
        };
        
        
    }
}

function convert_seconds_to_time(seconds_string){
    let whole = Math.floor(Number(seconds_string));
    let hours, minutes, seconds;
    seconds = whole;
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    seconds = seconds % 60;
    let time_string = "";
    
    if(hours < 10){
        time_string += "0"
    }
    time_string += String(hours);
    time_string += ":";
    
    
    
    if(minutes < 10){
        time_string += "0"
    }
    time_string += String(minutes);
    
    time_string += ":";
    
    if(seconds < 10){
        time_string += "0"
    }
    time_string += String(seconds);
    
    return time_string;
}

function sort_current_note_arrays(){
    let arr_b = current_note.notes_text_array;
    let arr_a = current_note.notes_time_array;
    let arr_c = times_to_display;
    for(let i = 0; i < arr_a.length; i += 1){
        for(let j = 0; j < arr_a.length - i - 1; j += 1){
            if(arr_a[j] > arr_a[j + 1]){
                let left_a = arr_a[j];
                arr_a[j] = arr_a[j + 1];
                arr_a[j + 1] = left_a;
                let left_b = arr_b[j];
                arr_b[j] = arr_b[j + 1];
                arr_b[j + 1] = left_b;
                let left_c = arr_c[j];
                arr_c[j] = arr_c[j + 1];
                arr_c[j + 1] = left_c;
            }
        }
    }
    current_note.notes_text_array = arr_b;
    current_note.notes_time_array = arr_a;
    times_to_display = arr_c
}
function compile_times_to_display(){
    times_to_display = [];
    for(let i = 0; i < current_note.notes_text_array.length; i += 1){
        let video_time = current_note.notes_time_array[i];
        let temp = convert_seconds_to_time(video_time);
        times_to_display.push(temp);
    }
}
function record_note(){
    let current_text = $("#note_input").value;
    if(current_text != ""){
        current_note.current_text = current_text;
        let video_time = player.getCurrentTime();
        
        current_note.notes_text_array.push(current_note.current_text);
        current_note.notes_time_array.push(video_time);
        let temp = convert_seconds_to_time(video_time);
        times_to_display.push(temp);
        sort_current_note_arrays();
        add_notes_to_main();
        $("#note_input").value = "";
    }
    else{
        alert("Can't save empty note!");
    }
}

//Bind events to nav buttons
function bind_events_on_nav(){
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
        $("#add_modall").style.display = "flex";
    }
    $('#create_note_btn').onclick = function(){
        add_new_note();
    }
    $('#note_delete').onclick = function(){
        load_help_page();
        add_notes_to_delete_menu();
        selected_indexes = [];
        $('#delete_modall').style.display = "flex";
        let notes_to_delete = document.querySelectorAll('.note_to_delete');
    
        notes_to_delete.forEach(function(item) {
            
            item.onclick = function(){
                let {groups : {index}} = /note_delete_(?<index>\d+)/.exec(item.id);
                index = Number(index);
                
                if(item.classList.contains("selected") === true){
                    let index_to_delete = selected_indexes.findIndex(temp => {temp === index});
                    selected_indexes.splice(index_to_delete, 1);
                }
                else{
                    selected_indexes.push(index);
                }
                item.classList.toggle("selected");

            }
        })
        
    }
    $("#delete_notes_btn").onclick = function(){
        if(selected_indexes.length === 0){
            alert("No notes are selected to be deleated. Please select notes to delete by clicking on them, or close the delete window.");
        }
        else{
            delete_notes_at_indexes(selected_indexes);
            set_notes_data();
            
            add_notes_to_nav();
            $('#delete_modall').style.display = "none";
            
        }
        
        
    }
    $('#export_btn').onclick = export_notes_data;
    $("#import_btn").onclick = import_notes_data;
    $("#help_page_btn").onclick = function(){
        
        load_help_page();
    }
    $all(".note").forEach(function (item){
        item.onclick = function(){
            load_note(item.id);
        };
    })
    
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
    
    
    let closes = document.querySelectorAll(".close_modall");
    closes.forEach(close => {
        close.onclick = function(ev){
            close.parentElement.style.display = "none";
        }
        
    })

    all_notes_data = get_notes_data();
    add_notes_to_nav();
    load_help_page();
    
    
    
    $("#body_wrapper").style.visibility = "visible";
}


// app entry point
document.addEventListener("DOMContentLoaded", function(ev){
    init();
})