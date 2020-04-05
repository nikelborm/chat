import React, { Component, createRef } from "react";
import Message from "./Message";
import shallowEqual from "../tools/shallowEqual";

class MessagesList extends Component {
    constructor(props) {
        super(props);
        this.chatList = createRef();
        this.down = createRef();
    }
    shouldComponentUpdate(nextProps) {
        console.log('this.props.messages, nextProps.messages: ', this.props.messages, nextProps.messages);
        console.log(shallowEqual(this.props.messages, nextProps.messages));
        console.log('this.props.activeChat !== nextProps.activeChat: ', this.props.activeChat !== nextProps.activeChat);
        console.log('this.props.isLoading !== nextProps.isLoading: ', this.props.isLoading !== nextProps.isLoading);
        return (
            this.props.activeChat !== nextProps.activeChat ||
            !shallowEqual(this.props.messages, nextProps.messages) ||
            this.props.isLoading !== nextProps.isLoading
        );
        // TODO: Как добавлю редактирование сообщений, прокачать это
    }
    componentDidUpdate() {
        this.chatList.current.scrollTo(0, this.down.current.offsetTop);
    }
    render() {
        const { messages, isLoading, activeChat, myID} = this.props;

        let info, ulWithMsgs;

        if (!activeChat) {
            info = (<strong>Пожалуйста выберите чат для отображения</strong>);
        } else if (isLoading) {
            info = (<strong>Сообщения загружаются, пожалуйста подождите</strong>);
        } else if ( !Object.keys(messages).length ){
            info = (<strong>Сообщений пока нет, но вы можете это исправить!</strong>);
        } else {
            // longHexMessageId0000000000000000: {
            //     authorInfo : {},// Вместо {} ссылка на knownUsers.longHexUserId0000000000000000
            //     authorID: "longHexUserId0000000000000000",
            //     text : ["qwe"], // Распарсенное сообщение
            //     time : "12 декабря 08:56" // Распарсенное время
            // }
            ulWithMsgs = Object.keys(messages).map((msgId) => (
                <Message
                    key={msgId}
                    myID={myID}
                    userID={messages[msgId].userID}
                    userInfo={messages[msgId].userInfo}
                    messageBody={messages[msgId].messageBody}
                    correctTime={messages[msgId].correctTime}
                />
            ));
            ulWithMsgs = <ul> {ulWithMsgs} </ul>;
        }
        return (
            <div className="chat-list" ref={this.chatList}>
                {info ? info : ulWithMsgs}
                <span ref={this.down}></span>
            </div>
        );
    }
}
export default MessagesList;
