/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { TabsContainer } from "./TabsContainer";
// Вообще как бы планировалось сделать его с состоянием и дополняемым
export class RightTabs extends Component {
    render() {
        return (
            <div className="right-tabs">
                <ul className="tabs">
                    <li className="active">
                        <a href="#"><i className="fa fa-users"></i></a>
                    </li>
                    <li><a href="#"><i className="fa fa-paperclip"></i></a></li>
                    <li><a href="#"><i className="fa fa-link"></i></a></li>
                </ul>
                <TabsContainer />
                <i className="fa fa-cog"></i>
            </div>
        );
    }
}
