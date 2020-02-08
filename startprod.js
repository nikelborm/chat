const express = require('express');
const favicon = require('express-favicon');
const mongodb = require("mongodb");
const path = require('path');
const session = require('express-session');
const sha256 = require('sha256');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const redisStorage = require('connect-redis')(session);
const redis = require('redis');
const http = require('http');
const WebSocket = require('ws');

function isStr(value) {
    return typeof value === "string";
}
function hasIntersections(setA, setB) {
    for (const elem of setB) {
        if (setA.has(elem)) return true;
    }
}
function logout(request, response) {
    request.session.destroy(err => {
        if (err) return console.log(err);
        response.clearCookie("userName");
        response.clearCookie("fullName");
        response.clearCookie("statusText");
        response.redirect('/');
    });
}
function notifyAboutNewPersonInChat(authInfo) {
    const id = authInfo._id.toString();
    const user = {
        userName: authInfo.userName,
        fullName: authInfo.fullName,
        onlineStatus: setOfActiveUserIDs[id] ? "online" : "offline"
    };
    wss.clients.forEach(client => {
        if (hasIntersections(client.authInfo.rooms, authInfo.rooms)) {
            client.send(JSON.stringify({handlerType: "newPersonInChat", id, user}));
        }
    });
}
function createEmptyResponseData() {
    return {
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
}
function fillCookies(response, dataObj, ...params) {
    for (const param of params) {
        if(dataObj[param] !== undefined) {
            response.cookie(param, dataObj[param]);
        }
    }
}
// console.log(Object.getOwnPropertyNames(users.__proto__))
const port = process.env.PORT || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://myUserAdmin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const secretKey = process.env.SECRET || "wHaTeVeR123";
// const mailLogin = process.env.GMAIL_LOGIN || "wHaTeVeR123";
// const mailPassword = process.env.GMAIL_PASS || "wHaTeVeR123";

const app = express();
const store = new redisStorage({
    client: redis.createClient(redisLink)
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(session({
    store,
    secret: secretKey,
    resave: false,
    rolling: true,
    unset: "destroy",
    saveUninitialized: false
}));
app.use(cookieParser(secretKey));
app.use(favicon(__dirname + '/build/favicon.ico'));

// Если человек сам зашёл на логин или его редиректнуло, идёт проверка авторизован ли он, если да то его редиректит на / то есть чат, если нет, то ему выкидывается страница логина
// Вместе с страницей логина делаются доступными все файлы в нужной директории
// Если человек сам зашёл на чат или его редиректнуло, так же идёт проверка авторизован ли он, если да то он остаётся тут, иначе его редиректит на логин
// Становятся доступными все файлы в директории чата

// TODO: Сделать проверку есть ли пользователь (хранящийся в сессии) в базе (на случай если была авторизация на нескольких устройствах, а акк удалён из базы) в этих пунктах:
//   /
//   /chat
//   /loadChatHistory
//   /loadListOfUsersInChat

app.get("/", function (request, response) {
    if (request.session.authInfo) {
        response.redirect('/chat'); // на чат
    } else {
        response.sendFile(path.join(__dirname, 'authorize', 'index.html'));
    }
});
app.use("/", express.static(path.join(__dirname, 'authorize')));
app.get("/chat", function (request, response) {
    if (request.session.authInfo) {
        response.sendFile(path.join(__dirname, 'build', 'index.html'));
    } else {
        response.redirect('/');
    }
});
app.use("/chat", express.static(path.join(__dirname, 'build')));
app.get("/deleteAccount", function(request, response) {
    users.deleteOne({"_id": new mongodb.ObjectId(request.session.authInfo._id)}, function(err, result){
        if (err) return console.log(err);
        console.log(result);
    });
    logout(request, response);
});
app.get("/logout", logout);

app.post("/canIlogin", function (request, response) {
    let resdata = createEmptyResponseData();
    let rp = resdata.report;
    const { userNameOrEmail, password } = request.body;

    let errorField = "";
    const isRequestCorrect = isStr(userNameOrEmail) && isStr(password);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (!userNameOrEmail) {
        rp.info = "Вы не ввели никнейм или почту";
        errorField = "userNameOrEmail";
    } else if (!password) {
        rp.info = "Вы не ввели пароль";
        errorField = "passwordLogin";
    }
    if (rp.info) {
        resdata.reply.errorField = errorField;
        return response.json(resdata);
    }

    users.findOne({$or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]})
    .then(result => {
        if (!result) {
            resdata.reply.errorField = "userNameOrEmail";
            throw new Error ("Пользователь с указанными логином или почтой не найден");
        } else if (result.password !== sha256(password)) {
            resdata.reply.errorField = "passwordLogin";
            throw new Error ("Неверный пароль");
        }
        request.session.authInfo = resdata.reply = result;
        fillCookies(response, result, "userName", "fullName", "statusText", "avatarLink");
        rp.isError = false;
        rp.info = "Успешная авторизация";
    }).catch(err => {
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});
app.post("/canIregister", function (request, response) {
    // TODO: Добавить проверку почты через присылание письма
    let resdata = createEmptyResponseData();
    let rp = resdata.report;
    const { userName, password, confirmPassword, fullName, email } = request.body;

    let errorField = "";
    const isRequestCorrect = isStr(userName) && isStr(password) && isStr(confirmPassword) && isStr(fullName) && isStr(email);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (!userName) {
        rp.info = "Вы не ввели никнейм";
        errorField = "userName";
    } else if (!email) {
        rp.info = "Вы не ввели почту";
        errorField = "email";
    } else if (!password) {
        rp.info = "Вы не ввели пароль";
        errorField = "passwordRegister";
    } else if (!fullName) {
        rp.info = "Вы не ввели ваше имя";
        errorField = "fullName";
    } else if (password.length < 8) {
        rp.info = "Длина пароля должна быть от 8 символов";
        errorField = "passwordRegister";
    } else if (password.length > 40) {
        rp.info = "Длина пароля должна быть до 40 символов";
        errorField = "passwordRegister";
    } else if (confirmPassword !== password) {
        rp.info = "Пароли не совпадают";
        errorField = "confirmPassword";
    }
    if (rp.info) {
        resdata.reply.errorField = errorField;
        return response.json(resdata);
    }

    users.findOne({ $or: [{ userName }, { email }] })
    .then(result => {
        if (!result) { // Не нашёл никаких результатов
            const userProfile = {
                userName,
                password: sha256(password),
                email,
                fullName,
                regDate: new Date(Date.now()),
                statusText: "Тут был статус",
                avatarLink: "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif", // Это временно
                rooms: ["global"]
            };
            return users.insertOne(userProfile); // Возвращаем промис
        } else if (result.userName === userName) {
            resdata.reply.errorField = "userName";
            throw new Error ("Этот никнейм занят. Если вы владелец, попробуйте <a href='/restore' style='color: #32017d;'>восстановить аккаунт</a>.");
        } else if (result.email === email) {
            resdata.reply.errorField = "email";
            throw new Error ("Эта почта занята. Если вы владелец, попробуйте <a href='/restore' style='color: #32017d;'>восстановить аккаунт</a>.");
        }
    }).then(result => {
        const data = result.ops[0];
        request.session.authInfo = resdata.reply = data;
        fillCookies(response, data, "userName", "fullName", "statusText", "avatarLink");
        notifyAboutNewPersonInChat(data);
        rp.isError = false;
        rp.info = "Регистрация успешна";
    }).catch(err => {
        console.log(err);
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});
// TODO: Добавить оповещение всех онлайновых, кто в одном чате о присоединении новичка
// app.post("/canIjoinTheRoom", function (request, response) {
//     let resdata = createEmptyResponseData();
//     let rp = resdata.report;
//     const d = request.body;
//     notifyAboutNewPersonInChat()
// });
// TODO: Добавить восстановление аккаунта по почте
app.post("/loadChatHistory", function (request, response) {
    let resdata = createEmptyResponseData();
    let rp = resdata.report;
    const { room } = request.body;
    const { authInfo } = request.session;

    const isRequestCorrect = isStr(room);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (!authInfo) {
        rp.info = "Вы не авторизованы";
    } else if (!authInfo.rooms.includes(room)) {
        rp.info = "У вас нет доступа к этому чату. Если вы получили к нему доступ с другого устройства, перезайдите в аккаунт.";
    }
    if (rp.info) {
        return response.json(resdata);
    }

    messages.find({room}, {projection: {room: 0}}).toArray((err, results) => {
        if (err) {
            rp.info = err.message;
            console.log(err);
        } else {
            resdata.reply = results;
            rp.isError = false;
            rp.info = "Данные успешно загружены";
        }
        response.json(resdata);
    });
});
app.post("/sendMsgInChat", function (request, response) {
    let resdata = createEmptyResponseData();
    let rp = resdata.report;
    const { room, text } = request.body;
    const { authInfo } = request.session;

    const isRequestCorrect = isStr(room) && isStr(text);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (!authInfo) {
        rp.info = "Вы не авторизованы";
    } else if (!text) {
        rp.info = "Вы отправили пустое сообщение";
    } else if (!authInfo.rooms.includes(room)) {
        rp.info = "У вас нет доступа к этому чату. Если вы получили к нему доступ с другого устройства, перезайдите в аккаунт.";
    }
    if (rp.info) {
        return response.json(resdata);
    }
    const message = {
        room,
        author: authInfo.userName,
        text,
        time: new Date(Date.now())
    };
    messages.insertOne(message)
    .then(result => {
        rp.info = "Сообщение успешно отправлено";
        rp.isError = false;
        resdata.reply = result.ops[0];
        wss.clients.forEach(client => {
            if (client.authInfo.rooms.has(room)) {
                client.send(JSON.stringify({handlerType: "message", message}));
            }
        });
    }).catch(err => {
        console.log(err);
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});
app.post("/loadListOfUsersInChat", function (request, response) {
    let resdata = createEmptyResponseData();
    let rp = resdata.report;
    const { room } = request.body;
    const { authInfo } = request.session;

    const isRequestCorrect = isStr(room);
    if (!isRequestCorrect) {
        rp.info = "Неправильно составлен запрос";
    } else if (!authInfo) {
        rp.info = "Вы не авторизованы";
    } else if (!authInfo.rooms.includes(room)) {
        rp.info = "У вас нет доступа к этому чату. Если вы получили к нему доступ с другого устройства, перезайдите в аккаунт.";
    }
    if (rp.info) {
        return response.json(resdata);
    }
    let results = {};
    users.find({rooms: room}, {projection: { userName:1, fullName:1 }})
    .forEach(
        (doc) => {
            const id = doc._id.toString();
            const user = {
                userName: doc.userName,
                fullName: doc.fullName,
                onlineStatus: setOfActiveUserIDs[id] ? "online" : "offline"
            };
            results[id] = user;
        },
        function(err) {
            if (err) {
                console.log(err);
                rp.info = err;
            } else {
                resdata.reply = results;
                rp.isError = false;
                rp.info = "Данные успешно загружены";
            }
            response.json(resdata);
        }
    );
});

const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let dbClient;
let users;
let messages;
let setOfActiveUserIDs = {};
const server = http.createServer(app);
const wss = new WebSocket.Server({
    server
});
wss.on('connection', (ws, request) => {
    ws.isAlive = true;
    const cookies = cookie.parse(request.headers.cookie);
    const sid = cookieParser.signedCookie(cookies["connect.sid"], secretKey);
    store.get(sid, (err, ss) => {
        if (err) console.log(err);
        if (!ss || !ss.authInfo || err) {
            ws.send("Вы не авторизованы!");
            ws.terminate();
        } else {
            const { _id } = ws.authInfo = ss.authInfo;
            ws.authInfo.rooms = new Set(ss.authInfo.rooms);
            if (!setOfActiveUserIDs[_id]) {
                setOfActiveUserIDs[_id] = 1;
                wss.clients.forEach(client => {
                    if (hasIntersections(client.authInfo.rooms, ws.authInfo.rooms)) {
                        client.send(JSON.stringify({handlerType: "isOnline", _id}));
                    }
                });
            } else {
                setOfActiveUserIDs[_id]++;
            }
        }
    });
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.on('close',() => {
        const { _id } = ws.authInfo;
        if (setOfActiveUserIDs[_id] === 1) {
            delete setOfActiveUserIDs[_id];
            wss.clients.forEach(client => {
                if (hasIntersections(client.authInfo.rooms, ws.authInfo.rooms)) {
                    client.send(JSON.stringify({handlerType: "isOffline", _id}));
                }
            });
        } else {
            setOfActiveUserIDs[_id]--;
        }
    });
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    // ws.send('Hi there, I am a WebSocket server');
});
setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    wss.clients.forEach((ws) => {
        // Если соединение мертво, завершить
        if (!ws.isAlive) {
            setOfActiveUserIDs.delete(ws.authInfo._id);
            return ws.terminate();
        }
        // обьявить все соединения мертвыми, а тех кто откликнется на ping, сделать живыми
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);
mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    users = client.db().collection("users");
    messages = client.db().collection("messages");
    server.listen(port, function(){
        console.log("Сервер слушает");
    });
});
process.on("SIGINT", () => {
    // На самом деле я не думаю, что это всерьёз будет работать
    wss.clients.forEach((ws) => ws.close(1000, "Сервер выключен или перезагружается."));
    dbClient.close();
    process.exit();
});
