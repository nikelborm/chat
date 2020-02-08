import React, { Component } from 'react';
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";
import RightTabs from "./RightTabs";
class WindowArea extends Component {
    constructor(props) {
        super(props);
        this.cometCreated = false;
    }
    state = {
        msgList: [],
        usersInGlobalRoom: {},
        ischatHistoryLoaded: false,
        isUsersListInRoomDownloaded: false
    };
    componentDidMount = () => {
        this.loader("/loadChatHistory", "msgList", "ischatHistoryLoaded");
        this.loader("/loadListOfUsersInChat", "usersInGlobalRoom", "isUsersListInRoomDownloaded");
    };
    loader = (path, pasteReplyIn, pasteSuccessIn) => {
        fetch(document.location.origin + path, {
            method: 'post',
            body: JSON.stringify({ room: "global" }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            const {reply, report} = data;
            if (!report.isError) {
                this.setState({
                    [pasteReplyIn]: reply,
                    [pasteSuccessIn]: true
                });
            }
        });
    };
    componentDidUpdate = () => {
        if (this.state.ischatHistoryLoaded && this.state.isUsersListInRoomDownloaded && !this.cometCreated) {
            const protocol = document.location.protocol[4] === "s" ? "wss://": "ws://"
            let socket = new WebSocket(protocol + document.location.host);
            socket.onopen = function (e) {
                console.log("[open] Соединение установлено");
            };
            socket.onmessage = (event) => {
                console.log("[message] Данные получены с сервера:");
                const data = JSON.parse(event.data);
                console.log("Отчёт:")
                console.log(event)
                console.log(data)
                switch (data.handlerType) {
                    case "message":
                        this.setState({
                            msgList: this.state.msgList.concat(data.message)
                        });
                        break
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
                        break
                    case "newPersonInChat":
                        if (!this.state.usersInGlobalRoom[data.id]) {
                            this.setState((prevState) => {
                                prevState.usersInGlobalRoom[data.id] = data.user;
                                return prevState;
                            });
                        }
                        break
                    default:
                        console.log("Неизвестный обработчик");
                        break
                }
            };
            socket.onclose = function (event) {
                console.log("[close] Соединение закрыто. Отчёт:");
                console.log(event);
            };
            socket.onerror = function (error) {
                console.error("[error] Ошибка! Отчёт:");
                console.log(error);
            };
            this.cometCreated = true;
        }
    };
    render() {
        const {msgList, ischatHistoryLoaded, usersInGlobalRoom} = this.state;
        return (
            <div className="window-area">
                <ConversationList usersList={usersInGlobalRoom}/>
                <ChatArea msgList={msgList} isLoading={!ischatHistoryLoaded}/>
                <RightTabs />
            </div>
        );
    }
}
export default WindowArea;
