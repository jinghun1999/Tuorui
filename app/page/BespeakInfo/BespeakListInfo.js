/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
}from 'react-native';
import Head from '../../commonview/Head';
class BespeakListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    _onBack(){
        let _this= this;
        const {navigator}=_this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render(){
        return(
            <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
        )
    }
}
module.exports = BespeakListInfo;