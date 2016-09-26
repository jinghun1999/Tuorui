/**
 * Created by User on 2016-09-02.
 */

'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    Animated
    } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let body = <Bars size={10} color="#1CAFF6"/>
        if (this.props.type == 'text') {
            body = <Text>ヽ(≧Д≦)ノ 努力加载中...</Text>
        }
        return (
            <View style={{flexDirection:'column', flex:1, marginTop:5, justifyContent: 'center', alignItems: 'center',}}>
                {body}
            </View>
        );
    }
}
module.exports = Loading;
