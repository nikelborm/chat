import React, { PureComponent } from "react";
import renderHTML from "react-render-html";
import { postsStore } from "../firebase";
import { Link } from "react-router-dom";
import { ReactComponent as Heart } from "bootstrap-icons/icons/heart.svg";
import { ReactComponent as FilledHeart } from "bootstrap-icons/icons/heart-fill.svg";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import { ReactComponent as Edit } from "bootstrap-icons/icons/pencil-square.svg";

class Post extends PureComponent {
    state = {
        isLikeStateChanging: false
    }
    nothingDo = () => {};
    convertTime = function (date) {
        // TODO: Прокачать так, чтобы в зависимости от текущего времени показывался разный набор данных, чем старее, тем подробнее дата
        return new Intl.DateTimeFormat("ru", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Moscow"
        }).format(date);
    }
    onStartLikeStateChanging = () => {
        this.setState({
            isLikeStateChanging: true
        });
    }
    onFinishLikeStateChanging = () => {
        this.setState({
            isLikeStateChanging: false
        });
    };
    onClickEditBtn = (event) => {
        event.preventDefault();
        this.props.onClickEditBtn();
    };
    onClickDeleteBtn = (event) => {
        event.preventDefault();
        postsStore.doc(this.props.id).delete().catch(
            (err) => {
                alert(err);
                // TODO: уведомить пользователя об ошибке (например нельзя удалить пост так как плохое соединение) нормально, tippy
            }
        );
    };
    onClickLikeBtn = (event) => {
        event.preventDefault();
        this.onStartLikeStateChanging();
        this.props.changeLikeState(
            this.props.isLiked ? "dislike" : "like",
            this.props.id
        ).catch((err) => {
            alert(err);
            // TODO: уведомить пользователя об ошибке (например нельзя лайкнуть пост так как плохое соединение) нормально, tippy
        }).finally(() => {
            this.onFinishLikeStateChanging();
        });
    };
    render() {
        // TODO: Показать time или updatedTime
        // { title, body, time, updatedTime? } == post
        // time == {seconds: 1593200940, nanoseconds: 0}
        // title здесь это сплошной текст, а body это строка с html кодом заметки
        const { title, body, time, updatedTime, likesCounter, isLiked, isExpanded, preview, id, isAdminMode, isAutorized } = this.props;
        const HeartNow = isLiked ? FilledHeart : Heart;
        return (
            <div className="post">
                {isAdminMode && <Edit onClick={ this.onClickEditBtn } className="edit"/>}
                {isAdminMode && <Trash onClick={ this.onClickDeleteBtn } className="trash"/>}
                <span className={ isAdminMode ? "moved-time" : "" }>
                    { updatedTime
                        ? <> Отредактировано: { this.convertTime(updatedTime.toDate()) } </>
                        : <> Опубликовано: { this.convertTime(time.toDate()) } </>
                    }
                </span>
                <h2 className="crop-line">Тема: { title }</h2>
                {/* Здесь применён мой хак, просто чтобы родные стили нормально цеплялись к тексту, нужна обёртка в виде .ql-editor */}
                { isExpanded
                    ? <div className="ql-snow"><div className="ql-editor">{ renderHTML(body) }</div></div>
                    : <>
                        <p>{ preview }</p>
                        <Link
                            to={ "/post/" + id }
                            className="topage"
                            children="Открыть полностью..."
                        />
                    </>
                }
                <div className="counter">
                    <HeartNow
                        fill="red"
                        className="heart"
                        onClick={ isAutorized && !this.state.isLikeStateChanging ? this.onClickLikeBtn : this.nothingDo }
                    />
                    : { likesCounter }
                </div>
            </div>
        );
    }
}

export default Post;
