/**
 * Created by tuorui on 2016/9/5.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    ToastAndroid,
    InteractionManager,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import ChooseBeautyServices from './ChooseBeautyServices';
import ChoosePet from './ChoosePet';
import BeautyListInfo from './BeautyListInfo';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
class BeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: false,
            beautySource: [],
            petSource: [{
                PetName: '', PetCode: '', PetBreed: '', BarCode: '', SellPrice: 0, PetStatus: '',
                GestName: '', MobilePhone: '', GestID: '', GestCode: '', TotalCost: 0, PackageUnit: '',
            }],
            totalAmount: 0.00,
            isOpen: false,
            totalNum: 0,
            servicesFWID: null,
            loaded: false,
            serviceSource: [],
            servicesID: null,
            edit: '保存',
            serviceName: '',
            canChoose: false,
            isEdit: true,
            ServicerNameData: [''],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
    }

    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _loadData() {
        let _this = this;
        //新增
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/ServiceCode?', header, function (data) {
                if (_this.state.servicesFWID == null) {
                    _this.setState({
                        servicesFWID: data.Message,
                        canChoose: true,
                    });
                }
            })
            //http://petservice.tuoruimed.com/service/Api/Persons/GetPersonsByAppconfigID?appconfigID=82
            NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=82', header, function (data) {
                    var serviceData = data.Message;
                    var _data = [];
                    serviceData.forEach((item, index, array)=> {
                        _data.push(item.PersonName);
                    })
                    _this.setState({
                        serviceSource: serviceData,
                        ServicerNameData: _data,
                        serviceName: _data[0],
                        loaded: true,
                    });
                }
            )
            //查看
            if (!_this.props.canEdit) {
                _this.setState({
                    petSource: _this.props.beautyInfo,
                    servicesFWID: _this.props.beautyInfo.ServiceCode,
                    serviceName: _this.props.beautyInfo.HairdresserName,
                    servicesID: _this.props.beautyInfo.HairdresserID,
                    totalNum: _this.props.beautyInfo.TotalNum,
                    totalAmount: _this.props.beautyInfo.TotalCost,
                    edit: '编辑',
                })
                if (_this.props.beautyInfo.PaidStatus == 'SM00051') {
                    _this.setState({isEdit: false,})
                }
                var postdata = [{
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "ServiceID",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.props.beautyInfo.ID,
                    "Conn": 1
                }]
                NetUtil.postJson(CONSTAPI.HOST + '/ServiceDetail/GetModelList', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            beautySource: data.Message,
                            loaded: true,
                        })
                    }
                    else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                })
            }
        }, function (err) {
            alert(err)
        });
    }

    chooseBeauty() {
        if (this.state.canChoose) {
            let _this = this;
            const {navigator} = _this.props;
            if (navigator) {
                navigator.push({
                    name: 'ChooseBeautyServices',
                    component: ChooseBeautyServices,
                    params: {
                        headTitle: '选择美容服务',
                        getResult: function (beauty) {
                            var _beauty = _this.state.beautySource, _exists = false;
                            _beauty && _beauty.forEach((item, index, array) => {
                                if (item.BarCode == beauty.BarCode) {
                                    _exists = true;
                                }
                            })
                            if (!_exists) {
                                _beauty.push(beauty);
                                _this.state.totalAmount += beauty.RecipePrice;
                                _this.state.totalNum += 1;
                            }
                            _this.setState({
                                beautySource: _beauty,
                            })
                        }
                    }
                })
            }
        }
    }

    _onBeautyDetails(beauty) {
        let _this = this;
        if (_this.state.edit == '编辑') {
            return false;
        }
        Alert.alert(
            '删除提示',
            '您确定要删除此条信息吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: '确定', onPress: () => {
                    //删除此条数据、PaidStatus=SM00040 未付款
                    if (beauty.PaidStatus != 'SM00040') {
                        Alert.alert('提示', '此项目已缴费,不可删除!', [{text: '确定'}]);
                        return false;
                    }
                    //beautySource: _this.state.beautySource.filter((elem, i) => index !== i)
                    let newSource = [];
                    _this.state.beautySource.forEach((item, index, array)=> {
                        if (beauty.ItemCode === item.ItemCode) {
                            //var _beauty=_this.state.beautySource.splice(0,index);
                            item.IsDeleted =1;
                            _this.state.totalAmount -= beauty.SellPrice;
                            _this.state.totalNum -= 1;
                        }
                        newSource.push(item);
                    });
                    _this.setState({
                        beautySource: newSource,

                    })
                }
                }
            ]
        )
    }

    _onChoosePet() {
        let _this = this;
        if (!_this.state.canChoose) {
            return false;
        }
        const {navigator} =_this.props;
        if (navigator) {
            navigator.push({
                name: 'ChoosePet',
                component: ChoosePet,
                params: {
                    headTitle: '选择宠物',
                    getResult: function (pet) {
                        _this.setState({
                            petSource: pet,
                        });
                    }
                },
            })
        }
    }

    _onEditInfo() {
        let _this = this;
        if (_this.state.edit == '编辑') {
            _this.setState({
                edit: '保存',
                canChoose: true,
            })
        } else if (_this.state.edit == '保存') {
            if (_this.state.petSource.PetID == null) {
                Alert.alert('提示', '请选择宠物', [{text: '确定'}]);
                return false;
            } else if (_this.state.serviceName == null) {
                Alert.alert('提示', '请选择服务师', [{text: '确定'}]);
                return false;
            } else if (_this.state.beautySource.length == 0) {
                Alert.alert('提示', '请选择美容项目', [{text: '确定'}]);
                return false;
            }
            if (_this.props.beautyID == 1) {
                //1为新增美容服务
                NetUtil.getAuth(function (user, hos) {
                    var service = _this.state.serviceSource;
                    var servicesID = 0;
                    service.forEach((item, index, array)=> {
                        if (item.PersonName == _this.state.serviceName) {
                            servicesID = item.ID;
                        }
                    });
                    var _petSource = _this.state.petSource;
                    var totalNum = _this.state.totalNum;
                    var totalAmount = _this.state.totalAmount;
                    var items = {
                        "ID": "00000000-0000-0000-0000-000000000000",
                        "ServiceCode": _this.state.servicesFWID,
                        "GestID": _petSource.GestID,
                        "GestName": _petSource.GestName,
                        "PetID": _petSource.PetID,
                        "PetName": _petSource.PetName,
                        "GestCode": _petSource.GestCode,
                        "MobilePhone": _petSource.MobilePhone,
                        "HairdresserID": servicesID,
                        "AssistantID": null,
                        "AssistantName": "",
                        "HairdresserName": _this.state.serviceName,
                        "TotalNum": totalNum,
                        "TotalCost": totalAmount,
                        "PaidStatus": "SM00040",
                        "PaidTime": null,
                        "Remark": "",
                        "CreatedBy": null,
                        "CreatedOn": "0001-01-01T00:00:00",
                        "ModifiedBy": null,
                        "ModifiedOn": "0001-01-01T00:00:00",
                        "IsDeleted": 0,
                        "EntID": "00000000-0000-0000-0000-000000000000"
                    };
                    let beautyItems = [];
                    let _beauty = _this.state.beautySource;
                    for (let i = 0; i < _beauty.length; i++) {
                        var item = {
                            "ID": "00000000-0000-0000-0000-000000000000",
                            "ServiceID": null,
                            "ItemCode": _beauty[i].ItemCode,
                            "ItemName": _beauty[i].ItemName,
                            "ItemStandard": "",
                            "BarCode": _beauty[i].BarCode,
                            "SellPrice": _beauty[i].SellPrice,
                            "InputCount": 1,
                            "TotalCost": _beauty[i].TotalCost,
                            "PackageUnit": _beauty[i].PackageUnit,
                            "PaidStatus": "SM00040",
                            "PaidTime": null,
                            "Remark": null,
                            "CreatedBy": null,
                            "CreatedOn": "0001-01-01T00:00:00",
                            "ModifiedBy": null,
                            "ModifiedOn": "0001-01-01T00:00:00",
                            "IsDeleted": 0,
                            "EntID": "00000000-0000-0000-0000-000000000000"
                        };
                        beautyItems.push(item);
                    }
                    let postjson = {
                        item: items,
                        details: beautyItems,
                    }
                    let header = NetUtil.headerClientAuth(user, hos);
                    ////save http://petservice.tuoruimed.com/service/Api/Service/AddList
                    NetUtil.postJson(CONSTAPI.HOST + '/Service/AddList', postjson, header, function (data) {
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
                    alert(err);
                })
            }
            else if (_this.props.beautyID == 2) {
                //2为详情 修改
                NetUtil.getAuth(function (user, hos) {
                    var service = _this.state.serviceSource;
                    var servicesID = 0;
                    service.forEach((item, index, array)=> {
                        if (item.PersonName == _this.state.serviceName) {
                            servicesID = item.ID;
                        }
                    });
                    var _petSource = _this.state.petSource;
                    var totalNum = _this.state.totalNum;
                    var totalAmount = _this.state.totalAmount;
                    var items = {
                        "ID": _petSource.ID,
                        "ServiceCode": _this.state.servicesFWID,
                        "GestID": _petSource.GestID,
                        "GestName": _petSource.GestName,
                        "PetID": _petSource.PetID,
                        "PetName": _petSource.PetName,
                        "GestCode": _petSource.GestCode,
                        "MobilePhone": _petSource.MobilePhone,
                        "HairdresserID": servicesID,
                        "AssistantID": _petSource.AssistantID,
                        "AssistantName": _petSource.AssistantName,
                        "HairdresserName": _this.state.serviceName,
                        "TotalNum": totalNum,
                        "TotalCost": totalAmount,
                        "PaidStatus": _petSource.PaidStatus,
                        "PaidTime": _petSource.PaidTime,
                        "Remark": _petSource.Remark,
                        "CreatedBy": _petSource.CreatedBy,
                        "CreatedOn": _petSource.CreatedOn,
                        "ModifiedBy": user.user.mobile,
                        "ModifiedOn": Util.getTime(),
                        "IsDeleted": _petSource.IsDeleted,
                        "EntID": _petSource.EntID
                    };
                    let beautyItems = [];
                    let _beauty = _this.state.beautySource;
                    for (let i = 0; i < _beauty.length; i++) {
                        var item = {
                            "ID": _beauty[i].ID,
                            "ServiceID": _beauty[i].ServiceID ? _beauty[i].ServiceID : null,
                            "ItemCode": _beauty[i].ItemCode,
                            "ItemName": _beauty[i].ItemName,
                            "ItemStandard": _beauty[i].ItemStandard,
                            "BarCode": _beauty[i].BarCode,
                            "SellPrice": _beauty[i].SellPrice,
                            "InputCount": _beauty[i].InputCount,
                            "TotalCost": _beauty[i].TotalCost,
                            "PackageUnit": _beauty[i].PackageUnit,
                            "PaidStatus": _beauty[i].PaidStatus,
                            "PaidTime": _beauty[i].PaidTime,
                            "Remark":  _beauty[i].Remark,
                            "CreatedBy": _beauty[i].CreatedBy,
                            "CreatedOn": _beauty[i].CreatedOn,
                            "ModifiedBy": user.user.mobile,
                            "ModifiedOn": Util.getTime(),
                            "IsDeleted": _beauty[i].IsDeleted,
                            "EntID": _beauty[i].EntID
                        };
                        beautyItems.push(item);
                    }
                    let postjson = {
                        item: items,
                        details: beautyItems,
                    }
                    let header = NetUtil.headerClientAuth(user, hos);
                    ////update //http://test.tuoruimed.com/service/Api/Service/UpdateList
                    NetUtil.postJson(CONSTAPI.HOST + '/Service/UpdateList', postjson, header, function (data) {
                        if (data.Sign) {
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            Alert.alert('提示', '获取数据错误'+ data.Exception, [{text: '确定'}]);
                        }
                    });
                }, function (err) {
                    alert(err);
                })
            }
            _this.setState({
                edit: '编辑',
                canChoose: false,
            })
        }

    }

    _onChooseService() {
        if (this.state.canChoose) {
            this.picker.toggle();
        }
    }

    _renderHeader() {
        return (
            <View style={{flex:1,}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={this.state.isEdit} edit={this.state.edit} editInfo={this._onEditInfo.bind(this)}/>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>会员名称</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.petSource.GestName}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>手机号码</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.petSource.MobilePhone}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePet.bind(this)}
                                  style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>宠物名称</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.petSource.PetName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>服务信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>服务单号</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.servicesFWID}</Text>
                </View>
                <TouchableOpacity onPress={this._onChooseService.bind(this)} style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>服务师</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.serviceName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>总项</Text>
                    <Text style={{flex:1,color:'black'}}>{this.state.totalNum.toString()}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={styles.textTitle}>总金额</Text>
                    <Text style={{flex:1,color:'black'}}>¥{this.state.totalAmount.toString()}</Text>
                </View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>美容项目</Text>
                    <TouchableOpacity
                        style={{width:50,alignItems:'center', backgroundColor:'#99CCFF', justifyContent:'center'}}
                        onPress={this.chooseBeauty.bind(this)}>
                        <Text>添加</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _onRenderRow(beauty) {
        if (beauty.IsDeleted === 1) {
            return null;
        } else {
            return (
                <TouchableOpacity style={styles.row} onPress={()=>this._onBeautyDetails(beauty)}>
                    <Text style={{flex: 1,fontSize:14,color:'#27408B', fontWeight:'bold'}}>{beauty.ItemName}</Text>
                    <Text style={{flex: 1,fontSize:14,color:'#8B0000'}}>单价: ¥{beauty.SellPrice}</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        if (!this.state.loaded) {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <Loading type="text"/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ListView enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.beautySource)}
                          renderHeader={this._renderHeader.bind(this)}
                          renderRow={this._onRenderRow.bind(this)}
                />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.picker = picker}
                    pickerData={this.state.ServicerNameData}
                    selectedValue={this.state.serviceName}
                    onPickerDone={(text)=>{
                 this.setState({
                     serviceName: text!==null?text[0]:'',
                 })
                 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    titleStyle: {
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
        flexDirection: 'row',
    },
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        color: '#CC0033',
    },
    textTitle: {
        width: 100,
        fontSize: 16,
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
})
module.exports = BeautyServices