import React, { Component } from "react";
import InputForm from "./InputForm";
import MessagesList from "./MessagesList";
import ParticipantsList from "./ParticipantsList";
import MyAccountInfo from "./MyAccountInfo";
import RightTabs from "./RightTabs";
// import getCookie from "./getCookie";

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
    }
    state = {
        // myRooms: JSON.parse(getCookie("myRooms")) ,
        // activeChat: this.myRooms.length === 1 ? this.myRooms[0] : "",
        activeChat: "global",
        myRooms: ["global"],
        knownUsersList: {
            // longHexUserId0000000000000000: {
            //     userName: "eva_tyan",
            //     fullName: "Евангелина Рима",
            //     statusText : "В сети",
            //     avatarLink : "https://99px.ru/sstorage/1/2020/01/image_12201200001487843711.gif",
            //     onlineStatus: "online",
            //     rooms: ["global"] // Не все его комнаты, а только пересекающиеся
            // }
        },
        roomsInfo : {
            // global: {
            //     isDownloaded: false,
            //     isDirect: false,
            //     isMuted: false
            // }
        },
        chatsHistory: {
            // global: {
            //     longHexMessageId0000000000000000: {
            //         author_info : {},// Вместо {} ссылка на usersList.longHexUserId0000000000000000
            //         text : ["qwe"], // Распарсенное сообщение
            //         time : "2020-03-30T21:08:56.855Z"
            //     }
            // }
        },
        usersInRooms: {
            // global: {
            //     longHexUserId0000000000000000: {}// Вместо {} ссылка на usersList.longHexUserId0000000000000000
            // }
        }
    };
    componentDidMount = () => {
        if (this.state.activeChat) {
            this.loader("/loadChatHistory", "chatsHistory", "isActiveChatHistoryLoaded", this.state.activeChat);
        }
        for (const room of this.state.myRooms) {
            this.loader("/loadListOfUsersInChat", "usersInRooms", "isUsersListInRoomDownloaded", room);
        }
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
    createOrRespawnWebSocket = () => {
        const loc = document.location;
        const adress = (loc.protocol[4] === "s" ? "wss://": "ws://") + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);
        window.socket = new WebSocket(adress);
        window.socket.onopen = function (e) {
            window.isSocketAvailable = true;
            console.log("[open] Соединение установлено");
        };
        window.socket.onmessage = (event) => {
            console.log("[message] Данные получены с сервера:");
            const data = JSON.parse(event.data);
            console.log("Отчёт:");
            console.log(event);
            console.log(data);
            switch (data.handlerType) {
                case "logs":
                    console.log("Пришли ответные логи");
                    console.log(data.response);
                    break;
                case "message":
                    this.setState((prevState) => {
                        prevState.chatsHistory[data.room][data.id] = data.message
                        return prevState;
                    });
                    break;
                case "isOnline":
                case "isOffline":
                    if (this.state.usersList[data.id]) {
                        this.setState((prevState) => {
                            const status = data.handlerType === "isOnline" ? "online" : "offline";
                            prevState.usersList[data.id].onlineStatus = status;
                            return prevState;
                        });
                    } else {
                        console.log("Новый пользователь, которого мы не знаем");
                    }
                    break;
                case "newPersonInChat":
                    if (!this.state.usersInGlobalRoom[data.id]) {
                        this.setState((prevState) => {
                            prevState.usersInGlobalRoom[data.id] = data.user;
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
            console.log("[close] Соединение закрыто. Отчёт:");
            console.log(event);
            window.socket = null;
            // this.componentDidMount();
            setTimeout(this.createOrRespawnWebSocket, 3000);
            // TODO: Добавить нарастающую задержку перед следующим переподключением
        };
        window.socket.onerror = function (error) {
            window.socket.close();
            window.isSocketAvailable = false;
            console.error("[error] Ошибка! Отчёт:");
            console.log(error);
        };
    };
    componentDidUpdate = () => {
        if (this.isActiveChatHistoryLoaded && this.isUsersListInRoomDownloaded && !this.cometCreated) {
            this.createOrRespawnWebSocket();
            this.cometCreated = true;
        }
    };
    render() {
        // TODO: Убрать лишние ререндеры у компонентов
        // TODO: Сделать чтобы рендерились так чтобы даже людей с одинаковыми никами можно было отличить
        // А основы авторства составлял уникальный ID ключ
        const {chatsHistory, usersInRooms, myRooms, activeChat} = this.state;
        return (
            <div className="window-area">
                <div className="conversation-list">
                    {myRooms.map((chatName) => (
                        <ParticipantsList key={chatName} usersList={usersInRooms[chatName]} />
                    ))}
                    <MyAccountInfo />
                </div>
                <div className="chat-area">
                    <div className="title">
                        <b> Переписка </b>
                        <i className="fa fa-search"></i>
                    </div>
                    <MessagesList
                        msgList={activeChat ? chatsHistory[activeChat] : []}
                        isLoading={!this.isActiveChatHistoryLoaded}
                        activeChat={activeChat}
                    />
                    <InputForm/>
                </div>
                <RightTabs />
            </div>
        );
    }
}
export default WindowArea;
