/**
 * Created by User on 2016-09-02.
 */

'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center',}}>
                <Bars size={10} color="#1CAFF6"/>
            </View>
        );
    }
}
module.exports = Loading;
