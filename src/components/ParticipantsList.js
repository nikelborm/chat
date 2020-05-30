import React, { Component, Fragment } from "react";
import Participant from "./Participant";

class ParticipantsList extends Component {
    render() {
        const { users, entities, isExpanded, onSelectChat } = this.props;
        const listOfParticipants = users.map(id =>
            <Participant
                id={id}
                nickName={entities[id].nickName}
                fullName={entities[id].fullName}
                onlineStatus={entities[id].onlineStatus}
                onSelectChat={onSelectChat}
            />
        );
        return (
            <Fragment>
                <ul className={isExpanded ? "" : "hidden"}>
                    {listOfParticipants}
                </ul>
                {!users.length && <strong>Загружается список участников комнаты...</strong>}
            </Fragment>
        );
    }
}
export default ParticipantsList;
