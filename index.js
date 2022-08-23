"use-strict";

let addForm = document.getElementById("add-form");

addForm.addEventListener("submit",function(e){
    e.preventDefault();

    let task = addForm.task.value.trim(),
        assignee = addForm.assignee.value.trim();

    if (task === "" || assignee === ""){
        alert("Empty Fields");
        return;
        //Alert Dialog Comes here instead of alert
    }
    const newTask = {
        task:task,
        assignee:assignee
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

    tasks.push(newTask);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    addForm.task.value = "";
    addForm.assignee.value = "";
    addForm.task.focus();

});