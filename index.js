"use-strict";

let addForm = document.getElementById("add-form"),
    alertDialog = document.querySelector("#alert-dialog"),
    alertMsg = document.querySelector("#alert-msg"),
    alertBtn = document.querySelector("#alert-btn")

function showAlertDialog(msg){
    alertDialog.classList.add("show-item");
    alertMsg.textContent = msg;
    alertBtn.addEventListener("click",()=>{
        alertDialog.classList.remove("show-item");
    });
};

addForm.addEventListener("submit",function(e){
    e.preventDefault();

    let task = addForm.task.value.trim(),
        assignee = addForm.assignee.value.trim();

    if (task === "" || assignee === ""){
        showAlertDialog("Empty Fields");
        return;
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
    showAlertDialog("Added Item Successfully");
});