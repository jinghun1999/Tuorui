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
                    <Text style={styles.titleText}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>宠物名称</Text>
                    <Text style={{flex:1,color:'black'}}>{this.props.appointInfo.PetName}</Text>
                </View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>预约信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>预约人</Text>
                    <Text style={{flex:1,color:'black'}}>{this.props.appointInfo.GestName}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>预约医生</Text>
                    <Text style={{flex:1,color:'black'}}>{this.props.appointInfo.DoctorName}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>预约开始时间</Text>
                    <Text style={{flex:1,color:'black'}}>{starTime}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>预约结束时间</Text>
                    <Text style={{flex:1,color:'black'}}>{endTime}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>登记时间</Text>
                    <Text style={{flex:1,color:'black'}}>{regTime}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    textTitle:{
        width:100,
        fontSize:16,
    },
    titleStyle: {
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
        flexDirection:'row',
    },
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        color:'#CC0033',
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

})
module.exports = AppointDetails;