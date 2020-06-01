import React, { Component, Fragment } from "react";
import RoomHeader from "./RoomHeader";
import ParticipantsList from "./ParticipantsList";

class Room extends Component {
    render() {
        const { id, entities, users, isExpanded, isMuted } = this.props;
        return (
            <Fragment>
                <RoomHeader
                    id={id}
                    nickName={entities[id].nickName}
                    fullName={entities[id].fullName}
                    isExpanded={isExpanded}
                    isMuted={isMuted}
                />
                <ul className={isExpanded ? "" : "hidden"}>
                    <ParticipantsList
                        users={users}
                        entities={entities}
                        isExpanded={isExpanded}
                        isDownloaded={entities[id].isUsersDownloaded}
                    />
                    {/* TODO: нормально отображать подсказку */}
                    {entities[id].isHistoryDownloadingNow && <strong>Загружается список участников комнаты...</strong>}
                </ul>
            </Fragment>
        );
    }
}
export default Room;
