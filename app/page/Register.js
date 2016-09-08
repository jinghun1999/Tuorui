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
    Alert
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
    render() {
        return (
            <View style={{backgroundColor:'#f4f4f4',flex:1}}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true}
                      onPress={this._onBack.bind(this)}/>
                <TextInput
                    style={styles.style_user_input}
                    placeholder='手机号'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({user: text})}
                    textAlignVertical='center'
                    textAlign='center'/>
                <View style={{flexDirection:'row',height:1,backgroundColor:'#f4f4f4', marginTop:20}}/>
                <TextInput
                    style={styles.style_authcode_input}
                    placeholder='验证码'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({pwd: text})}
                    secureTextEntry={true}
                    textAlignVertical='center'
                    textAlign='center'
                    ref='authcode'
                    onFocus={() => {this.refs.authcode.focus()}}
                />
                <NButton
                    underlayColor='#4169e1'
                    style={styles.style_authcode_button}
                    text='获取验证码' />
                <View>
                    <NButton
                        underlayColor='#4169e1'
                        style={styles.style_view_button}
                        text='注册' />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    style_user_input: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 45,
    },
    style_authcode_input: {
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
    style_authcode_button: {
        marginLeft: 20,
        backgroundColor: '#63B8FF',
        borderColor: '#5bc0de',
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

export default Register