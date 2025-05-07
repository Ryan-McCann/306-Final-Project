let rooms = [];

function loadRoomList() {
    fetch('/getrooms')
    .then(response => response.json())
    .then(res_rooms => {
        rooms = [];
        
        res_rooms.forEach(room => {
            rooms.push(room);
        });
        
        rooms.sort((a, b) => {
            if(a.name < b.name)
                return -1;
            if(a.name > b.name)
                return 1;

            return 0;
        });
        
        renderRoomList();
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

function renderRoomList() {
    let chatRoomsList = document.getElementById("chatRoomsList");
    chatRoomsList.innerHTML = "";
    
    if(rooms.length < 1) {
        let li = document.createElement("li");
        li.innerText = "There doesn't seem to be anything here...";
        li.className = "list-group-item";
        chatRoomsList.append(li);
    } else {
        for(const room of rooms) {
            let li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                <a href="/room/${room.name}">${room.name}</a> <span>${room.user_count} User${room.user_count === 1 ? '' : 's'}</span>
            `;
            chatRoomsList.append(li);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadRoomList();
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        let createRoomForm = document.getElementById("createRoomForm");
        
        if(data.loggedIn) {
            createRoomForm.hidden = false;
        } else {
            createRoomForm.hidden = true;
        }
    });
    
    let sortSelect = document.getElementById("sort-select");
    sortSelect.addEventListener("change", () => {
        //loadRoomList();
        
        if(sortSelect.value === "alpha") {
            rooms.sort((a, b) => {
                if(a.name < b.name)
                    return -1;
                if(a.name > b.name)
                    return 1;

                return 0;
            });
           
       } else if(sortSelect.value === "ahpla") {
           rooms.sort((a, b) => {
                if(a.name > b.name)
                    return -1;
                if(a.name < b.name)
                    return 1;

                return 0;
            });
           
       } else if(sortSelect.value === "users") {
           rooms.sort((a, b) => {
                if(a.user_count > b.user_count)
                    return -1;
                if(a.user_count < b.user_count)
                    return 1;

                return 0;
            });
           
       } else if(sortSelect.value === "sresu") {
           rooms.sort((a, b) => {
                if(a.user_count < b.user_count)
                    return -1;
                if(a.user_count > b.user_count)
                    return 1;

                return 0;
            });
       }
        
        renderRoomList();
    });
});