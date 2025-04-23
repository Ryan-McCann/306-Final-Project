let threadId = window.location.pathname.split('/')[2];

function loadPosts() {
    
}

document.addEventListener("DOMContentLoaded", () => {
    let threadTitleSpan = document.getElementById("threadTitleSpan");
    threadTitleSpan.innerText = threadTitle;
    
    loadPosts();
});