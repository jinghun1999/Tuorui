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
    Alert,
    NetInfo,
} from 'react-native';
import Util from '../util/Util';
import NetUtil from '../util/NetUtil';
import Index from '../../Index';
import NButton from '../commonview/NButton';
import Register from './Register';
import FindPwd from './FindPwd';
import { toastShort } from '../util/ToastUtil';
import NetWorkTool from '../util/NetWorkTool';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: '',
            user: '',
            code: '',
            isConnected: null,
            connectionInfo:null,
        };
    }

    componentDidMount() {

    }
    checkConnectState(){
        NetWorkTool.addEventListener(NetWorkTool.TAG_NETWORK_CHANGE,this._handleConnectivityChange);
        //检测网络是否连接
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({isConnected}); }
        );
    }
    componentWillUnmount() {
    }
    removeListener(){
        NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE,this._handleConnectivityChange);
    }
    _handleConnectivityChange(isConnected) {
        if(!isConnected){
            toastShort('无网络');
        }
    }

    _Login() {
        this.refs.pwd.blur();
        this.refs.user.blur();
        if (!this.state.user || this.state.user.length == 0) {
            toastShort('请输入用户名')
            return;
        }
        if (!this.state.pwd || this.state.pwd.length == 0) {
            toastShort('请输入密码')
            return;
        }
        this.checkConnectState();
        this.removeListener();
        if(!this.state.isConnected){
            toastShort('请检查网络状态');
            return;
        }
        var _this = this;
        const { navigator } = _this.props;
        try {
            NetUtil.login(_this.state.user, _this.state.pwd, _this.state.code, function (ok, msg) {
                if (ok) {
                    if (navigator) {
                        navigator.pop();
                        navigator.push({
                            name: 'Index',
                            component: Index,
                            params: {}
                        });
                    }
                } else {
                    toastShort(msg)
                }
            });
        } catch (e) {
            toastShort("登陆失败.(500)" + e)
        }
    }

    _register() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'Register',
                component: Register
            });
        }
    }

    _findpwd() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'FindPwd',
                component: FindPwd
            });
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
                    ref='user'
                    onFocus={()=>{this.refs.user.focus()}}
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
                    <Text style={styles.style_view_unlogin} onPress={this._findpwd.bind(this)}>
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