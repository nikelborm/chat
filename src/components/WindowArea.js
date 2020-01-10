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
        usersList: [],
        ischatHistoryLoaded: false,
        isUsersListInRoomDownloaded: false
    };
    componentDidMount = () => {
        this.loader("/loadChatHistory", "msgList", "ischatHistoryLoaded");
        this.loader("/loadListOfUsersInChat", "usersList", "isUsersListInRoomDownloaded");
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
            let socket = new WebSocket("ws://"+document.location.host);
            socket.onopen = function (e) {
                console.info("[open] Соединение установлено");
            };
            socket.onmessage = (event) => {
                console.info("[message] Данные получены с сервера:");
                const data = JSON.parse(event.data);
                console.log("Отчёт:")
                console.log(event)
                if (data.handlerType === "message") {
                    this.setState({
                        msgList: this.state.msgList.concat(data.message)
                    });
                }
            };
            socket.onclose = function (event) {
                console.info("[close] Соединение закрыто. Отчёт:");
                console.log(event);
            };
            socket.onerror = function (error) {
                console.error("[error] Ошибка! Отчёт:");
                console.log(error);
            };
            this.cometCreated = true;
        }
    };
    createCometConnection = () => {
        let socket = new WebSocket("wss://"+document.location.host);
        socket.onopen = function (e) {
            console.log("[open] Соединение установлено");
            // socket.send("Меня зовут Джон");
        };
        socket.onmessage = (event) => {
            console.log(`[message] Данные получены с сервера: ${event.data}`);
            const data = JSON.parse(event.data);
            if (data.handlerType === "message") {
                this.setState({
                    msgList: this.state.msgList.concat(data.message)
                });
            }
        };
        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log('[close] Соединение прервано');
            }
        };
        socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
        };
    };
    render() {
        const {msgList, ischatHistoryLoaded, usersList} = this.state;
        return (
            <div className="window-area">
                <ConversationList usersList={usersList}/>
                <ChatArea msgList={msgList} isLoading={!ischatHistoryLoaded}/>
                <RightTabs />
            </div>
        );
    }
}
export default WindowArea;
