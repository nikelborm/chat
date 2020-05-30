import React, { Component } from "react";
import Room from "./Room";
import DirectChat from "./DirectChat";

class ChatsList extends Component {
    render() {
        const { rooms, directChats, muted, entities, usersInRooms, onMuteChange, onExpandChange, onDeleteChat, onSelectChat } = this.props;
        const directChatsComponents = directChats.map(id => (
            <DirectChat
                key={id}
                id={id}
                isMuted={muted.includes(id)}
                nickName={entities[id].nickName}
                fullName={entities[id].fullName}
                onlineStatus={entities[id].onlineStatus}

                onMuteChange={onMuteChange}
                onDeleteChat={onDeleteChat}
                onSelectChat={onSelectChat}
            />
        ));
        const roomsComponents = rooms.map(id => (
            <Room
                key={id}
                id={id}
                muted={muted}
                entities={entities}
                usersInRooms={usersInRooms}

                onExpandChange={onExpandChange}
                onMuteChange={onMuteChange}
                onDeleteChat={onDeleteChat}
                onSelectChat={onSelectChat}
            />
        ));
        return (
            <ul>
                <li className="item header">
                    <i className="fa fa-list-alt"></i>
                    <span>Прямые чаты</span>
                </li>
                { directChatsComponents }
                <li className="item header">
                    <i className="fa fa-list-alt"></i>
                    <span>Комнаты</span>
                </li>
                { roomsComponents }
            </ul>
        );
    }
}
export default ChatsList;
