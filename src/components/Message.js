/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from "react";

class Message extends PureComponent {
    render() {
        // TODO: Сделать сообщения редактируемыми
        const { authorID, text, time, myID } = this.props;
        const correctTime = new Intl.DateTimeFormat("ru",{month:"long",day:"numeric",hour:"numeric",minute:"numeric",timeZone:"Europe/Moscow"}).format(Date.parse(time));
        let last = 0;
        let results = [];
        for (const match of text.matchAll(/[#@]([\w\dА-Яа-яЁё]{1,50})/g)) {
            last !== match.index && results.push(text.slice(last, match.index));
            if (match[0][0] === "#") {
                results.push(<a href="#" className="hashtag">{match[0]}</a>);
            } else {
                results.push(<span className="blue-label">{match[0]}</span>);
            }
            last = match.index + match[0].length;
        }
        results.push(text.slice(last));
        // TODO: Изменить так, чтобы сравнивалось с authotID
        // TODO: Сделать чтобы имена пользователя можно было менять
        // TODO: В этом случае нужно сделать, чтобы имена авторов динамично подгружались и всегда соответствовали ID
        return (
            <li className={(authorID === myID) ? "me" : ""}>
                <div className="name">
                    <span className="">
                        {authorID}{/* Должно быть autorUserName*/}
                    </span>
                </div>
                <div className="message">
                    <p>
                        {results}
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
