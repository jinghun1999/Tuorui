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

import DatePicker from  'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        };
        this._search = this._search.bind(this);
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData(1, false);
        });
    }

    _pressRow(obj) {
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
    }

    _fetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            let postdata = {
                "items": [{
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "CreatedOn",
                    "Title": null,
                    "Operator": {"Name": ">=", "Title": "大于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateFrom,
                    "Conn": 1
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
                    "Field": "PaidStatus,CreatedOn",
                    "Title": null,
                    "Sort": {"Name": "Desc", "Title": "降序"},
                    "Conn": 0
                }],
                index: page,
                pageSize: _this.state.pageSize
            };
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
                    alert("获取数据失败：" + data.Message);
                }
            });
            postdata = [{
                "Childrens": null,
                "Field": "IsDeleted",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "0",
                "Conn": 0
            }, {
                "Childrens": null,
                "Field": "CreatedOn",
                "Title": null,
                "Operator": {"Name": ">=", "Title": "大于等于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateFrom,
                "Conn": 1
            }, {
                "Childrens": null,
                "Field": "CreatedOn",
                "Title": null,
                "Operator": {"Name": "<=", "Title": "小于等于", "Expression": null},
                "DataType": 0,
                "Value": _this.state.dateTo + " 23:59:59",
                "Conn": 1
            }]
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSell/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                            loaded: true,
                        });
                    } else {
                        alert("获取记录数失败：" + data.Message);
                    }
                });
            }
        }, function (err) {

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
                        _this.search();
                    }
                }
            })
        }
    }

    _search() {
        this._fetchData(1, false);
    }

    _renderRow(obj) {
        let status = (<Text style={{color:'#FF6666'}}>未付款</Text>)
        if (obj.PaidStatus == 'SM00051') {
            status = (<Text style={{color:'#FF0033'}}>已付款</Text>)
        }
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._pressRow(obj)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:16, color:'#CC0033'}}>销售单号:{obj.DirectSellCode}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>会员:{obj.GestName}</Text>
                        <Text style={{flex: 1,}}>明细数:{obj.TotalNum}</Text>
                        <Text style={{flex: 1,}}>总价:¥{obj.TotalCost}</Text>
                        <Text style={{flex: 1,}}>折扣:¥{obj.Discount}</Text>
                        {status}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _renderFooter() {
        //计算总页数，如果最后一页，则返回没有数据啦~
        let totalPage = this.state.recordCount / this.state.pageSize;
        if (this.state.pageIndex >= totalPage) {
            return (
                <View style={{height: 40, justifyContent:'center', alignItems:'center'}}>
                    <Text>没有更多数据了~</Text>
                </View>
            )
        }
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
        );
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
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle}
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={true}
                      edit="新增"
                      editInfo={this._onAdd.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.searchRow}>
                        <Text style={{marginLeft:10}}>购买时间</Text>
                        <DatePicker
                            date={this.state.dateFrom}
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
                  }} onDateChange={(date) => {this.setState({dateFrom: date})}}/>
                        <Text>到</Text>
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
                </ScrollView>
            </View>
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
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
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
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
})
module.exports = SaleList;