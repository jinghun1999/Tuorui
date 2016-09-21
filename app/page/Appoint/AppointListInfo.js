/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import AppointDetails from './AppointDetails';
import DatePicker from  'react-native-datepicker';
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
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._onFetchData();
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onFetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
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
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            alert(err)
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAppointDetails(a) {
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
        let _this = this;
        _this._onFetchData();
    }

    _onRenderRow(a) {
        var time = Util.getFormateTime(a.StartTime, 'min');
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onAppointDetails(a)}>
                <View style={{flex:1,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={{fontSize:16, color:'#27408B',fontWeight:'bold'}}>预约医生:{a.DoctorName}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{width:150}}>预约人: {a.GestName}</Text>
                        <Text style={{flex:1,}}>预约时间:{time}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
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
                    <View style={styles.noResultContainer}>
                        <View style={styles.noResult}>
                            <Text>无数据~您所选日期没有预约信息!</Text>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.searchRow}>
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
                        style={styles.searchBtn}
                        onPress={this._search.bind(this)}>
                        <Text style={{color:'#fff'}}>查询</Text>
                    </TouchableOpacity>
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    searchRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
    },
    searchBtn: {
        height: 30,
        width: 50,
        marginLeft: 10,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    noResultContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    noResult: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        height: 50,
        padding: 20,
    },
})
module.exports = AppointListInfo;