/**
 * Created by User on 2016-09-23.
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
    Alert,
    TouchableHighlight
    } from 'react-native';
import NetUtil from '../util/NetUtil';
import Index from '../../Index';
import NButton from '../commonview/NButton';
import Head from '../commonview/Head';
import { toastShort } from '../util/ToastUtil';
class FindPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            code: '',
            pwd: '',
            sendText: '0秒后重发',
            cansend: true,
        };
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _send() {
        let c = 60;
        let _this = this;
        if (_this.state.phone.length !== 11) {
            toastShort("请输入正确的手机号");
            return;
        }
        let uri = CONSTAPI.Auth + '/verify?clientid=' + this.state.phone + '&mobile=' + this.state.phone
        NetUtil.get(uri, false, function (data) {
            if (data.Sign) {
                _this.timer = setInterval(
                    () => {
                        if (c >= 0) {
                            _this.setState({
                                cansend: false,
                                sendText: c + '秒后重发'
                            });
                            c--;
                        } else {
                            _this.setState({
                                cansend: true,
                            });
                            _this.timer && clearInterval(_this.timer);
                        }
                    },
                    1000
                );
            } else {
                toastShort("验证码发送失败，请重试");
            }
        });
    }

    _register() {
        let _this = this;
        const {navigator} = _this.props;
        if (_this.state.phone.length !== 11) {
            toastShort("请输入正确的手机号");
            return;
        }
        if (_this.state.code.length !== 6) {
            toastShort("请输入正确的验证码");
            return;
        }
        if (_this.state.pwd.length < 6) {
            toastShort("密码太短啦");
            return;
        }
        if (_this.state.pwd.indexOf('12345') > -1) {
            toastShort("密码太简单，请重新设置");
            return false;
        }
        let postjson = {
            ClientID: _this.state.phone,
            Mobile: _this.state.phone,
            Password: _this.state.pwd,
            VerCode: _this.state.code,
        }
        //submit reg info
        try {
            NetUtil.postJson(CONSTAPI.Auth + '/ad?o=findpwd', postjson, false, function (data) {
                if (data.Sign) {
                    //direct login
                    NetUtil.login(_this.state.phone, _this.state.pwd, function (ok, msg) {
                        if (ok) {
                            if (navigator) {
                                //navigator.pop();
                                navigator.replace({
                                    name: 'Index',
                                    component: Index,
                                    params: {}
                                });
                            }
                        } else {
                            toastShort(msg);
                        }
                    });
                } else {
                    toastShort(data.Exception);
                }
            });
        } catch (e) {
            toastShort('找回密码失败(500)' + e);
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        return (
            <View style={{backgroundColor: '#f4f4f4', flex: 1}}>
                <Head title={'找回密码'} canBack={true} onPress={this._onBack.bind(this)}/>
                <TextInput
                    style={styles._input}
                    placeholder='手机号'
                    numberOfLines={1}
                    maxLength={11}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({phone: text})}
                    textAlignVertical='center'
                    keyboardType={'numeric'}
                    textAlign='center'/>
                <View style={{flexDirection: 'row', backgroundColor: '#f4f4f4', marginTop: 10}}>
                    <TextInput
                        style={styles.verifycode_input}
                        placeholder='验证码'
                        numberOfLines={1}
                        maxLength={6}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => this.setState({code: text})}
                        textAlignVertical='center'
                        textAlign='center'
                        keyboardType={'numeric'}
                        />
                    {this.state.cansend ?
                        <TouchableHighlight style={styles.button} onPress={this._send.bind(this)}
                                            underlayColor="#B5B5B5" ref={'sendButton'}>
                            <Text style={styles.buttonText}>获取验证码</Text>
                        </TouchableHighlight>
                        :
                        <View style={[styles.button, {backgroundColor:'#888'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.sendText}
                            </Text>
                        </View>
                    }
                </View>
                <TextInput
                    style={styles._input}
                    placeholder='新密码'
                    numberOfLines={1}
                    maxLength={16}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({pwd: text})}
                    secureTextEntry={true}
                    textAlignVertical='center'
                    textAlign='center'
                    ref='pwd'
                    onFocus={() => {
                        this.refs.pwd.focus()
                    }}
                    />
                <View>
                    <NButton
                        underlayColor='#4169e1'
                        style={styles.register_button}
                        text='确定'
                        onPress={this._register.bind(this)}
                        />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    _input: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 45,
    },
    verifycode_input: {
        flex: 7,
        backgroundColor: '#fff',
        height: 45
    },
    register_button: {
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
    button: {
        flex: 3,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#63B8FF',
        borderColor: '#5bc0de',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default FindPwd