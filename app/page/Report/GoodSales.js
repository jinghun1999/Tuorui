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
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
class GoodSales extends React.Component {
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
            kw: '',
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
                NetUtil.get(CONSTAPI.HOST + '/Report/GetCountItemSell?' + querystr, header, function (data) {
                    let json = [
                        {
                            '条码':'111111',
                            ItemName:'强力多维',
                            Standard:'130g/只',
                            Company:'从而向',
                            TotalCount:'100',
                            Unit:'只',
                            Price:'79',
                            TotalMoney:'1000',
                        },{
                            '条码':'22222',
                            ItemName:'强力多维2',
                            Standard:'130g/只',
                            Company:'从而向',
                            TotalCount:'100',
                            Unit:'只',
                            Price:'79',
                            TotalMoney:'1000',
                        },
                    ]
                    if (data.Sign && data.Message != null) {
                        alert(data.Message)
                        _this.setState({
                            dataSource: json,//data.Message,
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

    _onRenderRow(obj) {
        return (
            <View style={styles.row}>
                <Text style={styles.itemName}>{obj.条码}</Text>
                <View style={{flexDirection:'column', flex:1, marginLeft:15,}}>
                    <Text style={styles.barcode}>
                        {obj.BarCode}
                        <Text
                            style={{marginLeft:10, fontSize:12, color:'#fff', backgroundColor:'#ccc'}}>{obj.ItemStyle}</Text>
                    </Text>
                    <View style={{flexDirection:'row'}}>
                        <Text>售价:¥{obj.SellPrice}</Text>
                        <Text style={{marginLeft:20,}}>进价:¥{obj.InputPrice}</Text>
                        <Text style={{marginLeft:20,}}>库存:{obj.ItemCountNum}</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let searchBox = (<View
            style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#ccc', paddingBottom:5, alignItems:'center', backgroundColor:'#fff'}}>
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
                  }} onDateChange={(date) => {this.setState({dateTo: date})}}/>
                </View>
                <View
                    style={{height:35, flex:1,flexDirection:'row', backgroundColor:'#fff', borderWidth:StyleSheet.hairlineWidth, borderColor:'#ccc', borderRadius:3, marginLeft:5, alignItems:'center'}}>
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
                                  renderHeader={()=>{
                                    <View style={styles.hd}>
                                        <Text style={{color:'#CC0033'}}>商品销售统计</Text>
                                    </View>
                                  }}
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
        color: '#FF9999',
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