/**
 * Created by User on 2016-07-19.
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Alert,
    Navigator,
    Image,
    ToastAndroid,
    View
    } from 'react-native';
import MainPage from './MainPage';
import Login from './app/page/Login';
import NetWorkTool from './app/util/NetWorkTool'
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
        NetWorkTool.checkNetworkState((isConnected)=> {
            if (!isConnected) {
                ToastAndroid.show(NetWorkTool.NOT_NETWORK, ToastAndroid.SHORT);
            }
        });
        NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.handleNetConnect);
    }

    handleNetConnect(isConnected) {
        //console.log('test', (isConnected ? 'online' : 'offline'));
    }

    componentDidMount() {
        this._initState();
    }

    componentWillUpdate() {
        //this._initState();
    }

    _initState() {
        var _this = this;
        storage.load({
            key: 'LoginData',
            autoSync: false,
            syncInBackground: false
        }).then(ret=> {
            _this._getUser(true);
        }).catch(err=> {
            _this._getUser(false);
        });
    }

    _getUser(sync = false) {
        var _this = this;
        storage.load({
            key: 'USER',
            autoSync: sync,
            syncInBackground: false
        }).then(ret => {
            _this.setState({
                user: ret.user,
                loaded: true,
            });
        }).catch(err => {
            //Alert.alert('提示', '登陆过期，请重新登陆', [{text: '确定'}]);
            _this.setState({
                loaded: true,
            });
        });
    }

    render() {
        var defaultName = 'Login';
        var defaultComponent = Login;
        if (this.state.user && this.state.user.Token && this.state.user.Token.token.length > 0) {
            defaultName = 'MainPage';
            defaultComponent = MainPage;
        }
        if (!this.state.loaded) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        }
        else {
            return (
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent, id: 'main' }}
                    configureScene={(route) => {
                            let gestureType = Navigator.SceneConfigs.HorizontalSwipeJump;
                            gestureType.gestures.jumpForward = null;
                            gestureType.gestures.jumpBack = null;
                            return gestureType;
                        }
                    }
                    renderScene={(route, navigator) => {
                        this._navigator = navigator;
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} tabBarShow={route.id==='main'} />
                    }
                }/>
            );
        }
    }
}

export default Index;