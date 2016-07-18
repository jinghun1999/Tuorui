/**
 * Created by tuorui on 2016/7/15.
 */
'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    Image,
} from 'react-native';
import TopScreen from './TopScreen';
import Head from './Head';
export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onPress() {
        //或者写成 const navigator = this.props.navigator;
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        return (
            <View>
                <Head/>
                <TouchableOpacity onPress={this.oenPress}>
                <Text>点我跳转回去</Text>
                    </TouchableOpacity>
            </View>
        );
    }
}
module.exports = Sale;