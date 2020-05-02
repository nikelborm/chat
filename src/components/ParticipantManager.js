import React, { Component } from "react";
import ParticipantsList from "./ParticipantsList";
import Participant from './Participant';

class ParticipantManager extends Component {
    render() {
        const { myRooms, usersInRooms, roomsInfo, onMuteChange, onExpandChange, onDeleteChat, onSelectChat } = this.props;
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
                        onSelectChat={onSelectChat}
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
                        onSelectChat={onSelectChat}
                    />
                );
            }
        }
        return (
            <ul>
                { directChats.length
                    ? <li className="item header">
                        <i className="fa fa-list-alt"></i>
                        <span>Прямые чаты</span>
                    </li>
                    : ""
                }
                {directChats}
                { roomsParticipants.length
                    ? <li className="item header">
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