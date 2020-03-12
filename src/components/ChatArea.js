import React, { Component } from "react";
import InputForm from "./InputForm";
import MessagesList from "./MessagesList";
class ChatArea extends Component {
    render() {
        const { msgList, isLoading } = this.props;
        return (
            <div className="chat-area">
                <div className="title">
                    <b> Переписка </b>
                    <i className="fa fa-search"></i>
                </div>
                <MessagesList msgList={msgList} isLoading={isLoading} />
                <InputForm/>
            </div>
        );
    }
}
export default ChatArea;
