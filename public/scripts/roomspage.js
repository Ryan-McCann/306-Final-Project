class User {
    constructor(id, name, bio, profilePhotoFile) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.profilePhotoFile = profilePhotoFile;
    }
}

class Room {
    constructor(id, ownerID, name) {
        this.id = id;
        this.ownerID = ownerID;
        this.name = name;
    }
}

class Message {
    constructor(id, roomID, userID, text, date) {
        this.id = id;
        this.roomID = roomID;
        this.userID = userID;
        this.text = text;
        this.date = date;
    }
}

let users = [];
let rooms = [];

rooms.sort((a, b) => {
    if(a[0].name < b[0].name)
        return -1;
    if(a[0].name > b[0].name)
        return 1;
    
    return 0;
});

function loadRoomList() {
    let chatRoomsList = document.getElementById("chatRoomsList");
    chatRoomsList.innerHTML = "";
    
    fetch('/getrooms')
    .then(response => response.json())
    .then(res_rooms => {
        res_rooms.forEach(room => {
            rooms.push(room);
        });
        
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
                    <a href="/room/${room.name}">${room.name}</a> <span>0 Users</span>
                `;
                chatRoomsList.append(li);
            }
        }
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
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
        if(sortSelect.value === "alpha") {
            rooms.sort((a, b) => {
                if(a[0].name < b[0].name)
                    return -1;
                if(a[0].name > b[0].name)
                    return 1;

                return 0;
            });
            loadRoomList();
           
       } else if(sortSelect.value === "ahpla") {
           rooms.sort((a, b) => {
                if(a[0].name > b[0].name)
                    return -1;
                if(a[0].name < b[0].name)
                    return 1;

                return 0;
            });
            loadRoomList();
           
       } else if(sortSelect.value === "users") {
           rooms.sort((a, b) => {
                if(a[1] > b[1])
                    return -1;
                if(a[1] < b[1])
                    return 1;

                return 0;
            });
            loadRoomList();
           
       } else if(sortSelect.value === "sresu") {
           rooms.sort((a, b) => {
                if(a[1] < b[1])
                    return -1;
                if(a[1] > b[1])
                    return 1;

                return 0;
            });
            loadRoomList();
       }
    });
});