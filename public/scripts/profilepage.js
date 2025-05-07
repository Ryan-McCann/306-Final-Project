const username = window.location.pathname.split('/').pop();

document.addEventListener("DOMContentLoaded", () => {
    let now = new Date();
    let fileInput = document.getElementById("fileInput");
    
    document.getElementById('editBtn').addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
        let file = fileInput.files[0];
        
        if(!file) return;
        
        let formData = new FormData();
        formData.append('profile_photo', file);
        
        fetch('/uploadphoto', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            location.reload();
        });
    });
    
    fetch(`/profileuser/${username}`)
        .then(res => res.json())
        .then(data => {
        
        document.getElementById('username').innerText = data.username;
        document.getElementById('profilePhoto').src = `/images/${data.profile_photo}`;
        
        if(data.currentUser) {
            document.getElementById('email').innerText = data.email;
            document.getElementById('emailInput').value = data.email;
            document.getElementById('editBtn').classList.remove('d-none');
            document.getElementById('editSection').classList.remove('d-none');
        }
    });
    
    fetch(`/user-threads/${username}`)
        .then(res => res.json())
        .then(data => {
        let threadList = document.getElementById('threadList');
        
        data.forEach( thread => {
            let date = new Date(thread.creation_date.replace(' ', 'T')+'Z');
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
            
            let li = document.createElement("li");
            li.innerHTML = `
                <div class="d-flex flex-column">
                    <div>
                        <a class="fw-bold" href="/board/${thread.board_name}/thread/${thread.id}">${thread.title}</a>
                    </div>
                    <div class="text-muted small">
                        Created ${isToday ? 'at' : 'on'} ${formatted} in 
                        <a href="/board/${thread.board_name}" class="text-decoration-none">${thread.board_name}</a>
                    </div>
                </div>
            `;
            li.className = "list-group-item";
            threadList.append(li);
        });
    });
    
    fetch(`/user-posts/${username}`)
        .then(res => res.json())
        .then(data => {
        
        let postList = document.getElementById('postList');
        
        data.forEach( post => {        
            let date = new Date(post.creation_date.replace(' ', 'T')+'Z');
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
            
            let li = document.createElement('li');
            li.innerHTML = `
                <div class="d-flex flex-column">
                    <div>
                        ${post.contents.substring(0, 80)}...
                    </div>
                    <div class="text-muted small">
                        Posted ${isToday ? 'at' : 'on'} ${formatted} in
                        <a href="/board/${post.board_name}/thread/${post.thread_id}" class="text-decoration-none">${post.thread_title}</a>
                    </div>
                </div>
            `;
            li.className = "list-group-item";
            postList.append(li);
        });
        
    });
    
    fetch(`/user-rooms/${username}`)
        .then(res => res.json())
        .then(data => {
        let roomList = document.getElementById('roomList');
        
        data.forEach( room => {
            let li = document.createElement('li');
            li.innerHTML = `<a class='fw-bold' href="/room/${room.name}">${room.name}</a>`;
            li.className = "list-group-item";
            roomList.append(li);
        });
        
    });
});