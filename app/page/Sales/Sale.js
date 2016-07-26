/**
 * Created by tuorui on 2016/7/15.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    DatePickerAndroid,
    Navigator,
    ScrollView,
    ListView,
    Image,
} from 'react-native';
import Global from './../../util/Global';
import Head from './../../commonview/Head';
import NButton from './../../commonview/NButton';
import AddGood from './AddGood';
import ChooseGuest from './ChooseGuest';
import ChooseStore from './ChooseStore';
import NetUitl from './../../net/NetUitl';
import JsonUitl from './../../util/JsonUitl';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import FormPicker from './../../commonview/FormPicker';
import FormInput from './../../commonview/FormInput';
var base64 = require('base-64');
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            simpleText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            simpleDate: now,
            SelectedGoods: {DisCount: 100, MustPay: 0, RealPay: 0, items: []},
            goodsDataSource: [],
            Guest: {GestName: '选择会员', ID: null},
            Store: {WarehouseName: '选择仓库', ID: null},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            goodDiscountInput: '',
            goodAmountInput: '',
        };
    }

    //进行创建时间日期选择器
    async showPicker(stateKey, options) {
        try {
            var newState = {};
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                newState[stateKey + 'Text'] = 'dismissed';
            } else {
                var date = new Date(year, month, day);
                newState[stateKey + 'Text'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                newState[stateKey + 'Date'] = date;
            }
            this.setState(newState);
        } catch (o) {
            alert('控件异常。');
        }
    }

    chooseGuest() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseGuest',
                component: ChooseGuest,
                params: {
                    tabBarShow: false,
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
                tabBarShow:false,
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
        var _this = this;
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
                    tabBarShow:false,
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
                        _goods.RealPay = (_goods.MustPay * _goods.DisCount / 100).toFixed(1);
                        if (!_exists) {
                            _goods.items.push(good);
                        }
                        _this.setState({
                            SelectedGoods: _goods,
                            goodAmountInput: _goods.RealPay.toString(),
                            goodDiscountInput:_goods.DisCount.toString(),
                        });
                    }
                }
            });
        }
    }

    SaveInfo() {
        var _this = this;
        if (_this.state.Store.ID == null) {
            ToastAndroid.show("请选择仓库", ToastAndroid.SHORT);
            return false;
        } else if (_this.state.Guest.ID == null) {
            ToastAndroid.show("请选择会员", ToastAndroid.SHORT);
            return false;
        } else if (_this.state.SelectedGoods.items.length == 0) {
            ToastAndroid.show("请选择商品", ToastAndroid.SHORT);
            return false;
        } else if(!_this.state.SelectedGoods.RealPay || isNaN(_this.state.SelectedGoods.RealPay)){
            ToastAndroid.show("请输入付款金额", ToastAndroid.SHORT);
            return false;
        }
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            var items = [];
            var _goods = _this.state.SelectedGoods.items;
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
                    PaidStatus: 'SM00040',
                    PaidTime: null,
                    SellContent: null,
                    SellPrice: _goods[i].SellPrice,
                    SellUnit: null,
                    TotalCost: null,
                    WarehouseID: _this.state.Store.WarehouseID
                };
                items.push(item);
            }
            var postjson = {
                gest: _this.state.Guest,
                sellItemList: items,
            }
            var header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(encodeURIComponent(ret.personname) + ':' + base64.encode(ret.password) + ':' + Global.ENTCODE + ":" + ret.token)
            };
            NetUitl.postJson(Global.SAVESALES, postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    ToastAndroid.show("保存成功", ToastAndroid.SHORT);
                    _this._onBack();
                } else {
                    ToastAndroid.show("获取数据错误" + data.Exception, ToastAndroid.SHORT);
                }
            });
        }).catch(err => {
            alert('error:' + err);
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps() {
        //var mustpay = 0.00;
        //var _selectedgood = this.state.SelectedGoods;
        //for (let i = 0; i < this.state.SelectedGoods.items.length; i++) {
        //mustpay += this.state.SelectedGoods.items[i].GoodCount * this.state.SelectedGoods.items[i].SellPrice;
        //}
        //_selectedgood.MustPay = mustpay;
        //_selectedgood.RealPay = mustpay;
        //this.setState({
        //    SelectedGoods: _selectedgood
        //})
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    pressRow(good) {
        alert(good.ItemName);
    }

    renderGood(good, sectionID, rowID) {
        return (
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(good)}>
                <Image style={styles.goodHead}
                       source={{uri:'http://www.easyicon.net/api/resizeApi.php?id=1171058&size=64', scale:3}}/>
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
                <Head title='新销售单' canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.pickerBox}>
                        <FormPicker title="日期" tips={this.state.simpleText}
                                    onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}/>
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
                                    good.RealPay = (good.MustPay*d/100).toFixed(1);
                                    this.setState({
                                        SelectedGoods: good,
                                        goodAmountInput: good.RealPay,
                                    })
                                }
                            }}
                            />
                            <View style={{width:20, justifyContent:'center'}}>
                                <Text>%</Text>
                            </View>
                        </View>
                        <FormInput title="实收金额" value={this.state.goodAmountInput} enabled={true}
                                   showbottom={false}
                                   onChangeText={(text)=>{
                                        //var _t = this.state.SelectedGoods;
                                        // _t.RealPay = parseFloat(_t).toFixed(1);
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
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 17,
        },
        pickerBox: {
            backgroundColor: '#fff',
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            borderTopColor: '#ddd',
            borderTopWidth: 1,
            paddingLeft: 5,
            paddingRight: 5,
        }
    }
);
module.exports = Sale;