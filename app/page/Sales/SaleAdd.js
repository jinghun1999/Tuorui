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
    //ToastAndroid,
    TouchableOpacity,
    ScrollView,
    ListView,
    Image,
    Alert,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import NButton from '../../commonview/NButton';
import AddGood from './AddGood';
import ChooseGuest from './ChooseGuest';
//import ChooseStore from './ChooseStore';
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
            sellStoreId: null,
            Guest: {GestName: '选择会员', ID: null},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            goodDiscountInput: '',
            goodAmountInput: '',
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        if (_this.state.sellStoreId == null) {
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                NetUtil.get(CONSTAPI.HOST + '/Store_DirectSell/GetDirectSellPageConfig', header, function (data) {
                    if (data.Sign && data.Message) {
                        _this.setState({
                            sellStoreId: data.Message.SellStoreID,
                        });
                    }
                });
            });
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
                    getResult: function (g) {
                        _this.setState({
                            Guest: g,
                        });
                    }
                }
            });
        }
    }

    chooseGood() {
        let _this = this;
        if (_this.state.sellStoreId == null) {
            Alert.alert('提示', '医院没有设置销售仓库');
            return false;
        }
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'AddGood',
                component: AddGood,
                params: {
                    storeId: _this.state.sellStoreId,
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
        if (_this.state.Guest.ID == null) {
            Alert.alert('提示', "请选择会员", [
                {text: 'OK', onPress: () => {}},
            ]);
            return false;
        } else if (_this.state.SelectedGoods.items.length == 0) {
            Alert.alert('提示', "请选择商品", [
                {text: 'OK', onPress: () => {}},
            ]);
            return false;
        } else if (!_this.state.SelectedGoods.RealPay || isNaN(_this.state.SelectedGoods.RealPay)) {
            Alert.alert('提示', "请输入付款金额", [
                {text: 'OK', onPress: () => {}},
            ]);
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
                let now = Util.getTime();
                let items = [];
                var ids = [];
                let _goods = _this.state.SelectedGoods.items;
                for (let i = 0; i < _goods.length; i++) {
                    var item = {
                        BarCode: _goods[i].BarCode,
                        BusiTypeCode: _goods[i].BusiTypeCode,
                        CreatedBy: user.user.Mobile,
                        CreatedOn: now,
                        ModifiedBy: user.user.Mobile,
                        ModifiedOn: now,
                        DirectSellCode: null,
                        DirectSellID: null,
                        EntID: '00000000-0000-0000-0000-000000000000',
                        ID: Util.guid(),
                        IsBulk: '否',
                        IsDeleted: 0,
                        ItemCode: _goods[i].ItemCode,
                        ItemName: _goods[i].ItemName,
                        ItemNum: _goods[i].GoodCount,
                        TotalCost: _goods[i].GoodAmount,
                        ItemStandard: _goods[i].ItemStandard,
                        ManufacturerCode: null,
                        ManufacturerName: null,
                        PaidStatus: 'SM00051',
                        PaidTime: now,
                        SellContent: null,
                        SellPrice: _goods[i].SellPrice,
                        SellUnit: _goods[i].PackageUnit,
                        WarehouseID: null,
                    };
                    items.push(item);
                    ids.push(item.ID);
                }
                let addpost = {
                    gest: _this.state.Guest,
                    sellItemList: items,
                }
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                //添加销售单
                //销售库
                NetUtil.postJson(CONSTAPI.HOST + '/Store_DirectSell/DirectSellBillSave', addpost, header, function (adddata) {
                        if (adddata.Sign && adddata.Message) {
                            let getfinpost = {
                                "gestID": _this.state.Guest.ID,
                                "dicEndItems": {"直接销售": ids}
                            };
                            //获取销售单信息
                            NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/GetFinaceInfo', getfinpost, header, function (findata) {
                                if (findata.Sign && findata.Message != null) {
                                    let finishpost = {
                                        "newSA": {
                                            "ID": "00000000-0000-0000-0000-000000000000",
                                            "SettleCode": null,
                                            "GestID": findata.Message.CurrentGest.ID,
                                            "GestCode": findata.Message.CurrentGest.GestCode,
                                            "GestName": findata.Message.CurrentGest.GestName,
                                            "PetCode": null,
                                            "PetName": null,
                                            "TotalMoney": _this.state.SelectedGoods.MustPay,
                                            "DisCountMoney": _this.state.goodDiscountInput,
                                            "ShouldPaidMoney": _this.state.SelectedGoods.MustPay,
                                            "FactPaidMoney": _this.state.goodAmountInput,
                                            "BackMoney": null,
                                            "BackReason": null,
                                            "PaidStatus": null,
                                            "PaidTime": null,
                                            "CreatedBy": null,
                                            "CreatedOn": null,
                                            "ModifiedBy": null,
                                            "ModifiedOn": null,
                                            "IsDeleted": 0,
                                            "ChangeMoney": 0.00,
                                            "EntID": findata.Message.CurrentGest.EntID,
                                            "HandDiscountMoney": 0.00,
                                            "InputDiscountMoney": _this.state.goodDiscountInput,
                                            "OriginalDiscountMoney": 0.0,
                                            "FactTotalMoney": _this.state.goodAmountInput
                                        },
                                        "fSADetalList": findata.Message.FSADetalList,
                                        "gprList": [{
                                            "ID": "00000000-0000-0000-0000-000000000000",
                                            "GestID": null,
                                            "GestName": null,
                                            "OperateAction": "现金",
                                            "OperateContent": _this.state.goodAmountInput,
                                            "SettleAccountsID": null,
                                            "CreatedBy": null,
                                            "CreatedOn": null,
                                            "ModifiedBy": null,
                                            "ModifiedOn": null,
                                            "IsDeleted": 0,
                                            "EntID": "00000000-0000-0000-0000-000000000000"
                                        }, {
                                            "ID": "00000000-0000-0000-0000-000000000000",
                                            "GestID": null,
                                            "GestName": null,
                                            "OperateAction": "折扣",
                                            "OperateContent": _this.state.goodDiscountInput,
                                            "SettleAccountsID": null,
                                            "CreatedBy": null,
                                            "CreatedOn": null,
                                            "ModifiedBy": null,
                                            "ModifiedOn": null,
                                            "IsDeleted": 0,
                                            "EntID": "00000000-0000-0000-0000-000000000000"
                                        }]
                                    };
                                    //结算
                                    NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/Finish', finishpost, header, function (okdata) {
                                        if (okdata.Sign && okdata.Message != null) {
                                            Alert.alert('提示', '销售成功');
                                            if (_this.props.getResult) {
                                                _this.props.getResult();
                                            }
                                            _this._onBack();
                                        } else {
                                            Alert.alert('提示', '结算失败');
                                        }
                                    });
                                } else {
                                    Alert.alert('提示', '获取销售单失败');
                                }
                            });
                        }
                        else {
                            ToastAndroid.show("获取数据错误" + data.Exception, ToastAndroid.SHORT);
                        }
                    }
                )
                ;
            }

            ,
            function (err) {
            }
        )
        ;
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
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit={'保存'} editInfo={this.SaveInfo.bind(this)}
                    />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.pickerBox}>
                        <FormPicker title="日期" tips={this.state.date}
                                    onPress={()=>{}}/>
                        <FormPicker title="会员/客户" tips={this.state.Guest.GestName}
                                    onPress={this.chooseGuest.bind(this)}/>
                    </View>
                    <View style={[styles.pickerBox,{marginTop:10,}]}>
                        <FormPicker title="添加商品" tips="选择/扫码" onPress={this.chooseGood.bind(this)}
                                    showbottom={false}/>
                    </View>
                    <View>
                        <ListView enableEmptySections={true}
                                  dataSource={this.state.ds.cloneWithRows(this.state.SelectedGoods.items)}
                                  renderRow={this.renderGood.bind(this)}/>
                    </View>
                    <View style={[styles.pickerBox, {marginTop:10,}]}>
                        <FormInput title="应收金额" value={this.state.SelectedGoods.MustPay.toString()}
                                   enabled={false}/>
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
module
    .
    exports = SaleAdd;