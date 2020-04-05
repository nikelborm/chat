import React, { Component } from "react";
import shallowEqual from "../tools/shallowEqual";

class Message extends Component {
    shouldComponentUpdate(nextProps) {
        // Если ссылки на сообщения разные
        return !shallowEqual(this.props.userInfo, nextProps.userInfo) ||
        this.props.messageBody !== nextProps.messageBody;
        // TODO: Сравнивать также параметры authorInfo и менять их если допустим чел только что сменил userName
    }
    render() {
        const { userID, userInfo, correctTime, messageBody, myID } = this.props;
        // TODO: Сделать чтобы имена пользователя и сообщения можно было редактировать
        // В принципе компонент уже готов к этому (Реализуется на сервере)
        // TODO: Сделать так, чтобы при наведении на div.name выводилась Tippy с инфой о пользователе
        return (
            <li className={(userID === myID) ? "me" : ""}>
                <div className="name">
                    <span className="">
                        {userInfo.userName}
                    </span>
                </div>
                <div className="message">
                    <p>
                        {messageBody}
                    </p>
                    <span className="msg-time">
                        {correctTime}
                    </span>
                </div>
            </li>
        );
    }
}
export default Message;
