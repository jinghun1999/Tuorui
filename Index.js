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
    BackAndroid,
    Image,
    View
    } from 'react-native';
import HomePage from './HomePage';
import Start from './Start';
import Login from './app/page/Login';
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            user:this.props.user,
            pwd:this.props.pwd,
            CurrentUser: this.props.CurrentUser,
        });
        if(this.state.CurrentUser)
            alert(this.state.CurrentUser.SafetyCode)
    }
    render() {
        if (this.state.CurrentUser && this.state.CurrentUser.SafetyCode) {
            return (
                <HomePage />
            )
        } else {
            return (
                <Start />
            )
        }
    }
}

export default Index;