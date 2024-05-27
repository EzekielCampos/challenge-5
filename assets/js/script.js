

const toDoString = "to-do";
const inProgressString= "in-progress";
const doneString = "done";

const taskInput = $("#task-title");
const dateInput = $("#due-date");
const descriptionInput = $("#task-description");

// This lets the input box choose a date
$("#due-date").datepicker({
    changeMonth: true,
    changeYear: true,
  });
 
  // Creates a modal for when the add task button is clicked
    let modal = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 700,
      width: 350,
      modal: true,
      buttons: {
        // Creates buttons inside modal 
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


    let randomId = Math.floor(Math.random()*10000);

    return randomId;


}


// Todo: create a function to create a task card
function createTaskCard(task) {
    
    let taskCard = $('<div>').addClass("card project-card draggable my3 mb-5").attr("data-project-id", task.id);
    let headerEl = $("<header>").addClass("card-header h4 ").text(task.name);
    let bodyEl = $("<body>").addClass("card-body");
    let pDescriptionEl = $("<p>").addClass("card-text").text(task.description);
    let pDateEl = $("<p>").addClass("card-text").text(task.date);
    let cardDeleteBtn = $("<button>").addClass("btn btn-danger delete").text("Delete").attr("data-task-id", task.id);

    if (task.date) {
      const now = dayjs();
      const taskDueDate = dayjs(task.date, 'DD/MM/YYYY');
      if (now.isSame(taskDueDate, 'day')) {
        headerEl.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
        headerEl.addClass('bg-danger text-white');
        cardDeleteBtn.addClass('border-light');
      }
    }

    bodyEl.append(pDescriptionEl, pDateEl, cardDeleteBtn);

    taskCard.append(headerEl, bodyEl);
    return taskCard;


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const todoList = $('#todo-cards');
    const progressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

   

    todoList.empty();
    progressList.empty();
    doneList.empty();

    let showTasks = readTasksFromStorage();

    for(task of showTasks){

      if(task.status === toDoString){
        todoList.append(createTaskCard(task));
      }
      else if(task.status === inProgressString){
        progressList.append(createTaskCard(task));

      }
      else if(task.status === doneString){
        doneList.append(createTaskCard(task));

      }
       

    }

}

function readTasksFromStorage() {
  
  //  Retrieve tasks from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
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

    descriptionInput.val("");

    let newTaskList= readTasksFromStorage();
    const newTask = {

        name:taskInput.val(),
        description:descriptionInput.val().trim(),
        date:dateInput.val(),
        id:generateTaskId(),
        status:"to-do",

    }
    newTaskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
    taskInput.val("");
    dateInput.val("");
    descriptionInput.val("");
    modal.dialog("close");
    renderTaskList();


}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){


    const taskId = $(event.target).parent().parent().attr("data-project-id");

    let task = readTasksFromStorage();

    for (let index = 0; index < task.length; index++){

        if(task[index].id == taskId){
            
            task.splice(index, 1);
            console.log("sucess");
        }

     }

     localStorage.setItem("tasks", JSON.stringify(task));
     renderTaskList();

    // renderTaskList();
console.log("hi");
console.log(taskId);
console.log(task);



}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

   // ? Read projects from localStorage
   let tasks = readTasksFromStorage();

   // ? Get the project id from the event
   const taskId = ui.draggable[0].dataset.projectId;
   console.log(taskId);
 
   // ? Get the id of the lane that the card was dropped into
   const newStatus = event.target.id;
   console.log(newStatus);

   for(let index = 0; index < tasks.length; index++){
    if(tasks[index].id == taskId){

      console.log("sucess");
      tasks[index].status = newStatus;

    }
   }
   localStorage.setItem("tasks", JSON.stringify(tasks));
   renderTaskList();
   $(".draggable").draggable({ zIndex: 100,});



}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    renderTaskList();

    $( "#add-button" ).on( "click", function() {
      modal.dialog( "open" );
    });
    

    $("#todo-cards").on("click", ".delete", handleDeleteTask);
    $("#in-progress-cards").on("click", ".delete", handleDeleteTask);
    $("#done-cards").on("click", ".delete", handleDeleteTask);



      $(".draggable").draggable({ zIndex: 100,});

      $('.lane').droppable({ 
        accept: ".draggable",
        drop:handleDrop,
     
    });



});
