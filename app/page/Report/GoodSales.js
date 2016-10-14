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
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import AppStyle from '../../theme/appstyle';
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
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let querystr = 'startDate=' + _this.state.dateFrom + '&endDate=' + _this.state.dateTo + ' 23:59:59&itemName=' + _this.state.kw;
            NetUtil.get(CONSTAPI.HOST + '/Report/GetCountItemSellDataTable?' + querystr, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let a1 = 0, a2 = 0, json = data.Message;
                    json.forEach((d)=> {
                        a1 += parseInt(d.总数量);
                        a2 += parseFloat(d.总金额);
                    });
                    _this.setState({
                        dataSource: json,
                        loaded: true,
                        totalCount: a1,
                        totalAmount: a2.toFixed(2),
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
        }, function (err) {
            toastShort(err);
        });
    }

    _search() {
        this.fetchData();
    }

    _renderHead() {
        return (
            <View style={{backgroundColor:'#e7e7e7'}}>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>销售汇总</Text>
                </View>
                <View style={AppStyle.outerRow}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}>{this.state.totalCount}</Text>
                        <Text style={AppStyle.sumTitle}>总数量</Text>
                    </View>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.totalAmount}</Text>
                        <Text style={AppStyle.sumTitle}>总金额</Text>
                    </View>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>销售记录</Text>
                </View>
            </View>
        );
    }

    _onRenderRow(obj) {
        return (
            <View style={AppStyle.listRow}>
                <View style={{flexDirection:'row'}}>
                    <Text style={AppStyle.itemName}>{obj.商品名}</Text>
                    <Text style={AppStyle.subName}>{obj.条码}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>总数:{obj.总数量} {obj.单位}</Text>
                    <Text style={{marginLeft:8,}}>均价:¥{obj.平均售价}</Text>
                    <Text style={{marginLeft:8,}}>总价:¥{obj.总金额}</Text>
                </View>
            </View>
        );
    }

    render() {
        let searchBox = (
            <View>
                <View style={[AppStyle.searchBox, {paddingBottom:0}]}>
                    <Text>查询日期从</Text>
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
                        style={{width:100}}
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
                        style={{width:100}}
                        customStyles={{
                            dateInput: {
                              height:30,
                              borderWidth:StyleSheet.hairlineWidth,
                            },
                          }} onDateChange={(date) => {this.setState({dateTo: date})}}/>
                </View>
                <View style={[AppStyle.searchBox, {paddingTop:5}]}>
                    <View style={AppStyle.searchTextInput}>
                        <TextInput
                            style={{height:35,flex:1,borderWidth:0}}
                            onChangeText={(text) => this.setState({kw: text})}
                            value={this.state.kw}
                            underlineColorAndroid={'transparent'}
                            placeholder={'商品名/条码/拼音码'}/>
                    </View>
                    <TouchableHighlight
                        underlayColor='#999933'
                        style={AppStyle.searchBtn}
                        onPress={this._search.bind(this)}>
                        <Text style={{color:'#fff'}}>查询</Text>
                    </TouchableHighlight>
                </View>
            </View>)
        if (this.state.loaded) {
            return (
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    {searchBox}
                    <View style={{ backgroundColor:'#fff', flex:1}}>
                        <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                  renderRow={this._onRenderRow.bind(this)}
                                  renderHeader={this._renderHead.bind(this)}
                                  initialListSize={15}
                                  pageSize={15}
                                  enableEmptySections={true}
                            />
                    </View>
                </View>
            )
        } else {
            return (
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    {searchBox}
                    <Loading type={'text'}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({});

module.exports = GoodSales;