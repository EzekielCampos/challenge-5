// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskInput = $("#task-title");
const dateInput = $("#due-date");
const descriptionInput = $("#task-description");

let modal;

$("#due-date").datepicker({
    changeMonth: true,
    changeYear: true,
  });
 
    modal = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 700,
      width: 350,
      modal: true,
      buttons: {
        "Add Task":handleAddTask,
        Cancel: function() {
            taskInput.val("");
            dateInput.val("");
            descriptionInput.val("");
          modal.dialog( "close" );
        }
      },
      close: function() {
        taskInput.val("");
        dateInput.val("");
        descriptionInput.val("");
        modal.dialog( "close" );
      }
    });

// Todo: create a function to generate a unique task id
function generateTaskId() {

    let randomId;
    for(let index = 0; index < 5; index++){

        randomId = Math.floor(Math.random()*10000);

    }
    return randomId;


}


// Todo: create a function to create a task card
function createTaskCard(task) {
    
    let taskCard = $('<div>').addClass("card project-card draggable my3").attr("data-project-id", task.id);
    let headerEl = $("<header>").addClass("card-header h4").text(task.title);
    let bodyEl = $("<body>").addClass("card-body");
    let pDescriptionEl = $("<p>").addClass("card-text").text(task.description);
    let pDateEl = $("<p>").addClass("card-text").text(task.date);
    let cardDeleteBtn = $("<button>").addClass("btn btn-danger delete").text("delete").attr("data-project-id", task.id);

    bodyEl.append(pDescriptionEl, pDateEl, cardDeleteBtn);

    taskCard.append(headerEl, bodyEl);
    return taskCard;


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    let showTasks = readTasksFromStorage();

    for(task of showTasks){
        $("#todo-cards").append(createTaskCard(task));

    }



}

function readTasksFromStorage() {
  
    // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
  const retrievedTasks = JSON.parse(localStorage.getItem("tasks"));
  
  let allTasks =[];
  if(retrievedTasks !== null){
    allTasks = retrievedTasks;
    return allTasks;
  }
  else{
  
    return allTasks;
  
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let newTaskList= readTasksFromStorage();
    const newTask = {

        name:taskInput.val(),
        description:descriptionInput.val().trim(),
        date:dateInput.val()

    }
    newTaskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
    taskInput.val("");
    dateInput.val("");
    descriptionInput.val("");
    renderTaskList();


}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){



}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    renderTaskList();

    $( ".btn" ).button().on( "click", function() {
        modal.dialog( "open" );
      });

});
