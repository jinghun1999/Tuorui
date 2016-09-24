/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
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
import AppStyle from '../../theme/appstyle';
class AppointDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: false,
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
        var starTime = Util.getFormateTime(this.props.appointInfo.StartTime, 'min');
        var endTime = Util.getFormateTime(this.props.appointInfo.EndTime, 'min');
        var regTime = Util.getFormateTime(this.props.appointInfo.ModifiedOn, 'min');
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>宠物信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>宠物名称</Text>
                    <Text style={AppStyle.rowVal}>{this.props.appointInfo.PetName}</Text>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>预约信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>预约人</Text>
                    <Text style={AppStyle.rowVal}>{this.props.appointInfo.GestName}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>预约医生</Text>
                    <Text style={AppStyle.rowVal}>{this.props.appointInfo.DoctorName}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>开始时间</Text>
                    <Text style={AppStyle.rowVal}>{starTime}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>结束时间</Text>
                    <Text style={AppStyle.rowVal}>{endTime}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.titleText}>登记时间</Text>
                    <Text style={AppStyle.rowVal}>{regTime}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    width150:{
        width:150,
    }
});
module.exports = AppointDetails;