function Message(id, id_sender, id_group, message, created_at, modified_at) {
    this.id = id;
    this.id_sender = id_sender;
    this.id_group = id_group;
    this.message = message;
    this.created_at = created_at;
    this.modified_at = modified_at;
}

module.exports = Message;