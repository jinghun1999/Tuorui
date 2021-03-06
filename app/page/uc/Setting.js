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
    Linking,
    TouchableOpacity
    } from 'react-native';
import Head from '../../commonview/Head';
import Style from '../../theme/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { toastShort } from '../../util/ToastUtil';
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
            toastShort('更新失败啦，详情：' + err);
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
                toastShort('您的应用版本已是最新');
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
            toastShort('更新失败啦，详情：' + err);
        });
    };

    componentWillUnmount() {

    }

    clearCache() {
        toastShort('缓存清理完成');
    }

    render() {
        return (
            <View style={Style.container}>
                <Head title="设置" canBack={true} onPress={this._onBack.bind(this)}/>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('服务条款')}>
                    <Text style={styles.titleText}>服务条款</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('使用帮助')}>
                    <Text style={styles.titleText}>使用帮助</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.showInfo('关于我们')}>
                    <Text style={styles.titleText}>关于我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('联系我们')}>
                    <Text style={styles.titleText}>联系我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.clearCache()}>
                    <Text style={styles.titleText}>清除缓存</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.checkUpdate()}>
                    <Text style={styles.titleText}>检查更新</Text>
                    <Text style={{color:'#ccc'}}>当前版本:V{packageVersion}</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
  titleText:{fontSize:15,flex:1,},
})
module.exports = MyAccount;