document.addEventListener("DOMContentLoaded", () => {
    let recentPostsList = document.getElementById("recentPostsList");
    let activeRoomsList = document.getElementById("activeRoomsList");
    
    fetch('/recent')
    .then(res => res.json())
    .then(recentPosts => {
        if(recentPosts.length < 1) {
            let li = document.createElement("li");
            li.innerText = "There doesn't seem to be anything here...";
            li.className = "list-group-item";
            recentPostsList.append(li);
        } else {
            for(const post of recentPosts) {
                let li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="fw-bold fs-6">Topic: <a href="/board/${post.board_name}/thread/${post.thread_id}">${post.title}</a></div>
                    <div><a href="/profile/${post.username}" class="text-decoration-none">${post.username}</a> wrote:</div>
                    <div class="fst-italic">${post.contents.substring(0, 80)}...</div>
                    <div class="fw-light">in community <a href="/board/${post.board_name}">${post.board_name}</a> at ${post.creation_date}</div>
                `;
                recentPostsList.append(li);
            }
        }
    });
    
    fetch('/toprooms')
    .then(res => res.json())
    .then(topRooms => {
        if(topRooms.length < 1) {
            let li = document.createElement("li");
            li.innerText = "There doesn't seem to be anything here...";
            li.className = "list-group-item";
            activeRoomsList.append(li);
        } else {
            for(const room of topRooms) {
                let userCount = room.user_count;

                let li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    ${userCount} User${userCount === 1 ? '' : 's'} in <a href="/room/${room.name}">${room.name}</a>
                `;
                activeRoomsList.append(li);
            }
        }
    });
});