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
        //         // $(function() { $('.chat-area > .chat-list').jScrollPane({ mouseWheelSpeed: 30 }); });
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
        // send_JSON_to_server({target: "load"}, 'chat_handler.php', loadCallBack);
        this.setState({ msgList: [
            {
                author: 'rrr',
                text: "<span class='blue-label'>Kristi Galeeva</span> I see what you did there.",
                time: '4:20 am'
            },
            {
                author: 'rrr',
                text: "Hey, do you like the new interface? It's done with Font Awesome",
                time: '4:20 am'
            },
            {
                author: 'TEST',
                text: "Hey, do you like the new interface? It's done with Font Awesome, ",
                time: '4:20 am'
            },
            {
                author: 'TEST',
                text: "<span class='blue-label'>Kristi Galeeva</span> I see what you did there.",
                time: '4:20 am'
            },
            {
                author: 'CLEANER',
                text: '☺☺☺☺☺☺☺☺',
                time: '4:20 am'
            }
        ] });
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
