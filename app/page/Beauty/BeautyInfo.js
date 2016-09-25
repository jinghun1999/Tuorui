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
import BeautyListInfo from './BeautyList';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
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
            });
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
            });
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
                }];
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
            //alert(err)
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
                            item.IsDeleted = 1;
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

    _onSave() {
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
                            Alert.alert('提示', "保存成功", [{text: '确定'}]);
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            Alert.alert('提示', "保存失败，" + data.Exception, [{text: '确定'}]);
                        }
                    });
                }, function (err) {
                    Alert.alert('提示', err, [{text: '确定'}]);
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
                        "ModifiedBy": user.FullName,
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
                            "Remark": _beauty[i].Remark,
                            "CreatedBy": _beauty[i].CreatedBy,
                            "CreatedOn": _beauty[i].CreatedOn,
                            "ModifiedBy": user.FullName,
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
                            Alert.alert('提示', '保存成功', [{text: '确定'}]);
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            Alert.alert('提示', '保存失败，' + data.Exception, [{text: '确定'}]);
                        }
                    });
                }, function (err) {
                    Alert.alert('提示', err, [{text: '确定'}]);
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
                <Head title={this.props.headTitle}
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={this.state.isEdit}
                      edit={this.state.edit}
                      editInfo={this._onSave.bind(this)}/>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>宠物信息</Text>
                </View>
                {this.state.petSource.PetName != null && this.state.petSource.PetName != '' ?
                    <View>
                        <View style={AppStyle.row}>
                            <Text style={AppStyle.rowTitle}>会员</Text>
                            <Text style={AppStyle.rowVal}>{this.state.petSource.GestName}</Text>
                        </View>
                        <View style={AppStyle.row}>
                            <Text style={AppStyle.rowTitle}>手机</Text>
                            <Text style={AppStyle.rowVal}>{this.state.petSource.MobilePhone}</Text>
                        </View>
                    </View>
                    : null
                }
                <TouchableOpacity onPress={this._onChoosePet.bind(this)} style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>宠物</Text>
                    <Text style={AppStyle.rowVal}>{this.state.petSource.PetName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                </TouchableOpacity>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>服务信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>服务单号</Text>
                    <Text style={AppStyle.rowVal}>{this.state.servicesFWID}</Text>
                </View>
                <TouchableOpacity onPress={this._onChooseService.bind(this)} style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>服务师</Text>
                    <Text style={AppStyle.rowVal}>{this.state.serviceName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                </TouchableOpacity>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>项目数</Text>
                    <Text style={AppStyle.rowVal}>{this.state.totalNum.toString()}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>总金额</Text>
                    <Text style={AppStyle.rowVal}>¥{this.state.totalAmount.toString()}</Text>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>美容项目</Text>
                    {this.state.edit === '保存' ?
                        <TouchableOpacity style={AppStyle.smallBtn} onPress={this.chooseBeauty.bind(this)}>
                            <Text>添加</Text>
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        )
    }

    _onRenderRow(beauty) {
        if (beauty.IsDeleted === 1) {
            return null;
        } else {
            return (
                <TouchableOpacity style={AppStyle.row} onPress={()=>this._onBeautyDetails(beauty)}>
                    <Text style={AppStyle.mpName}>{beauty.ItemName}</Text>
                    <Text style={{fontSize:14,color:'#8B0000'}}>单价: ¥{beauty.SellPrice}</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        if (!this.state.loaded) {
            return (
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <Loading type="text"/>
                </View>
            )
        }
        return (
            <View style={AppStyle.container}>
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

const styles = StyleSheet.create({});
module.exports = BeautyServices