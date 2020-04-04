import React, { Component } from "react";

class Message extends Component {
    shouldComponentUpdate(nextProps) {
        // Если ссылки на сообщения разные
        return this.props.messageBody === nextProps.messageBody;
        // TODO: Сравнивать также параметры authorInfo и менять их если допустим чел только что сменил userName
    }
    render() {
        const { authorID, authorInfo, correctTime, messageBody, myID } = this.props;
        // TODO: Сделать чтобы имена пользователя и сообщения можно было редактировать
        // В принципе компонент уже готов к этому (Реализуется на сервере)
        // TODO: Сделать так, чтобы при наведении на div.name выводилась Tippy с инфой о пользователе
        return (
            <li className={(authorID === myID) ? "me" : ""}>
                <div className="name">
                    <span className="">
                        {authorInfo.userName}
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
