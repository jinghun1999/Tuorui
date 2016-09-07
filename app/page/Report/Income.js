/**
 * Created by User on 2016-09-05.
 */

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView,
    InteractionManager,
    } from 'react-native';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
class Income extends React.Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        this.state = {
            user: {},
            ds: ds,
            dataSource: [],
            loaded: false,
            dateFrom: year + "-" + month + "-1",
            dateTo: year + "-" + month + "-" + day,
        };
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        _this.setState({
            loaded: false,
        })
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
                let postdata = [{
                    "Childrens": null,
                    "Field": "1",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "1",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "PaidTime",
                    "Title": null,
                    "Operator": {"Name": ">=", "Title": "大于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateFrom,
                    "Conn": 1
                }, {
                    "Childrens": null,
                    "Field": "PaidTime",
                    "Title": null,
                    "Operator": {"Name": "<=", "Title": "小于等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.dateTo + ' 23:59:59',
                    "Conn": 1
                }];
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                NetUtil.postJson(CONSTAPI.HOST + '/HasPaidTotal/GetModelList', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            dataSource: data.Message,
                            loaded: true,
                        });
                    } else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    memberLoaded: true,
                });
                alert('error:' + err.message);
            }
        );
    }

    _search() {
        this.fetchData();
    }

    _renderHeader() {
        return (
            <View style={{backgroundColor:'#e7e7e7'}}>
                <View style={styles.hd}>
                    <Text style={{color:'#CC0033'}}>营收明细</Text>
                </View>
                <View style={styles.outerRow}>
                    <View style={styles.sumRow}>
                        <Text style={styles.sumValue}>1200</Text>
                        <Text style={styles.sumTitle}>销售数量</Text>
                    </View>
                    <View style={styles.sumRow}>
                        <Text style={styles.sumValue}>1200</Text>
                        <Text style={styles.sumTitle}>销售额</Text>
                    </View>
                    <View style={[styles.sumRow,{borderRightWidth:0}]}>
                        <Text style={styles.sumValue}>1200</Text>
                        <Text style={styles.sumTitle}>销售成本</Text>
                    </View>
                </View>
                <View style={styles.outerRow}>
                    <View style={[styles.sumRow,{borderBottomWidth:0}]}>
                        <Text style={styles.sumValue}>1200034.32</Text>
                        <Text style={styles.sumTitle}>优惠成本</Text>
                    </View>
                    <View style={[styles.sumRow,{borderBottomWidth:0}]}>
                        <Text style={styles.sumValue}>1200</Text>
                        <Text style={styles.sumTitle}>其他成本</Text>
                    </View>
                    <View style={[styles.sumRow,{borderBottomWidth:0, borderRightWidth:0}]}>
                        <Text style={styles.sumValue}>1200</Text>
                        <Text style={styles.sumTitle}>利润</Text>
                    </View>
                </View>
                <View style={styles.hd}>
                    <Text style={{color:'#CC0033'}}>营收明细</Text>
                </View>
            </View>
        )
    }

    _onRenderRow(obj) {
        return (
            <View style={styles.row}>
                <Text style={styles.itemName}>{obj.ItemName}</Text>
                <Text style={styles.guestName}>{obj.GestName}</Text>
                <Text style={{marginLeft:20,}}>实价:{obj.InfactPrice}</Text>
                <Text style={{marginLeft:20,}}>优惠:{obj.DisCountMoney}</Text>
                <Text style={{marginLeft:20,}}>数量:{obj.TotalNum}</Text>
            </View>
        );
    }

    render() {
        let searchBox = (<View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#fff'}}>
            <Text style={{marginLeft:10}}>从</Text>
            <DatePicker
                date={this.state.dateFrom}
                mode="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                minDate="2010-01-01"
                maxDate="2020-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={true}
                customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      height:30,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginRight: 36,
                      height:30,
                      borderWidth:StyleSheet.hairlineWidth,
                    },
                  }}
                onDateChange={(date) => {this.setState({dateFrom: date})}}/>
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
                showIcon={true}
                customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      height:30,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginRight: 36,
                      height:30,
                      borderWidth:StyleSheet.hairlineWidth,
                    },
                  }}
                onDateChange={(date) => {this.setState({dateTo: date})}}/>
            <TouchableHighlight
                underlayColor='#4169e1'
                style={styles.searchBtn}
                onPress={this._search.bind(this)}>
                <Text style={{color:'#fff'}}>查询</Text>
            </TouchableHighlight>
        </View>)
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    {searchBox}
                    <View style={{ backgroundColor:'#fff', flex:1}}>
                        <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                  renderRow={this._onRenderRow.bind(this)}
                                  renderHeader={this._renderHeader.bind(this)}
                                  initialListSize={15}
                                  pageSize={15}
                                  enableEmptySections={true}
                            />
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    {searchBox}
                    <Loading type={'text'}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    hd: {
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
    },
    outerRow: {
        flexDirection: 'row',
    },
    sumRow: {
        flex: 1,
        flexDirection: 'column',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#333',
    },
    sumTitle: {
        color: '#CCCC99',
        fontSize: 14,
    },
    sumValue: {
        fontSize: 24,
        color: '#FF6666',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    itemName: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        width: 100,
        backgroundColor: '#CC0033',
        padding: 2
    },
    guestName: {
        fontSize: 16,
        color: '#CC0033',
        fontWeight: 'bold',
        width: 50,
        marginLeft: 20,
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
});

module.exports = Income;