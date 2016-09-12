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
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
class SaleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            sale: this.props.sale,
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
            this._fetchData(this.state.kw, 1, false);
        });
    }

    _fetchData() {
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
                let postdata = [{
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "DirectSellCode",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.sale.DirectSellCode,
                    "Conn": 1
                }];
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSellDetail/GetModelListByQitems', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            dataSource: data.Message.returns,
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
                    loaded: true,
                });
                alert('error:' + err.message);
            }
        )
    }

    _renderPet(obj) {
        return (
            <View style={styles.row}>
                <Text style={{fontSize:16, color:'#CC0033'}}>{obj.ItemName}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{flex: 1,}}>单价:¥{obj.SellPrice}</Text>
                    <Text style={{flex: 1,}}>数量:{obj.ItemNum}</Text>
                    <Text style={{flex: 1,}}>总价:¥{obj.TotalCost}</Text>
                </View>
            </View>
        )
    }

    render() {
        var body = <Loading type={'text'}/>
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          enableEmptySections={true}
                          renderRow={this._renderPet.bind(this)}/>
            )
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.hd}>
                    <Text style={{color:'#CC0033'}}>基本信息</Text>
                </View>
                <View style={styles.itemBox}>
                    <View style={{width:100,}}><Text style={{fontSize:16}}>会员</Text></View>
                    <View style={styles.itemVal}><Text>{this.state.sale.GestName}</Text></View>
                </View>
                <View style={styles.itemBox}>
                    <View style={{width:100,}}><Text style={{fontSize:16}}>明细数</Text></View>
                    <View style={styles.itemVal}><Text>{this.state.sale.TotalNum}</Text></View>
                </View>
                <View style={styles.itemBox}>
                    <View style={{width:100,}}><Text style={{fontSize:16}}>总价</Text></View>
                    <View style={styles.itemVal}><Text>¥{this.state.sale.TotalCost}</Text></View>
                </View>
                <View style={styles.itemBox}>
                    <View style={{width:100,}}><Text style={{fontSize:16}}>折扣</Text></View>
                    <View style={styles.itemVal}><Text>¥{this.state.sale.Discount}</Text></View>
                </View>
                <View style={styles.hd}>
                    <Text style={{color:'#CC0033'}}>商品明细</Text>
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    row: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor:'#fff',
        padding:10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    hd: {
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
    },
    itemBox: {
        flexDirection: 'row',
        backgroundColor:'#fff',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    itemVal: {flex: 1, alignItems: 'flex-end'},
})
module.exports = SaleDetail;