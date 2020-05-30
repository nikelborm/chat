import React, { Component, Fragment } from "react";
import RoomHeader from "./RoomHeader";
import ParticipantsList from "./ParticipantsList";

class Room extends Component {
    render() {
        const { id, muted, entities, usersInRooms, onExpandChange, onMuteChange, onDeleteChat, onSelectChat } = this.props;
        const isExpanded = entities[id].isExpanded;
        return (
            <Fragment>
                <RoomHeader
                    id={id}
                    nickName={entities[id].nickName}
                    fullName={entities[id].fullName}
                    isExpanded={isExpanded}
                    isMuted={muted.includes(id)}

                    onSelectChat={onSelectChat}
                    onExpandChange={onExpandChange}
                    onDeleteChat={onDeleteChat}
                    onMuteChange={onMuteChange}
                />
                <ParticipantsList
                    users={usersInRooms[id]}
                    entities={entities}
                    isExpanded={isExpanded}
                    onSelectChat={onSelectChat}
                />
            </Fragment>
        );
    }
}
export default Room;
