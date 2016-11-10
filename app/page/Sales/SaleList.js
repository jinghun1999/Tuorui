/**
 * Created by User on 2016-09-09.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    InteractionManager,
    ScrollView,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import SaleAdd from './SaleAdd';
import SaleDetail from './SaleDetail';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import DatePicker from  'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenu from 'react-native-side-menu';
import SaleMenu from './SaleMenu';
import AppStyle from '../../theme/appstyle';
import SearchTitle from '../../commonview/SearchTitle';

class SaleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-1),
            dateTo: Util.GetDateStr(0),
            pageIndex: 1,
            recordCount: 0,
            pageSize: 15,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isOpen: false,
            selectedItem: '全部',
            value: null,
            paidStatus: '',
            sellCode: null,
            noPayBackgroundColor: '#F0F0F0',
            payBackgroundColor: '#F0F0F0',
            allBackgroundColor: '#FF5809',
        };
        //this._search = this._search.bind(this);
    }

    _onBack() {
        requestAnimationFrame(() => {
            const {navigator}=this.props;
            if (navigator) {
                navigator.pop();
            }
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData(1, false);
        });
    }

    _pressRow(obj) {
        requestAnimationFrame(() => {
            var _this = this;
            const { navigator } = _this.props;
            if (navigator) {
                navigator.push({
                    name: 'SaleDetail',
                    component: SaleDetail,
                    params: {
                        headTitle: '销售详情',
                        sale: obj,
                    }
                });
            }
        });
    }

    _fetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let postdata = {
                "items": [{
                    "Childrens": null,
                    "Field": "CreatedOn",
                    "Title": null,
                    "Operator": {"Name": ">=", "Title": "大于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateFrom,
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "CreatedOn",
                    "Title": null,
                    "Operator": {"Name": "<=", "Title": "小于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateTo + " 23:59:59",
                    "Conn": 1
                }],
                "sorts": [{
                    "Field": "CreatedOn",
                    "Title": null,
                    "Sort": {"Name": "Desc", "Title": "降序"},
                    "Conn": 0
                }],
                index: page,
                pageSize: _this.state.pageSize
            };
            let gestdata = {
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
            let paiddata = {
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
            let selldata = {
                "Childrens": null,
                "Field": "DirectSellCode",
                "Title": null,
                "Operator": {
                    "Name": "like",
                    "Title": "相似",
                    "Expression": " @File like '%' + @Value + '%' "
                },
                "DataType": 0,
                "Value": _this.state.sellCode,
                "Conn": 1
            };
            if (_this.state.value != null && _this.state.value != '') {
                postdata.items.push(gestdata);
            }
            if (_this.state.paidStatus != null && _this.state.paidStatus != '') {
                postdata.items.push(paiddata);
            }
            if (_this.state.sellCode != null && _this.state.sellCode != '') {
                postdata.items.push(selldata)
            }
            NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSell/GetPageRecord', postdata, header, function (data) {
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
                        pageIndex: page,
                    });
                } else {
                    toastShort("获取数据失败：" + data.Exception);
                }
            });

            postdata = [
                {
                    "Childrens": null,
                    "Field": "1",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "1",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "CreatedOn",
                    "Title": null,
                    "Operator": {"Name": ">=", "Title": "大于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateFrom + " 00:00:00",
                    "Conn": 1
                }, {
                    "Childrens": null,
                    "Field": "CreatedOn",
                    "Title": null,
                    "Operator": {"Name": "<=", "Title": "小于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateTo + " 23:59:59",
                    "Conn": 1
                }
            ];
            gestdata = {
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
            paiddata = {
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
            selldata = {
                "Childrens": null,
                "Field": "DirectSellCode",
                "Title": null,
                "Operator": {
                    "Name": "like",
                    "Title": "相似",
                    "Expression": " @File like '%' + @Value + '%' "
                },
                "DataType": 0,
                "Value": _this.state.sellCode,
                "Conn": 1
            };
            if (_this.state.value != null && _this.state.value != '') {
                postdata.push(gestdata);
            }
            if (_this.state.paidStatus != null && _this.state.paidStatus != '') {
                postdata.push(paiddata);
            }
            if (_this.state.sellCode != null && _this.state.sellCode != '') {
                postdata.push(selldata)
            }
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSell/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                            loaded: true,
                        });
                    } else {
                        toastShort("获取记录数失败：" + data.Exception);
                    }
                });
            }
        }, function (err) {
            toastShort(err);
        });
    }

    _onEndReached() {
        this._fetchData(this.state.pageIndex + 1, true);
    }

    _onAdd() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'SaleAdd',
                component: SaleAdd,
                params: {
                    headTitle: '新销售单',
                    getResult: function () {
                        _this._fetchData(1, false);
                    }
                }
            })
        }
    }

    _renderRow(obj) {
        let status = (<Text style={{color:'#FF9999',flex:1, textAlign:'right'}}>未付款</Text>)
        if (obj.PaidStatus == 'SM00051') {
            status = (<Text style={{color:'#99CC66',flex:1, textAlign:'right'}}>已付款</Text>)
        }
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._pressRow(obj)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <Text style={{fontSize:16, flex:2, color:'#CC0033'}}>单号:{obj.DirectSellCode}</Text>
                        {status}
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>会员:{obj.GestName}</Text>
                        <Text style={{flex: 1,}}>总价:¥{obj.TotalCost}</Text>
                        <Text style={{flex: 2, textAlign:'right'}}>{Util.getFormateTime(obj.CreatedOn, 'min')}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>

            </TouchableOpacity>
        )
    }

    _renderFooter() {
        //计算总页数，如果最后一页，则返回没有数据啦~
        let totalPage = this.state.recordCount / this.state.pageSize;
        if (this.state.pageIndex >= totalPage) {
            return (
                <View style={{height: 40, justifyContent:'center', alignItems:'center'}}>
                </View>
            )
        }
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
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
        var body = <Loading type={'text'}/>
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             enableEmptySections={true}
                             initialListSize={15}
                             pageSize={15}
                             onEndReached={this._onEndReached.bind(this)}
                             renderRow={this._renderRow.bind(this)}
                             renderFooter={this._renderFooter.bind(this)}/>
        }
        const menu = <SaleMenu dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
                               value={this.state.value} sellCode={this.state.sellCode}
                               noColor={this.state.noPayBackgroundColor} payColor={this.state.payBackgroundColor}
                               allColor={this.state.allBackgroundColor}
                               onItemSelected={(item)=>{
                                if(item=='submit'){
                                    //完成
                                    var searchName = '时间:'+this.state.dateFrom+'至'+this.state.dateTo;
                                    this.setState({isOpen:false,selectedItem:searchName})
                                    if(this.state.value!=null && this.state.value !=''){
                                        this.setState({selectedItem:searchName+' 关键字:'+this.state.value})
                                    }
                                    if(this.state.sellCode!=null&&this.state.sellCode!=''){
                                        this.setState({selectedItem:searchName+' 销售单号:'+this.state.sellCode})
                                    }
                                    if(this.state.paidStatus!==null&&this.state.paidStatus!==''){
                                    var status='';
                                        if(this.state.paidStatus=='SM00051'){
                                            status='已支付'
                                        }else if(this.state.paidStatus=='SM00040'){
                                            status='未支付'
                                        }
                                    this.setState({selectedItem:searchName+' 支付状态:'+status})
                                }
                                    this._fetchData(1, false);
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
                                    //会员信息
                                    var key = item.split(':')[1];
                                    this.setState({value:key,})
                                } if(item==='no'){
                                    this.setState({noPayBackgroundColor:'#FF5809',payBackgroundColor:'#F0F0F0',allBackgroundColor:'#F0F0F0',paidStatus:'SM00040',})
                                } if(item ==='pay'){
                                    this.setState({payBackgroundColor:'#FF5809',noPayBackgroundColor:'#F0F0F0',allBackgroundColor:'#F0F0F0',paidStatus:'SM00051',})
                                } if(item ==='all'){
                                    this.setState({allBackgroundColor:'#FF5809',noPayBackgroundColor:'#F0F0F0',payBackgroundColor:'#F0F0F0',paidStatus:''})
                                } if(item.indexOf('Code')>0){
                                    //销售单号
                                    var code = item.split(':')[1];
                                    this.setState({sellCode:code})
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
                    <Head title={this.props.headTitle}
                          canBack={true}
                          onPress={this._onBack.bind(this)}
                          canAdd={true}
                          edit="新增"
                          editInfo={this._onAdd.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
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
    searchTextInput: {
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },
    row: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
})
module.exports = SaleList;