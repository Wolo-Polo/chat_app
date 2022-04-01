const express = require('express');
const app = express();
const session = require('express-session');
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
var port = 3000;//process.env.PORT 
const { UserDao } = require('./dao/user_dao');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const { GroupDao } = require('./dao/group_dao');
const { MessageDao } = require('./dao/message_dao');
const Message = require('./model/message');
const { UserGroupDao } = require('./dao/user_group_dao');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 86400000 }}));//1 ngày


app.get('/', (req, resp) => {
    if(req.session.user == null) {
        resp.redirect('/login');
    } else {
        var attribute = {};
        attribute['user'] = req.session.user;
        attribute['group'] = {id: 1};

        resp.render('index', attribute);
    }
});

app.get('/register', (req, resp) => {
    resp.render('register', {error: null});
});

app.post('/register', async (req, resp) => {
    let user = await UserDao.getByEmail(req.body.email);
    if(user == null) {
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        await UserDao.insert(new User(null, req.body.name, req.body.email, hashPassword));
        resp.redirect('/login');
    } else {
        resp.render("register", {error: "Email này đã được sử dụng!"})
    }

});

app.get('/login', (req, resp) => {
    resp.render('login', {error: null});
});

app.post('/login', async (req, resp) => {
    let user = await UserDao.getByEmail(req.body.email);
    if(user != null) {
        let checkPassword = await bcrypt.compare(req.body.password, user.password);
        if(checkPassword){
            req.session.user = user;
            resp.redirect("/");
        } else {
            resp.render("login", {error: "Đăng nhập thật bại, sai mật khẩu!"})
        }
    } else {
        resp.render("login", {error: "Đăng nhập thật bại, email không tồn tại!"})
    }
});

app.get('/logout', (req, resp) => {
    req.session.user = null;

    resp.redirect('/login');
});

app.post('/users', async (req, resp) => {
    let name = req.body.search;
    await UserDao.searchByName(name)
        .then(results => {
            resp.json(results);
        })
        .catch(err => console.log(err));
});

app.post('/groups', async (req, resp) => {
    let id_user = req.body.id_user;
    await GroupDao.getByUserId(id_user).then(groups => {
        resp.json(groups);
    });
});

app.post('/messages', async (req, resp) => {
    let id_group = req.body.id_group;
    await MessageDao.getAllByGroup(id_group).then(msgs => {
        resp.json(msgs);
    });

    //seen
    let user = req.session.user;
    await UserGroupDao.updateSeen(user.id, id_group);
});

app.post('/users_in_group', async (req, resp) => {
    let id_group = req.body.id_group;
    await UserDao.getUserByGroupId(id_group).then(users => {
        resp.json(users.map(user => new User(user.id, user.name, user.email)));
    });
});

app.post('/user_group_seen', async (req, resp) => {
    let id_group = req.body.id_group;
    let user = req.session.user;
    await UserGroupDao.updateSeen(user.id, id_group)
    .then(() => resp.json({status: "success"}))
    .catch(err => console.log(err));
});

var users_online = {};
io.on('connection', function (socket) {
    socket.on('online', function (user){
        users_online[socket.id] = user;
        io.emit('online', users_online);
    });

    socket.on('chat', async function (msg){
        let id_group = msg.id_group;
        if(msg.id_group == undefined || msg.id_group == null) {
            let name_group = "";

            if(msg.group_name == "") {
                for(let i = 0; i < msg.list_user.length; i++) {
                    name_group += msg.list_user[i].name + ",";
                }
            } else {
                name_group = msg.group_name;
            }

            let new_group = {}
            new_group['name'] = name_group;
            new_group['details'] = msg.list_user;
            await GroupDao.insert(new_group).then((id) => {
                id_group = id;
            })
            .catch(err => console.log(err));
        } 

        await MessageDao.insert(new Message(null, msg.id_sender, id_group, msg.message));
        await GroupDao.updateLastMessageAt(id_group);
        await UserGroupDao.updateNotSeenAll(id_group);
        await UserGroupDao.updateSeen(msg.id_sender, id_group)  

        let new_message = {};
        await UserDao.getById(msg.id_sender)
        .then(user => {
            new_message['sender'] = {id: user.id, name: user.name};
        })

        new_message['group'] = {id: id_group};
        new_message['message'] = {message: msg.message};         

        await UserDao.getUserByGroupId(id_group).then(users => {
            let userIds = users.map(i => i.id);
            Object.keys(users_online).forEach(k => {
                if(userIds.includes(users_online[k].id)) {
                    //console.log("emit to " + k);
                    socket.to(k).emit("private message", new_message);
                } 
            });
        });

    });

    // socket.on('private message', function(msg){
    //     console.log(msg);
    // });

    socket.on('disconnect', function(){
        delete users_online[socket.id];
        io.emit('online', users_online);
    });
});

http.listen(port, function () {
    console.log("listen port:" + port)
})
