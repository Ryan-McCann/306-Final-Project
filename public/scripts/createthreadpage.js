const boardName = window.location.pathname.split('/')[2];

document.addEventListener("DOMContentLoaded", () => {
    let createForm = document.getElementById("createThreadForm");
    createForm.action += boardName;
});