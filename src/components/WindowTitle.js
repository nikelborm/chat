import React, { Component } from 'react';
import { Search } from "./Search";
export class WindowTitle extends Component {
    render() {
        return (<div className="window-title">
            <div className="dots">
                <i className="fa fa-circle"></i>
                <i className="fa fa-circle"></i>
                <i className="fa fa-circle"></i>
            </div>
            <Search />
            <div className="expand">
                <i className="fa fa-expand"></i>
            </div>
        </div>);
    }
}
