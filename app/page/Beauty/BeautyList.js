/**
 * Created by tuorui on 2016/9/8.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    Alert,
    ListView,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import BeautyInfo from './BeautyInfo';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
import DatePicker from 'react-native-datepicker';
import SideMenu from 'react-native-side-menu';
import BeautyMenu from './BeautyMenu';
import SearchTitle from '../../commonview/SearchTitle';
class BeautyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isOpen: false,
            selectedItem: '全部',
            pageSize: 15,
            pageIndex: 1,
            dataSource: [],
            recordCount: 0,
            searchID: 0,
            value: null,
            dateFrom: Util.GetDateStr(-7),
            dateTo: Util.GetDateStr(0),
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            noPayBackgroundColor: '#F0F0F0',
            payBackgroundColor: '#F0F0F0',
            allBackgroundColor: '#FF5809',
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1, false);
        });
    }

    fetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = {
                "items": [
                    {
                        "Childrens": null,
                        "Field": "1",
                        "Title": null,
                        "Operator": {
                            "Name": "=",
                            "Title": "等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": "1",
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Operator": {
                            "Name": ">=",
                            "Title": "大于等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": _this.state.dateFrom + " 00:00:00",
                        "Conn": 1
                    },
                    {
                        "Childrens": null,
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Operator": {
                            "Name": "<=",
                            "Title": "小于等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": _this.state.dateTo + " 23:59:59",
                        "Conn": 1
                    }
                ],
                "sorts": [
                    {
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Sort": {
                            "Name": "Desc",
                            "Title": "降序"
                        },
                        "Conn": 0
                    }
                ],
                index: page,
                pageSize: _this.state.pageSize
            };

            let gestData = {
                "Childrens": [
                    {
                        "Childrens": null,
                        "Field": "GestCode",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "GestName",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    },
                    {
                        "Childrens": null,
                        "Field": "MobilePhone",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    }
                ],
                "Field": null,
                "Title": null,
                "Operator": null,
                "DataType": 0,
                "Value": null,
                "Conn": 1
            };
            let paidData = {
                "Childrens": null,
                "Field": "PaidStatus",
                "Title": null,
                "Operator": {
                    "Name": "=",
                    "Title": "等于",
                    "Expression": null
                },
                "DataType": 0,
                "Value": _this.state.paidStatus,
                "Conn": 1
            };
            if (_this.state.value != null && _this.state.value != '') {
                postdata.items.push(gestData);
            }
            if (_this.state.paidStatus != null && _this.state.paidStatus != '') {
                postdata.items.push(paidData);
            }
            //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/Service/GetPageRecord', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let dataSource = _this.state.dataSource;
                    if (isNext) {
                        data.Message.forEach((d)=> {
                            dataSource.push(d);
                        });
                    } else {
                        dataSource = data.Message;
                    }
                    _this.setState({
                        dataSource: dataSource,
                        loaded: true,
                        pageIndex: page,
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            let guestFilter = {
                "Childrens": [
                    {
                        "Childrens": null,
                        "Field": "GestCode",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "GestName",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    },
                    {
                        "Childrens": null,
                        "Field": "MobilePhone",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    }
                ],
                "Field": null,
                "Title": null,
                "Operator": null,
                "DataType": 0,
                "Value": null,
                "Conn": 1
            };
            let paidFilter = {
                "Childrens": null,
                "Field": "PaidStatus",
                "Title": null,
                "Operator": {
                    "Name": "=",
                    "Title": "等于",
                    "Expression": null
                },
                "DataType": 0,
                "Value": _this.state.paidStatus,
                "Conn": 1
            };
            postdata = [
                {
                    "Childrens": null,
                    "Field": "1",
                    "Title": null,
                    "Operator": {
                        "Name": "=",
                        "Title": "等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": "1",
                    "Conn": 0
                },
                {
                    "Childrens": null,
                    "Field": "ModifiedOn",
                    "Title": null,
                    "Operator": {
                        "Name": ">=",
                        "Title": "大于等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": _this.state.dateFrom + " 00:00:00",
                    "Conn": 1
                },
                {
                    "Childrens": null,
                    "Field": "ModifiedOn",
                    "Title": null,
                    "Operator": {
                        "Name": "<=",
                        "Title": "小于等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": _this.state.dateTo + " 23:59:59",
                    "Conn": 1
                }
            ];
            if (_this.state.value != null && _this.state.value != '') {
                postdata.push(guestFilter);
            }
            if (_this.state.paidStatus != null && _this.state.paidStatus != '') {
                postdata.push(paidFilter);
            }
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Service/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        toastShort("获取记录数失败：" + data.Message);
                    }
                });
            }
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

    _onAdd() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautyInfo',
                component: BeautyInfo,
                params: {
                    headTitle: '新增美容',
                    canEdit: true,
                    beautyID: 1,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onBeautyDetails(beauty) {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautyInfo',
                component: BeautyInfo,
                params: {
                    headTitle: '美容详情',
                    canEdit: false,
                    beautyID: 2,
                    beautyInfo: beauty,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onEndReached() {
        this.fetchData(this.state.pageIndex + 1, true);
    }

    _renderFooter() {
        if (this.state.pageIndex >= this.state.recordCount / this.state.pageSize) {
            return (
                <View style={AppStyle.noMore}>
                </View>
            )
        }
        return (
            <ActivityIndicator />
        );
    }

    _onRenderRow(beauty) {
        //PaidStatus=SM00051
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onBeautyDetails(beauty)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText,{flex:1,}]}>会员: {beauty.GestName}</Text>
                        {beauty.PaidStatus === 'SM00051' ? <Text style={{color:'#FF8247'}}>已付款</Text> :
                            <Text style={{color:'#CDC9A5'}}>未付款</Text>}
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex:1}}>宠物: {beauty.PetName}</Text>
                        <Text style={{flex:1, textAlign:'right'}}>{beauty.CreatedOn.replace('T', ' ')}</Text>
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
        var body = <Loading type="text"/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             enableEmptySections={true}
                             renderRow={this._onRenderRow.bind(this)}
                             onEndReached={this._onEndReached.bind(this)}
                             renderFooter={this._renderFooter.bind(this)}/>
        }
        const menu = <BeautyMenu onItemSelected={(item)=>{
            if(item=='submit'){
                this.setState({isOpen:false,selectedItem:'时间:'+this.state.dateFrom+'至'+this.state.dateTo})
                if(this.state.paidStatus!=null && this.state.paidStatus!=''){
                    var status='';
                    if(this.state.paidStatus=='SM00051'){
                        status='已支付'
                    }else if(this.state.paidStatus=='SM00040'){
                        status='未支付'
                    }
                    this.setState({selectedItem:this.state.selectedItem+' 支付状态:'+status})
                }
                if(this.state.value != null && this.state.value != ''){
                    this.setState({selectedItem:this.state.selectedItem+' 关键字:'+this.state.value})
                }
               this.fetchData(1, false);
               return false;
            }else if(item =='cancel'){
                this.setState({isOpen:false})
                 return false;
            }else if(item.indexOf('Form')>0){
                var dateFrom = item.split(':')[1];
                 this.setState({dateFrom:dateFrom,})
                  return false;
            }else if(item.indexOf('To')>0){
                var dateTo = item.split(':')[1];
                this.setState({dateTo:dateTo})
                 return false;
            }else if(item=='no'){
                this.setState({noPayBackgroundColor:'#FF5809',payBackgroundColor:'#F0F0F0',allBackgroundColor:'#F0F0F0',paidStatus:'SM00040',})
                 return false;
            }else if(item=='pay'){
                this.setState({payBackgroundColor:'#FF5809',noPayBackgroundColor:'#F0F0F0',allBackgroundColor:'#F0F0F0',paidStatus:'SM00051',})
                 return false;
            }else if(item =='all'){
                this.setState({allBackgroundColor:'#FF5809',noPayBackgroundColor:'#F0F0F0',payBackgroundColor:'#F0F0F0',paidStatus:''})
                 return false;
            }else if(item.indexOf('ey')>0){
                var key = item.split(':')[1];
                this.setState({value:key,})
                 return false;
            }
        }}
                                 dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
                                 noColor={this.state.noPayBackgroundColor} payColor={this.state.payBackgroundColor}
                                 allColor={this.state.allBackgroundColor} value={this.state.value}/>;
        return (
            <SideMenu menu={menu}
                      menuPosition={'right'}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={(isOpen)=>this.updateMenuState(isOpen)}
            >
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle}
                          canBack={true}
                          onPress={this._onBack.bind(this)}
                          canAdd={true}
                          edit="新增"
                          editInfo={this._onAdd.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu >
        )
    }
}
const styles = StyleSheet.create({})
module.exports = BeautyList;