/**
 * Created by User on 2016-07-20.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    BackAndroid,
    ScrollView
    } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Util from '../../util/Util';
import Global from '../../util/Global';
import NetUitl from '../../net/NetUitl';
import JsonUitl from '../../util/JsonUitl';
import Head from './../../commonview/Head';
import NButton from '../../commonview/NButton';
import FormPicker from './../../commonview/FormPicker';
import FormInput from './../../commonview/FormInput';
import ScanQr from '../../commonview/ScanQr';
import ChooseGoods from './ChooseGood'
var base64 = require('base-64');
const scanIcon = (<Icon name={'md-barcode'} size={40} color={'#63B8FF'}/>);
const addIcon = (<Icon name={'md-add'} size={40} color={'#63B8FF'}/>);
class GoodsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            goodsDataSource: null,
            loaded: false,
            GoodInfo: {ID: null, ItemName: null, BarCode: null, SellPrice: 0.00, GoodCount: 1, GoodAmount: 0.00},
            //GoodCount: 1,
            //GoodAmount: 0.00,
            kw: null,
            storeId: null,
        };
        this._this = this;
    }

    componentDidMount() {
        //在组件加载后将上一页面传入的值保存到storeId
        this.setState({
            storeId: this.props.storeId,
        })
    }

    _onPressQRCode() {
        var _this = this;
        const { navigator } = this.props;
        if (navigator) {
            this.props.navigator.push({
                component: ScanQr,
                title: 'ScanQr',
                params: {
                    onSucess: function(v){
                        _this.setState({kw: v});
                        _this._getGood();
                    },
                },
            });
        }
    }

    _getGood() {
        var _this = this;
        if(_this.state.kw==null||_this.state.kw.length==0){
            ToastAndroid.show('未获得条码/编号', ToastAndroid.SHORT);
            return false;
        }
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            var postjson = {
                WarehouseID: _this.state.storeId,
                CateNo: null,
                InputTxt: _this.state.kw && _this.state.kw.length > 0 ? _this.state.kw : null,
                BusiTypeCodes: [],
                pageSize: 1,
                pageIndex: 1
            };
            var header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(encodeURIComponent(ret.personname) + ':' + base64.encode(ret.password) + ':' + Global.ENTCODE + ":" + ret.token)
            };
            NetUitl.postJson(Global.GETGOODS, postjson, header, function (data) {
                if (data.Sign && data.Message && data.Message.length > 0) {
                    var good = data.Message[0];
                    good.GoodCount = 1;
                    good.GoodAmount = good.SellPrice;
                    _this.setState({
                        GoodInfo: good,
                    });
                } else {
                    ToastAndroid.show("未找到此商品", ToastAndroid.SHORT);
                }
            });
        }).catch(err => {
            alert('error:' + err);
        });
    }

    _SaveAndContinue(go) {
        var _this = this;
        if (_this.state.GoodInfo.ID == null) {
            ToastAndroid.show('请先选择商品', ToastAndroid.SHORT);
            return;
        }
        else if (_this.state.GoodCount < 1) {
            ToastAndroid.show('商品数量不能少于1', ToastAndroid.SHORT);
            return;
        }
        if (_this.props.getResult) {
            //调用上一页面的回掉函数给上一页面变量赋值
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
            ToastAndroid.show('添加成功', ToastAndroid.SHORT);
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
                    storeId: _this.state.storeId,
                    getResult: function (res) {
                        res.GoodCount = 1;
                        res.GoodAmount = res.SellPrice;
                        _this.setState({
                            GoodInfo: res,
                            kw: res.ItemCode,
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
                                   value={this.state.GoodInfo.GoodCount.toString()}
                                   enabled={true}
                                   keyboardType={'numeric'}
                                   onChangeText={(text)=>{
                                        var t = parseInt(text);
                                        if(!t){
                                            return false;
                                        }
                                        var good = this.state.GoodInfo;
                                        good.GoodCount= t;
                                        good.GoodAmount = t * this.state.GoodInfo.SellPrice
                                        this.setState({
                                            GoodInfo: good,
                                        });
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