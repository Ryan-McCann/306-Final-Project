const boardName = window.location.pathname.split('/')[2];

function loadThreads() {
    fetch('/threads/'+boardName)
    .then(response => response.json())
    .then(res_threads => {
        
        let threadList = document.getElementById("threadList");
        let now = new Date();
        
        if(res_threads.length < 1) {
            let li = document.createElement("li");
            li.innerText = "There are no threads yet...";
            li.className = "list-group-item";
            threadList.append(li);
        } else {
            res_threads.forEach(thread => {
                let date = new Date(thread.last_posted.replace(' ', 'T')+'Z');
                let isToday = 
                    date.getFullYear() === now.getFullYear() &&
                    date.getMonth() === now.getMonth() &&
                    date.getDate() === now.getDate();
                
                let formatted = new Date(date).toLocaleString(undefined, isToday ? {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                } : {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                
                threadList.innerHTML +=
                `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><a href="/board/${boardName}/thread/${thread.thread_id}">${thread.title}</a></div>
                        <div class="col">${thread.post_count}</div>
                        <div class="col">${formatted}</div>
                        <div class="col"><a class="" href="/profile/${thread.last_user}">${thread.last_user}</a></div>
                     </div>
                </li>
                `;
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let boardNameSpan = document.getElementById("boardNameSpan");
    let createThreadButton = document.getElementById("createThreadButton");
    createThreadButton.href += "/"+boardName;
    
    boardNameSpan.innerText = boardName.replace("%20", " ");
    document.title = `${boardName.replace("%20", " ")} | Chatpost`;
    loadThreads();
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        let createThreadButton = document.getElementById("createThreadButton");
        
        if(data.loggedIn) {
            createThreadButton.hidden = false;
        } else {
            createThreadButton.hidden = true;
        }
    });
});