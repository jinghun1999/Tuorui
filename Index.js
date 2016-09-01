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
import MainPage from './MainPage';
import Login from './app/page/Login';
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }
    shouldComponentUpdate(){
        return true;
    }
    componentWillMount() {
        this._initState();
    }
    componentWillUpdate(){
        //this._initState();
    }
    _initState(){
        var _this = this;
        /*storage.remove({
            key: 'USER'
        });*/
        storage.load({
            key: 'USER',
            autoSync: false,
            syncInBackground: false
        }).then(ret => {
            _this.setState({
                user: ret.user,
                loading: false,
            });
        }).catch(err => {
            alert('error:' + err);
            _this.setState({
                loading: false,
            });
        });
    }
    render() {
        var defaultName = 'Login';
        var defaultComponent = Login;
        if (this.state.user && this.state.user.Token && this.state.user.Token.length > 0) {
            defaultName = 'MainPage';
            defaultComponent = MainPage;
        }
        if(this.state.loading){
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        }
        else{
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