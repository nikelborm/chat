/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Participant } from './Participant';
export class ParticipantsList extends Component {
    render() {
        const { listOfUsers } = this.props;
        return (
            <ul>
                <li className="item"><a href="#"><i className="fa fa-list-alt"></i><span>Участники</span></a></li>
                <li className="item active"><a href="#"><i className="fa fa-user"></i><span>Команда чата</span><i className="fa fa-times"></i></a></li>
                <ul>
                    {listOfUsers && listOfUsers.map((item) => <Participant key={item.id} data={item} />)}
                </ul>
                {!listOfUsers.length && <strong>Сообщений пока нет, но вы можете это исправить!</strong>}
            </ul>
        );
    }
}
