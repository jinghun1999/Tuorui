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
import DatePicker from 'react-native-datepicker';
import AppStyle from '../../theme/AppStyle';

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
            this._onFetchData();
        });
    }

    componentWillUnmount() {

    }

    _onFetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let postdata = [{
                "Childrens": null,
                "Field": "IsDeleted",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "0",
                "Conn": 0
            }, {
                "Childrens": null,
                "Field": "StartTime",
                "Title": null,
                "Operator": {"Name": ">", "Title": "大于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateFrom + " 00:00:00",
                "Conn": 1
            }, {
                "Childrens": null,
                "Field": "StartTime",
                "Title": null,
                "Operator": {"Name": "<", "Title": "小于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateTo + " 23:59:59",
                "Conn": 1
            }]
            //预约信息接口 http://test.tuoruimed.com/service/Api/Appoint/GetModelList
            NetUtil.postJson(CONSTAPI.HOST + '/Appoint/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        appointSource: data.Message,
                        loaded: true,
                    })
                }
                else {
                    Alert.alert('提示', "获取数据失败：" + data.Message, [{text: '确定'}]);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            _this.setState({
                loaded: true,
            });
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
        this._onFetchData();
    }

    _onRenderRow(a) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onDetails(a)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={AppStyle.titleText}>会员：{a.GestName}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex:1,}}>预约医生：{a.DoctorName}</Text>
                        <Text>时间：{Util.getFormateTime(a.StartTime, 'min')}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    render() {
        let body = <Loading type="text"/>
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
                        <Text>没有符合条件的预约信息.</Text>
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