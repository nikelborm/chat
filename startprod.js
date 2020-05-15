/* eslint-disable default-case */
const express = require("express");
const favicon = require("express-favicon");
const mongodb = require("mongodb");
const path = require("path");
const session = require("express-session");
const sha256 = require("sha256");
const bodyParser = require("body-parser");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const RedisStorage = require("connect-redis")(session);
const redis = require("redis");
const http = require("http");
const WebSocket = require("ws"); // jshint ignore:line
const sendmail = require("sendmail")({silent:true});
const querystring = require("querystring");

function isAllStrings(body) {
    let result = 1;
    for (let prop in body) {
        result &= typeof body[prop] === "string";
    }
    return result;
}
function randomString(len) {
    const chrs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let str = "";
    for (let i = 0; i < len; i++) {
        str += chrs[Math.floor(Math.random() * chrs.length)];
    }
    return str;
}
function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
function filterAuthInfo(authInfo/*ToFilter*/) {
    return {
        userName: authInfo.userName,
        fullName: authInfo.fullName,
        statusText : authInfo.statusText,
        avatarLink : authInfo.avatarLink,
        onlineStatus: activeUsersCounter[authInfo._id] ? "online" : "offline"
    };
}
function filterAuthInfoHarder(authInfo/*ToFilter*/) {
    // облегчённая версия
    return {
        
    };
}
function notifyAboutNewPersonInChat(NewPersonAuthInfo, room) {
    const user = filterAuthInfo(NewPersonAuthInfo);
    WSServer.clients.forEach(function (client) {
        if (client.authInfo.rooms.has(room)) {
            user.rooms = intersection(NewPersonAuthInfo.rooms, client.authInfo.rooms);
            client.send(JSON.stringify({handlerType: "newPersonInChat", id: NewPersonAuthInfo._id, user, room}));
        }
    });
}
function createEmptyResponseData() {
    return {
        handlerType: "logs",
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
}

function validate1lvl(mode, body) {
    // login, registration и тому подобные
    let resdata = createEmptyResponseData();
    const { userNameOrEmail, password, userName, confirmPassword, fullName, email} = body;
    let info = "";
    let errorField = "";

    if (!isAllStrings(body)) {
        resdata.report.info = "Неправильно составлен запрос";
        return resdata;
    }
    if (mode === "register") {
        if (password.length < 8) {
            info = "Длина пароля должна быть от 8 символов";
            errorField = "passwordRegister";
        } else if (password.length > 40) {
            info = "Длина пароля должна быть до 40 символов";
            errorField = "passwordRegister";
        } else if (confirmPassword !== password) {
            info = "Пароли не совпадают";
            errorField = "confirmPassword";
        }
    }
    switch ("") {
        case userNameOrEmail:
            info = "Вы не ввели никнейм или почту";
            errorField = "userNameOrEmail";
            break;
        case fullName:
            info = "Вы не ввели ваше имя";
            errorField = "fullName";
            break;
        case userName:
            info = "Вы не ввели никнейм";
            errorField = "userName";
            break;
        case email:
            info = "Вы не ввели почту";
            errorField = "email";
            break;
        case password:
            info = "Вы не ввели пароль";
            errorField = mode === "login" ? "passwordLogin" : "passwordRegister";
    }

    resdata.reply.errorField = errorField;
    resdata.report.info = info;
    return resdata;
}
function validate2lvl(body, authInfo) {
    // message, loadChatHistory и тому подобные
    let resdata = createEmptyResponseData();
    const { room, text } = body;
    let info = "";

    if (!isAllStrings(body)) {
        resdata.report.info = "Неправильно составлен запрос";
        return resdata;
    }

    if (!authInfo) {
        info = "Вы не авторизованы";
    } else {
        if (!authInfo.rooms.has(room)) {
            info = "У вас нет доступа к этому чату. Если вы получили к нему доступ с другого устройства, перезайдите в аккаунт.";
        } else if (text === "") {
            info = "Вы отправили пустое сообщение";
        }
    }

    resdata.report.info = info;
    return resdata;
}
function sendToEveryoneKnown(messageBody, userRooms) {
    WSServer.clients.forEach(function (client) {
        // if hasIntersections
        for (const elem of userRooms) {
            if (client.authInfo.rooms.has(elem)){
                client.send(JSON.stringify(messageBody));
                return;
            }
        }
    });
}
function sendToEveryoneInRoom(messageBody, room) {
    WSServer.clients.forEach(function (client) {
        if (client.authInfo.rooms.has(room)) {
            client.send(JSON.stringify(messageBody));
        }
    });
}
function onCloseWSconnection(connection) {
    const { _id: id } = connection.authInfo;
    if (activeUsersCounter[id] === 1) {
        delete activeUsersCounter[id];
        sendToEveryoneKnown({handlerType: "isOffline", id}, connection.authInfo.rooms);
    } else {
        activeUsersCounter[id]--;
    }
}
function redirectIfNecessary(target, request, response) {
    if (!!request.session.authInfo ^ target === "/") {
        response.sendFile(path.join(__dirname, target === "/" ? "authorize" : "build", "index.html"));
    } else {
        response.redirect(target === "/" ? "/chat" : "/");
    }
}
function fillCookies(response, dataObj, ...params) {
    for (const param of params) {
        response.cookie(param, typeof dataObj[param] === "string" ? dataObj[param] : JSON.stringify( dataObj[param] ));
    }
}
function clearCookies(response, ...params) {
    for (const param of params) {
        response.clearCookie(param);
    }
}
function logout(request, response) {
    request.session.destroy((err) => {
        if (err) return console.log(err);
        clearCookies(response, "userName", "fullName", "statusText", "avatarLink");
        response.redirect("/");
    });
}

const port = process.env.PORT || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://myUserAdmin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const secretKey = process.env.SECRET || "wHaTeVeR123";
// const mailLogin = process.env.GMAIL_LOGIN || "wHaTeVeR123";
// const mailPassword = process.env.GMAIL_PASS || "wHaTeVeR123";

let dbClient;
let users;
let messages;
let activeUsersCounter = {};

const app = express();
const store = new RedisStorage({
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
app.use(favicon(__dirname + "/build/favicon.ico"));

// TODO: Сделать проверку есть ли пользователь (хранящийся в сессии) в базе в этих пунктах (на случай если была авторизация на нескольких устройствах, а акк удалён из базы):
//   /
//   /chat
//   /loadChatHistory
//   /loadListOfUsersInChat

app.get("/", redirectIfNecessary.bind(undefined, "/"));
app.use("/", express.static(path.join(__dirname, "authorize")));

app.get("/chat", redirectIfNecessary.bind(undefined, "/chat"));
app.use("/chat", express.static(path.join(__dirname, "build")));

app.get("/deleteAccount", function(request, response) {
    users.deleteOne({"_id": new mongodb.ObjectId(request.session.authInfo._id)}, function(err, result){
        if (err) return console.log(err);
        console.log(result);
    });
    logout(request, response);
});
app.get("/logout", logout);

app.post("/canIlogin", function (request, response) {
    const { userNameOrEmail, password } = request.body;
    let resdata = validate1lvl("login", { userNameOrEmail, password });
    let rp = resdata.report;

    if (rp.info) return response.json(resdata);

    users.findOne({$or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]})
    .then((result) => {
        if (!result) {
            resdata.reply.errorField = "userNameOrEmail";
            rp.info = "Пользователь с указанными логином или почтой не найден";
        } else if (result.password !== sha256(password)) {
            resdata.reply.errorField = "passwordLogin";
            rp.info = "Неверный пароль";
        } else if (!result.emailConfirmed) {
            resdata.reply.errorField = "userNameOrEmail";
            rp.info = "Вы не перешли по ссылке из письма (не подтвердили почту). Если письма нет даже в папке спам, то обращайтесь к администратору.";
        }
        if (rp.info) return;

        request.session.authInfo = resdata.reply = result;
        fillCookies(response, result, "userName", "fullName", "statusText", "avatarLink", "rooms");
        rp.isError = false;
        rp.info = "Успешная авторизация";
    }).catch((err) => {
        console.log(err);
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});
app.get("/finishRegistration", function (request, response) {
    const { secureToken, id } = request.query;
    if (!isAllStrings({ secureToken, id })) {
        return response.redirect("/");
    }
    const _id = new mongodb.ObjectID(id);
    let page = "/";
    users.findOne({ _id })
    .then((result) => {
        if (result && result.secureToken === secureToken) {
            result.rooms = ["global"];
            request.session.authInfo = result;
            fillCookies(response, result, "userName", "fullName", "statusText", "avatarLink", "rooms");
            page = "/chat";
            return users.updateOne( { _id }, {
                $addToSet: { rooms: "global" },
                $set: {
                    secureToken : randomString(32),
                    emailConfirmed: true
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        response.redirect(page);
    });
});
// TODO: Сделать,чтобы сессия привязывалась к ip, что помешает использовать одни и те же сессионные куки на разных устройствах
app.post("/canIregister", function (request, response) {
    const { userName, password, confirmPassword, fullName, email } = request.body;
    let resdata = validate1lvl("register", { userName, password, confirmPassword, fullName, email });
    let rp = resdata.report;

    if (rp.info) return response.json(resdata);

    users.findOne({ $or: [{ userName }, { email }] })
    .then((result) => {
        if (!result) { // Не нашёл никаких результатов
            const userProfile = {
                userName,
                password: sha256(password),
                email,
                fullName,
                regDate: new Date(Date.now()),
                statusText: "В сети",
                avatarLink: "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif", // Это временно
                rooms: [],
                secureToken: randomString(32),
                emailConfirmed: false
            };
            return users.insertOne(userProfile); // Возвращаем промис
        }
        if (result.emailConfirmed) {
            if (result.userName === userName) {
                resdata.reply.errorField = "userName";
                rp.info = "Этот никнейм занят.";
            } else {
                // (result.email === email)
                resdata.reply.errorField = "email";
                rp.info = "Эта почта занята.";
            }
            rp.info += " Если вы владелец, попробуйте <a href='/restore' style='color: #FFFFFF;'>восстановить аккаунт</a>.";
        }
    }).then((result) => {
        if (rp.info) return;
        const { secureToken, email, _id } = result.ops[0];
        // TODO: Настроить почтовый сервер, DNS, MX записи, а также SPF, DKIM, DMARC
        // И всё ради того, чтобы гугл блять не ругался и принимал почту
        // Тут иногда появляется фантомный баг и какой-нибудь символ (зачастую точка) исчезает из адреса в html
        console.log();
        sendmail({
            from: "robot <noreply@nikel.herokuapp.com>",
            to: email,
            subject: "Завершение регистрации",
            html: `<h2><a href="https://nikel.herokuapp.com/finishRegistration?${ querystring.stringify({id : _id.toString(), secureToken})}">Чтобы завершить регистрацию, перейдите по ссылке</a></h2> `
        }, (err, reply) => {
            if (err) {
                rp.info = err.message;
                return;
            }
        });
        rp.isError = false;
        rp.info = "Регистрация успешна";
    }).catch((err) => {
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});

// TODO: Добавить восстановление аккаунта по почте
const server = http.createServer(app);
const WSServer = new WebSocket.Server({
    server
});
WSServer.on("connection", (connection, request) => {
    connection.isAlive = true;
    const cookies = cookie.parse(request.headers.cookie);
    const sid = cookieParser.signedCookie(cookies["connect.sid"], secretKey);
    store.get(sid, (err, session) => {
        if (err) console.log(err);

        if (!session || !session.authInfo || err) {
            let resdata = createEmptyResponseData();
            resdata.report = "Вы не авторизованы!";
            connection.send(JSON.stringify(resdata));
            connection.terminate();
        } else {
            const { _id: id } = connection.authInfo = session.authInfo;
            connection.authInfo.rooms = new Set(session.authInfo.rooms);
            if (!activeUsersCounter[id]) {
                activeUsersCounter[id] = 1;
                sendToEveryoneKnown({handlerType: "isOnline", id}, connection.authInfo.rooms);
                // TODO: Отправить новичку инфу о том кто он?
            } else {
                activeUsersCounter[id]++;
            }
        }
    });
    connection.on("pong", () => {
        connection.isAlive = true;
    });
    connection.on("close", () => {
        onCloseWSconnection(connection);
    });
    connection.on("message", (input) => {
        const { authInfo } = connection;
        const { handlerType, room, text } = JSON.parse(input);

        let resdata = validate2lvl(handlerType === "message" ? { room, text } : { room }, authInfo);
        let rp = resdata.report;
        if (rp.info) return connection.send(JSON.stringify(resdata));

        switch (handlerType) {
            case "message":
                let message = {
                    room,
                    authorID: authInfo.userName,
                    text,
                    time: new Date(Date.now())
                };
                messages.insertOne(message)
                .then((result) => {
                    const id = result.ops[0]._id;
                    rp.info = "Сообщение успешно отправлено";
                    rp.isError = false;
                    resdata.reply = { id };
                    sendToEveryoneInRoom({handlerType: "message", messageId: id, ...message}, room);
                }).catch((err) => {
                    console.log(err);
                    rp.info = err.message;
                }).finally(() => {
                    connection.send(JSON.stringify(resdata));
                });
                break;
            case "loadSpecificChatHistory":
                messages.find({ room }, { projection: {room: 0} })
                .toArray((err, results) => {
                    if (err) {
                        rp.info = err.message;
                        console.log(err);
                    } else {
                        resdata.handlerType = "loadChatHistory";
                        resdata.reply = { room, results };
                        rp.isError = false;
                        rp.info = "Данные успешно загружены";
                    }
                    connection.send(JSON.stringify(resdata));
                });
                break;
            case "loadListOfUsersInChat":
                let results = {};
                users.find({rooms: room}, {projection: { userName:1, fullName:1 }})
                .forEach(
                    (doc) => {
                        const id = doc._id.toString();
                        const user = {
                            userName: doc.userName,
                            fullName: doc.fullName,
                            onlineStatus: activeUsersCounter[id] ? "online" : "offline"
                        };
                        results[id] = user;
                    },
                    function (err) {
                        if (err) {
                            console.log(err);
                            rp.info = err;
                        } else {
                            resdata.reply = { room, results };
                            rp.isError = false;
                            rp.info = "Данные успешно загружены";
                        }
                        connection.send(JSON.stringify(resdata));
                    }
                );
                break;
            case "canIjoinTheRoom":
                // TODO: Добавить оповещение всех онлайновых, кто в одном чате о присоединении новичка
                // TODO: Сделать защиту, чтобы имя комнаты не было каким-нибудь ебанутым типа constructor, __proto__ или this
                // let resdata = createEmptyResponseData();
                // let rp = resdata.report;
                // const d = request.body;
                // notifyAboutNewPersonInChat(authInfo, room);
                break;
            case "loadFilteredAuthInfoData":
                // TODO: обязательно проверять а знаком ли этот пользователь со вторым
                // Здесь загружается полная инфа о пользователе
                break;
            case "loadListOfDirectChats":
        }
    });
});
setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    WSServer.clients.forEach((connection) => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
            onCloseWSconnection(connection);
            return connection.terminate();
        }
        // обьявить все соединения мертвыми, а тех кто откликнется на ping, сделать живыми
        connection.isAlive = false;
        connection.ping(null, false, true);
    });
}, 10000);

const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// TODO: Должна быть третья коллекция с комнатами
mongoClient.connect(function (err, client) {
    if (err) return console.log(err);

    dbClient = client;
    users = client.db().collection("users");
    messages = client.db().collection("messages");
    server.listen(port, function(){
        console.log("Сервер слушает");
    });
});
['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, function() {
        WSServer.close(() => {
            console.log("Все WebSocket соединения успешно завершены");
        });
        dbClient.close();
        process.exit();
    });
});
