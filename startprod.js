const express = require('express');
const favicon = require('express-favicon');
const MongoClient = require("mongodb").MongoClient;
const path = require('path');
const session = require('express-session');
const sha256 = require('sha256');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const redisStorage = require('connect-redis')(session);
const redis = require('redis');

function isStr(value) { return typeof value === "string" }

// console.log(Object.getOwnPropertyNames(users.__proto__))
const port = process.env.PORT || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://myUserAdmin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const secretKey = process.env.SECRET || "wHaTeVeR123";
// const mailLogin = process.env.GMAIL_LOGIN || "wHaTeVeR123";
// const mailPassword = process.env.GMAIL_PASS || "wHaTeVeR123";

const app = express();
const storage = new redisStorage({
    client: redis.createClient(redisLink)
});
const mongoClient = new MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let dbClient;
mongoClient.connect(function(err, client){
    if (err) return console.log(err);
    dbClient = client;
    app.locals.users = client.db().collection("users");
    // app.locals.messages = client.db().collection("messages");
    app.listen(port, function(){
        console.log("Сервер ожидает подключения...");
    });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(session({
    store: storage,
    secret: secretKey,
    resave: false,
    rolling: true,
    unset: "destroy",
    saveUninitialized: false
}));
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));
// Эти две страницы выкидываются в первую очередь (они статичны)
app.use("/register", express.static(path.join(__dirname, 'registerPage')));
app.use("/restore", express.static(path.join(__dirname, 'restoreAccountPage')));
// Если человек сам зашёл на логин или его редиректнуло, идёт проверка авторизован ли он, если да то его редиректит на / то есть чат, если нет, то ему выкидывается страница логина
app.get("/login", function (request, response) {
    // TODO: Сделать проверку есть ли пользователь (хранящийся в сессии) в базе (на случай если была авторизация на нескольких устройствах, а акк удалён из базы)
    if (request.session.authInfo) {
        response.redirect('/'); // на чат
    } else {
        response.sendFile(path.join(__dirname, 'loginPage', 'index.html'));
    }
});
// Вместе с страницей логина делает доступными все файлы в нужной директории
app.use("/login", express.static(path.join(__dirname, 'loginPage')));
// Если человек сам зашёл на чат или его редиректнуло, так же идёт проверка авторизован ли он, если да то он остаётся тут, иначе его редиректит на логин
app.get("/", function (request, response) {
    // TODO: Сделать проверку есть ли пользователь (хранящийся в сессии) в базе (на случай если была авторизация на нескольких устройствах, а акк удалён из базы)
    if (request.session.authInfo) {
        response.sendFile(path.join(__dirname, 'build', 'index.html'));
    } else {
        response.redirect('/login');
    }
});
// Становятся доступными все файлы в директории чата
app.use("/", express.static(path.join(__dirname, 'build')));

app.get("/deleteAccount", function(request, response) {
    // TODO: Удаление аккаунта, затем удаление сессии, затем редирект на страницу входа
});
app.get("/logout", function (request, response) {
    request.session.destroy((err) => {
        if (err) return console.log(err);
        response.redirect('/login');
    });
});
app.post("/canIlogin", function (request, response) {
    let responsedata = {
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    }
    let rp = responsedata.report;
    const d = request.body; // data

    const isRequestCorrect = isStr(d.userName) && isStr(d.password);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (d.userName === "") {
        rp.info = "Вы не ввели никнейм";
    } else if (d.password === "") {
        rp.info = "Вы не ввели пароль";
    }
    if (rp.info) {
        return response.json(responsedata);
    }
    const users = request.app.locals.users;
    users.findOne({$or: [{ userName: d.userName }, { email: d.email }]})
    .then((result) => {
        if (result === null) {
            return "Пользователь с указанными логином или почтой не найден";
        } else if (result.password !== sha256(d.password)){
            return "Неверный пароль";
        } else {
            rp.isError = false;
            request.session.authInfo = responsedata.reply = result
            return "Успешная авторизация";
        }
    }).catch((err) => {
        console.log(err);
        return err;
    }).then((result) => {
        rp.info = result;
        response.json(responsedata);
    });
});
app.post("/canIregister", function (request, response) {
    let responsedata = {
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    }
    let rp = responsedata.report;
    const d = request.body;

    const isRequestCorrect = isStr(d.userName) && isStr(d.password) && isStr(d.repeatPassword) && isStr(d.fullName) && isStr(d.email);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
        return response.json(responsedata);
    }
    rp.info = (function (d) {
        switch ("") {
            case d.userName:
                return "Вы не ввели никнейм";
            case d.email:
                return "Вы не ввели почту";
            case d.password:
                return "Вы не ввели пароль";
            case d.fullName:
                return "Вы не ввели ваше имя";
            default:
                // всё заполнено
                return "";
        }
    }(d)); // Самовызывается и иногда возвращает строку с ошибкой
    if (d.repeatPassword !== d.password) {
        rp.info = "Пароли не совпадают";
    } else if (d.password.length < 8) {
        rp.info = "Длина пароля должна быть от 8 символов";
    } else if (d.password.length > 40) {
        rp.info = "Длина пароля должна быть до 40 символов";
    }
    // const pass = require('validate.it.js')(d.password);
    // if (pass.lessThan( 8 ).ok) {
    //     rp.info = "Длина пароля должна быть от 8 символов";
    // } else if (pass.longerThan( 40 ).ok) {
    //     rp.info = "Длина пароля должна быть до 40 символов";
    // } else if (! pass.hasNumbers().ok) {
    //     rp.info = "Пароль должен содержать хотя бы 1 цифру";
    // } else if (! pass.hasLettersLatin().ok) {
    //     rp.info = "Пароль должен содержать хотя бы 1 латинскую букву";
    // }
    if (rp.info) {
        return response.json(responsedata);
    }
    const users = request.app.locals.users;
    users.findOne({ $or: [{ userName: d.userName }, { email: d.email }] })
    .then((result) => {
        if (result === null) {
            // Пользователя нет в системе
            const userProfile = {
                userName: d.userName,
                password: sha256(d.password),
                email: d.email,
                fullName: d.fullName,
                regDate: new Date(Date.now())
            };
            rp.isError = false;
            return users.insertOne(userProfile); // Возвращаем промис
        } else if (result.userName === d.userName) {
            return "Этот никнейм занят. Если вы владелец, попробуйте <a href='/restore' style='color: #32017d;'>восстановить аккаунт</a>.";
        } else if (result.email === d.email) {
            return "Эта почта занята. Если вы владелец, попробуйте <a href='/restore' style='color: #32017d;'>восстановить аккаунт</a>.";
        } else {
            return "Я вообще не ебу, что происходит";
        }
    }).catch((err) => {
        console.log(err);
        rp.isError = true;
        return err;
    }).then((result) => {
        rp.info = rp.isError ? result : (request.session.authInfo = responsedata.reply = result.ops[0]) && "Регистрация успешна";
        response.json(responsedata);
    });
});
app.post("/loadChatHistory", function (request, response) {
    // TODO: Проверка Авторизации и доступа к конкретному чату, если успешно, отправить всю историю чата
});
app.post("/sendMsgInChat", function (request, response) {
    // TODO: Проверка Авторизации и доступа к конкретному чату, если успешно, закинуть сообщение в комет канал, затем в базу
});
// const WebSocket = require('ws')
// const wss = new WebSocket.Server({ port: 8080 })
// wss.on('connection', ws => {
//     ws.on('message', message => {
//         console.log(`Received message => ${message}`)
//     })
//     ws.send('ho!')
// })
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
