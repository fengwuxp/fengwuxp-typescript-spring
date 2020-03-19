// import React from "react";
// import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
// import {ConditionRouteProps} from "fengwuxp-routing-react";
//
// // This example shows how to render two different screens
// // (or the same screen in a different context) at the same url,
// // depending on how you got there.
// // 该例子演示了如何在同一个URL页面渲染两个不同的页面或在不同上下文中的同一页面
// //
// // Click the colors and see them full screen, then "visit the
// // gallery" and click on the colors. Note the URL and the component
// // are the same as before but now we see them inside a modal
// // on top of the old screen.
// // 点击颜色可以在全屏状态下查看他们，然后点击“visit the gallery"后再次点击色块。
// // 注意此时的URL和组件，虽然他们和之前一样但现在他们却以模态窗口的形式显示在旧页面之上。
//
// export default class ModalSwitch extends React.Component<ConditionRouteProps> {
//   // We can pass a location to <Switch/> that will tell it to
//   // ignore the router's current location and use the location
//   // prop instead.
//   // 我们可以传递location给<Switch/>组件，这可以让它优先展示我们传递的location而忽略路由当前的location。
//
//   // We can also use "location state" to tell the app the user
//   // wants to go to `/img/2` in a modal, rather than as the
//   // main page, keeping the gallery visible behind it.
//   // 我们也可以使用”location state"通知app，我们想使用modal的方式将`/img/2`显示在gallery之上。
//
//   // Normally, `/img/2` wouldn't match the gallery at `/`.
//   // So, to get both screens to render, we can save the old
//   // location and pass it to Switch, so it will think the location
//   // is still `/` even though its `/img/2`.
//   // 通常,`/img/2`并不匹配`/`路由，所以，为了同时显示两个路由，我们将之前的location保存并传递给Switch，
//   // 让组件认为当前仍然是`/`，尽管此时已经是`/img/2`了
//
//   // 保存之前的location
//   private previousLocation;
//
//
//   constructor(props: ConditionRouteProps, context: any) {
//     super(props, context);
//     this.previousLocation = props.location;
//   }
//
//   componentWillUpdate(nextProps) {
//     const {location} = this.props;
//     // set previousLocation if props.location is not modal
//     // 如果之前的location不是modal显示，设置previousLocation属性，后期将传递给Switch
//     if (nextProps.history.action !== "POP" && (!location.state || !location.state.modal)) {
//       this.previousLocation = this.props.location;
//     }
//   }
//
//   render() {
//     const {location} = this.props;
//     // 判断当前路由是否为modal模式
//     const isModal = !!(
//       location.state &&
//       location.state['modal'] &&
//       this.previousLocation !== location
//     ); // not initial render
//
//     return (
//       <div>
//         <Switch location={isModal ? this.previousLocation : location}>
//           <Route exact path="/" component={Home}/>
//           <Route path="/gallery" component={Gallery}/>
//           <Route path="/img/:id" component={ImageView}/>
//         </Switch>
//         {isModal ? <Route path="/img/:id" component={Modal}/> : null}
//       </div>
//     );
//   }
// }
