import React, { Component } from "react";
import ParticipantsList from "./ParticipantsList";
import Participant from './Participant';

class ParticipantManager extends Component {
    render() {
        const { myRooms, usersInRooms, roomsInfo, onMuteChange, onExpandChange, onDeleteChat } = this.props;
        let directChats = [];
        let roomsParticipants = [];

        for (const chatName of myRooms) {
            if (roomsInfo[chatName].isDirect) {
                directChats.push(
                    <Participant
                        key={roomsInfo[chatName].userId}
                        isDirect={true}
                        isMuted={roomsInfo[chatName].isMuted}
                        userInfo={roomsInfo[chatName].userInfo}
                        onMuteChange={onMuteChange}
                        onDeleteChat={onDeleteChat}
                    />
                );
            } else {
                roomsParticipants.push(
                    <ParticipantsList
                        key={chatName}
                        room={chatName}
                        usersInSpecificRoom={usersInRooms[chatName]}
                        specificRoomInfo={roomsInfo[chatName]}
                        onExpandChange={onExpandChange}
                        onMuteChange={onMuteChange}
                        onDeleteChat={onDeleteChat}
                    />
                );
            }
        }
        return (
            <ul>
                { directChats.length
                    ? <li className="item active">
                        <i className="fa fa-list-alt"></i>
                        <span>Прямые чаты</span>
                    </li>
                    : ""
                }
                {directChats}
                { roomsParticipants.length
                    ? <li className="item active">
                        <i className="fa fa-list-alt"></i>
                        <span>Комнаты</span>
                    </li>
                    : ""
                }
                {roomsParticipants}
            </ul>
        )
    }
}
export default ParticipantManager;