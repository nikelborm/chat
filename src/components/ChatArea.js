import React, { Component } from 'react';
import { MessagesList } from "./MessagesList";
import getElById from './getElById';
export class ChatArea extends Component {
    // constructor(props) {
    //     super(props);
    // }
    state = {
        msgList: [],
        isLoading: false
    };
    sendMsgInChat = () => {
        const data = {
            room: "global",
            message: getElById("inputArea").value
        };
        fetch(document.location.origin + '/sendMsgInChat', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            const {report} = data;
            if (!report.isError) {
            }
        });
    }
    componentDidMount() {
        const data = {
            room: "global"
        };
        fetch(document.location.origin + '/loadChatHistory', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            const {reply, report} = data;
            if (!report.isError && reply.length !== 0) {
                this.setState({ msgList: reply });
            }
        });
    }
    render() {
        // TODO: сделать подгрузку автоматической с помощью COMET
        const { msgList } = this.state;
        return (<div className="chat-area">
            <div className="title">
                <b> Переписка </b>
                <i className="fa fa-search"></i>
            </div>
            <MessagesList data={msgList} />
            <div className="input-area">
                <div className="input-wrapper">
                    <input type="text" defaultValue="" id="inputArea" />
                    <i className="fa fa-smile-o"></i>
                    <i className="fa fa-paperclip"></i>
                </div>
                <input type="button" defaultValue=">" id="send" onclick={this.sendMsgInChat} className="send-btn" />
            </div>
        </div>);
    }
}
