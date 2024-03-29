/* eslint-disable default-case */
const { validate1lvl, validate2lvl } = require("./functions/validate");
const { createHardAuthInfo, createLiteAuthInfo } = require("./functions/compressAuthInfo");
const { createEmptyResponseData } = require("./functions/createEmptyResponseData");
const { randomString } = require("./functions/randomString");
const { isAllStrings } = require("./functions/isAllStrings");
const { fillCookies } = require("./functions/fillCookies");
const { logout } = require("./functions/logout");
const { hasIntersections } = require("./functions/intersection");

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

function sendItToUsersWhoKnowMe({ rooms, directChats }, message) {
    // * Отправляет сообщение всем пользователям, кто сейчас подключён к вебсокету и кому это сообщение играет хоть какое либо значение,
    // * например онлайн статусы идут тем кто в моих прямых чатах или состоит в одной из моих групп, ведь я потенциально могу его увидеть
    WSServer.clients.forEach(function (client) {
        if ( directChats.has(client.authInfo.id) || hasIntersections(client.authInfo.rooms, rooms)) {
            client.send(JSON.stringify(message));
        }
    });
}
function sendItToUsersInRoom(roomID, message) {
    // * Отправляет сообщение всем участникам комнаты
    WSServer.clients.forEach(function (client) {
        if ( client.authInfo.rooms.has(roomID)) {
            client.send(JSON.stringify(message));
            return;
        }
    });
}
function sendItToSpecificUser(userID, message) {
    // * Отправляет сообщение конкретному пользователю
    for (const client of WSServer.clients) {
        if ( client.authInfo.id === userID ) {
            client.send(JSON.stringify(message));
            return;
        }
    }
}
function onCloseWSconnection(myAuthInfo) {
    const userID = myAuthInfo._id;
    if (activeUsersCounter[userID] === 1) {
        delete activeUsersCounter[userID];
        sendItToUsersWhoKnowMe(myAuthInfo, {handlerType: "offline", userID});
    } else {
        activeUsersCounter[userID]--;
    }
}
function onAccessWSconnection(myAuthInfo) {
    const userID = myAuthInfo._id;
    if (!activeUsersCounter[userID]) {
        activeUsersCounter[userID] = 1;
        sendItToUsersWhoKnowMe(myAuthInfo, {handlerType: "online", userID});
        // TODO: Отправить новичку инфу о том кто он?
    } else {
        activeUsersCounter[userID]++;
    }
}

function redirectIfNecessary(target, request, response) {
    if (!!request.session.authInfo !== (target === "/")) {
        response.sendFile(path.join(__dirname, target === "/" ? "authorize/index.min.html" : "build/index.html"));
    } else {
        response.redirect(target === "/" ? "/chat" : "/");
    }
}
function shutdown() {
    let haveErrors = false;
    console.log("Exiting...\n\nClosing WebSocket server...");
    clearInterval(cleaner);
    WSServer.close((err) => {
        if (err) {console.log(err);haveErrors = true;}
        console.log("WebSocket server closed.\n\nClosing Redis connection...");
        redisClient.quit((err) => {
            if (err) {console.log(err);haveErrors = true;}
            console.log('Redis connection closed.\n\nClosing MongoDb connection...');
            if (dbClient) {
                dbClient.close(false, (err) => {
                    if (err) {console.log(err);haveErrors = true;}
                    console.log('MongoDb connection closed.\n\nClosing http server...');
                    if (server.listening) {
                        server.close((err) => {
                            if (err) {console.log(err);haveErrors = true;}
                            console.log('Http server closed.\n');
                            process.exit(~~haveErrors);
                        });
                    } else {
                        console.log('Http server not started.\n');
                        process.exit(1);
                    }
                });
            } else {
                console.log('MongoDb not started.\n\nClosing http server...\nHttp server not started.');
                process.exit(1);
            }
        });
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
const redisClient = redis.createClient(redisLink);
const store = new RedisStorage({
    client: redisClient
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// TODO: Проверять не слишком ли большие данные, чтобы долго их не обрабатывать
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
            rp.info = "Вы не перешли по ссылке из письма (не подтвердили почту). Если письма нет даже в папке спам, обратитесь к администратору.";
        }
        if (rp.info) return;

        const { fullName, avatarLink } = request.session.authInfo = result;
        resdata.reply = { fullName, avatarLink };
        fillCookies(response, result, "nickName", "fullName", "statusText", "_id");
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
    entities.findOne({isRoom: false, _id, secureToken })
    .then((result) => {
        if (!result) return;
        request.session.authInfo = result;
        fillCookies(response, result, "nickName", "fullName", "statusText", "_id");
        page = "/chat";
        return entities.updateOne( { _id }, {
            // $addToSet: { rooms: тут можно добавить что-нибудь к любому массиву },
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
// TODO: Поправить всё, что связано с аватаром пользователя, так как обновилось в базе данных
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
            regDate: new Date(),
            statusText: "В сети", // TODO: Подумать над этим
            avatarStyle: { // TODO: Добавить возможность выбора аватара
                avatarLink: "",
                backgroundSize: "",
                backgroundPosition: ""
            },
            rooms: [],
            directChats: [],
            muted: [],
            secureToken: randomString(32),
            emailConfirmed: false
        };
        if (!result) {
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
        const pattern = (arg1, arg2 = "") => `Аккаунт с ${arg1} уже был создан, но не подтверждён. Мы отправим письмо повторно${arg2}. Если вы его не получите, проверьте спам или укажите почту другого сервиса.`;
        if (result.nickName === nickName) {
            if (result.email === email) {
                rp.info = pattern("указанными ником и почтой");
            } else {
                rp.info = pattern("указанным ником, но другой почтой", ", но уже на новый адрес");
            }
        } else {
            // (result.email === email)
            rp.info = pattern("этой почтой, но другим ником");
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
// TODO: Добавить функцию добавления комнаты или юзера в чёрный список по id-шнику естественно
const server = http.createServer(app);
const WSServer = new WebSocket.Server({
    server
});
WSServer.on("connection", (connection, request) => {
    connection.on("close", () => {
        onCloseWSconnection(connection.authInfo);
    });
    connection.isAlive = true;
    const cookies = cookie.parse(request.headers.cookie);
    const sid = "" + cookieParser.signedCookie(cookies["connect.sid"], secretKey);
    // TODO: Подумать над тем, что сообщение может начать обрабатываться до то того как редис вернёт запись для валидации
    store.get(sid, (err, session) => {
        if (err) console.log(err);

        if (!session || !session.authInfo || err) {
            let { resdata, rp } = createEmptyResponseData();
            rp.info = "Вы не авторизованы!";
            connection.send(JSON.stringify(resdata));
            connection.terminate();
        } else {
            const { rooms, directChats, ...rest } = session.authInfo;
            connection.authInfo = {
                ...rest,
                rooms: new Set(rooms),
                directChats: new Set(directChats)
            };
            onAccessWSconnection(connection.authInfo);
        }
    });
    connection.on("pong", () => {
        connection.isAlive = true;
    });
    connection.on("message", async (input) => {
        const { authInfo } = connection;
        // TODO: Проверять не слишком ли большие данные, чтобы долго их не обрабатывать
        const { handlerType, room, text, to } = JSON.parse(input.toString());
        console.log('Пришло в ws: ', JSON.parse(input.toString()));
        let { resdata, rp } = validate2lvl(handlerType === "message" ? { to, text } : { room }, authInfo);
        resdata.handlerType = handlerType;

        if (rp.info) return connection.send(JSON.stringify(resdata));

        switch (handlerType) {
            case "message":
                let message = {
                    to,
                    authorID: authInfo.nickName,
                    text,
                    time: new Date()
                };
                try {
                    const result = await entities.findOne({ _id: new ObjectId(to)});
                    if (!result) {
                        throw new Error("Чат не найден.");
                    }
                    message.isDirect = !result.isRoom;
                    if (result.isRoom && !authInfo.rooms.has(to)) {
                        throw new Error("У вас нет прав для отправки сообщения в эту комнату.");
                    }
                    if (!result.isRoom && !authInfo.directChats.has(to)) {
                        // TODO: Вызвать функцию, которая добавит id-шники обоим собеседникам в свои directChats в БД, в cессию, в connection и отправит уведомления этим двум пользователям
                    }

                    const msgID = (await messages.insertOne(message)).ops[0]._id;
                    rp.info = "Сообщение успешно отправлено";
                    rp.isError = false;
                    resdata.reply = { msgID };

                    WSServer.clients.forEach(function (client) {
                        if (client.authInfo.rooms.has(room)) {
                            client.send(JSON.stringify({handlerType: "message", msgID, ...message}));
                        }
                    });
                } catch (err) {
                    console.log(err);
                    rp.info = err.message;
                }
                connection.send(JSON.stringify(resdata));
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
                        const { user, id } = createLiteAuthInfo(doc, activeUsersCounter);
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

                // notifyAboutNewUserInRoom(authInfo, roomID);
                // const { user, id } = createHardAuthInfo(newAuthInfo, activeUsersCounter);
                // WSServer.clients.forEach(function (client) {
                //     if (client.authInfo.rooms.has(room)) {
                //         client.send(JSON.stringify({handlerType: "newUserInRoom", userID: id, user, roomID: }));
                //     }
                // });
                break;
            case "loadFilteredAuthInfoData":
                // TODO: обязательно проверять а знаком ли этот пользователь со вторым (хотя над этим ещё подумать надо)
                // Здесь загружается полная инфа о пользователе
                resdata.reply = createHardAuthInfo(authInfo, activeUsersCounter);
                connection.send(JSON.stringify(resdata));
                break;
            case "loadListOfDirectChats":
                // TODO: Загрузить список прямых чатов
                // Здесь загружается список всех прямых чатов с друзьями запрашивающего
                break;
            case "loadListOfMyRooms":
                // TODO: загружать список именно комнат в которых я состою
                break;
            case "loadStartupData":
                // TODO: loadListOfDirectChats, loadListOfMyRooms, loadFilteredAuthInfoDataOfMe
        }
    });
});
const cleaner = setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    WSServer.clients.forEach((connection) => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
            onCloseWSconnection(connection.authInfo);
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
mongoClient.connect((err, client) => {
    if (err) {
        console.log(err);
        return shutdown();
    }

    dbClient = client;
    entities = client.db().collection("entities");
    messages = client.db().collection("messages");
    server.listen(port, function(){
        console.log("Сервер слушает");
    });
});
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
