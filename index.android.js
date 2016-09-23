/**
 * DEMO Native App
 * https://github.com/facebook/react-native
 * @author:TOMCHOW
 * @date：2016-07-12 0:49
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Alert,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Linking,
    } from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    } from 'react-native-update';
import Global from './app/util/Global';
import Storage from './app/util/Storage';
import Index from './Index';
import _updateConfig from './update.json';
const {appKey} = _updateConfig[Platform.OS];
class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        //this.checkUpdate();
        if (isFirstTime) {
            /*
            Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
                {
                    text: '是', onPress: ()=> {
                    throw new Error('模拟启动失败,请重启应用')
                }
                },
                {
                    text: '否', onPress: ()=> {
                    markSuccess()
                }
                },
            ]);*/
            markSuccess();
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }
        else {
            //Alert.alert('提示', 'other');
        }
    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {
                    text: '是', onPress: ()=> {
                    switchVersion(hash);
                }
                },
                {text: '否',},
                {
                    text: '下次启动时', onPress: ()=> {
                    switchVersionLater(hash);
                }
                },
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {
                        text: '确定', onPress: ()=> {
                        info.downloadUrl && Linking.openURL(info.downloadUrl)
                    }
                    },
                ]);
            } else if (info.upToDate) {
                //Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                    {
                        text: '是', onPress: ()=> {
                        this.doUpdate(info)
                    }
                    },
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

    render() {
        return (
            <Index />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
AppRegistry.registerComponent('Demo', () => Demo);
