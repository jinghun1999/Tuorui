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
    InteractionManager,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AppStyle from '../../theme/appstyle';
import { toastShort } from '../../util/ToastUtil';
class AppointDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            petBirthday: '',
            petRace: '',
            petSex: '',
            enable: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData();
        });
    }

    _fetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.get(CONSTAPI.HOST + '/Pet/GetModel?ID=' + _this.props.appointInfo.PetID, header, function (data) {
                let ds = data.Message;
                if (data.Sign && ds != null) {
                    let petSexCode = ds.PetSex, petSex;
                    if (petSexCode == 'DM00004') {
                        petSex = '雌性'
                    } else {
                        petSex = '雄性'
                    }
                    _this.setState({
                        petBirthday: ds.PetBirthday,
                        petRace: ds.PetRace,
                        petWeight: ds.PetWeight,
                        petSex: petSex,
                        loaded: true,
                    });
                } else {
                    _this.setState({
                        loaded: true,
                    });
                }
            });

        }, function (err) {
            toastShort(err);
        })
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
        var typeCode = this.props.appointInfo.Type,type;
        switch(typeCode){
            case 'Foster':
                type = '寄养';
                break;
            case 'Hospital':
                type = '住院';
                break;
            case 'Service':
                type = '服务';
                break;
            case 'Treatment':
                type = '诊疗';
                break;
            case 'Vaccine':
                type = '驱虫疫苗';
                break;
            case 'Other':
                type='其他';
                break;
        }

        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>宠物信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物名称</Text>
                        <Text style={AppStyle.rowVal}>{this.props.appointInfo.PetName}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物品种</Text>
                        <Text style={AppStyle.rowVal}>{this.state.petRace}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物性别</Text>
                        <Text style={AppStyle.rowVal}>{this.state.petSex}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>出生日期</Text>
                        <Text style={AppStyle.rowVal}>{Util.getFormateTime(this.state.petBirthday, 'day')}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物体重</Text>
                        <Text style={AppStyle.rowVal}>{this.state.petWeight ? this.state.petWeight : 0} kg</Text>
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>预约信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>预约人</Text>
                        <Text style={AppStyle.rowVal}>{this.props.appointInfo.GestName}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>预约医生</Text>
                        <Text style={AppStyle.rowVal}>{this.props.appointInfo.DoctorName}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>预约类型</Text>
                        <Text style={AppStyle.rowVal}>{type}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>预约内容</Text>
                        <Text style={AppStyle.rowVal}>{this.props.appointInfo.Content}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>登记时间</Text>
                        <Text style={AppStyle.rowVal}>{regTime}</Text>
                    </View>

                    <View style={[AppStyle.row, {marginTop:10,}]}>
                        <Text style={AppStyle.rowTitle}>开始时间</Text>
                        <Text style={AppStyle.rowVal}>{starTime}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>结束时间</Text>
                        <Text style={AppStyle.rowVal}>{endTime}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({});
module.exports = AppointDetails;