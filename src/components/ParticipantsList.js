import React, { Component } from "react";
import Participant from "./Participant";
import symmetricDifference from "../tools/symmetricDifference";

class ParticipantsList extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.isExpanded && nextProps.isDownloaded && !!symmetricDifference(nextProps.users, this.props.users).size;
    }
    render() {
        const { users, entities } = this.props;
        return Array.from(users, id => (
            <Participant
                id={id}
                key={id}
                nickName={entities[id].nickName}
                fullName={entities[id].fullName}
                onlineStatus={entities[id].onlineStatus}
            />
        ));
    }
}
export default ParticipantsList;
