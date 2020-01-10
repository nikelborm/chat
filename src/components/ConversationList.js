import React from 'react';
import ParticipantsList from './ParticipantsList';
import MyAccountInfo from './MyAccountInfo';
function ConversationList(props) {
    const { usersList } = props;
    return (
        <div className="conversation-list">
            <ParticipantsList usersList={usersList} />
            <MyAccountInfo />
        </div>
    );
}
export default ConversationList;
