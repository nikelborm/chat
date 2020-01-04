import React, { Component } from 'react';
import { ParticipantsList } from './ParticipantsList';
import { MyAccountInfo } from './MyAccountInfo';
export class ConversationList extends Component {
    render() {
        const { listOfUsers } = this.props;
        return (
            <div className="conversation-list">
                <ParticipantsList listOfUsers={listOfUsers} />
                <MyAccountInfo />
            </div>
        );
    }
}
