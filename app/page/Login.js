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
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    ToastAndroid,
    TextInput,
    TouchableOpacity,
    } from 'react-native';
import Util from '../util/Util';
import Global from '../util/Global';
import NetUitl from '../net/NetUitl';
import JsonUitl from '../util/JsonUitl';
//import SecondPageComponent from './SecondPageComponent';
import MainPage from '../../Index';
var base64 = require('base-64');
var NButton = require('../commonview/NButton');
//import Example from 'react-native-camera/Example/Example';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _pressButton() {
        if (!this.state.user || this.state.user.length == 0) {
            ToastAndroid.show("请输入用户名", ToastAndroid.SHORT);
            return;
        }
        if (!this.state.pwd || this.state.pwd.length == 0) {
            ToastAndroid.show("请输入密码", ToastAndroid.SHORT);
            return;
        }

        var thiz = this;
        const { navigator } = this.props;
        let url = Global.LOGIN + "?identity="+this.state.user+"&password="+this.state.pwd+"&type=m";
        //var header = {'Authorization': 'Anonymous ' + base64.encode(Global.ENTCODE)};
        try {
            NetUitl.get(url, false, function (data) {
                if (data.Sign && data.Message) {
                    alert("登录成功" + data.Message.Token);
                    storage.save({
                        key: 'loginState',  //注意:请不要在key中使用_下划线符号!
                        rawData: {
                            phone: data.Message.Mobile,
                            name: data.Message.FullName,
                            token: data.Message.Token
                        },
                        expires: 1000 * 3600 * 24
                    });
                    if (navigator) {
                        navigator.pop();
                        navigator.push({
                            name: 'MainPage',
                            component: MainPage,
                            params: {}
                        });
                    }
                } else {
                    alert(data.Exception);
                }
            });
        } catch (e) {
            alert("登陆失败，错误信息：" + e);
        }
    }

    _cantLogin() {
        ToastAndroid.show("完善中", ToastAndroid.SHORT);
    }

    _register() {
        ToastAndroid.show("完善中", ToastAndroid.SHORT);
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
                    textAlign='center'/>
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
                    />
                <View>
                    <NButton
                        underlayColor='#4169e1'
                        style={styles.style_view_button}
                        onPress={this._pressButton.bind(this)}
                        text='登录'>
                    </NButton>
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
        borderRadius: 45,
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

export default Login