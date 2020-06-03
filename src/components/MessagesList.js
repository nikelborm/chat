import React, { Component, createRef } from "react";
import Message from "./Message";
// import shallowEqual from "../tools/shallowEqual";

class MessagesList extends Component {
    constructor(props) {
        super(props);
        this.chatList = createRef();
        this.down = createRef();
    }
    // shouldComponentUpdate(nextProps) {
    //     return (
    //         this.props.activeChat !== nextProps.activeChat ||
    //         !shallowEqual(this.props.messages, nextProps.messages) ||
    //         this.props.isLoading !== nextProps.isLoading
    //     );
    //     // TODO: Как добавлю редактирование сообщений, прокачать это
    // }
    componentDidUpdate() {
        this.chatList.current.scrollTo(0, this.down.current.offsetTop);
    }
    render() {
        const { history, entities, activeChat, myID, isDownloading} = this.props;

        let info, msgList;

        if (!activeChat) {
            info = <strong>Пожалуйста выберите чат для отображения</strong>;
        } else if (isDownloading) {
            info = <strong>Сообщения загружаются, пожалуйста подождите</strong>;
        } else if (activeChat === myID) {
            info = <strong>Функцию сохранённых сообщений (избранное) мы скоро добавим)</strong>;
        } else if ( !history ) { // history !== {}: либо undefined либо со свойствами
            info = <strong>Сообщений нет. Напишите первым!</strong>;
        } else {
            msgList = Object.keys(history).map(msgID => (
                <Message
                    key={msgID}
                    authorID={history[msgID].authorID}
                    myID={myID}
                    nickName={entities[history[msgID].authorID].nickName}
                    correctTime={history[msgID].correctTime}
                    messageBody={history[msgID].messageBody}
                />
            ));
        }
        return (
            <div className="chat-list" ref={this.chatList}>
                {info ? info : <ul> {msgList} </ul>}
                <span ref={this.down}></span>
            </div>
        );
    }
}
export default MessagesList;
