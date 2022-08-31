"use-strict";

let addForm = document.getElementById("add-form"),
    alertDialog = document.querySelector("#alert-dialog"),
    alertMsg = document.querySelector("#alert-msg"),
    alertBtn = document.querySelector("#alert-btn")

let searchForm = document.getElementById("search-form"),
    searchIcon = document.querySelector("#search-div svg");

let tasksSection = document.querySelector("#tasks-section");

let confirmDialog = document.querySelector("#confirm-dialog");

let deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>`;

let doneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg>`;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    

function showAlertDialog(msg){
    alertDialog.classList.add("show-item");
    alertMsg.textContent = msg;
    alertBtn.addEventListener("click",()=>{
        alertDialog.classList.remove("show-item");
    });
};

function emptyTasks(){
    let taskPar = document.createElement("p");
        taskPar.classList.add("text-center");
        taskPar.classList.add("no-tasks");
        taskPar.textContent = "No Tasks Added";
        tasksSection.insertAdjacentElement("beforeend",taskPar);
};

function showConfirmDialog(callback){
    confirmDialog.classList.add("show-item");
    document.querySelector("#confirm-btn").addEventListener("click",function(){
        this.closest("#confirm-dialog").classList.remove("show-item");
        callback(true)
    });
    document.querySelector("#cancel-btn").addEventListener("click",function(){
        this.closest("#confirm-dialog").classList.remove("show-item");
        callback(false);
    });
};
function countTasks(){
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (tasks){
        let todoTasksCount = 0,
        doneTasksCount = 0;

        tasks.filter(task=>task.status === 0 ? todoTasksCount++ : doneTasksCount++);
        document.querySelector("#todo").textContent = `Todo : ${todoTasksCount}`;
        document.querySelector("#done").textContent = `Done : ${doneTasksCount}`;
    }else{
        document.querySelector("#todo").textContent = `Todo : 0`;
        document.querySelector("#done").textContent = `Done : 0`;
    }
}

countTasks();

function searchTasks(){
    let searchVal = searchForm.search.value.trim();

    if (searchVal !== ""){
    let tasks = JSON.parse(localStorage.getItem("tasks")),
        newTasks = tasks.filter(task=> task.task.includes(searchVal)),
        newAssignees= tasks.filter(task=> task.assignee.includes(searchVal));
        tasksSection.innerHTML = "";

        let statics = document.createElement("div");
        statics.classList.add("flex-col");
        statics.insertAdjacentHTML("afterbegin",`<p>Tasks Using Task Name : ${newTasks.length}</p>`);
        statics.insertAdjacentHTML("afterbegin",`<p>Tasks Using Assignee Name : ${newAssignees.length}</p>`);

        tasksSection.insertAdjacentElement("afterbegin",statics);

        if (newTasks.length == 0 && newAssignees.length == 0){
            emptyTasks();
        }else{
            mapTasks(newTasks);
            mapTasks(newAssignees);
        }
    }
    else {
        showAlertDialog("Empty Search Value");
    }
};

function mapTasks(tasks){

    if(tasks){
        tasks.forEach(task=>{
            let taskdiv = document.createElement("div");
            taskdiv.classList.add("task-body");
            taskdiv.classList.add("flex-btw");
    
            let taskName = document.createElement("div");
            taskName.classList.add("task-name");
            taskName.classList.add("flex-btw");

            if (task.status == 1){
                taskName.classList.add("task-done");
            }
    
            taskName.insertAdjacentHTML("beforeend",`<p>${task.task}</p>`);
            taskName.insertAdjacentHTML("beforeend",`<p class='delete-icon'>${deleteIcon}</p>`);
    
            let taskAssignee = document.createElement("div");
            taskAssignee.classList.add("task-assignee");
            taskAssignee.classList.add("flex-btw");
    
            taskAssignee.insertAdjacentHTML("beforeend",`<p>${task.assignee}</p>`);
            taskAssignee.insertAdjacentHTML("beforeend",`<p class='done-icon'>${doneIcon}</p>`);

            let taskDate = document.createElement("div");
            taskDate.classList.add("task-date");
            taskDate.insertAdjacentHTML("beforeend",`<small>${task.date}</small>`);
            
            taskdiv.insertAdjacentElement("afterbegin",taskDate);
            taskdiv.insertAdjacentElement("afterbegin",taskAssignee);
            taskdiv.insertAdjacentElement("afterbegin",taskName);
    
            tasksSection.insertAdjacentElement("afterbegin",taskdiv);
            document.querySelector(".delete-icon").addEventListener("click",function(){
                document.querySelector("#confirm-task").textContent = task.task;
                showConfirmDialog((res)=>{
                    if (res){
                        this.closest(".task-body").remove();
                        let tasks = JSON.parse(localStorage.getItem("tasks")),
                            newTasks = tasks.filter(t=>t.task != task.task);
                        localStorage.setItem("tasks",JSON.stringify(newTasks));
                        if (newTasks.length == 0){
                            emptyTasks();
                            localStorage.setItem("tasks",null);
                        }
                        countTasks();
                    }
                });
            });
            document.querySelector(".done-icon").addEventListener("click",function(){
                if (!taskName.classList.contains("add-task")){
                    this.parentElement.previousElementSibling.classList.add("task-done");
                    let tasks = JSON.parse(localStorage.getItem("tasks")),
                        newTasks = tasks.filter(t=>t.task != task.task);
                    newTasks.push({
                        task:task.task,
                        assignee:task.assignee,
                        date:task.date,
                        status:1
                    });
                    tasksSection.innerHTML = "";
                    localStorage.setItem("tasks",JSON.stringify(newTasks));
                    countTasks();
                    mapTasks(JSON.parse(localStorage.getItem("tasks")));
                }
            });
        });   
    }else {
        emptyTasks();
    }
};
mapTasks(JSON.parse(localStorage.getItem("tasks")));

addForm.addEventListener("submit",function(e){
    e.preventDefault();

    let task = addForm.task.value.trim(),
        assignee = addForm.assignee.value.trim();

    if (task === "" || assignee === ""){
        showAlertDialog("Empty Fields");
        return;
    }

    const d = new Date();

    let month = months[d.getMonth()],
        day = days[d.getDay()];

    const newTask = {
        task:task,
        assignee:assignee,
        date:`Added ${month} , the ${d.getDate()}th , ${day}`,
        status:0
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];


    tasks.push(newTask);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    addForm.task.value = "";
    addForm.assignee.value = "";
    addForm.task.focus();
    showAlertDialog("Added Item Successfully");
    tasksSection.innerHTML = "";
    mapTasks(JSON.parse(localStorage.getItem("tasks")));
    addForm.task.value = "";
    addForm.assignee.value = "";
    countTasks();
});

searchIcon.addEventListener("click",()=> searchTasks());

searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    searchTasks();
});