import React, { Component, createRef } from "react";
import Message from "./Message";
import getCookie from "./getCookie";
class MessagesList extends Component {
    constructor(props) {
        super(props);
        this.chatList = createRef();
        this.down = createRef();
    }
    componentDidUpdate() {
        this.chatList.current.scrollTo(0, this.down.current.offsetTop);
    }
    render() {
        const { msgList, isLoading } = this.props;
        let info;
        if (isLoading) {
            info = (<strong>Сообщения загружаются, пожалуйста подождите</strong>);
        } else if ( !msgList.length ){
            info = (<strong>Сообщений пока нет, но вы можете это исправить!</strong>);
        }
        const myID = getCookie("userName") || "";
        return (
            <div className="chat-list" ref={this.chatList}>
                <ul>
                    {msgList.map(({ _id, author: authorUserName, text, time }) => (
                        <Message
                            key={_id}
                            myID={myID}
                            authorID={authorUserName}
                            text={text}
                            time={time}
                        />
                    ))}
                </ul>
                {info}
                <span ref={this.down}></span>
            </div>
        );
    }
}
export default MessagesList;
