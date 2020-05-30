import React, { Component } from "react";
import DirectChatsManager from "./DirectChatsManager";
import RoomsManager from "./RoomsManager";


class Chats extends Component {
    render() {
        const { rooms, directChats, muted, entities, usersInRooms, onMuteChange, onExpandChange, onDeleteChat, onSelectChat } = this.props;

        return (
            <ul>
                <DirectChatsManager
                    directChats={directChats}
                    muted={muted}
                    entities={entities}
                    onMuteChange={onMuteChange}
                    onDeleteChat={onDeleteChat}
                    onSelectChat={onSelectChat}
                />

                <RoomsManager
                    rooms={rooms}
                    muted={muted}
                    entities={entities}
                    usersInRooms={usersInRooms}
                    onMuteChange={onMuteChange}
                    onDeleteChat={onDeleteChat}
                    onSelectChat={onSelectChat}
                    onExpandChange={onExpandChange}
                />
            </ul>
        );
    }
}
export default Chats;
