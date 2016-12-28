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
class StockCapital extends React.Component {
    constructor(props) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            user: {},
            ds: ds,
            dataSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-30),
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
                let postdata = [];
                let header = NetUtil.headerClientAuth(user, hos);
                NetUtil.postJson(CONSTAPI.HOST + '/ItemCount/GetModelList', postdata, header, function (data) {
                    let dt = data.Message;
                    if (data.Sign && dt != null) {
                        let _count = 0, _val = 0.00, _cb = 0.00, _lr = 0.00;
                        dt.forEach((d)=> {
                            _count += d.ItemCountNum;
                            _val += d.ItemCountNum * d.SellPrice;
                            _cb += d.ItemCountNum * d.InputPrice;
                            _lr += d.ItemCountNum * d.SellPrice - d.ItemCountNum * d.InputPrice;
                        });
                        _this.setState({
                            dataSource: dt,
                            loaded: true,
                            totalCount: _count,
                            totalVal: _val.toFixed(2),
                            totalCB: _cb.toFixed(2),
                            totalLR: _lr.toFixed(2),
                        });
                    } else {
                        toastShort("获取数据失败：" + dt);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
            }, function (err) {
                toastShort(err);
            }
        );
    }

    _renderHeader() {
        return (
            <View style={{backgroundColor:'#e7e7e7'}}>
                <View style={AppStyle.groupTitle}>
                    <Text style={{color:'#CC0033'}}>资产汇总</Text>
                </View>
                <View style={AppStyle.outerRow}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}>{this.state.totalCount.toFixed(2)}</Text>
                        <Text style={AppStyle.sumTitle}>资产数量</Text>
                    </View>
                    <View style={[AppStyle.sumRow,{borderRightWidth:0,}]}>
                        <Text style={AppStyle.sumValue}><Text style={AppStyle.moneyText}>¥</Text>{this.state.totalVal}
                        </Text>
                        <Text style={AppStyle.sumTitle}>资产价值</Text>
                    </View>
                </View>
                <View style={[AppStyle.outerRow,{borderBottomWidth:0}]}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}><Text style={AppStyle.moneyText}>¥</Text>{this.state.totalCB}
                        </Text>
                        <Text style={AppStyle.sumTitle}>资产成本</Text>
                    </View>
                    <View style={[AppStyle.sumRow,{borderRightWidth:0}]}>
                        <Text style={AppStyle.sumValue}><Text style={AppStyle.moneyText}>¥</Text>{this.state.totalLR}
                        </Text>
                        <Text style={AppStyle.sumTitle}>资产利润</Text>
                    </View>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={{color:'#CC0033'}}>营收明细</Text>
                </View>
            </View>
        )
    }

    _onRenderRow(obj) {
        return (
            <View style={AppStyle.listRow}>
                <View style={{flexDirection:'row'}}>
                    <Text style={AppStyle.itemName}>{obj.ItemName}</Text>
                    <Text style={AppStyle.subName}>{obj.ItemCode}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>售价:¥{obj.SellPrice}</Text>
                    <Text style={{marginLeft:8,}}>进价:¥{obj.InputPrice}</Text>
                    <Text style={{marginLeft:8,}}>库存:{obj.ItemCountNum}</Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
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
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <Loading type={'text'}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({});

module.exports = StockCapital;