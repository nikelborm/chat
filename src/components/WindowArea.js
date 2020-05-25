import React, { Component } from "react";
import InputForm from "./InputForm";
import MessagesList from "./MessagesList";
import MyAccountInfo from "./MyAccountInfo";

import ParticipantManager from "./ParticipantManager";
import RightTabs from "../layout/RightTabs";
import convertMessageTime from '../tools/convertMessageTime';
import parseMessageBody from '../tools/parseMessageBody';
import getCookie from "../tools/getCookie";
// import loader from "../tools/loader";

// const whyDidYouRender = require("@welldone-software/why-did-you-render");
// whyDidYouRender(React, {
//     trackAllPureComponents: true,
// });
// "@welldone-software/why-did-you-render": "^4.0.5",
class WindowArea extends Component {
    constructor(props) {
        super(props);
        this.cometCreated = false;
        this.isActiveChatHistoryLoaded = true;
        this.isUsersListInRoomDownloaded = false;
        this.myID = getCookie("myID") || "";
    }
    state = {
        // myRooms: JSON.parse(getCookie("rooms")) ,
        // activeChat: JSON.parse(getCookie("rooms")).length === 1 ? getCookie("rooms").slice(2,-2) : "",
        myRooms: ["global", "kolya_kun"],
        activeChat: "global",
        entities: {
            // это данные о сущностях, с которыми приходилось сталкиваться
            "5e81046b8aaba01b18c3e08c": {
                nickName: "eva_tyan",
                fullName: "Евангелина Рима",
                statusText : "В сети",
                avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                onlineStatus: "online"
                // rooms: ["global", "kolya_kun"] // Не все его комнаты, а только пересекающиеся cо мной
            },
            "5e826790eeef65222c60cb20": {
                nickName: "kolya_kun",
                fullName: "Коля",
                statusText : "В сети",
                avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                onlineStatus: "online",
                isHistoryDownloaded: true,
                isHistoryDownloadingNow: false,
                // rooms: ["global", "eva_tyan"] // Не все его комнаты, а только пересекающиеся cо мной
            },
            "5ec042332508d40843da029e": {
                nickName : "global",
                owner : "5e81046b8aaba01b18c3e08c",
                fullName : "Глобальный чат",
                regDate : new ISODate("2020-03-29T20:26:19.176Z"),
                description : "добро пожаловать в спокойное, мирное и уютное место.",
                avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                isExpanded: false,
                isUsersDownloaded: true,
                isUsersDownloadingNow: false,
                isHistoryDownloaded: true,
                isHistoryDownloadingNow: false,
                isDirect: false,
                isMuted: false
            }
        },
        directChats: {
            "5e826790eeef65222c60cb20" : this.state.entities["5e826790eeef65222c60cb20"]
        },
        rooms : {
            "5ec042332508d40843da029e" : this.state.entities["5ec042332508d40843da029e"]
        },
        chatsHistory: {
            "5e826790eeef65222c60cb20": {
                "5eca7e4337b3cc5b1e34278d" : {
                    authorId : "5e81046b8aaba01b18c3e08c",
                    // text : "qwe1",
                    // time : ISODate("2021-04-23T21:08:56.855Z"),
                    messageBody : ["qwe1"], // Распарсенное сообщение text
                    correctTime : "12 декабря 08:56" // Распарсенное время time
                },
                "5ecabef837b3cc5b1e342ef7" : {
                    author : "5e826790eeef65222c60cb20",
                    messageBody : ["qwe2"],
                    correctTime : "13 декабря 08:56"
                }
            },
            "5ec042332508d40843da029e": {
                "5e825fe8eeef65222c60cb1f" : {
                    author : "5e81046b8aaba01b18c3e08c",
                    messageBody : ["qweasdfsdf1"],
                    correctTime : "14 декабря 08:56"
                },
                "5ecabfb537b3cc5b1e342f19" : {
                    author : "5e826790eeef65222c60cb20",
                    messageBody : ["qweasdfsdf2"],
                    correctTime : "15 декабря 08:56"
                }
            }
        },
        usersInRooms: {
            "5ec042332508d40843da029e": {
                "5e826790eeef65222c60cb20" : this.state.entities["5e826790eeef65222c60cb20"],
                "5e81046b8aaba01b18c3e08c" : this.state.entities["5e81046b8aaba01b18c3e08c"],
            }
        },
        muted: ["5e826790eeef65222c60cb20"]
    };
    componentDidMount = () => {
        // if (this.state.activeChat) {
        //     this.loader("/loadChatHistory", "chatsHistory", "isActiveChatHistoryLoaded", this.state.activeChat);
        // }
        // for (const room of this.state.myRooms) {
        //     this.loader("/loadListOfUsersInChat", "usersInRooms", "isUsersListInRoomDownloaded", room);
        // } // А надо ли?
        // Код остаток, который ещё пригодится
        // const {reply, report} = data;
        // if (report.isError) {
        //     // TODO: Добавить обработку ошибок (можно с TIPPY)
        // } else {
        //     this[pasteSuccessIn] = true;
        //     this.setState((prevState) => {
        //         prevState[pasteReplyIn][room] = reply;
        //         return prevState;
        //     });
        // }
    };
    onSelectChat = async (room) => {
        console.log('onSelectChat: ', room);
        // TODO: Загрузка сообщений по конкретному чату
        // А после добавление их и новой активной комнаты в state
        if (this.state.roomsInfo[room].isHistoryDownloadingNow) {
            // вроде ничего не должны делать
            return;
        }
        if (!this.state.roomsInfo[room].isHistoryDownloaded) {
            // const {reply, report} = await loader("/загрузить историю конкретного чата", { room });
            // if (report.isError) {
            //     // TODO: Добавить обработку ошибок (можно с TIPPY)
            // } else {
            //     this[pasteSuccessIn] = true;
            //     this.setState((prevState) => {
            //         prevState[pasteReplyIn][room] = reply;
            //         return prevState;
            //     });
            // }
        } else {

        }
        this.setState((prevState) => {
            prevState.activeChat = room;
            return prevState;
        });

    };
    onExpandChange = (room) => {
        console.log('onExpandChange: ', room);
        // TODO: Загрузка пользователей по конкретному чату
        // isExpanded
        this.setState((prevState) => {
            prevState.roomsInfo[room].isExpanded = !prevState.roomsInfo[room].isExpanded;
            return prevState;
        });
    };
    onMuteChange = (room) => {
        console.log('onMuteChange: ', room);
        // TODO: Загрузка пользователей по конкретному чату
        // isMuted
        this.setState((prevState) => {
            prevState.roomsInfo[room].isMuted = !prevState.roomsInfo[room].isMuted;
            return prevState;
        });
    };
    onDeleteChat = (room) => {
        console.log('onDeleteChat: ', room);
    };
    createOrRespawnWebSocket = () => {
        const loc = document.location;
        const adress = (loc.protocol[4] === "s" ? "wss://": "ws://") + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);
        window.socket = new WebSocket(adress);
        window.socket.onopen = function (e) {
            window.isSocketAvailable = true;
            console.log("[open] Соединение установлено");
        };
        window.socket.onmessage = (event) => {
            console.log("[message] Сервер отправил сообщение. Отчёт: ", event);
            const data = JSON.parse(event.data);
            console.log("[message] Данные: ", data);
            switch (data.handlerType) {
                case "logs":
                    console.log("Пришли ответные логи: ", data.report);
                    break;
                case "message":
                    // TODO: Подумать о том, а загружен ли этот чат, чтобы в него что-нибудь вставлять?
                    this.setState((prevState) => {
                        prevState.chatsHistory[data.room][data.messageId] = {
                            author_info : prevState.knownUsers[data.authorId],
                            text : parseMessageBody(data.text),
                            time : convertMessageTime(data.time)
                        }
                        return prevState;
                    });
                    break;
                case "editMessage":
                    // TODO: При изменении сообщения, полностью создавать новый обьект сообщения, чтобы shouldComponentUpdate в MessagesList сработал
                    break;
                case "isOnline":
                case "isOffline":
                    if (this.state.knownUsers[data.id]) {
                        this.setState((prevState) => {
                            const status = data.handlerType === "isOnline" ? "online" : "offline";
                            prevState.knownUsers[data.id].onlineStatus = status;
                            return prevState;
                        });
                    } else {
                        // загружать инфу о нём не надо так как, если он не известен, то это значит, что мы ни разу не открыли список с ним и не видели ни одного его сообщения
                        console.log("Новый пользователь, которого мы не знаем");
                    }
                    break;
                case "newPersonInChat":
                    if (this.state.knownUsers[data.id]) {
                        this.setState((prevState) => {
                            prevState.knownUsers[data.id].rooms.push(data.room);
                            prevState.usersInRooms[data.room][data.id] = prevState.knownUsers[data.id];
                            return prevState;
                        });
                    } else {
                        this.setState((prevState) => {
                            prevState.knownUsers[data.id] = data.user;
                            return prevState;
                        });
                    }
                    break;
                default:
                    console.log("Неизвестный обработчик");
                    break;
            }
        };
        window.socket.onclose = (event) => {
            window.isSocketAvailable = false;
            console.log("[close] Соединение закрыто. Отчёт: ", event);
            window.socket = null;
            // this.componentDidMount();
            setTimeout(this.createOrRespawnWebSocket, 3000);
            // TODO: Добавить нарастающую задержку перед следующим переподключением
        };
        window.socket.onerror = function (error) {
            window.socket.close();
            window.isSocketAvailable = false;
            console.error("[error] Ошибка! Отчёт: ");
            console.log(error);
        };
    };
    componentDidUpdate = () => {
        // TODO: Прокачать это условие
        if (this.isActiveChatHistoryLoaded && this.isUsersListInRoomDownloaded && !this.cometCreated) {
            this.createOrRespawnWebSocket();
            this.cometCreated = true;
        }
    };
    render() {
        // TODO: Убрать лишние ререндеры у компонентов
        const {chatsHistory, usersInRooms, myRooms, activeChat, roomsInfo} = this.state;
        return (
            <div className="window-area">
                <div className="conversation-list">
                    <ParticipantManager
                        usersInRooms={usersInRooms}
                        myRooms={myRooms}
                        roomsInfo={roomsInfo}
                        onExpandChange={this.onExpandChange}
                        onMuteChange={this.onMuteChange}
                        onDeleteChat={this.onDeleteChat}
                        onSelectChat={this.onSelectChat}
                    />
                    <MyAccountInfo />
                </div>
                <div className="chat-area">
                    <div className="title">
                        <b> Переписка </b>
                        <i className="fa fa-search"></i>
                    </div>
                    <MessagesList
                        messages={activeChat ? chatsHistory[activeChat] : {}}
                        isLoading={!this.isActiveChatHistoryLoaded}
                        activeChat={activeChat}
                        myID={this.myID}
                    />
                    <InputForm/>
                </div>
                <RightTabs />
            </div>
        );
    }
}
export default WindowArea;
