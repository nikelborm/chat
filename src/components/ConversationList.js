import React from 'react';
import ParticipantsList from './ParticipantsList';
import MyAccountInfo from './MyAccountInfo';
function ConversationList(props) {
    const { listOfUsers } = props;
    return (
        <div className="conversation-list">
            <ParticipantsList listOfUsers={listOfUsers} />
            <MyAccountInfo />
        </div>
    );
}
export default ConversationList;
