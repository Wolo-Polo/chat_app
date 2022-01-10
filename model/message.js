function Message(id, sender, group, message, created_at, modified_at) {
    this.id = id;
    this.sender = sender;
    this.group = group;
    this.message = message;
    this.created_at = created_at;
    this.modified_at = modified_at;
}

module.exports = Message;