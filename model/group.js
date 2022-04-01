function Group(id, name, last_message_at, created_at, details, seen) {
    this.id = id;
    this.name = name;
    this.last_message_at = last_message_at;
    this.created_at = created_at;
    this.details = details;
    this.seen = seen;
}

module.exports = Group;