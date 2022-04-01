create table if not exists tbl_user (
    id bigint auto_increment primary key,
    name varchar(50) not null,
    email varchar(50) not null,
    password varchar(50) not null
);

create table if not exists tbl_message (
    id bigint auto_increment primary key,
    id_sender bigint not null,
    id_group bigint not null,
    message varchar(1000) not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

create table if not exists tbl_group (
    id bigint auto_increment primary key,
    name varchar(50),
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

create table if not exists  tbl_user_group (
    id bigint auto_increment primary key,
    id_user bigint not null,
    id_group bigint not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)