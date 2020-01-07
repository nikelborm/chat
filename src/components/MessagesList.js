import React, { Component, createRef } from 'react';
import { Message } from './Message';
import $ from "jquery";
import "jscrollpane";
import "jquery-mousewheel";
export class MessagesList extends Component {
    constructor(props) {
        super(props);
        this.chatList = createRef()
    }

    componentDidUpdate() {
        $(() => {
            console.log("успех");
            // сохранение dom дерева, до момента изменений внесённых jScrollPane
            this.props.reserve = $('.chat-area').html()
            // jScrollPane оборачивает .chat-list своими div-ами
            $('.chat-list').jScrollPane({ mouseWheelSpeed: 30 });
            document.getElementsByClassName("jspContainer")[0].scrollTo(0, document.getElementById('down').offsetTop)
            const jspDrag = document.getElementsByClassName("jspDrag")[0];
            const jspTrack = document.getElementsByClassName("jspTrack")[0].offsetHeight;
            const jspPane = document.getElementsByClassName("jspPane")[0];
            jspDrag.style.top = jspTrack - jspDrag.offsetHeight + "px"
            jspPane.style.top = jspTrack - jspPane.offsetHeight + "px"
        });
    }
    shouldComponentUpdate() {
        // возврат dom дерева, к состоянию, с которым может работать react
        $('.chat-list').html(this.props.reserve);
        return true;
    }
    render() {
        const { data } = this.props;
        console.log(data);
        return (
            <div className="chat-list" ref={this.chatList}>
                <ul>
                    {data.map((item) => <Message key={item._id} data={item} />)}
                </ul>
                {!data.length && <strong>Сообщений пока нет, но вы можете это исправить!</strong>}
                <span id="down"></span>
            </div>
        );
    }
}
