import React, { Component, Fragment } from "react";
import Participant from "./Participant";

class ParticipantsList extends Component {
    render() {
        const { usersInSpecificRoom, onExpandChange, room, specificRoomInfo, onMuteChange, onDeleteChat, onSelectChat } = this.props;
        const listOfParticipants = Object.keys(usersInSpecificRoom).map((userId) => (
            <Participant
                key={userId}
                isDirect={false}
                userInfo={usersInSpecificRoom[userId]}
            />
        ));
        return (
            <Fragment>
                <li className="item" onClick={onSelectChat.bind(undefined, room)}>
                    <i className="fas fa-user-alt"></i>
                    <span>{room}</span>
                    <i
                        className={"fa fa-angle-down" + (specificRoomInfo.isExpanded ? " reversed": "")}
                        onClick={onExpandChange.bind(undefined, room)}
                    />
                    <i
                        className="far fa-trash-alt"
                        onClick={onDeleteChat.bind(undefined, room)}
                    />
                    <i
                        className={"far fa-bell" + (specificRoomInfo.isMuted ? "-slash": "")}
                        onClick={onMuteChange.bind(undefined, room)}
                    />
                </li>
                <ul className={specificRoomInfo.isExpanded ? "": "hidden"}>
                    {listOfParticipants}
                </ul>
                {!listOfParticipants.length && <strong>Загружается список участников комнаты...</strong>}
            </Fragment>
        );
    }
}
export default ParticipantsList;
