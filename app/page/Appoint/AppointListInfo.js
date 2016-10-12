/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    Alert,
    ListView,
    TouchableOpacity,
    InteractionManager
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AppointDetails from './AppointDetails';
import Loading from '../../commonview/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import { toastShort } from '../../util/ToastUtil';
import DatePicker from 'react-native-datepicker';
import AppStyle from '../../theme/appstyle';

class AppointListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(0),
            dateTo: Util.GetDateStr(0),
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData();
        });
    }

    componentWillUnmount() {

    }

    _fetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let postdata = [{
                "Childrens": null,
                "Field": "StartTime",
                "Title": null,
                "Operator": {"Name": ">", "Title": "大于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateFrom + " 00:00:00",
                "Conn": 0
            }, {
                "Childrens": null,
                "Field": "StartTime",
                "Title": null,
                "Operator": {"Name": "<", "Title": "小于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateTo + " 23:59:59",
                "Conn": 1
            }]
            NetUtil.postJson(CONSTAPI.HOST + '/Appoint/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        appointSource: data.Message,
                        loaded: true,
                    })
                }
                else {
                    toastShort("获取数据失败：" + data.Exception);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            toastShort(err);
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onDetails(a) {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'AppointDetails',
                component: AppointDetails,
                params: {
                    headTitle: '预约详情',
                    appointInfo: a,
                }
            })
        }
    }

    _search() {
        this._fetchData();
    }

    _onRenderRow(a) {
        let typeCode = a.Type, type;
        switch (typeCode) {
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
                type = '其他';
                break;
        }
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onDetails(a)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText, {flex:1,color:'#CD5C5C'}]}>{a.GestName}</Text>
                        <Text style={{flex:1}}>类型:{type}</Text>
                        <Text style={{flex:1}}>宠物:{a.PetName}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:1}}>
                        <Text style={{flex:1,}}>预约医生：{a.DoctorName}</Text>
                        <Text>预约时间：{Util.getFormateTime(a.StartTime, 'min')}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    render() {
        let body = <Loading type={'text'}/>
        if (this.state.loaded) {
            if (this.state.appointSource.length != 0) {
                body = (
                    <ListView dataSource={this.state.ds.cloneWithRows(this.state.appointSource)}
                              enableEmptySections={true}
                              initialListSize={5}
                              pageSize={5}
                              renderRow={this._onRenderRow.bind(this)}
                    />
                )
            } else {
                body = (
                    <View style={AppStyle.noMore}>
                        <Text>没有符合条件的预约信息~</Text>
                    </View>
                )
            }
        }
        return (
            <View style={AppStyle.container}>
                <Head title={'预约列表'} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={AppStyle.searchBox}>
                    <Text>预约时间</Text>
                    <DatePicker
                        date={this.state.dateFrom}
                        mode="date"
                        placeholder="选择日期"
                        format="YYYY-MM-DD"
                        minDate="2015-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        style={{width:80}}
                        customStyles={{
                        dateInput: {
                          height:30,
                          borderWidth:StyleSheet.hairlineWidth,
                        },
                      }} onDateChange={(date) => {this.setState({dateFrom: date})}}/>
                    <Text> 到 </Text>
                    <DatePicker
                        date={this.state.dateTo}
                        mode="date"
                        placeholder="选择日期"
                        format="YYYY-MM-DD"
                        minDate="2010-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        style={{width:80}}
                        customStyles={{
                    dateInput: {
                      height:30,
                      borderWidth:StyleSheet.hairlineWidth,
                    },
                  }} onDateChange={(date) => {this.setState({dateTo: date})}}/>
                    <TouchableOpacity
                        underlayColor='#4169e1'
                        style={AppStyle.searchBtn}
                        onPress={this._search.bind(this)}>
                        <Text style={{color:'#fff'}}>查询</Text>
                    </TouchableOpacity>
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = AppointListInfo;