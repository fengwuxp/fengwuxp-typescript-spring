import React, { Component } from "react";
import "./app.less";

class App extends Component {
    componentDidMount() {}

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {
        console.log("componentDidCatchError in appjs!");
    }

    componentDidCatch(e) {
        console.log("componentDidCatch in appjs!");
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children;
    }
}

export default App;
