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
    Navigator,
    ScrollView,
} from 'react-native';
import TopScreen from './TopScreen';
import Head from './SaleHead';
import NButton from './app/commonview/NButton';
import Goods from './Goods';
export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetDate: new Date(2016, 7, 19),
            allDate: new Date(2020, 4, 5),
            simpleText: '选择日期:',
            minText: '选择日期,不能比今日再早',
            maxText: '选择日期,不能比今日再晚',
            presetText: '选择日期,指定2016/3/5',
        };
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

    _pressButton() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Goods',
                component: Goods,
            })
        }
    }

    SaveInfo() {
        alert('保存');
    }
    pressSale() {
        alert('打折');
    }
    pressStore() {
        alert('默认门店');
    }
    render() {
        return (

            <View style={styles.container}>
                <Head />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#a5a5a5"
                        onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}>
                        <Text style={styles.buttonText}>{this.state.simpleText}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#a5a5a5"
                        onPress={this.pressStore.bind(this)}>
                        <Text>门店:</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#a5a5a5">
                        <Text>会员:</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#a5a5a5"
                        onPress={this._pressButton.bind(this)}>
                        <Text>添加商品</Text>
                    </TouchableHighlight>
                    <View style={styles.view3}>
                        <Text style={styles.title}>应收金额:</Text>
                        <TextInput style={styles.style_user_input}
                                   placeholder='100.0'
                                   numberOfLines={1}
                                   underlineColorAndroid={'transparent'}
                        >
                        </TextInput>
                    </View>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#a5a5a5"
                        onPress={this.pressSale.bind(this)}>
                        <Text>折扣:</Text>
                    </TouchableHighlight>
                    <View style={styles.view3}>
                        <Text style={styles.title}>实收金额:</Text>
                        <TextInput style={styles.style_user_input}
                                   placeholder='100.0'
                                   numberOfLines={1}
                                   underlineColorAndroid={'transparent'}
                        >
                        </TextInput>
                    </View>
                    <View style={styles.view3}>
                        <Text style={styles.title}>备注:</Text>
                        <TextInput style={styles.style_user_input}
                                   placeholder='about..'
                                   numberOfLines={1}
                                   underlineColorAndroid={'transparent'}
                        >
                        </TextInput>
                    </View>
                    <View style={styles.v0}>
                        <NButton
                            onPress={this.SaveInfo}
                            text="保存"
                            style={{width:50}}/>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        contentContainer: {
            paddingBottom:300,
        },
        title: {
            alignSelf: 'flex-start',
            textAlign: 'center',
            margin: 5,
        },
        button: {
            margin: 5,
            backgroundColor: 'white',
            padding: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#cdcdcd',
        },
        style_user_input: {
            flex: 1,
            backgroundColor: '#fff',
            marginTop: 5,
            height: 55,
        },
        view3: {
            flex: 1,
            flexDirection: 'row',
            margin: 5,
            backgroundColor: 'white',
            padding: 15,
            height: 55,
            borderBottomColor: '#cdcdcd',
        },
    v0:{
        height:130,
    }
    }
);
module.exports = Sale;