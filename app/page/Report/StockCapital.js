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

import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
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
                let postdata = [{
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 0
                }];
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
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
                        alert("获取数据失败：" + dt);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
            }, function (err) {

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
                    <Text style={{color:'#0099CC'}}>资产汇总</Text>
                </View>
                <View style={styles.outerRow}>
                    <View style={styles.sumRow}>
                        <Text style={styles.sumValue}>{this.state.totalCount}</Text>
                        <Text style={styles.sumTitle}>资产数量</Text>
                    </View>
                    <View style={[styles.sumRow,{borderRightWidth:0,}]}>
                        <Text style={styles.sumValue}>¥{this.state.totalVal}</Text>
                        <Text style={styles.sumTitle}>资产价值</Text>
                    </View>
                </View>
                <View style={[styles.outerRow,{borderBottomWidth:0}]}>
                    <View style={styles.sumRow}>
                        <Text style={styles.sumValue}>¥{this.state.totalCB}</Text>
                        <Text style={styles.sumTitle}>资产成本</Text>
                    </View>
                    <View style={[styles.sumRow,{borderRightWidth:0}]}>
                        <Text style={styles.sumValue}>¥{this.state.totalLR}</Text>
                        <Text style={styles.sumTitle}>资产利润</Text>
                    </View>
                </View>
                <View style={styles.hd}>
                    <Text style={{color:'#0099CC'}}>营收明细</Text>
                </View>
            </View>
        )
    }

    _onRenderRow(obj) {
        return (
            <View style={styles.row}>
                <Text style={styles.itemName}>{obj.ItemName}</Text>
                <View style={{flexDirection:'column', flex:1, marginLeft:15,}}>
                    <Text style={styles.barcode}>
                        <Text
                            style={{marginRight:5,paddingLeft:5, fontSize:12, color:'#fff', backgroundColor:'#ccc'}}>{obj.ItemStyle}</Text>
                        <Text>{obj.BarCode}</Text>
                    </Text>
                    <View style={{flexDirection:'row'}}>
                        <Text>售价:¥{obj.SellPrice}</Text>
                        <Text style={{marginLeft:8,}}>进价:¥{obj.InputPrice}</Text>
                        <Text style={{marginLeft:8,}}>库存:{obj.ItemCountNum}</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
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
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
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
        borderLeftColor: '#0099CC',
        paddingLeft: 5,
    },
    outerRow: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    sumRow: {
        flex: 1,
        flexDirection: 'column',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',

        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#ccc',
    },
    sumTitle: {
        color: '#CCCC99',
        fontSize: 14,
    },
    sumValue: {
        fontSize: 24,
        color: '#0099CC',
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
        width: 120,
        backgroundColor: '#0099CC',
        padding: 2
    },
    barcode: {
        flex: 1,
        fontSize: 16,
        color: '#0099CC',
        fontWeight: 'bold',
    },
});

module.exports = StockCapital;