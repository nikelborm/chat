/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import Participant from "./Participant";

class ParticipantsList extends Component {
    render() {
        const { usersList } = this.props;
        let listOfParticipants = [];
        for (const userId in usersList) {
            let { userName, fullName, onlineStatus } = usersList[userId];
            listOfParticipants.push(
                <Participant
                    key={userId}
                    userName={userName}
                    fullName={fullName}
                    onlineStatus={onlineStatus}
                />
            );
        }
        return (
            <Fragment>
                <li className="item">
                    <a href="#">
                        <i className="fa fa-user"></i>
                        <span>Команда чата</span>
                        <i className="fa fa-times"></i>
                    </a>
                </li>
                <ul>
                    {listOfParticipants}
                </ul>
                {!listOfParticipants.length && <strong>Загружается список участников комнаты...</strong>}
            </Fragment>
        );
    }
}
export default ParticipantsList;
