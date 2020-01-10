/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
function Participant(props) {
    const { userName, onlineStatus } = props.data;
    return (<li>
        <a href="#">
            <i className={"fa fa-circle-o " + onlineStatus}></i>
            <span>{userName}</span>
            <i className="fa fa-times"></i>
        </a>
    </li>);
}
export default Participant;
