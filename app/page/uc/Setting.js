/**
 * Created by User on 2016-09-12.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
    Platform,
    TouchableOpacity
    } from 'react-native';
import Head from '../../commonview/Head';
import Style from '../../theme/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalPicker from 'react-native-modal-picker';
import SettingContent from './SettingContent';

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
import _updateConfig from '../../../update.json';
const {appKey} = _updateConfig[Platform.OS];

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: 'V 1.0'
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    showInfo(o) {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'SettingContent',
                component: SettingContent,
                params: {
                    headTitle: o,
                }
            })
        }
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
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.', [{text: '知道了'}]);
        }
        else {
            //Alert.alert('提示', 'other');
        }
    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {text: '取消',},
                {
                    text: '现在重启', onPress: ()=> {
                    switchVersion(hash);
                }
                },
                {
                    text: '下次启动时', onPress: ()=> {
                    switchVersionLater(hash);
                }
                },
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.', [{text: '知道了'}]);
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
                Alert.alert('提示', '您的应用版本已是最新.', [{text: '知道了'}]);
            } else {
                Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                    {text: '取消',},
                    {
                        text: '现在下载', onPress: ()=> {
                        this.doUpdate(info)
                    }
                    },
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.' + err, [{text: '知道了'}]);
        });
    };

    componentWillUnmount() {

    }

    clearCache() {
        Alert.alert('提示', '清理完成', [{text: '确定'}]);
    }

    render() {
        return (
            <View style={Style.container}>
                <Head title="设置" canBack={true} onPress={this._onBack.bind(this)}/>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('服务条款')}>
                    <Text style={Style.titleText}>服务条款</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('使用帮助')}>
                    <Text style={Style.titleText}>使用帮助</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.showInfo('关于我们')}>
                    <Text style={Style.titleText}>关于我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('联系我们')}>
                    <Text style={Style.titleText}>联系我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.clearCache()}>
                    <Text style={Style.titleText}>清除缓存</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.checkUpdate()}>
                    <Text style={Style.titleText}>检查更新</Text>
                    <Text style={{color:'#ccc'}}>当前版本:V{packageVersion}</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
            </View>
        );
    }
}

module.exports = MyAccount;