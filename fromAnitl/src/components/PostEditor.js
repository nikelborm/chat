import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.title = React.createRef();
        this.body = React.createRef();
    }
    state = {
        isSendingNow: false
    }
    formats = [
        "header",
        "font",
        "size",
        "italic",
        "bold",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "image",
        "video",
        "code-block"
    ]
    modules = {
        toolbar : [
            [{ header: "1"}, { header: "2"}, { font: [] }],
            [{size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{list: "ordered"}, {list: "bullet"} ],
            ["link", "image", "video"],
            ["clean"],
            ["code-block"]
        ]
    }
    onFinishSending = () => {
        this.setState({
            isSendingNow: false
        });
    };
    onStartSending = () => {
        this.setState({
            isSendingNow: true
        });
    };
    onSubmit = async (event) => {
        event.preventDefault();
        this.onStartSending();
        const titleRef = this.title.current;
        const bodyRef = this.body.current;
        try {
            let preview = bodyRef.getEditorContents().replace(/<[^>]*>/g, ' ').replace(/[\s\t]+/g, ' ').trim();
            const nextSpace = preview.indexOf(" ", 500);
            preview = ~nextSpace ? preview.slice(0, nextSpace) + " ..." : preview;
            await this.props.onSubmit(
                titleRef.value,
                bodyRef.getEditorContents(),
                preview
            );
        } catch (error) {
            alert(error);
            // TODO: уведомить пользователя об ошибке (при отправке формы) красиво, tippy
        }
        if (this.props.setBtnEnabledWhenFinished) {
            titleRef.value = "";
            bodyRef.editor.setText("");
            this.onFinishSending();
        }
    };
    render() {
        const { initTitle, initBody } = this.props;
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input
                        disabled={ this.state.isSendingNow }
                        type="text"
                        name="title"
                        placeholder="Title"
                        defaultValue={initTitle}
                        ref={this.title}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <ReactQuill
                        readOnly={ this.state.isSendingNow }
                        defaultValue={initBody}
                        ref={this.body}
                        modules={this.modules}
                        formats={this.formats}
                        placeholder="Body"
                    />
                </div>
                <button disabled={ this.state.isSendingNow } className="btn btn-primary">
                    { this.state.isSendingNow ? "Отправка..."  : "Отправить" }
                </button>
            </form>
        );
    }
}

export default PostEditor;
