/**
 * Created by tuorui on 2016/9/5.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ListView,
    ScrollView,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import ChooseBeautyServices from './ChooseBeautyServices';
import ChoosePet from './ChoosePet';
import BeautyListInfo from './BeautyList';
import { toastShort } from '../../util/ToastUtil';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
import NButton from '../../commonview/NButton';
import BeautySettlement from './BeautySettlement';
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
            num: 1,
        }
    }

    componentWillMount() {
        let _this= this;
        InteractionManager.runAfterInteractions(() => {
            _this._loadData();
        });
    }
    componentWillUnmount() {

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
            NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=82', header, function (data) {
                var serviceData = data.Message;
                var _data = [];
                serviceData.forEach((item, index, array)=> {
                    _data.push(item.PersonName);
                })
                if(_this.props.beautyID==1){
                    _this.state.serviceName=_data[0];
                }
                _this.setState({
                    serviceSource: serviceData,
                    ServicerNameData: _data,
                    loaded: true,
                });
            });
            //查看
            if (!_this.props.canEdit) {
                // //http://test.tuoruimed.com/service/Api/Service/GetUpdateServiceConfig?id=f8f95c5e-95e8-4c94-9de4-847ff334f55a
                NetUtil.get(CONSTAPI.HOST + '/Service/GetUpdateServiceConfig?id='+_this.props.beautyInfo.ID,header,function(data){
                    if(data.Sign && data.Message!=null){
                        var dataSource = data.Message.ICList;
                        var _totalNum=0;
                        dataSource.forEach((d)=>{
                            _totalNum+=d.InputCount;
                        })
                        _this.state.totalNum = _totalNum;
                        var itemSource = data.Message.Item;
                        _this.setState({
                            beautySource:dataSource,
                            petSource: _this.props.beautyInfo,
                            servicesFWID:itemSource.ServiceCode,
                            serviceName: itemSource.HairdresserName,
                            servicesID: itemSource.HairdresserID,
                            totalAmount: itemSource.TotalCost,
                            paidStatus:itemSource.PaidStatus,
                            edit: '编辑',
                        })
                    }
                })

                /*_this.setState({
                    petSource: _this.props.beautyInfo,
                    servicesFWID: _this.props.beautyInfo.ServiceCode,
                    serviceName: _this.props.beautyInfo.HairdresserName,
                    servicesID: _this.props.beautyInfo.HairdresserID,
                    totalAmount: _this.props.beautyInfo.TotalCost,
                    paidStatus:_this.props.beautyInfo.PaidStatus,
                    edit: '编辑',
                })*/
                if (_this.props.beautyInfo.PaidStatus == 'SM00051') {
                    _this.setState({isEdit: false,})
                }
                /*var postdata = [{
                    "Childrens": null,
                    "Field": "ServiceID",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.props.beautyInfo.ID,
                    "Conn": 0
                }];
                NetUtil.postJson(CONSTAPI.HOST + '/ServiceDetail/GetModelList', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            beautySource: data.Message,
                            loaded: true,
                        })
                    }
                    else {
                        _this.setState({
                            loaded: true,
                        });
                        toastShort("获取数据失败：" + data.Exception);
                    }
                })*/
            }
        }, function (err) {
            toastShort(err);
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
                                _this.state.totalAmount += beauty.SellPrice;
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
            '您确定要删除' + beauty.ItemName + '吗？',
            [
                {text: '取消'},
                {
                    text: '确定', onPress: () => {
                    if (this.props.beautyID == 2) {
                        if (beauty.PaidStatus === 'SM00051') {
                            toastShort('此项目已缴费,不可删除!');
                            return false;
                        }
                    }
                    let newSource = [];
                    _this.state.beautySource.forEach((item, index, array)=> {
                        if (beauty.ItemCode === item.ItemCode) {
                            _this.state.totalAmount -= beauty.SellPrice*(beauty.InputCount?beauty.InputCount:this.state.num);
                            _this.state.totalNum -= (beauty.InputCount?parseInt(beauty.InputCount):this.state.num);
                        } else {
                            newSource.push(item);
                        }
                    });
                    _this.setState({
                        beautySource: newSource,
                    });
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
                toastShort('请选择宠物');
                return false;
            } else if (_this.state.serviceName == null) {
                toastShort('请选择服务师');
                return false;
            } else if (_this.state.beautySource.length == 0) {
                toastShort('请选择美容项目');
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
                            "ItemStandard": _beauty[i].ItemStandard ? _beauty[i].ItemStandard : '',
                            "BarCode": _beauty[i].BarCode,
                            "SellPrice": _beauty[i].SellPrice,
                            "InputCount": _beauty[i].InputCount?_beauty[i].InputCount:1,
                            "TotalCost": _beauty[i].SellPrice*( _beauty[i].InputCount?_beauty[i].InputCount:1),
                            "PackageUnit": _beauty[i].PackageUnit,
                            "PaidStatus": "SM00040",
                            "PaidTime": null,
                            "Remark": null,
                            "CreatedBy": user.FullName,
                            "CreatedOn": Util.getTime(),
                            "ModifiedBy": user.FullName,
                            "ModifiedOn": Util.getTime(),
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
                            toastShort("保存成功");
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            toastShort("保存失败，" + data.Exception);
                        }
                    });
                }, function (err) {
                    toastShort(err);
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
                            "InputCount": _beauty[i].InputCount?_beauty[i].InputCount:1,
                            "TotalCost": _beauty[i].SellPrice*( _beauty[i].InputCount?_beauty[i].InputCount:1),
                            "PackageUnit": _beauty[i].PackageUnit,
                            "PaidStatus": _beauty[i].PaidStatus,
                            "PaidTime": _beauty[i].PaidTime,
                            "Remark": _beauty[i].Remark,
                            "CreatedBy": _beauty[i].CreatedBy,
                            "CreatedOn": _beauty[i].CreatedOn,
                            "ModifiedBy": user.FullName,
                            "ModifiedOn": Util.getTime(),
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
                            toastShort('保存成功');
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            toastShort('保存失败，' + data.Exception);
                        }
                    });
                }, function (err) {
                    toastShort(err);
                })
            }
            _this.setState({
                edit: '编辑',
                canChoose: false,
            })
        }

    }

    _saveAndSet() {
        //保存并结算
        /*{this.state.edit === '编辑' ?
         <View style={{padding:5,}}>
         {
         this.state.paidStatus === 'SM00051'
         ?null:
         <NButton onPress={this._saveAndSet.bind(this)} backgroundColor={'#1E90FF'} text="结算"/>
         }

         </View>
         : null
         }*/
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautySettlement',
                component: BeautySettlement,
                params: {
                    headTitle: '美容结算',
                    beauty: _this.state.beautySource,
                    member: {
                        ID: _this.state.petSource.GestID,
                        memberCode: _this.state.petSource.GestCode,
                        memberName: _this.state.petSource.GestName,
                    },
                }
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
                            <Text style={AppStyle.rowTitle}>编号</Text>
                            <Text style={AppStyle.rowVal}>{this.state.petSource.GestCode}</Text>
                        </View>
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
                    {this.state.edit === '保存'?<Icon name={'angle-right'} size={20} color={'#ccc'}/>:null}
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
                    {this.state.edit === '保存'?<Icon name={'angle-right'} size={20} color={'#ccc'}/>:null}
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
        return (
            <View style={AppStyle.row}>
                <Text style={AppStyle.mpName}>{beauty.ItemName}</Text>
                <Text style={AppStyle.mpTitle}>单价: ¥{beauty.SellPrice?beauty.SellPrice:0}</Text>
                <Text style={AppStyle.mpTitle}>数量:</Text>
                {this.state.edit === '保存' ?
                    <View style={AppStyle.mpBorder}>
                        <TextInput value={beauty.InputCount?beauty.InputCount.toString():this.state.num.toString()}
                                   defaultValue={this.state.num.toString()}
                                   editable={true}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'numeric'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{
                                       beauty.InputCount=text;
                                       //beauty.TotalCost=beauty.SellPrice*(beauty.InputCount?beauty.InputCount:this.state.num);
                                       let _countAmount=0;
                                       var _totalNum=0;
                                       if(!text || isNaN(text)){
                                        this.setState({num:1})
                                        return false;
                                        }
                                        if(this.state.beautySource.length>1){
                                            this.state.beautySource.forEach((item,index,array)=>{
                                                if(item.ItemCode===beauty.ItemCode){return false;}
                                                _countAmount+=item.SellPrice*(item.InputCount?parseInt(item.InputCount):parseInt(this.state.num))
                                                _totalNum+=(item.InputCount?parseInt(item.InputCount):parseInt(this.state.num));
                                            })
                                        }
                                        this.setState({totalAmount:_countAmount+(beauty.SellPrice*(beauty.InputCount?beauty.InputCount:this.state.num)),
                                                        totalNum:(parseInt(_totalNum)+parseInt(text))})
                                       }}/>
                    </View>
                    : <Text style={AppStyle.mpTitle}>{beauty.InputCount ? beauty.InputCount : 1}</Text>
                }

                {this.state.edit === '保存' ?
                    <TouchableOpacity style={AppStyle.mpBtn} onPress={()=>this._onBeautyDetails(beauty)}>
                        <Text style={{color:'white',textAlign:'center'}}>删除</Text>
                    </TouchableOpacity>
                    : null
                }

            </View>
        );
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
                     serviceName: text?text[0]:'',
                 })
                 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({});
module.exports = BeautyServices