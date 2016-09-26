/**
 * Created by User on 2016-07-20.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import NButton from '../../commonview/NButton';
import FormPicker from '../../commonview/FormPicker';
import FormInput from '../../commonview/FormInput';
import ChooseGoods from './ChooseGood';
import ScanBarcode from './ScanBarcode';
import Icon from 'react-native-vector-icons/Ionicons';
const scanIcon = (<Icon name={'md-barcode'} size={40} color={'#63B8FF'}/>);
const addIcon = (<Icon name={'md-add'} size={40} color={'#63B8FF'}/>);

class GoodsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            GoodInfo: {ID: null, ItemName: null, BarCode: null, SellPrice: 0.00, GoodCount: 1, GoodAmount: 0.00},
            kw: '',
            goodCountInput: '',
        };
        this._this = this;
    }

    _onPressQRCode() {
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            this.props.navigator.push({
                component: ScanBarcode,
                title: 'ScanBarcode',
                params: {
                    onSucess: function (v) {
                        _this._getGood(v);
                    },
                },
            });
        }
    }

    _getGood(v) {
        let _this = this;
        let kw = '';
        if (v != null && v.length > 0) {
            kw = v;
        } else {
            kw = _this.state.kw;
        }
        if (kw === null || kw === '') {
            Alert.alert('提示', '未获得商品条码/编号', [{text: '确定'}]);
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
            let postjson = {
                WarehouseID: _this.props.storeId,
                CateNo: null,
                InputTxt: kw,
                BusiTypeCodes: [1, 2, 3, 7, 8, 9, 12],
                pageSize: 1,
                pageIndex: 1
            };
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeLeftJoinItemCount/SearchSellListByPage', postjson, header, function (data) {
                if (data.Sign && data.Message && data.Message.length > 0) {
                    var good = data.Message[0];
                    good.GoodCount = 1;
                    good.GoodAmount = good.SellPrice;
                    _this.setState({
                        GoodInfo: good,
                    });
                } else {
                    Alert.alert('提示', "未找到此商品", [{text: '确定'}]);
                }
            });
        }, function (msg) {
            Alert.alert('错误', msg, [{text: '确定'}]);
        });
    }

    _SaveAndContinue(go) {
        var _this = this;
        if (_this.state.GoodInfo.ID == null) {
            Alert.alert('提示', '请先选择商品', [{text: '确定'}]);
            return;
        }
        else if (_this.state.GoodCount < 1) {
            Alert.alert('提示', '商品数量不能少于1', [{text: '确定'}]);
            return;
        }
        if (_this.props.getResult) {
            _this.props.getResult(_this.state.GoodInfo);
        }
        _this.setState({
            GoodInfo: {
                ID: null,
                ItemName: null,
                BarCode: null,
                SellPrice: 0.00,
                GoodCount: 1,
                GoodAmount: 0.00,
            },
        })
        if (go) {
            _this._onBack();
        } else {
            Alert.alert('提示', '添加成功', [{text: '确定'}]);
        }
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    chooseGood() {
        var _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseGoods',
                component: ChooseGoods,
                params: {
                    storeId: _this.props.storeId,
                    getResult: function (res) {
                        res.GoodCount = 1;
                        res.GoodAmount = res.SellPrice;
                        _this.setState({
                            GoodInfo: res,
                            kw: res.ItemCode,
                            goodCountInput: res.GoodCount.toString(),
                        });
                    }
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title='添加商品' canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.pickerBox}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <FormInput title="商品编号" value={this.state.kw} enabled={true}
                                           onChangeText={(text)=>{
                                        this.setState({ kw: text });
                                    }}/>
                            </View>
                            <TouchableOpacity
                                style={{height:50.5,
                                 width:30,
                                 justifyContent:'center',
                                 borderBottomWidth:
                                 StyleSheet.hairlineWidth,
                                 borderBottomColor: '#ccc',}} onPress={this._getGood.bind(this)}>
                                <Icon name={'md-search'} size={35} color={'#63B8FF'}/>
                            </TouchableOpacity>
                        </View>
                        <FormPicker title="商品名称"
                                    tips={this.state.GoodInfo.ItemName==null?addIcon:this.state.GoodInfo.ItemName}
                                    onPress={this.chooseGood.bind(this)}/>
                        <FormPicker title="条码"
                                    tips={this.state.GoodInfo.BarCode==null?scanIcon:this.state.GoodInfo.BarCode}
                                    showbottom={false}
                                    onPress={this._onPressQRCode.bind(this)}/>
                    </View>
                    <View style={[styles.pickerBox,{marginTop:10,}]}>
                        <FormInput title="数量"
                                   value={this.state.goodCountInput}
                                   enabled={true}
                                   onChangeText={(text)=>{
                                        this.setState({
                                            goodCountInput:text
                                        });
                                        var t = parseInt(text);
                                        if(!t || isNaN(t)){
                                            return false;
                                        }else{
                                        var good = this.state.GoodInfo;
                                        good.GoodCount= t;
                                        good.GoodAmount = t * this.state.GoodInfo.SellPrice
                                        this.setState({
                                            GoodInfo: good,
                                        })
                                        }
                                    }}/>
                        <FormInput title="售价" value={this.state.GoodInfo.SellPrice.toString()} enabled={false}/>
                        <FormInput title="金额"
                                   value={this.state.GoodInfo.GoodAmount.toString()}
                                   enabled={false}
                                   showbottom={false}
                                   keyboardType={'numeric'}
                                   onChangeText={(text)=>{
                                var good = this.state.GoodInfo;
                                good.GoodAmount = parseInt(text);
                                this.setState({GoodInfo: good});
                            }}/>
                    </View>
                    <View style={{height:130, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <NButton text='添加' onPress={() => this._SaveAndContinue(true)}></NButton>
                        </View>
                        <View style={{flex:1}}>
                            <NButton text='添加并继续' onPress={() => this._SaveAndContinue(false)}></NButton>
                        </View>
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
    pickerBox: {
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
    }
});

module.exports = GoodsAdd;