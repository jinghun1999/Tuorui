/**
 * Created by tuorui on 2016/9/14.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    Alert,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Picker from 'react-native-picker';
import VaccineService from './VaccineService';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
import { toastShort } from '../../util/ToastUtil';
import SideMenu from 'react-native-side-menu';
import VaccineMenu from './VaccineMenu';
import SearchTitle from '../../commonview/SearchTitle';
class VaccineListInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccine: [],
            selectVaccine: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            recordCount: 0,
            value: null,
            isOpen: false,
            dateFrom: Util.GetDateStr(-7),
            dateTo: Util.GetDateStr(0),
            selectedItem: '全部',
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1, false);
        });
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
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
                        "Field": "FactShootTime",
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
                        "Field": "FactShootTime",
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
                        "Field": "ShootStatus",
                        "Title": null,
                        "Sort": {
                            "Name": "Asc",
                            "Title": "升序"
                        },
                        "Conn": 0
                    },
                    {
                        "Field": "CreatedOn",
                        "Title": null,
                        "Sort": {
                            "Name": "Desc",
                            "Title": "降序"
                        },
                        "Conn": 0
                    }
                ],
                "index": page,
                "pageSize": _this.state.pageSize
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
            if (_this.state.value != null && _this.state.value != '') {
                postdata.items.push(gestData);
            }
            //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = NetUtil.headerClientAuth(user, hos);
            //http://test.tuoruimed.com/service/Api/Medic_Vaccine/GetPageRecord
            NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetPageRecord', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let dataSource = _this.state.vaccine;
                    if (isNext) {
                        data.Message.forEach((d)=> {
                            dataSource.push(d);
                        });
                    } else {
                        dataSource = data.Message;
                    }
                    _this.setState({
                        vaccine: dataSource,
                        loaded: true,
                        pageIndex: page,
                    });
                } else {
                    toastShort('获取数据失败：' + data.Message)
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            /*get recordCount from the api*/
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
                    "Field": "FactShootTime",
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
                    "Field": "FactShootTime",
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
            ]
            let gestFilter = {
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
            if (_this.state.value != null && _this.state.value != '') {
                postdata.push(gestFilter);
            }
            //http://test.tuoruimed.com/service/Api/Medic_Vaccine/GetRecordCount
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        toastShort("获取记录数失败：" + data.Message)
                    }
                });
            }
        }, function (err) {
            toastShort(err)
        })
    }

    _addInfo() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'VaccineService',
                component: VaccineService,
                params: {
                    headTitle: '添加疫苗',
                    canEdit: true,
                    id: 1,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onVaccDetails(vacc) {
        //疫苗详情
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'VaccineService',
                component: VaccineService,
                params: {
                    headTitle: '疫苗详情',
                    canEdit: false,
                    vaccine: vacc,
                    id: 2,//2为修改 目前不支持修改
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

    _onRenderRow(vacc) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onVaccDetails(vacc)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText,{flex:1,}]}>会员: {vacc.GestName}</Text>
                        {vacc.ShootStatus === 'SM00030' ? <Text style={{color:'#FF8247'}}>已执行</Text> :
                            <Text style={{color:'#CDC9A5'}}>未执行</Text>}
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex:2,}}>疫苗: {vacc.ItemName}</Text>
                        <Text style={{flex:1,}}>宠物: {vacc.PetName}</Text>
                        <Text style={{flex:1,}}>{vacc.CreatedOn.substr(0, 10)}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    _renderFooter() {
        //计算总页数，如果最后一页，则返回没有数据啦~
        if (this.state.pageIndex >= this.state.recordCount / this.state.pageSize) {
            return (<View></View>)
        }
        return (
            <ActivityIndicator />
        );
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
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
                          renderRow={this._onRenderRow.bind(this)}
                          initialListSize={15}
                          pageSize={15}
                          onEndReached={this._onEndReached.bind(this)}
                          enableEmptySections={true}
                          renderFooter={this._renderFooter.bind(this)}
                />
            )
        }
        const menu = <VaccineMenu dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} value={this.state.value}
                                  onItemSelected={(item)=>{
                                  if(item=='submit'){
                                    //完成
                                    this.setState({isOpen:false,selectedItem:'时间:'+this.state.dateFrom+'至'+this.state.dateTo})
                                    if(this.state.value != null && this.state.value != ''){
                                        this.setState({selectedItem:this.state.selectedItem+' 关键字:'+this.state.value})
                                    }
                                    this.fetchData(1, false);
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
                                } if(item.indexOf('ey')>0){
                                    var key = item.split(':')[1];
                                    this.setState({value:key,})
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
                    <Head title={this.props.headTitle} canAdd={true} canBack={true} edit="新增"
                          onPress={this._onBack.bind(this)}
                          editInfo={this._addInfo.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = VaccineListInfo;