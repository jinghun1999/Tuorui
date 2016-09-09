/**
 * Created by User on 2016-09-07.
 */

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView,
    TextInput,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
class GoodSales extends React.Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            user: {},
            ds: ds,
            dataSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-30),
            dateTo: Util.GetDateStr(0),
            kw: '',
            totalCount: 0,
            totalAmount: 0,
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
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                let querystr = 'startDate=' + _this.state.dateFrom + '&endDate=' + _this.state.dateTo + ' 23:59:59&itemName=' + _this.state.kw;
                //GetCountItemSellDataTable
                NetUtil.get(CONSTAPI.HOST + '/Report/GetCountItemSell?' + querystr, header, function (data) {
                    let json = [
                        {
                            条码: '111111',
                            商品名: '强力多维',
                            规格: '130g/只',
                            生产商: '从而向',
                            总数量: '100',
                            单位: '只',
                            平均售价: '79',
                            总金额: '1000',
                        }, {
                            条码: '2222',
                            商品名: '强力多维',
                            规格: '130g/只',
                            生产商: '从而向',
                            总数量: '210',
                            单位: '只',
                            平均售价: '79',
                            总金额: '1000.21',
                        },
                    ]
                    let a1 = 0, a2 = 0;
                    json.forEach((d)=> {
                        a1 += parseInt(d.总数量);
                        a2 += parseFloat(d.总金额);
                    });
                    if (data.Sign && data.Message != null) {
                        //alert(data.Message)
                        _this.setState({
                            dataSource: json,//data.Message,
                            loaded: true,
                            totalCount: a1,
                            totalAmount: a2,
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

    _onRenderRow(obj) {
        return (
            <View style={styles.row}>
                <Text style={styles.itemName}>{obj.商品名}</Text>
                <View style={{flexDirection:'column', flex:1, marginLeft:15,}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.barcode}>条码: {obj.条码}</Text>
                        <Text style={{marginLeft:10, color:'#CCCC99'}}>生产商: {obj.生产商}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>总数:{obj.总数量} {obj.单位}</Text>
                        <Text style={{marginLeft:8,}}>均价:¥{obj.平均售价}</Text>
                        <Text style={{marginLeft:8,}}>总价:¥{obj.总金额}</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let searchBox = (<View style={styles.searchBox}>
            <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
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
                </View>
                <View style={styles.input}>
                    <TextInput
                        style={{height:35,flex:1,borderWidth:0}}
                        onChangeText={(text) => this.setState({kw: text})}
                        value={this.state.kw}
                        underlineColorAndroid={'transparent'}
                        placeholder={'请输入关键字'}/>
                </View>
            </View>
            <TouchableHighlight
                underlayColor='#FF0033'
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
                                  renderHeader={()=>
                                    <View style={{backgroundColor:'#e7e7e7'}}>
                                        <View style={styles.hd}>
                                            <Text style={{color:'#0099CC'}}>销售汇总</Text>
                                        </View>
                                        <View style={styles.outerRow}>
                                            <View style={styles.sumRow}>
                                                <Text style={styles.sumValue}>{this.state.totalCount}</Text>
                                                <Text style={styles.sumTitle}>总数量</Text>
                                            </View>
                                            <View style={styles.sumRow}>
                                                <Text style={styles.sumValue}>¥{this.state.totalAmount}</Text>
                                                <Text style={styles.sumTitle}>总金额</Text>
                                            </View>
                                        </View>
                                        <View style={styles.hd}></View>
                                    </View>
                                  }
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
        borderLeftColor: '#FF9999',
        paddingLeft: 5,
    },
    outerRow: {
        flexDirection: 'row',
    },
    sumRow: {
        flex: 1,
        flexDirection: 'column',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#ccc',
    },
    sumTitle: {
        color: '#CCCC99',
        fontSize: 14,
    },
    sumValue: {
        fontSize: 32,
        color: '#FF9999',
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
        backgroundColor: '#FF9999',
        padding: 2
    },
    guestName: {
        fontSize: 16,
        color: '#CC0033',
        fontWeight: 'bold',
        width: 50,
        marginLeft: 20,
    },
    input: {
        height: 35,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 3,
        marginLeft: 5,
        alignItems: 'center'
    },
    searchBox: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    searchBtn: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        height: 60,
        backgroundColor: '#FF9999',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

module.exports = GoodSales;