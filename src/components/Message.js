import React from 'react';
import getCookie from './getCookie';
function Message(props) {
    const { author, text, time } = props.data;
    const myName = getCookie("userName");
    return (
        <li className={(author === myName) ? 'me' : ''}>
            <div className="name">
                <span className="">
                    {author}
                </span>
            </div>
            <div className="message">
                <p>
                    {text.replace(/@(\w{1,50})/g, '<a href="domain.com/$1">$&</a>').replace(/#[\wА-Яа-яЁё]{1,50}/g, '<a href="#" class="hashtag">$&</a>')}
                    {/* TODO: Заставить эту хрень работать как положено */}
                </p>
                <span className="msg-time">
                    {/* TODO: организовать работу со временем */}
                    {time}
                </span>
            </div>
        </li>
    );
}
export default Message;
