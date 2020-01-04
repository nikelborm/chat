import React from 'react';
export function Message(props) {
    const { author, text, time } = props.data;
    return (<li className={('rrr' === author) ? 'me' : ''}>
        <div className="name">
            <span className="">
                {author}
            </span>
        </div>
        <div className="message">
            <p>
                {text}
            </p>
            <span className="msg-time">
                {time}
            </span>
        </div>
    </li>);
}
