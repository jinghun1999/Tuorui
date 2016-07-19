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
    TouchableHighlight,
    TextInput,
    DatePickerAndroid,
} from 'react-native';
import TopScreen from './TopScreen';
import Head from './SaleHead';
import NButton from './app/commonview/NButton';
import Calendar from './app/commonview/CalendarView';
var goods = require('./Goods');
export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {presetDate: new Date(2016, 7, 19),
            allDate: new Date(2020, 4, 5),
            simpleText: '选择日期,默认今天',
            minText: '选择日期,不能比今日再早',
            maxText: '选择日期,不能比今日再晚',
            presetText: '选择日期,指定2016/3/5',};
    }
    //进行创建时间日期选择器
    async showPicker(stateKey, options) {
        try {
            var newState = {};
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                newState[stateKey + 'Text'] = 'dismissed';
            } else {
                var date = new Date(year, month, day);
                newState[stateKey + 'Text'] = date.toLocaleDateString();
                newState[stateKey + 'Date'] = date;
            }
            this.setState(newState);
        } catch (o) {
           alert('控件异常。');
        }
    }
    render() {
        return (
            <View style={styles.container} >
                <Head />
                <TouchableHighlight
                    style={styles.button}
                    underlayColor="#a5a5a5"
                    onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}>
                    <Text style={styles.buttonText}>{this.state.simpleText}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.button}
                    underlayColor="#a5a5a5">
                    <Text>添加商品</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        margin:5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
    },
});
module.exports = Sale;