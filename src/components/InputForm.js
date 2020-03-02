import React, { Component } from 'react';
import Tippy from '@tippy.js/react';
import createEmojiToolTipBody from './createEmojiToolTipBody'

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/perspective.css';

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.inputArea = React.createRef();
        this.instanceRef = React.createRef();
        this.emojiPicker = createEmojiToolTipBody(this.chooseEmoji);
    }
    sendMsgInChat = (e) => {
        e.preventDefault();
        this.instanceRef.current.hide();
        const data = {
            room: "global",
            text: this.inputArea.current.value
        };
        this.inputArea.current.value = "";
        fetch(document.location.origin + '/sendMsgInChat', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        });
    };
    chooseEmoji = (emoji) => {
        this.inputArea.current.value += emoji;
    };
    render() {
        return (
            <form className="input-area">
                <div className="input-wrapper">
                    <input type="text" defaultValue="" ref={this.inputArea}/>
                    <Tippy
                        content={this.emojiPicker}
                        animation="perspective"
                        trigger="click"
                        theme="emoji"
                        interactive={true}
                        inertia={true}
                        arrow={false}
                        duration={[350, 200]}
                        onCreate={instance => (this.instanceRef.current = instance)}
                    >
                        <i className="fa fa-smile-o"></i>
                    </Tippy>
                    <i className="fa fa-paperclip"></i>
                </div>
                <button onClick={this.sendMsgInChat} className="send-btn">{">"}</button>
            </form>
        );
    }
}
export default InputForm;
