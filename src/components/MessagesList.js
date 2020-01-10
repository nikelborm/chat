import React, { Component, createRef } from 'react';
import Message from './Message';
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
            info =(<strong>Сообщения загружаются, пожалуйста подождите</strong>)
        } else if ( !msgList.length ){
            info = (<strong>Сообщений пока нет, но вы можете это исправить!</strong>)
        }
        return (
            <div className="chat-list" ref={this.chatList} style={{overflowX: "hidden", overflowY: "scroll"}}>
                <ul>
                    {msgList.map((item) => <Message key={item._id} data={item} />)}
                </ul>
                {info}
                <span ref={this.down}></span>
            </div>
        );
    }
}
export default MessagesList;
