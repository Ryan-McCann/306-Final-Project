export class Post {
    constructor(id, userID, topicID, name, text, creationDate, modifiedDate = null) {
        this.id = id;
        this.userID = userID;
        this.topicID = topicID;
        this.name = name;
        this.text = text;
        this.creationDate = creationDate;
        this.modifiedDate = modifiedDate;
    }
}