/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
function Message(props) {
    const { author, text, time, myName } = props.data;
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
    return (
        <li className={(author === myName) ? 'me' : ''}>
            <div className="name">
                <span className="">
                    {author}
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
export default Message;
