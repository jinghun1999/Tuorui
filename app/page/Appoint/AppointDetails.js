/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    Picker,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Head from '../../commonview/Head';
class AppointDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enable:false,
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.titleStyle}>
                    <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>宠物名称</Text>
                    <TextInput value={this.props.appointInfo.petName}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>宠物年龄</Text>
                    <TextInput value={this.props.appointInfo.petAge}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.titleStyle}>
                    <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>预约信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约人</Text>
                    <TextInput value={this.props.appointInfo.memberName}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约手机</Text>
                    <TextInput value={this.props.appointInfo.memberPhone}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约时间</Text>
                    <TextInput value={this.props.appointInfo.appointTime}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>登记时间</Text>
                    <TextInput value={this.props.appointInfo.registerTime}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约状态</Text>
                    <Picker selectedValue={this.props.appointInfo.appointState}
                            mode="dropdown"
                            enabled={this.state.enable}
                            style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                            onValueChange={(state) => this.setState({appointState: state})}>
                        <Picker.Item label="请选择" value='0'/>
                        <Picker.Item label="已确定" value='1'/>
                        <Picker.Item label="已取消" value='2'/>
                    </Picker>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    titleStyle: {
        height: 20,
        margin: 2,
        flexDirection: 'row',
        backgroundColor: '#ccc',
    },
})
module.exports = AppointDetails;