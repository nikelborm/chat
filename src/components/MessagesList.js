import React, { Component, createRef } from "react";
import Message from "./Message";
import getCookie from "./getCookie";
class MessagesList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.activeChat !== nextProps.activeChat ||
            this.props.msgList.length !== nextProps.msgList.length ||
            this.props.isLoading !== nextProps.isLoading);
        // TODO: Как добавлю редактирование сообщений, прокачать это
    }
    constructor(props) {
        super(props);
        this.chatList = createRef();
        this.down = createRef();
    }
    componentDidUpdate() {
        this.chatList.current.scrollTo(0, this.down.current.offsetTop);
    }
    render() {
        const { msgList, isLoading, activeChat } = this.props;
        const myID = getCookie("userName") || "";
        let info, ulWithMsgs;

        if (!activeChat) {
            info = (<strong>Пожалуйста выберите чат для отображения</strong>);
        } else if (isLoading) {
            info = (<strong>Сообщения загружаются, пожалуйста подождите</strong>);
        } else if ( !msgList.length ){
            info = (<strong>Сообщений пока нет, но вы можете это исправить!</strong>);
        } else {
            ulWithMsgs = msgList.map(({ _id, author: authorUserName, text, time }) => (
                <Message
                    key={_id}
                    myID={myID}
                    authorID={authorUserName}
                    text={text}
                    time={time}
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
