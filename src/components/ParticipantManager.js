/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import ParticipantsList from "./ParticipantsList";
class ParticipantManager extends Component {
    render() {
        const { myRooms, usersInRooms, onShowUsersInRoom } = this.props
        const participants = myRooms.map((chatName) => (
            <ParticipantsList
            key={chatName}
            knownUsers={usersInRooms[chatName]}
            onShowUsersInRoom={onShowUsersInRoom}
            />
        ));
        return (
            <ul>
                <li className="item active">
                    <a href="#">
                        <i className="fa fa-list-alt"></i>
                        <span>Участники</span>
                    </a>
                </li>
                {participants}
            </ul>
        )
    }
}
export default ParticipantManager;