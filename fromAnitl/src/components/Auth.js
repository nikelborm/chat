import React, { Component } from "react";
import app, { usersStore, postsStore, FieldValue } from "../firebase";
import { withRouter } from "react-router-dom";

export const isRegistrationAllowed = true;

export const AuthContext = React.createContext({
    currentUser: null,
    isAdminOnlyForGUI: false,
    likes: new Set(),
    isFirstCalled: false,
    changeLikeState: () => {}
});

class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.unsubscribeAuth = null;
        this.unsubscribeposts = null;
        this.isFirstCalled = false;
    }
    componentWillUnmount() {
        this.unsubscribeAuth();
        this.unsubscribeposts();
    }

    state = {
        currentUser: null,
        isAdminOnlyForGUI: false,
        likes: new Set()
    }
    changeLikeState = async ( newState, postId ) => {
        // newState ∈ ["like", "dislike"]
        const isLike = newState === "like";
        this.setState((prevState) => {
            prevState.likes[isLike ? "add" : "delete"](postId);
        });
        await postsStore.doc(postId).update({
            likesCounter: FieldValue.increment(isLike ? 1 : -1) // запретить увеличивать на единицу, если likes содержит this.props.id
        })
        await usersStore.doc(this.state.currentUser.uid).update({
            likes: FieldValue[isLike ? "arrayUnion" : "arrayRemove"](postId)
        })
    }
    componentDidMount() {
        this.unsubscribeAuth = app.auth().onAuthStateChanged(async (user) => {
            console.log("onAuthStateChanged");
            console.log("user: ", user);
            console.log("this.state: ", this.state);
            this.isFirstCalled = true;
            if (!user) {
                this.setState({
                    currentUser: null,
                    isAdminOnlyForGUI: false,
                    likes: new Set()
                });
            } else {
                this.unsubscribeposts = usersStore.doc(user.uid).onSnapshot(snapshot => {
                    if (!snapshot.exists) return;
                    const { isAdminOnlyForGUI, likes } = snapshot.data();
                    this.setState({
                        currentUser: user,
                        isAdminOnlyForGUI,
                        likes: new Set(likes)
                    });
                });
            }
        });
    }
    render() {

        return (
            <AuthContext.Provider
                value={{
                    ...this.state,
                    isFirstCalled: this.isFirstCalled,
                    changeLikeState: this.changeLikeState
                }}
                children={this.props.children}
            />
        );
    }
}
export default withRouter(AuthProvider);
