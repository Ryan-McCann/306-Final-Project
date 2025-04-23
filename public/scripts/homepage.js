class User {
    constructor(id, name, bio, profilePhotoFile) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.profilePhotoFile = profilePhotoFile;
    }
}

class Board {
    constructor(id, ownerID, name) {
        this.id = id;
        this.ownerID = ownerID;
        this.name = name;
    }
}

class Topic {
    constructor(id, boardID, userID, title, creationDate) {
        this.id = id;
        this.boardID = boardID;
        this.userID = userID;
        this.title = title;
        this.creationDate = creationDate;
    }
}

class Post {
    constructor(id, userID, topicID, text, creationDate, modifiedDate = null) {
        this.id = id;
        this.userID = userID;
        this.topicID = topicID;
        this.text = text;
        this.creationDate = creationDate;
        this.modifiedDate = modifiedDate;
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
let boards = [];
let topics = [];

function getUser(userID) {
    return users.find((user) => user.id === userID);
}

function getBoard(boardID) {
    return boards.find((board) => board.id === boardID);
}

function getTopic(topicID) {
    return topics.find((topic) => topic.id === topicID);
}

let recentPosts = [];
let topRooms = [];

users.push(new User(0, "User 123", "A simple user", "profile.png"));
users.push(new User(1, "Tony 456", "Another user", "profile.png"));
users.push(new User(2, "Sideshow bob", "A third user", "profile.png"));
users.push(new User(3, "Ryan", "Me", "profile.png"));

boards.push(new Board(0, 0, "Music Lovers"));
boards.push(new Board(1, 1, "Cars"));

topics.push(new Topic(0, 0, 0, "Cool concert", Date("2022-11-30T16:27:00")));
topics.push(new Topic(1, 1, 2, "Favorite Cars", Date("2022-11-30T16:28:00")));

recentPosts.push(new Post(26, 0, 0, "I recently saw a concert that featured rollercoasters and fireworks, and it blew my mind", Date("2022-11-30T16:27:00")));
recentPosts.push(new Post(27, 1, 1, "The new Ford Mustang is easily in my top ten favorite cars.", Date("2022-11-30T16:29:00")));

topRooms.push(new Room(0, 0, "MusicChat"));
topRooms.push(new Room(1, 1, "WeLoveCars"));
topRooms.push(new Room(2, 1, "MovieBuffs"));
topRooms.push(new Room(3, 2, "General Chat"));
topRooms.push(new Room(4, 3, "Tech Chat"));

document.addEventListener("DOMContentLoaded", () => {
    let recentPostsList = document.getElementById("recentPostsList");
    let activeRoomsList = document.getElementById("activeRoomsList");
    
    if(recentPosts.length < 1) {
        let li = document.createElement("li");
        li.innerText = "There doesn't seem to be anything here...";
        li.className = "list-group-item";
        recentPostsList.append(li);
    } else {
        for(const post of recentPosts) {
            let user = getUser(post.userID);
            let topic = getTopic(post.topicID);
            let board = getBoard(topic.boardID);
            
            
            let li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                <div class="fw-bold fs-6">Topic: <a href="/topic.html?id=${topic.id}">${topic.title}</a></div>
                <div>${user.name} wrote:</div>
                <div class="fst-italic">${post.text.substring(0, 80)}...</div>
                <div class="fw-light">in community <a href="/board/${board.name}">${board.name}</a> at ${post.creationDate}</div>
            `;
            recentPostsList.append(li);
        }
    }
    
    if(topRooms.length < 1) {
        let li = document.createElement("li");
        li.innerText = "There doesn't seem to be anything here...";
        li.className = "list-group-item";
        activeRoomsList.append(li);
    } else {
        for(const room of topRooms) {
            let userCount = Number.parseInt(Math.random() * 1001 + 1);
            
            let li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                ${userCount} Users in <a href="/room/${room.name}">${room.name}</a>
            `;
            activeRoomsList.append(li);
        }
    }
});