/**
 * Created by tuorui on 2016/11/17.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    Switch,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AppStyle from '../../theme/appstyle';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
class FeeSettlement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            gestID: this.props.gestID,
            gestDataSource: {GestName: '', GestCode: ''},
            dataSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            totalAmount: 0,
            money: 0,
            discount: 0,
            paidStatus: '现金',
            prepayMoney: 1,
            vipAccount: 0,
            balanceSwitch: false,
            prepaySwitch: false,
            oddChange:0,
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    fetchData() {
        let _this = this;
        //http://test.tuoruimed.com/service/Api/Finance_SettleAccounts/GetFinaceInfo
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let postdata = {
                "gestID": _this.state.gestID,
                "dicEndItems": null,
                "isCurrentOnly": false
            };
            NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/GetFinaceInfo', postdata, header, function (data) {
                if (data.Message !== null && data.Sign) {
                    data.Message.FSADetalList.forEach((item, index, array)=> {
                        _this.state.totalAmount += item.TotalCost;
                    })
                    //预付金
                    _this.state.prepayMoney = data.Message.CurrentGest.PrepayMoney;
                    //账户余额
                    _this.state.vipAccount = data.Message.CurrentGest.VIPAccount;
                    _this.setState({
                        gestDataSource: data.Message.CurrentGest,
                        dataSource: data.Message.FSADetalList,
                        businesCates: data.Message.BusinesCates,
                        loaded: true,
                    })
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            toastShort(err)
        })


    }

    componentDidMount() {
        //初始化
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    onSettlement() {
        //结算
        let _this = this;
        //判断选择了余额 选择了预付金 或者全选 或者全不选
        let money = _this.state.money + _this.state.discount;
        if (_this.state.balanceSwitch == false && _this.state.prepaySwitch == false) {
            if (_this.state.money == null || _this.state.money == '' || _this.state.money == 0) {
                toastShort('请输入金额')
                return false;
            }
            if (_this.state.discount === null || _this.state.discount === '') {
                return false;
            }
            if (_this.state.totalAmount !== money) {
                toastShort('请核对支付金额')
                return false;
            }
        }
        if(_this.state.prepayMoney+_this.state.vipAccount<_this.state.totalAmount-_this.state.discount){
            //当预付金+余额<总消费额-折扣额
            if(_this.state.balanceSwitch==true && _this.state.prepaySwitch==true){
                //勾选了预付金和余额
                let totalMoney = _this.state.prepayMoney+_this.state.vipAccount+_this.state.discount+(_this.state.money-_this.state.oddChange);
                if(_this.state.totalAmount!==totalMoney){
                    toastShort('请核对支付金额')
                    return false;
                }
            }
            if(_this.state.balanceSwitch==true){
                //只勾选余额
                let totalMoney = _this.state.vipAccount+_this.state.discount+(_this.state.money-_this.state.oddChange);
                if(_this.state.totalAmount!==totalMoney){
                    toastShort('请核对支付金额')
                    return false;
                }
            }
            if(_this.state.prepaySwitch==true){
                //只勾选了预付金
                let totalMoney = _this.state.prepayMoney+_this.state.discount+(_this.state.money-_this.state.oddChange);
                if(_this.state.totalAmount!==totalMoney){
                    toastShort('请核对支付金额')
                    return false;
                }
            }
        }

        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let now = Util.getTime();
            let newSA = {
                "ID": "00000000-0000-0000-0000-000000000000",
                "SettleCode": null,
                "GestID": _this.state.gestDataSource.ID,
                "GestCode": _this.state.gestDataSource.GestCode,
                "GestName": _this.state.gestDataSource.GestName,
                "PetCode": null,
                "PetName": null,
                "TotalMoney": _this.state.totalAmount,
                "DisCountMoney": _this.state.discount,
                "ShouldPaidMoney": _this.state.totalAmount - _this.state.discount,
                "FactPaidMoney": _this.state.money,
                "BackMoney": null,
                "BackReason": null,
                "PaidStatus": null,
                "PaidTime": null,
                "CreatedBy": user.Mobile,
                "CreatedOn": now,
                "ModifiedBy": user.Mobile,
                "ModifiedOn": now,
                "ChangeMoney": 0,
                "EntID": "00000000-0000-0000-0000-000000000000",
                "HandDiscountMoney": 0,
                "InputDiscountMoney": _this.state.discount,
                "OriginalDiscountMoney": 0,
                "FactTotalMoney": _this.state.totalAmount - _this.state.discount,
                "CreatedByID": "00000000-0000-0000-0000-000000000000",
                "ModifiedByID": "00000000-0000-0000-0000-000000000000"
            };
            let gprList = [];
            if (_this.state.money != 0) {
                let money = {
                    "ID": "00000000-0000-0000-0000-000000000000",
                    "GestID": null,
                    "GestName": null,
                    "OperateAction": _this.state.paidStatus.toString(),
                    "OperateContent": _this.state.money,
                    "SettleAccountsID": null,
                    "CreatedBy": user.Mobile,
                    "CreatedOn": now,
                    "ModifiedBy": user.Mobile,
                    "ModifiedOn": now,
                    "EntID": "00000000-0000-0000-0000-000000000000",
                    "CreatedByID": "00000000-0000-0000-0000-000000000000",
                    "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                }
                gprList.push(money);
            }
            if (_this.state.balanceSwitch) {
                let balance;
                if (_this.state.vipAccount >= (_this.state.totalAmount - _this.state.discount)) {
                    //1.余额足够
                    balance = [{
                        "ID": "00000000-0000-0000-0000-000000000000",
                        "GestID": null,
                        "GestName": null,
                        "OperateAction": "余额",
                        "OperateContent": _this.state.totalAmount - _this.state.discount,
                        "SettleAccountsID": null,
                        "CreatedBy": user.Mobile,
                        "CreatedOn": now,
                        "ModifiedBy": user.Mobile,
                        "ModifiedOn": now,
                        "EntID": "00000000-0000-0000-0000-000000000000",
                        "CreatedByID": "00000000-0000-0000-0000-000000000000",
                        "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                    }];
                    gprList = balance;
                } else {
                    //2.余额不足
                    balance = {
                        "ID": "00000000-0000-0000-0000-000000000000",
                        "GestID": null,
                        "GestName": null,
                        "OperateAction": "余额",
                        "OperateContent": _this.state.vipAccount,
                        "SettleAccountsID": null,
                        "CreatedBy": user.Mobile,
                        "CreatedOn": now,
                        "ModifiedBy": user.Mobile,
                        "ModifiedOn": now,
                        "EntID": "00000000-0000-0000-0000-000000000000",
                        "CreatedByID": "00000000-0000-0000-0000-000000000000",
                        "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                    }
                    gprList.push(balance)
                }

            }
            if (_this.state.prepaySwitch) {
                //1.预付金足够 2.预付金不足
                let prepay;
                if (_this.state.prepayMoney >= (_this.state.totalAmount - _this.state.discount)) {
                    prepay = [{
                        "ID": "00000000-0000-0000-0000-000000000000",
                        "GestID": null,
                        "GestName": null,
                        "OperateAction": "预付金",
                        "OperateContent": _this.state.totalAmount - _this.state.discount,
                        "SettleAccountsID": null,
                        "CreatedBy": user.Mobile,
                        "CreatedOn": now,
                        "ModifiedBy": user.Mobile,
                        "ModifiedOn": now,
                        "EntID": "00000000-0000-0000-0000-000000000000",
                        "CreatedByID": "00000000-0000-0000-0000-000000000000",
                        "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                    }]
                    gprList = prepay;
                }
                else {
                    prepay = {
                        "ID": "00000000-0000-0000-0000-000000000000",
                        "GestID": null,
                        "GestName": null,
                        "OperateAction": "预付金",
                        "OperateContent": _this.state.prepayMoney,
                        "SettleAccountsID": null,
                        "CreatedBy": user.Mobile,
                        "CreatedOn": now,
                        "ModifiedBy": user.Mobile,
                        "ModifiedOn": now,
                        "EntID": "00000000-0000-0000-0000-000000000000",
                        "CreatedByID": "00000000-0000-0000-0000-000000000000",
                        "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                    }
                    gprList.push(prepay)
                }
            }
            let postdata = {
                newSA: newSA,
                fSADetailList: _this.state.dataSource,
                gprList: gprList
            };
            //http://test.tuoruimed.com/service/Api/Finance_SettleAccounts/Finish
            NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/Finish', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    toastShort('结算成功');
                    if (_this.props.getResult) {
                        _this.props.getResult();
                    }
                    _this._onBack();
                } else {
                    toastShort('结算失败')
                    _this._onBack();
                }
            })
        }, function (err) {
            toastShort(err)
        })

    }

    _onChoosePaid() {
        this.pickerState.toggle();
    }

    _renderRow(fee) {
        var busiTypeCode = fee.BusiTypeCode;
        return (
            <View style={AppStyle.row}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText,{flex:1,}]}>类型: {this.state.businesCates[busiTypeCode]}</Text>
                        <Text style={{fontSize:18,color:'#FF8040'}}>¥{fee.InfactPrice}</Text>
                    </View>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={{flex:1,}}>名称:{fee.ItemName}</Text>
                        <Text>数量:{fee.TotalNum}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        var setBody = <Loading type='text'/>;
        if (this.state.loaded) {
            setBody = <ListView enableEmptySections={true}
                                dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                renderRow={this._renderRow.bind(this)}/>
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            keyboardShouldPersistTaps={false}
                            keyboardDismissMode={'on-drag'}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>会员信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>编号</Text>
                        <Text style={AppStyle.rowVal}>{this.state.gestDataSource.GestCode}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员</Text>
                        <Text style={AppStyle.rowVal}>{this.state.gestDataSource.GestName}</Text>
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>结算信息</Text>
                    </View>
                    <View>{setBody}</View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>付款信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>总消费额</Text>
                        <Text style={[AppStyle.rowVal,{color:'#FF9D6F',fontSize:18,}]}>¥ {this.state.totalAmount}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>预付金</Text>
                        <Text style={AppStyle.rowVal}>{this.state.prepayMoney}</Text>
                        <Switch
                            onValueChange={(value) => {
                            if(this.state.prepayMoney==0){this.setState({prepaySwitch: false})}
                            else{this.setState({prepaySwitch: value})}
                            }}
                            value={this.state.prepaySwitch}/>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>余额</Text>
                        <Text style={AppStyle.rowVal}>{this.state.vipAccount}</Text>
                        <Switch
                            onValueChange={(value) => {
                            if(this.state.vipAccount==0){this.setState({balanceSwitch: false})}
                            else{this.setState({balanceSwitch: value})}
                            }}
                            value={this.state.balanceSwitch}/>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>折扣金额</Text>
                        <TextInput value={this.state.discount.toString()}
                                   underlineColorAndroid={'transparent'}
                                   editable={true}
                                   keyboardType={'numeric'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{
                                    this.setState({discount:text})
                                   var d = parseFloat(text);
                                   if(!d || isNaN(d)){
                                   this.setState({discount:0})
                                   return false;
                                   }else{
                                    this.setState({discount:parseFloat(text),})
                                   }
                                   }}/>
                    </View>
                    <TouchableOpacity onPress={this._onChoosePaid.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>支付方式</Text>
                        <Text style={AppStyle.rowVal}>{this.state.paidStatus}</Text>
                        <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>支付金额</Text>
                        <TextInput value={this.state.money.toString()}
                                   underlineColorAndroid={'transparent'}
                                   editable={true}
                                   keyboardType={'numeric'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{
                                   this.setState({money:text})
                                   var d = parseFloat(text);
                                   if(!d || isNaN(d)){
                                   this.setState({money:0})
                                   return false;
                                   }else{
                                    this.setState({money:parseFloat(text)})
                                    //如果支付金额大于应支付金额，显示找零
                                   var p = this.state.totalAmount-this.state.discount;
                                   if(text>p){
                                        this.setState({oddChange:text-p})
                                   }else{
                                   this.setState({oddChange:0})
                                   }
                                   }
                                   }}/>
                    </View>
                </ScrollView>
                <View style={AppStyle.feeView}>
                    <View style={styles.payStyle}>
                        <Text style={styles.amountStyle}>应支付: </Text>
                        <Text style={styles.priceStyle}>¥{this.state.totalAmount - this.state.discount}</Text>
                        <Text style={styles.amountStyle}> 找零:  </Text>
                        <Text style={styles.priceStyle}>¥ {this.state.oddChange}</Text>
                    </View>
                    <TouchableOpacity style={AppStyle.feeBtn} onPress={this.onSettlement.bind(this)}>
                        <Text style={AppStyle.feeText}>提交订单</Text>
                    </TouchableOpacity>
                </View>
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerState = picker}
                    pickerData={['现金','支付宝','微信','银行卡']}
                    selectedValue={this.state.paidStatus}
                    onPickerDone={(cardState)=>{
                        this.setState({
                            paidStatus:cardState,
                        })
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    payStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    amountStyle: {
        fontSize: 18,
    },
    priceStyle: {
        color: '#FF9D6F',
        fontSize: 18,
    },
})
module.exports = FeeSettlement;