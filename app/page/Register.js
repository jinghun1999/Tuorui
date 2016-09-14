/**
 * Created by tuorui on 2016/9/8.
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
import NButton from '../commonview/NButton';
import Head from '../commonview/Head';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:'',
        };
    }
    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _register() {
        let _this = this;
        if (!_this.state.phoneNumber || _this.state.phoneNumber.length == 0) {
            ToastAndroid.show("请输入用户名", ToastAndroid.SHORT);
            return;
        }
        if (!_this.state.verifycode || _this.state.verifycode.leaf == 0) {
            ToastAndroid.show("请输入验证码", ToastAndroid.SHORT);
            return;
        }
        if (!_this.state.pwd || _this.state.pwd.length == 0) {
            ToastAndroid.show("请输入密码", ToastAndroid.SHORT);
            return;
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#f4f4f4', flex: 1}}>
                <Head title={'用户注册'} canBack={true} onPress={this._onBack.bind(this)}/>
                <TextInput
                    style={styles._input}
                    placeholder='手机号'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({phoneNumber: text})}
                    textAlignVertical='center'
                    textAlign='center'/>
                <View style={{flexDirection: 'row', backgroundColor: '#f4f4f4', marginTop: 10}}>
                    <TextInput
                        style={styles.verifycode_input}
                        placeholder='验证码'
                        numberOfLines={1}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => this.setState({verifycode: text})}
                        secureTextEntry={true}
                        textAlignVertical='center'
                        textAlign='center'
                    />
                    <View style={{flex:3,paddingLeft:10}}>
                        <TouchableHighlight style={styles.button} underlayColor="#B5B5B5">
                            <Text style={styles.buttonText}>获取验证码</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <TextInput
                    style={styles._input}
                    placeholder='密码'
                    numberOfLines={1}
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
                        text='注册'
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
        flex:7,
        backgroundColor: '#fff',
        height:45
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
        backgroundColor: '#63B8FF',
        borderColor:'#5bc0de',
        height:45,
        marginRight:10,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color:'#fff',
        fontSize:16,
    }
});

export default Register