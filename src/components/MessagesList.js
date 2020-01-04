import React, { Component } from 'react';
import { Message } from './Message';
export class MessagesList extends Component {
    render() {
        // $(function() { $('.chat-area > .chat-list').jScrollPane({ mouseWheelSpeed: 30 }); });
        const { data } = this.props;
        console.log(data);
        return (
            <div className="chat-list" ref={this.chatList}>
                <ul>
                    {data.map((item) => <Message key={item.id} data={item} />)}
                </ul>
                {!data.length && <strong>Сообщений пока нет, но вы можете это исправить!</strong>}
            </div>
        );
    }
}
