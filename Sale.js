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
    Picker,
    } from 'react-native';
import Global from './app/util/Global';
import Head from './app/commonview/Head';
import NButton from './app/commonview/NButton';
import AddGood from './app/commonview/AddGood';
import ChooseGuest from './app/commonview/ChooseGuest';
import ChooseStore from './app/commonview/ChooseStore';
import NetUitl from './app/net/NetUitl';
import JsonUitl from './app/util/JsonUitl';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormPicker from './app/commonview/FormPicker';
var base64 = require('base-64');
export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            simpleText: now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate(),
            simpleDate: now,
            SelectedGood: {DisCount: 100, MustPay: 0, RealPay: 0, items: []},
            goodsDataSource: [],
            Guest: {GestName: '选择会员', ID: null},
            Store: {WarehouseName: '选择仓库', ID: null},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
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
                newState[stateKey + 'Text'] = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
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
            alert("请先选择仓库");
            return false;
        }
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'AddGood',
                component: AddGood,
                params: {
                    storeId: _this.state.Store.ID,
                    getResult: function (good) {
                        var _goods = _this.state.SelectedGood;
                        _goods.items.push(good);

                        _this.setState({
                            SelectedGood: _goods,
                        });
                    }
                }
            });
        }
    }

    SaveInfo() {
        var _this = this;
        /*
         var gest = {
         VIPNo:null,
         VIPAccount:null,
         TelPhone:null,
         Status:null,
         RewardPoint:null,
         Remark:null,
         PrepayMoney:null,
         PaidStatus:null,
         ModifiedOn:null,
         ModifiedBy:null,
         MobilePhone:null,
         LoseRightDate:null,
         LastPaidTime:null,
         IsVIP:null,
         IsDeleted:null,
         ID:null,
         GestStyle:null,
         GestSex:null,
         GestName:null,
         GestCode:null,
         GestBirthday:null,
         GestAddress:null,
         EntID:null,
         EMail:null,
         CreatedOn:null,
         CreatedBy:null,
         };
         var arr = [
         {
         BarCode: null,
         BusiTypeCode: null,
         CreatedBy: null,
         CreatedOn: null,
         DirectSellCode: null,
         DirectSellID: null,
         EntID: null,
         ID: null,
         IsBulk: null,
         IsDeleted: null,
         ItemCode: null,
         ItemName: null,
         ItemNum: null,
         ItemStandard: null,
         ManufacturerCode: null,
         ManufacturerName: null,
         ModifiedBy: null,
         ModifiedOn: null,
         PaidStatus: null,
         PaidTime: null,
         SellContent: null,
         SellPrice: null,
         SellUnit: null,
         TotalCost: null,
         WarehouseID: null
         }
         ];*/
        if (_this.state.Store.ID == null) {
            alert("请选择仓库");
            return false;
        } else if (_this.state.Guest.ID == null) {
            alert("请选择会员");
            return false;
        } else if (_this.state.SelectedGood.items.length == 0) {
            alert("请选择商品");
            return false;
        }
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            var items = [];
            var _goods = _this.state.SelectedGood.items;
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
                    alert('保存成功！');
                } else {
                    alert("获取数据错误！" + data.Exception);
                }
            });
        }).catch(err => {
            alert('error:' + err);
        });
        ToastAndroid.show('保存成功', ToastAndroid.SHORT);
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps() {
        var mustpay = 0.00;
        var _selectedgood = this.state.SelectedGood;
        for (let i = 0; i < this.state.SelectedGood.items.length; i++) {
            mustpay += this.state.SelectedGood.items[i].Count * this.state.SelectedGood.items[i].SellPrice;
        }
        _selectedgood.MustPay = mustpay;
        _selectedgood.RealPay = mustpay;
        this.setState({
            SelectedGood: _selectedgood
        })
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _Alert(){
        alert('aa')
    }
    pressRow(good) {
        alert(good.ItemName);
    }

    renderGood(good, sectionID, rowID) {
        return (
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(good)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{good.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>数量: {good.Count}</Text>
                        <Text style={{flex: 1,}}>单价: {good.SellPrice}</Text>
                        <Text style={{flex: 1,}}>金额: {good.TotalCost}</Text>
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
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    <View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>出售日期</Text>
                        </View>
                        <View style={styles.smallCont}>
                            <TouchableHighlight
                                style={[styles.button,{backgroundColor:'#fff', width:100}]}
                                underlayColor="#a5a5a5"
                                onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}>
                                <Text>{this.state.simpleText}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={[styles.pickerBox,{paddingLeft:5, paddingRight:5}]}>
                        <FormPicker title="日期" tips={this.state.simpleText} onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}/>
                        <FormPicker title="会员/客户" tips={this.state.Guest.GestName} onPress={this.chooseGuest.bind(this)}/>
                        <FormPicker title="仓库" tips={this.state.Store.WarehouseName} onPress={this.chooseStores.bind(this)}/>
                    </View>
                    <View style={[styles.pickerBox,{paddingLeft:5, paddingRight:5, marginTop:20,}]}>
                        <FormPicker title="客户" tips="选择客户" onPress={this._Alert.bind(this)}/>
                        <FormPicker title="仓库" tips={this.state.Store.WarehouseName} onPress={this._Alert.bind(this)}/>
                        <FormPicker title="账户" tips="选择账户" onPress={this._Alert.bind(this)}/>
                    </View>
                    {/*<View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>会员</Text>
                        </View>
                        <View style={[styles.smallCont, {flexDirection:'row'}]}>
                            <TouchableHighlight
                                style={styles.button}
                                underlayColor="#a5a5a5"
                                onPress={this.chooseGuest.bind(this)}>
                                <Text>选择</Text>
                            </TouchableHighlight>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text>{this.state.Guest.GestName}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>仓库</Text>
                        </View>
                        <View style={[styles.smallCont, {flexDirection:'row'}]}>
                            <TouchableHighlight
                                style={styles.button}
                                underlayColor="#a5a5a5"
                                onPress={this.chooseStores.bind(this)}>
                                <Text>选择</Text>
                            </TouchableHighlight>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text>{this.state.Store.WarehouseName}</Text>
                            </View>
                        </View>
                    </View>*/}
                    <View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>添加商品</Text>
                        </View>
                        <View style={styles.smallCont}>
                            <TouchableHighlight
                                style={styles.button}
                                underlayColor="#a5a5a5"
                                onPress={this.chooseGood.bind(this)}>
                                <Text>添加 {this.state.SelectedGood.items.length}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View>
                        <ListView enableEmptySections={true}
                                  dataSource={this.state.ds.cloneWithRows(this.state.SelectedGood.items)}
                                  renderRow={this.renderGood.bind(this)}/>
                    </View>
                    <View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>应收金额</Text>
                        </View>
                        <View style={styles.smallCont}>
                            <TextInput style={styles.style_user_input}
                                       placeholder='应收金额'
                                       numberOfLines={1}
                                       editable={false}
                                       value={this.state.SelectedGood.MustPay.toString()}
                                       underlineColorAndroid={'transparent'} keyboardType='numeric'/>
                        </View>
                    </View>

                    {/*<View style={styles.view3}>
                     <View style={styles.smallTitle}>
                     <Text style={styles.title}>折扣</Text>
                     </View>
                     <View style={styles.smallCont}>
                     <TextInput style={styles.style_user_input}
                     placeholder='100.00%'
                     numberOfLines={1}
                     underlineColorAndroid={'transparent'} keyboardType='numeric'/>
                     </View>
                     </View>*/}
                    <View style={styles.view3}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.title}>实收金额</Text>
                        </View>
                        <View style={styles.smallCont}>
                            <TextInput style={styles.style_user_input}
                                       placeholder='100.0'
                                       numberOfLines={1}
                                       value={this.state.SelectedGood.RealPay.toString()}
                                       onChangeText={(text)=>{
                                            var _t = this.state.SelectedGood;
                                            _t.RealPay = parseInt(text);
                                            this.setState({SelectedGood: _t});
                                        }}
                                       underlineColorAndroid={'transparent'} keyboardType='numeric'/>
                        </View>
                    </View>
                    {/*<View style={styles.view3}>
                     <View style={styles.smallTitle}>
                     <Text style={styles.title}>备注:</Text>
                     </View>
                     <View style={styles.smallCont}>
                     <TextInput style={styles.style_user_input}
                     placeholder='about..'
                     numberOfLines={1}
                     underlineColorAndroid={'transparent'}/>
                     </View>
                     </View>*/}
                    <View style={{height:130}}>
                        <NButton
                            onPress={this.SaveInfo.bind(this)}
                            text="保存"
                            style={{width:50}}/>
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
            backgroundColor: '#fff',
        },
        contentContainer: {
            //paddingBottom:300,
        },
        title: {
            //alignSelf: 'flex-start',
            //textAlign: 'center',
            margin: 5,
        },
        button: {
            backgroundColor: '#63B8FF',
            margin: 5,
            padding: 3,
            width: 50,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'
        },
        style_user_input: {
            backgroundColor: '#ccc',
            height: 40,
            marginTop: 8,
            justifyContent: 'center',
        },
        view3: {
            flex: 1,
            flexDirection: 'row',
            margin: 5,
            backgroundColor: 'white',
            paddingBottom: 15,
            height: 40,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#cdcdcd',
        },
        smallTitle: {
            width: 80,
            justifyContent: 'center',
        },
        smallCont: {
            flex: 1,
            justifyContent: 'center'
        },
        pickerBox: {
            backgroundColor:'#fff',
            borderBottomColor:'#ccc',
            borderBottomWidth:1,
            borderTopColor:'#ccc',
            borderTopWidth:1,
        }
    }
);
module.exports = Sale;