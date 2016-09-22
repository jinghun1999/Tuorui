/**
 * Created by User on 2016-07-18.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React,{Component,} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ToastAndroid,
    TextInput,
    Alert
    } from 'react-native';
import Util from '../util/Util';
import NetUtil from '../util/NetUtil';
import MainPage from '../../Index';
import NButton from '../commonview/NButton';
import Register  from './Register';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: '',
            user: '',
        };
    }

    _Login() {
        if (!this.state.user || this.state.user.length == 0) {
            Alert.alert('错误', "请输入用户名",
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]);
            return;
        }
        if (!this.state.pwd || this.state.pwd.length == 0) {
            Alert.alert('错误', "请输入密码",
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]);
            return;
        }

        var _this = this;
        const { navigator } = _this.props;
        try {
            NetUtil.get(CONSTAPI.LOGIN + "?identity=" + _this.state.user + "&password=" + _this.state.pwd + "&type=m", false, function (data) {
                if (data.Sign && data.Message) {
                    //Alert.alert('登录成功', "Token:" + data.Message.Token);
                    storage.save({
                        key: 'LoginData',
                        rawData: {
                            identity: _this.state.user,
                            password: _this.state.pwd,
                        },
                    });
                    storage.save({
                        key: 'USER',
                        rawData: {
                            user: data.Message,
                        },
                        expires: 1000 * 60,
                    });
                    if (data.Message.HospitalId != null) {
                        let hos = {};
                        data.Message.Hospitals.forEach(function (v, i, d) {
                            if (v.ID === data.Message.HospitalId) {
                                hos = v;
                            }
                        });
                        storage.save({
                            key: 'HOSPITAL',
                            rawData: {
                                hospital: hos,
                            }
                        });
                    }

                    if (navigator) {
                        navigator.pop();
                        navigator.push({
                            name: 'MainPage',
                            component: MainPage,
                            params: {}
                        });
                    }
                } else {
                    Alert.alert('登陆失败', data.Exception,
                        [
                            {
                                text: '确定'
                            },
                        ]);
                }
            });
        } catch (e) {
            Alert.alert('登陆失败', "错误信息：" + e,
                [
                    {
                        text: '确定'
                    },
                ]);
        }
    }

    _cantLogin() {
        ToastAndroid.show("完善中", ToastAndroid.SHORT);
    }

    _register() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'Register',
                component: Register
            })
        }
    }

    render() {
        return (
            <View style={{backgroundColor:'#f4f4f4',flex:1}}>
                <Image
                    style={styles.style_image}
                    source={require('../../image/base_log.png')}/>
                <TextInput
                    style={styles.style_user_input}
                    placeholder='手机号'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({user: text})}
                    textAlignVertical='center'
                    textAlign='center'
                    keyboardType={'numeric'}
                    value={this.state.user}/>
                <View style={{height:1,backgroundColor:'#f4f4f4'}}/>
                <TextInput
                    style={styles.style_pwd_input}
                    placeholder='密码'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({pwd: text})}
                    secureTextEntry={true}
                    textAlignVertical='center'
                    textAlign='center'
                    ref='pwd'
                    onFocus={() => {this.refs.pwd.focus()}}
                    value={this.state.pwd}
                    />
                <View>
                    <NButton
                        underlayColor='#4169e1'
                        style={styles.style_view_button}
                        onPress={this._Login.bind(this)}
                        text='登录'/>
                </View>

                <View style={{flex:1,flexDirection:'row',alignItems: 'flex-end',bottom:10}}>
                    <Text style={styles.style_view_unlogin} onPress={this._cantLogin.bind(this)}>
                        无法登录?
                    </Text>
                    <Text style={styles.style_view_register} onPress={this._register.bind(this)}>
                        新用户
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    style_image: {
        borderRadius: 35,
        height: 70,
        width: 70,
        marginTop: 40,
        alignSelf: 'center',
    },
    style_user_input: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 45,
    },
    style_pwd_input: {
        backgroundColor: '#fff',
        height: 45,
    },
    style_view_commit: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#63B8FF',
        borderColor: '#5bc0de',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_button: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#63B8FF',
        borderColor: '#5bc0de',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_unlogin: {
        fontSize: 15,
        color: '#63B8FF',
        marginLeft: 10,
    },
    style_view_register: {
        fontSize: 15,
        color: '#63B8FF',
        marginRight: 10,
        alignItems: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        textAlign: 'right',
    },
});
module.exports = Login;