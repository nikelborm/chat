import React, { Component } from 'react';
import MessagesList from "./MessagesList";
class ChatArea extends Component {
    constructor(props) {
        super(props);
        this.inputArea = React.createRef();
    }
    sendMsgInChat = (e) => {
        e.preventDefault();
        const data = {
            room: "global",
            message: this.inputArea.current.value
        };
        fetch(document.location.origin + '/sendMsgInChat', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        });
    };
    render() {
        const { msgList, isLoading } = this.props;
        return (
            <div className="chat-area">
                <div className="title">
                    <b> Переписка </b>
                    <i className="fa fa-search"></i>
                </div>
                <MessagesList msgList={msgList} isLoading={isLoading} />
                <form className="input-area">
                    <div className="input-wrapper">
                        <input type="text" defaultValue="" ref={this.inputArea}/>
                        <i className="fa fa-smile-o"></i>
                        <i className="fa fa-paperclip"></i>
                    </div>
                    <button onClick={this.sendMsgInChat} className="send-btn">{">"}</button>
                </form>
            </div>
        );
    }
}
export default ChatArea;
