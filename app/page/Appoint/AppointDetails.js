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
    ListView,
    TouchableOpacity,
}from 'react-native';
import Util from '../../util/Util';
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
        var starTime = Util.getFormateTime(this.props.appointInfo.StartTime,'min');
        var endTime = Util.getFormateTime(this.props.appointInfo.EndTime,'min');
        var regTime = Util.getFormateTime(this.props.appointInfo.ModifiedOn,'min');
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.titleStyle}>
                    <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>宠物名称</Text>
                    <TextInput value={this.props.appointInfo.PetName}
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
                    <TextInput value={this.props.appointInfo.GestName}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约医生</Text>
                    <TextInput value={this.props.appointInfo.DoctorName}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约开始时间</Text>
                    <TextInput value={starTime}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>预约结束时间</Text>
                    <TextInput value={endTime}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>登记时间</Text>
                    <TextInput value={regTime}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={{height: 40, borderWidth:0, flex:1}}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    titleStyle: {
        margin: 2,
        flexDirection: 'row',
        backgroundColor: '#ccc',
    },
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

})
module.exports = AppointDetails;