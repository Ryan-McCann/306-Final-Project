class Board {
    constructor(id, name, threadCount, lastPosted, lastPostName) {
        this.id = id;
        this.name = name;
        this.threadCount = threadCount;
        this.lastPosted = lastPosted;
        this.lastPostName = lastPostName;
    }
}

let boards = [];

document.addEventListener("DOMContentLoaded", () => {
    let boardsList = document.getElementById("boardsList");
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        let createBoardForm = document.getElementById("createBoardForm");
        
        if(data.loggedIn) {
            createBoardForm.hidden = false;
        } else {
            createBoardForm.hidden = true;
        }
    });
    
    fetch('/getboards')
    .then(res => res.json())
    .then(data => {
        data.forEach( dboard => {
            boards.push(new Board(dboard.id, dboard.name, dboard.thread_count, dboard.last_post_date, dboard.last_user));
        });
        
        if(boards.length < 1) {
            let li = document.createElement("li");
            li.innerText = "There doesn't seem to be anything here...";
            li.className = "list-group-item";
            boardsList.append(li);
        } else {
            for(const board of boards) {
                board.postCount = Number.parseInt(Math.random() * 5000 + 1);
                let li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = 
                `<div class="row">
                    <div class="col"><a href="/board/${board.name}">${board.name}</a></div>
                    <div class="col">${board.threadCount}</div>
                    <div class="col">${board.lastPosted}</div>
                    <div class="col">${board.lastPostName}</div>
                 </div>`;
                boardsList.append(li);
            }
        }
    });
});