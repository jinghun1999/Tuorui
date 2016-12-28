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
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import AppStyle from '../../theme/appstyle';
import SideMenu from 'react-native-side-menu';
import IncomeMenu from './IncomeMenu';
import SearchTitle from '../../commonview/SearchTitle';
class Income extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            sumInfo: {
                TotalNum: 0,
                SellTotal: 0,
                InPrice: 0,
                Discount: 0,
                BackMoney: 0,
                Profit: 0,
            },
            dataSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-7),
            dateTo: Util.GetDateStr(0),
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
            let postdata = [
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
                }
            ];
            NetUtil.postJson(CONSTAPI.HOST + '/HasPaidTotal/GetModelList', postdata, header, function (data) {
                let ds = data.Message;
                if (data.Sign && ds != null) {
                    _this.setState({
                        dataSource: ds,
                        loaded: true,
                    });
                } else {
                    toastShort("获取数据失败：" + ds);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            NetUtil.get(CONSTAPI.HOST + '/Report/GetSumTotalEarnMoney?startDate=' + _this.state.dateFrom + '&endDate=' + _this.state.dateTo + ' 23:59:59', header, function (data) {
                let ds = data.Message;
                if (data.Sign && ds != null) {
                    _this.setState({
                        sumInfo: ds,
                        loaded: true,
                    });
                } else {
                    _this.setState({
                        loaded: true,
                    });
                }
            });
        }, function (err) {
            toastShort(err);
        });
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

    _renderHeader() {
        return (
            <View style={{backgroundColor:'#e7e7e7'}}>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>营收汇总</Text>
                </View>
                <View style={AppStyle.outerRow}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}>{this.state.sumInfo.TotalNum}</Text>
                        <Text style={AppStyle.sumTitle}>销售数量</Text>
                    </View>
                    <View style={[AppStyle.sumRow,{borderRightWidth:0}]}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.sumInfo.SellTotal.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>销售额</Text>
                    </View>
                </View>
                <View style={AppStyle.outerRow}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.sumInfo.InPrice.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>销售成本</Text>
                    </View>
                    <View style={[AppStyle.sumRow,{borderRightWidth:0}]}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.sumInfo.Discount.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>优惠成本</Text>
                    </View>
                </View>
                <View style={[AppStyle.outerRow,{borderBottomWidth:0,}]}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.sumInfo.BackMoney.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>其他成本</Text>
                    </View>
                    <View style={[AppStyle.sumRow,{borderRightWidth:0}]}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.sumInfo.Profit.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>利润</Text>
                    </View>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>营收明细</Text>
                </View>
            </View>
        )
    }

    _onRenderRow(obj) {
        return (
            <View style={AppStyle.listRow}>
                <View style={{flexDirection:'row'}}>
                    <Text style={AppStyle.itemName}>{obj.ItemName}</Text>
                    <Text style={AppStyle.subName}>{obj.GestName}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>实价:¥{obj.InfactPrice}</Text>
                    <Text style={{marginLeft:8,}}>优惠:¥{obj.DetailDiscountMoney}</Text>
                    <Text style={{marginLeft:8,}}>数量:{obj.TotalNum}</Text>
                </View>
            </View>
        );
    }

    render() {
        let searchBox = <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
        let body = <Loading type={'text'}/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             renderRow={this._onRenderRow.bind(this)}
                             renderHeader={this._renderHeader.bind(this)}
                             initialListSize={15}
                             pageSize={15}
                             enableEmptySections={true}
            />
        }
        const menu=<IncomeMenu dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
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
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({});

module.exports = Income;