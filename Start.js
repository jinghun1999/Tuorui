/**
 * Created by User on 2016-07-18.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
    ToastAndroid,
    ViewPagerAndroid,
    BackAndroid,
    Image,
    View
    } from 'react-native';
import Login from './app/page/Login';

class Start extends Component {
    render() {
        var defaultName = 'Login';
        var defaultComponent = Login;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}
                configureScene={(route) => {
            return Navigator.SceneConfigs.HorizontalSwipeJump;
        }}
                renderScene={(route, navigator) => {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
        }}/>
        );
    }
}

module.exports = Start;