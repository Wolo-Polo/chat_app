const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = 3000;//process.env.PORT 

app.set('view engine', 'ejs');

app.get('/', function (req, resp){
    resp.render('index', {title: 'home'});
})

app.get('/register', async (req, resp) => {
    resp.render('register');
});

app.get('/login', async (req, resp) => {
    resp.render('login');
});

io.on('connection', function (socket) {
    socket.on('chat', function (msg){
        io.emit('chat', msg);
        console.log(msg);
    });
});

http.listen(port, function () {
    console.log("listen port:" + port)
})
