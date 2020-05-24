/* eslint-disable default-case */
const express = require("express");
const favicon = require("express-favicon");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
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
        result &= +(typeof body[prop] === "string");
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
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
function createHardAuthInfo(authInfo) {
    const { user: lite, id } = createLiteAuthInfo(authInfo);
    return {
        user: {
            ...lite,
            statusText : authInfo.statusText,
            avatarLink : authInfo.avatarLink
        },
        id
    };
}
function createLiteAuthInfo(authInfo) {
    const id = authInfo._id.toString();
    return {
        user: {
            nickName: authInfo.nickName,
            fullName: authInfo.fullName,
            onlineStatus: activeUsersCounter[id] ? "online" : "offline"
        },
        id
    };
}
function notifyAboutNewPersonInChat(newAuthInfo, room) {
    const { user, id } = createHardAuthInfo(newAuthInfo);
    sendToEveryoneInRoom(
        {handlerType: "newPersonInChat", id, user, room},
        (body, clientsrooms) => {
            body.user.rooms = intersection(newAuthInfo.rooms, clientsrooms);
            return body;
        }
    );
}
function createEmptyResponseData() {
    const resdata = {
        handlerType: "logs",
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
    return {resdata, rp: resdata.report};
}
function validate1lvl(mode, body) {
    // login, registration и тому подобные
    let { resdata, rp } = createEmptyResponseData();
    const { nickNameOrEmail, password, nickName, confirmPassword, fullName, email} = body;
    let info = "";
    let errorField = "";

    if (!isAllStrings(body)) {
        rp.info = "Неправильно составлен запрос";
        return {resdata, rp: resdata.report};
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
        case nickNameOrEmail:
            info = "Вы не ввели никнейм или почту";
            errorField = "nickNameOrEmail";
            break;
        case fullName:
            info = "Вы не ввели ваше имя";
            errorField = "fullName";
            break;
        case nickName:
            info = "Вы не ввели никнейм";
            errorField = "nickName";
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
    rp.info = info;
    return {resdata, rp: resdata.report};
}
function validate2lvl(body, authInfo) {
    // message, loadChatHistory и тому подобные
    let { resdata, rp } = createEmptyResponseData();
    const { room, text } = body;
    let info = "";

    if (!isAllStrings(body)) {
        info = "Неправильно составлен запрос";
    } else if (!authInfo) {
        info = "Вы не авторизованы";
    } else if (!authInfo.rooms.has(room)) {
        info = "У вас нет доступа к этому чату. Если вы получили к нему доступ с другого устройства, перезайдите в аккаунт.";
    } else if (text === "") {
        info = "Вы отправили пустое сообщение";
    }

    rp.info = info;
    return {resdata, rp: resdata.report};
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
function sendToEveryoneInRoom(messageBody, room, preSend) {
    WSServer.clients.forEach(function (client) {
        if (client.authInfo.rooms.has(room)) {
            if (preSend) {
                messageBody = preSend(messageBody, client.authInfo.rooms);
            }
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
    if (!!request.session.authInfo !== (target === "/")) {
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
        clearCookies(response, "nickName", "fullName", "statusText", "avatarLink");
        response.redirect("/");
    });
}
function shutdownOn(sig) {
    process.on(sig, function() {
        WSServer.close(() => {
            console.log("Все WebSocket соединения успешно завершены");
        });
        dbClient.close();
        process.exit();
    });
}
function deleteEntityById(id) {
    entities.deleteOne({ _id : new ObjectId(id)})
    .catch((err) => {
        console.log(err);
    }).then((result) => {
        console.log(result);
    });
}
const port = process.env.PORT || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://myUserAdmin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const secretKey = process.env.SECRET || "wHaTeVeR123";
// const mailLogin = process.env.GMAIL_LOGIN || "wHaTeVeR123";
// const mailPassword = process.env.GMAIL_PASS || "wHaTeVeR123";

let dbClient;
let entities;
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
    // TODO: По такому же принципу построить удаление комнат
    deleteEntityById(request.session.authInfo._id);
    logout(request, response);
});
app.get("/logout", logout);

app.post("/canIlogin", function (request, response) {
    const { nickNameOrEmail, password } = request.body;
    let { resdata, rp } = validate1lvl("login", { nickNameOrEmail, password });

    if (rp.info) return response.json(resdata);

    entities.findOne({ isRoom: false, $or: [{ nickName: nickNameOrEmail }, { email: nickNameOrEmail }]})
    .then((result) => {
        if (!result) {
            resdata.reply.errorField = "nickNameOrEmail";
            rp.info = "Пользователь с указанными логином или почтой не найден";
        } else if (result.password !== sha256(password)) {
            resdata.reply.errorField = "passwordLogin";
            rp.info = "Неверный пароль";
        } else if (!result.emailConfirmed) {
            resdata.reply.errorField = "nickNameOrEmail";
            rp.info = "Вы не перешли по ссылке из письма (не подтвердили почту). Если письма нет даже в папке спам, то обращайтесь к администратору.";
        }
        if (rp.info) return;

        request.session.authInfo = resdata.reply = result;
        fillCookies(response, result, "nickName", "fullName", "statusText", "avatarLink", "rooms");
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
    // @ts-ignore
    const _id = new ObjectId(id);
    let page = "/";
    entities.findOne({ _id, secureToken })
    .then((result) => {
        if (!result) return;
        request.session.authInfo = result;
        fillCookies(response, result, "nickName", "fullName", "statusText", "avatarLink", "rooms");
        page = "/chat";
        return entities.updateOne( { _id }, {
            // $addToSet: { rooms: "global" },
            $set: {
                secureToken : randomString(32),
                emailConfirmed: true
            }
        });
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        response.redirect(page);
    });
});
// TODO: Сделать,чтобы сессия привязывалась к ip, что помешает использовать одни и те же сессионные куки на разных устройствах
app.post("/canIregister", function (request, response) {
    const { nickName, password, confirmPassword, fullName, email } = request.body;
    let { resdata, rp } = validate1lvl("register", { nickName, password, confirmPassword, fullName, email });

    if (rp.info) return response.json(resdata);

    entities.findOne({isRoom: false, $or: [{ nickName }, { email }] })
    .then((result) => {
        const userProfile = {
            isRoom: false,
            nickName,
            password: sha256(password),
            email,
            fullName,
            regDate: new Date(Date.now()),
            statusText: "В сети", // TODO: Подумать над этим
            avatarLink: "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif", // TODO: Добавить возможность выбора аватара
            rooms: [],
            directChats: [],
            muted: [],
            secureToken: randomString(32),
            emailConfirmed: false
        };
        if (!result) { // Не нашёл никаких результатов
            return entities.insertOne(userProfile); // Возвращаем промис
        }
        let info;
        if (result.emailConfirmed) {
            if (result.nickName === nickName) {
                resdata.reply.errorField = "nickName";
                info = "Этот никнейм занят.";
            } else {
                // (result.email === email)
                resdata.reply.errorField = "email";
                info = "Эта почта занята.";
            }
            info += " Если вы владелец, попробуйте <a href='/restore' style='color: #FFFFFF;'>восстановить аккаунт</a>.";
            throw new Error(info);
        }
        // Если нашёлся неподтверждённый аккаунт
        resdata.reply.errorField = "email";
        if (result.nickName === nickName) {
            if (result.email === email) {
                rp.info = "Аккаунт с указанными ником и почтой уже был создан, но не подтверждён. Мы отправим письмо повторно. Если вы его не получите, проверьте спам или укажите почту другого сервиса.";
            } else {
                rp.info = "Аккаунт с указанным ником, но другой почтой уже был создан, но не подтверждён. Мы отправим письмо повторно, но уже на новый адрес. Если вы его не получите, проверьте спам или укажите почту другого сервиса.";
            }
        } else {
            // (result.email === email)
            rp.info = "Аккаунт с этой почтой, но другим ником уже был создан, но не подтверждён. Мы отправим письмо повторно. Если вы его не получите, проверьте спам или укажите почту другого сервиса.";
        }
        return entities.findOneAndReplace({_id: result._id}, userProfile, {returnOriginal:false});
    }).then((result) => {
        const { secureToken, email, _id } = result.value ? result.value : result.ops[0];
        // TODO: Настроить почтовый сервер, DNS, MX записи, а также SPF, DKIM, DMARC
        // И всё ради того, чтобы гугл блять не ругался и принимал почту
        // Тут иногда появляется фантомный баг и какой-нибудь символ (зачастую точка) исчезает из адреса в html
        sendmail({
            from: "robot <noreply@nikel.herokuapp.com>",
            to: email,
            subject: "Завершение регистрации",
            html: `<h2><a href="https://nikel.herokuapp.com/finishRegistration?${ querystring.stringify({id : _id.toString(), secureToken})}">Чтобы завершить регистрацию, перейдите по ссылке</a></h2> `
        }, (err) => {
            throw err;
            // TODO: подумать как сделать, чтобы сообщение об ошибке отправки не затирало сообщения о неподтверждённом аккаунте
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
    const sid = ""+cookieParser.signedCookie(cookies["connect.sid"], secretKey);
    store.get(sid, (err, session) => {
        if (err) console.log(err);

        if (!session || !session.authInfo || err) {
            let { resdata, rp } = createEmptyResponseData();
            rp.info = "Вы не авторизованы!";
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
        const { handlerType, room, text } = JSON.parse(input.toString());
        let { resdata, rp } = validate2lvl(handlerType === "message" ? { room, text } : { room }, authInfo);
        resdata.handlerType = handlerType;

        if (rp.info) return connection.send(JSON.stringify(resdata));

        switch (handlerType) {
            case "message":
                // TODO: Проверять имеет ли пользователь право отправлять сообщения в этот чат
                let message = {
                    room,
                    authorID: authInfo.nickName,
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
                        resdata.reply = { room, results };
                        rp.isError = false;
                        rp.info = "Данные успешно загружены";
                    }
                    connection.send(JSON.stringify(resdata));
                });
                break;
            case "loadListOfUsersInChat":
                let results = {};
                entities.find({rooms: room}, {projection: { nickName:1, fullName:1 }})
                .forEach(
                    (doc) => {
                        const { user, id } = createLiteAuthInfo(doc);
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

                notifyAboutNewPersonInChat(authInfo, room);
                break;
            case "loadFilteredAuthInfoData":
                // TODO: обязательно проверять а знаком ли этот пользователь со вторым (хотя над этим ещё подумать надо)
                // Здесь загружается полная инфа о пользователе
                resdata.reply = createHardAuthInfo();
                connection.send(JSON.stringify(resdata));
                break;
            case "loadListOfDirectChats":
                // TODO: Загрузить список прямых чатов
                // Здесь загружается список всех прямых чатов с друзьями запрашивающего
                break;
            case "loadListOfMyRooms":
                // загружать список именно комнат в которых я состою
                break;
            case "loadStartupData":
                // loadListOfDirectChats, loadListOfMyRooms, loadFilteredAuthInfoDataOfMe
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
        connection.ping(null, false);
    });
}, 10000);

const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoClient.connect(function (err, client) {
    if (err) return console.log(err);

    dbClient = client;
    entities = client.db().collection("entities");
    messages = client.db().collection("messages");
    server.listen(port, function(){
        console.log("Сервер слушает");
    });
});
shutdownOn("SIGINT");
shutdownOn("SIGTERM");
