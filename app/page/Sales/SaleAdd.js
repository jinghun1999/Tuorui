/**
 * Created by tuorui on 2016/7/15.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    ScrollView,
    ListView,
    Image,
    Alert,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import NButton from '../../commonview/NButton';
import AddGood from './AddGood';
import ChooseGuest from './ChooseGuest';
import ChooseStore from './ChooseStore';
import FormPicker from '../../commonview/FormPicker';
import FormInput from '../../commonview/FormInput';
import DatePicker from  'react-native-datepicker';
//import Scan from './Scan';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
export default class SaleAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: Util.GetDateStr(0),
            SelectedGoods: {DisCount: 0, MustPay: 0, RealPay: 0, items: []},
            goodsDataSource: [],
            Guest: {GestName: '选择会员', ID: null},
            Store: {WarehouseName: '选择仓库', ID: null},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            goodDiscountInput: '',
            goodAmountInput: '',
        };
    }

    chooseGuest() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseGuest',
                component: ChooseGuest,
                params: {
                    getResult: function (g) {
                        _this.setState({
                            Guest: g,
                        });
                    }
                }
            });
        }
    }

    chooseStores() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseStore',
                component: ChooseStore,
                tabBarShow: false,
                params: {
                    getResult: function (g) {
                        _this.setState({
                            Store: g,
                        });
                    }
                }
            });
        }
    }

    chooseGood() {
        let _this = this;
        if (_this.state.Store.ID == null) {
            ToastAndroid.show('请先选择仓库', ToastAndroid.SHORT);
            return false;
        }
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'AddGood',
                component: AddGood,
                params: {
                    storeId: _this.state.Store.ID,
                    tabBarShow: false,
                    getResult: function (good) {
                        //如已经添加了此商品，则更新数量和金额，否则添加到集合
                        var _goods = _this.state.SelectedGoods, _exists = false;
                        _goods.MustPay = good.GoodAmount;
                        _goods.items && _goods.items.forEach((item, index, array) => {
                            _goods.MustPay += item.GoodAmount;
                            if (item.ID == good.ID) {
                                _goods.items[index].GoodCount += good.GoodCount;
                                _goods.items[index].GoodAmount += good.GoodAmount;
                                _exists = true;
                            }
                        });
                        _goods.RealPay = (_goods.MustPay - _goods.DisCount).toFixed(1);
                        if (!_exists) {
                            _goods.items.push(good);
                        }
                        _this.setState({
                            SelectedGoods: _goods,
                            goodAmountInput: _goods.RealPay.toString(),
                            goodDiscountInput: _goods.DisCount.toString(),
                        });
                    }
                }
            });
        }
    }

    SaveInfo() {
        let _this = this;
        if (_this.state.Store.ID == null) {
            ToastAndroid.show("请选择仓库", ToastAndroid.SHORT);
            return false;
        } else if (_this.state.Guest.ID == null) {
            ToastAndroid.show("请选择会员", ToastAndroid.SHORT);
            return false;
        } else if (_this.state.SelectedGoods.items.length == 0) {
            ToastAndroid.show("请选择商品", ToastAndroid.SHORT);
            return false;
        } else if (!_this.state.SelectedGoods.RealPay || isNaN(_this.state.SelectedGoods.RealPay)) {
            ToastAndroid.show("请输入付款金额", ToastAndroid.SHORT);
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
            let items = [];
            let _goods = _this.state.SelectedGoods.items;
            for (let i = 0; i < _goods.length; i++) {
                var item = {
                    BarCode: null,
                    BusiTypeCode: _goods[i].BusiTypeCode,
                    CreatedBy: 'a',
                    CreatedOn: '2016-12-12',
                    ModifiedBy: 'a',
                    ModifiedOn: '2016-12-12',
                    DirectSellCode: null,
                    DirectSellID: null,
                    EntID: null,
                    ID: null,
                    IsBulk: '否',
                    IsDeleted: null,
                    ItemCode: _goods[i].ItemCode,
                    ItemName: _goods[i].ItemName,
                    ItemNum: _goods[i].Count,
                    ItemStandard: _goods[i].ItemStandard,
                    ManufacturerCode: null,
                    ManufacturerName: null,
                    PaidStatus: 'SM00051',
                    PaidTime: null,
                    SellContent: null,
                    SellPrice: _goods[i].SellPrice,
                    SellUnit: null,
                    TotalCost: null,
                    WarehouseID: _this.state.Store.WarehouseID
                };
                items.push(item);
            }
            let postjson = {
                gest: _this.state.Guest,
                sellItemList: items,
            }
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            NetUtil.postJson(CONSTAPI.SAVESALES, postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    ToastAndroid.show("保存成功", ToastAndroid.SHORT);
                    if (_this.props.getResult) {
                        _this.props.getResult();
                    }
                    _this._onBack();
                } else {
                    ToastAndroid.show("获取数据错误" + data.Exception, ToastAndroid.SHORT);
                }
            });
        }, function (err) {
        });
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    pressRow(good) {
        Alert.alert(
            '删除提醒',
            '确定要移除' + good.ItemName + '吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () => console.log('OK Pressed!')},
            ]
        );
        //alert(good.ItemName);
    }

    renderGood(good, sectionID, rowID) {
        return (
            <TouchableOpacity
                style={styles.row}
                onPress={()=>this.pressRow(good)}>
                <Image style={styles.goodHead}
                       source={require('../../img/shopping_81px.png')}/>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{good.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>数量: {good.GoodCount}</Text>
                        <Text style={{flex: 1,}}>售价: {good.SellPrice}</Text>
                        <Text style={{flex: 1,}}>金额: {good.GoodAmount}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.pickerBox}>
                        <FormPicker title="日期" tips={this.state.date}
                                    onPress={()=>{}}/>
                        <FormPicker title="会员/客户" tips={this.state.Guest.GestName}
                                    onPress={this.chooseGuest.bind(this)}/>
                        <FormPicker title="仓库" tips={this.state.Store.WarehouseName}
                                    onPress={this.chooseStores.bind(this)} showbottom={false}/>
                    </View>
                    <View style={[styles.pickerBox,{marginTop:10,}]}>
                        <FormPicker title="添加商品" tips="选择/扫码" onPress={this.chooseGood.bind(this)} showbottom={false}/>
                    </View>
                    <View>
                        <ListView enableEmptySections={true}
                                  dataSource={this.state.ds.cloneWithRows(this.state.SelectedGoods.items)}
                                  renderRow={this.renderGood.bind(this)}/>
                    </View>
                    <View style={[styles.pickerBox, {marginTop:10,}]}>
                        <FormInput title="应收金额" value={this.state.SelectedGoods.MustPay.toString()} enabled={false}/>
                        <View style={{flexDirection:'row'}}>
                            <FormInput style={{flex:1}} title="折扣" value={this.state.goodDiscountInput}
                                       onChangeText={(text)=>{
                                       this.setState({
                                            goodDiscountInput: text
                                        });
                                var d = parseFloat(text);
                                if(!d || isNaN(d)){
                                    var value= 0;
                                    this.setState({
                                        goodAmountInput: value.toString(),
                                    })
                                    return false;
                                }else{
                                    var good = this.state.SelectedGoods;
                                    good.DisCount = d;
                                    good.RealPay = (good.MustPay-d).toFixed(1);
                                    this.setState({
                                        SelectedGoods: good,
                                        goodAmountInput: good.RealPay,
                                    })
                                }
                            }}/>
                        </View>
                        <FormInput title="实收金额" value={this.state.goodAmountInput} enabled={true}
                                   showbottom={false}
                                   onChangeText={(text)=>{
                                        this.setState({
                                            goodAmountInput: text
                                        });
                                        var val = parseFloat(text).toFixed(1);
                                        if(isNaN(val) || !val){
                                            return false;
                                        }
                                        else{
                                            var t =this.state.SelectedGoods;
                                            t.RealPay= val;
                                            this.setState({
                                                SelectedGoods: t,
                                            });
                                        }
                                    }}/>
                    </View>
                    <View style={{height:130}}>
                        <NButton onPress={this.SaveInfo.bind(this)} text="保存"/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#ececec',
        },
        goodHead: {
            width: 34,
            height: 34,
            marginRight: 10,
        },
        pickerBox: {
            backgroundColor: '#fff',
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            borderTopColor: '#ddd',
            borderTopWidth: 1,
            paddingLeft: 5,
            paddingRight: 5,
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
    }
);
module.exports = SaleAdd;