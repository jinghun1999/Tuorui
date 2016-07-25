/**
 * Created by tuorui on 2016/7/19.
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
    TextInput,
} from 'react-native';
import Head from './Head';
class Goods extends React.Component {
    render() {
        return (
            <View>
                <Head />
                <Text>123456</Text>
            </View>
        )
    }
}
module.exports = Goods;