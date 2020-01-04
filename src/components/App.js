import React, { Component } from 'react';
import { WindowArea } from "./WindowArea";
import { WindowTitle } from "./WindowTitle";
export class App extends Component {
    state = {
        myName: "rrr"
    }
    componentDidMount() {
        //     this.setState({
        //         myName : document.getElementById('myName').textContent
        //     });
        // cometApi.start({dev_id:2375,/* user_id:1, user_key:"userHash",*/ node:"app.comet-server.ru"});
    }
    render() {
        return (
            <React.Fragment>
                <WindowTitle />
                <WindowArea />
            </React.Fragment>
        );
    }
}
