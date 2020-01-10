/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Participant from './Participant';
function ParticipantsList(props) {
    const { listOfUsers } = props;
    return (
        <ul>
            <li className="item"><a href="#"><i className="fa fa-list-alt"></i><span>Участники</span></a></li>
            <li className="item active"><a href="#"><i className="fa fa-user"></i><span>Команда чата</span><i className="fa fa-times"></i></a></li>
            <ul>
                {listOfUsers && listOfUsers.map((item) => <Participant key={item.id} data={item} />)}
            </ul>
            {!listOfUsers.length && <strong>Участников нет! (очень странно)</strong>}
        </ul>
    );
}
export default ParticipantsList;
