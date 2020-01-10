import React, { Component } from 'react';
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";
import RightTabs from "./RightTabs";
class WindowArea extends Component {
    chatHistoryIsLoaded = (childThis) => {
        let socket = new WebSocket("ws://"+document.location.host);
        socket.onopen = function (e) {
            console.log("[open] Соединение установлено");
            // socket.send("Меня зовут Джон");
        };
        socket.onmessage = (event) => {
            console.log(`[message] Данные получены с сервера: ${event.data}`);
            const data = JSON.parse(event.data);
            childThis.setState({ msgList: childThis.state.msgList.concat(data.message) });
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
        return (<div className="window-area">
            <ConversationList listOfUsers={[{userName:"Давид Барто", onlineStatus:"online"},{userName:"Сергей Бондарь", onlineStatus:"idle"},{userName:"Глеб Кавраский", onlineStatus:"offline"}]}/>
            <ChatArea chatHistoryIsLoaded={this.chatHistoryIsLoaded}/>
            <RightTabs />
        </div>);
    }
}
export default WindowArea;
