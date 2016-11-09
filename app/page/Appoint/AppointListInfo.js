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
import SideMenu from 'react-native-side-menu';
import AppointMenu from './AppointMenu';
import SearchTitle from '../../commonview/SearchTitle';
class AppointListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-7),
            dateTo: Util.GetDateStr(0),
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            selectedItem: '全部',
            isOpen: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    componentWillUnmount() {

    }

    fetchData() {
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
                        <Text style={{flex:1,color: '#292929',}}>{a.GestName}</Text>
                        <Text style={{color:'#EE7621'}}>类型:{type}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:1}}>
                        <Text style={{flex:1,}}>医生：{a.DoctorName}</Text>
                        <Text style={{flex:1}}>宠物:{a.PetName}</Text>
                        <Text>时间：{Util.getFormateTime(a.StartTime, 'min')}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        //修改值
        let _this = this;
        _this.setState({isOpen,});
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
        const menu=<AppointMenu dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
                                onItemSelected={(item)=>{
                                if(item=='submit'){
                                    //完成
                                    this.setState({isOpen:false,selectedItem:'时间:'+this.state.dateFrom+'至'+this.state.dateTo})
                                    this.fetchData();
                                } if(item =='cancel'){
                                    //取消
                                    this.setState({isOpen:false})
                                } if(item.indexOf('Form')>0){
                                    //日期
                                     var dateFrom = item.split(':')[1];
                                     this.setState({dateFrom:dateFrom,})
                                } if(item.indexOf('To')>0){
                                    var dateTo = item.split(':')[1];
                                    this.setState({dateTo:dateTo})
                                }
                                }}
        />
        return (
            <SideMenu menu={menu}
                      menuPosition={'right'}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={(isOpen)=>this.updateMenuState(isOpen)}
            >
                <View style={AppStyle.container}>
                    <Head title={'预约列表'} canBack={true} onPress={this._onBack.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = AppointListInfo;