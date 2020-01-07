import React, { Component } from 'react';
import { MessagesList } from "./MessagesList";
export class ChatArea extends Component {
    // constructor(props) {
    //     super(props);
    // }
    state = {
        msgList: [],
        isLoading: false
    };
    componentDidMount() {
        // eslint-disable-next-line no-unused-vars
        const subThis = this;
        // var loadCallBack = function() {
        //     // this это обьект xhr внутри send_JSON_to_server с коллбэком (3-й параметр) на обработке состояния запроса
        //     // subThis это всплывающий контекст компонента
        //     const {report, reply} = JSON.parse(this.responseText);
        //     if (report.status) {
        //         console.info("Отчёт об успехе: " + report.text + " Код состояния: " + report.code);
        //         subThis.setState({
        //             msgList: reply
        //         });
        //         const block = subThis.chatList.current;
        //         block.scrollTop = block.scrollHeight;
        //         cometApi.subscription("globalChat.messages", (e) => {
        //             // console.log(e);
        //             subThis.setState({
        //                 msgList: subThis.state.msgList.concat(e)
        //             });
        //             const block = subThis.chatList.current;
        //             block.scrollTop = block.scrollHeight;
        //         });
        //     } else {
        //         console.error("Отчёт об ошибке: " + report.text + " Код состояния: " + report.code);
        //     }
        // };
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
                <input type="button" defaultValue="Ввод" id="send" className="send-btn" />
            </div>
        </div>);
    }
}
