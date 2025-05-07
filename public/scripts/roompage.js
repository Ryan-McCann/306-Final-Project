const roomName = window.location.pathname.split('/')[2];

function loadMessages(userID) {
    fetch('/messages/'+roomName)
    .then(response => response.json())
    .then(res_msgs => {
        
        let messageList = document.getElementById("messageList");
        
        let now = new Date();
        
        res_msgs.forEach(msg => {
            let justify = (userID === msg.user_id) ? "justify-content-end" : "justify-content-start";
            let says = (userID === msg.user_id) ? "You say:" : ` <a href="/profile/${msg.username}" class="text-decoration-none">${msg.username}</a> says`;
            
            let date = new Date(msg.date.replace(' ', 'T')+'Z');
            
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
            li.className = "list-group-item";
            li.innerHTML = `
            <div class="d-flex ${justify}">
                <a href="/profile/${msg.username}"><img src="/images/${msg.profile_photo}" class="rounded-circle me-2" width="40" height="40" alt="${msg.username}"></a>
                <div class="bg-light border rounded p-2 px-3 text-dark">
                    <div>${says}</div>
                    <div>${msg.content}</div>
                    <div>at ${formatted}</div>
                </div>
            </div>
            `;
            
            messageList.appendChild(li);
        });
        
        messageList.scrollTop = messageList.scrollHeight;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let roomNameSpan = document.getElementById("roomNameSpan");
    let msgSubmit = document.getElementById("msgsubmit");
    
    var userID = -1;
    
    roomNameSpan.innerText = roomName.replace("%20", " ");
    document.title = `${roomName.replace("%20", " ")} | Chatpost`;
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        let messageForm = document.getElementById("messageForm");
        
        if(data.loggedIn) {
            messageForm.hidden = false;
        } else {
            messageForm.hidden = true;
        }
        
        userID = data.user_id;
        
        loadMessages(userID);
    });
    
    document.getElementById('message_form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = document.getElementById('msg_txt');
        const msg_txt = input.value;

        if (!msg_txt.trim()) return;
        let room_name = roomName;
        
        await fetch('/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ msg_txt, room_name })
        })
        .then(res =>{
            input.value = '';
            location.reload();
        });
    });

});