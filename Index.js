/**
 * Created by User on 2016-07-19.
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,

    Image,
    View
    } from 'react-native';
import HomePage from './MainPage';
import Login from './app/page/Login';
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this._initState();
    }
    componentWillUpdate(){
        this._initState();
    }
    _initState(){ 
        var _this = this;
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            _this.setState({
                user: ret.phone,
                name: ret.name,
                token: ret.token,
            });
        }).catch(err => {
            alert('error:' + err);
        });
    }
    render() {
        var defaultName = 'Login';
        var defaultComponent = Login;
        if (this.state.token && this.state.token.length > 0) {
            defaultName = 'HomePage';
            defaultComponent = HomePage;
        }
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent, id: 'main' }}
                configureScene={(route) => {
                    let gestureType = Navigator.SceneConfigs.HorizontalSwipeJump;
                    gestureType.gestures.jumpForward=null;
                    gestureType.gestures.jumpBack=null;
                    return gestureType;
                }
            }
                renderScene={(route, navigator) => {
                this._navigator = navigator;
                let Component = route.component;
                return <Component {...route.params} navigator={navigator} tabBarShow={route.id==='main'} />
            }}/>
        );
    }
}

export default Index;