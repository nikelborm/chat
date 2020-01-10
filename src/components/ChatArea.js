import React, { Component } from 'react';
import MessagesList from "./MessagesList";
class ChatArea extends Component {
    constructor(props) {
        super(props);
        this.inputArea = React.createRef();
    }
    state = {
        msgList: [],
        isLoading: true
    };
    componentDidMount = () => {
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
                this.setState({
                    msgList: reply,
                    isLoading: false
                });
                this.props.chatHistoryIsLoaded(this);
            }
        });
    };
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
        // TODO: сделать подгрузку автоматической с помощью COMET
        const { msgList, isLoading } = this.state;
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
