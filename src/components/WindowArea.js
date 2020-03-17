import React, { Component } from "react";
import InputForm from "./InputForm";
import MessagesList from "./MessagesList";
import ParticipantsList from "./ParticipantsList";
import MyAccountInfo from "./MyAccountInfo";
import RightTabs from "./RightTabs";

// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React, {
//     trackAllPureComponents: true,
// });
class WindowArea extends Component {
    constructor(props) {
        super(props);
        this.cometCreated = false;
        this.ischatHistoryLoaded = false;
        this.isUsersListInRoomDownloaded = false;
    }
    state = {
        msgList: [],
        usersInGlobalRoom: {}
    };
    componentDidMount = () => {
        this.loader("/loadChatHistory", "msgList", "ischatHistoryLoaded");
        this.loader("/loadListOfUsersInChat", "usersInGlobalRoom", "isUsersListInRoomDownloaded");
    };
    loader = (path, pasteReplyIn, pasteSuccessIn) => {
        fetch(document.location.origin + path, {
            method: "post",
            body: JSON.stringify({ room: "global" }),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            const {reply, report} = data;
            if (!report.isError) {
                this[pasteSuccessIn] = true;
                this.setState({
                    [pasteReplyIn]: reply
                });
            }
        }); // TODO: Добавить обработку ошибки соединения (можно с TIPPY)
    };
    componentDidUpdate = () => {
        if (this.ischatHistoryLoaded && this.isUsersListInRoomDownloaded && !this.cometCreated) {
            const createOrRespawnWebSocket = () => {
                const protocol = document.location.protocol[4] === "s" ? "wss://": "ws://";
                window.socket = new WebSocket(protocol + document.location.host);
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
                            this.setState({
                                msgList: this.state.msgList.concat(data.message)
                            });
                            break;
                        case "isOnline":
                        case "isOffline":
                            if (this.state.usersInGlobalRoom[data._id]) {
                                this.setState((prevState) => {
                                    const status = data.handlerType === "isOnline" ? "online" : "offline";
                                    prevState.usersInGlobalRoom[data._id].onlineStatus = status;
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
                window.socket.onclose = function (event) {
                    window.isSocketAvailable = false;
                    console.log("[close] Соединение закрыто. Отчёт:");
                    console.log(event);
                    window.socket = null;
                    // this.componentDidMount();
                    setTimeout(createOrRespawnWebSocket, 3000);
                    // TODO: Добавить нарастающую задержку перед следующим переподключением
                };
                window.socket.onerror = function (error) {
                    window.socket.close();
                    window.isSocketAvailable = false;
                    console.error("[error] Ошибка! Отчёт:");
                    console.log(error);
                };
            };
            createOrRespawnWebSocket();
            this.cometCreated = true;
        }
    };
    render() {
        // TODO: Убрать лишние ререндеры у компонентов
        // TODO: Сделать чтобы рендерились так чтобы даже людей с одинаковыми никами можно было отличить
        // А основы авторства составлял уникальный ID ключ
        const {msgList, usersInGlobalRoom} = this.state;
        return (
            <div className="window-area">
                <div className="conversation-list">
                    <ParticipantsList usersList={usersInGlobalRoom} />
                    <MyAccountInfo />
                </div>
                <div className="chat-area">
                    <div className="title">
                        <b> Переписка </b>
                        <i className="fa fa-search"></i>
                    </div>
                    <MessagesList msgList={msgList} isLoading={!this.ischatHistoryLoaded} />
                    <InputForm/>
                </div>
                <RightTabs />
            </div>
        );
    }
}
export default WindowArea;
