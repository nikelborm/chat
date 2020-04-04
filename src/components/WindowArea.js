import React, { Component } from "react";
import InputForm from "./InputForm";
import MessagesList from "./MessagesList";
import MyAccountInfo from "./MyAccountInfo";

import ParticipantManager from "./ParticipantManager";
import RightTabs from "./RightTabs";
import parseMessageTime from '../tools/parseMessageTime';
import parseMessageBody from '../tools/parseMessageBody';
import getCookie from "../tools/getCookie";

// const whyDidYouRender = require("@welldone-software/why-did-you-render");
// whyDidYouRender(React, {
//     trackAllPureComponents: true,
// });
// "@welldone-software/why-did-you-render": "^4.0.5",
class WindowArea extends Component {
    constructor(props) {
        super(props);
        this.cometCreated = false;
        this.isActiveChatHistoryLoaded = false;
        this.isUsersListInRoomDownloaded = false;
        this.myID = getCookie("myID") || "";
    }
    state = {
        myRooms: JSON.parse(getCookie("rooms")) ,
        activeChat: JSON.parse(getCookie("rooms")).length === 1 ? getCookie("rooms").slice(2,-2) : "",
        knownUsers: {
            longHexUserId0000000000000000: {
                userName: "eva_tyan",
                fullName: "Евангелина Рима",
                statusText : "В сети",
                avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                onlineStatus: "online",
                rooms: ["global"] // Не все его комнаты, а только пересекающиеся cо мной
            }
        },
        roomsInfo : {
            global: {
                isHidden: true,
                isUsersDownloaded: false,
                isHistoryDownloaded: false,
                isDirect: false,
                isMuted: false
            }
        },
        chatsHistory: {
            global: {
                longHexMessageId0000000000000000: {
                    authorInfo : {
                        userName: "eva_tyan",
                        fullName: "Евангелина Рима",
                        statusText : "В сети",
                        avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                        onlineStatus: "online",
                        rooms: ["global"] // Не все его комнаты, а только пересекающиеся cо мной
                    },// Вместо {} ссылка на knownUsers.longHexUserId0000000000000000
                    authorID: "longHexUserId0000000000000000",
                    text : ["qwe"], // Распарсенное сообщение
                    time : "12 декабря 08:56" // Распарсенное время
                }
            }
        },
        usersInRooms: {
            global: {
                longHexUserId0000000000000000: {
                    userName: "eva_tyan",
                    fullName: "Евангелина Рима",
                    statusText : "В сети",
                    avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
                    onlineStatus: "online",
                    rooms: ["global"] // Не все его комнаты, а только пересекающиеся cо мной
                }// Вместо {} ссылка на knownUsers.longHexUserId0000000000000000
            }
        }
    };
    componentDidMount = () => {
        // if (this.state.activeChat) {
        //     this.loader("/loadChatHistory", "chatsHistory", "isActiveChatHistoryLoaded", this.state.activeChat);
        // }
        // for (const room of this.state.myRooms) {
        //     this.loader("/loadListOfUsersInChat", "usersInRooms", "isUsersListInRoomDownloaded", room);
        // } // А надо ли?
    };
    loader = async (path, pasteReplyIn, pasteSuccessIn, room) => {
        let data;
        try {
            const response = await fetch(document.location.origin + path, {
                method: "post",
                body: JSON.stringify({ room }),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            });
            data = await response.json();
            console.log(data);
        } catch (error) {
            data = {
                report: {
                    isError: true,
                    info: "Ошибка при загрузке данных с " + path
                }
            };
            console.error(error);
        }

        const {reply, report} = data;
        if (report.isError) {
            // TODO: Добавить обработку ошибок (можно с TIPPY)
        } else {
            this[pasteSuccessIn] = true;
            this.setState((prevState) => {
                prevState[pasteReplyIn][room] = reply;
                return prevState;
            });
        }
    };
    onSelectChat = () => {
        // TODO: Загрузка сообщений по конкретному чату
        // А после добавление их и новой активной комнаты в state

    };
    onShowUsersInRoom = () => {
        // TODO: Загрузка пользователей по конкретному чату
    }
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
                    console.log("Пришли ответные логи: ", data.response);
                    break;
                case "message":
                    // TODO: Подумать о том, а загружен ли этот чат, чтобы в него что-нибудь вставлять?
                    this.setState((prevState) => {
                        prevState.chatsHistory[data.room][data.id] = {
                            author_info : prevState.knownUsers[data.message.authorId],
                            text : parseMessageBody(data.message.text),
                            time : parseMessageTime(data.message.time)
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
        const {chatsHistory, usersInRooms, myRooms, activeChat} = this.state;
        return (
            <div className="window-area">
                <div className="conversation-list">
                    <ParticipantManager
                        usersInRooms={usersInRooms}
                        myRooms={myRooms}
                        onShowUsersInRoom={this.onShowUsersInRoom}
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
