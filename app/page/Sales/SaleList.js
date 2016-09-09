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
            kw: '',
            pageIndex: 1,
            pageSize: 10,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
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
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
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
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
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
                            loaded: true,
                            pageIndex: page,
                        });
                    } else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
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
                }, {
                    "Childrens": null,
                    "Field": "PaidStatus",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "SM00051",
                    "Conn": 1
                }]
                if (!isNext) {
                    NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSell/GetRecordCount', postdata, header, function (data) {
                        if (data.Sign && data.Message != null) {
                            _this.setState({
                                recordCount: data.Message,
                            });
                        } else {
                            alert("获取记录数失败：" + data.Message);
                        }
                    });
                }
            }
        ).catch(err => {
                _this.setState({
                    petDataSource: [],
                    loaded: true,
                });
                alert('error:' + err.message);
            }
        )
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
                }
            })
        }
    }

    _search(txt) {
        this._fetchData(1, false);
        this.setState({
            kw: txt,
            loaded: false,
        });
    }

    _renderPet(pet) {
        return (
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this._pressRow(pet)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:16, color:'#CC0033'}}>销售单号:{pet.DirectSellCode}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>会员:{pet.GestName}</Text>
                        <Text style={{flex: 1,}}>明细数:{pet.TotalNum}</Text>
                        <Text style={{flex: 1,}}>总价:¥{pet.TotalCost}</Text>
                        <Text style={{flex: 1,}}>折扣:¥{pet.Discount}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var body = <Loading type={'text'}/>
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             enableEmptySections={true}
                             renderRow={this._renderPet.bind(this)}
                />
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

})
module.exports = SaleList;