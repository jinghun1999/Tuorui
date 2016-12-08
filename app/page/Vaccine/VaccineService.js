/**
 * Created by tuorui on 2016/9/14.
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
import ChoosePet from '../Beauty/ChoosePet';
import Picker from 'react-native-picker';
import ChooseVaccineInfo from './ChooseVaccineInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
import DatePicker from 'react-native-datepicker';
import VaccineSettlement from './VaccineSettlement';
import NButton from '../../commonview/NButton';
import { toastShort } from '../../util/ToastUtil';
class VaccineService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccine: [],
            petSource: {
                PetName: '', PetCode: '', PetBreed: '', BarCode: '', SellPrice: 0, PetStatus: '',
                GestName: '', MobilePhone: '', GestID: '', GestCode: '', TotalCost: 0, PackageUnit: '',
            },
            selectVaccine: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            VaccineGroupCode: '',
            executorName: '',
            executorNameData: [''],
            totalAmount: 0,
            totalNum: 0,
            edit: this.props.canEdit ? '保存' : '',
            num: 1,
            carryDate: new Date(),
            shootStatus: '',
            loaded: false,
        }
    }

    _onBack() {
        let _this = this;
        const {navigator} =_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onLoadVaccInfo();
        });
    }

    onLoadVaccInfo() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            //执行人初始化
            //http://test.tuoruimed.com/service/Api/Persons/GetPersonsByAppconfigID?appconfigID=97
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=97', header, function (data) {
                var serviceData = data.Message;
                var _data = [];
                serviceData.forEach((item, index, array)=> {
                    _data.push(item.PersonName);
                })
                _this.setState({
                    executorSource: serviceData,
                    executorNameData: _data,
                    executorName: _data[0],
                });
            });
            let postData = [{
                "Childrens": null,
                "Field": "IsDrugStore",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "是",
                "Conn": 0
            }];
            //http://test.tuoruimed.com/service/Api/Warehouse/GetFirstModel
            NetUtil.postJson(CONSTAPI.HOST + '/Warehouse/GetFirstModel', postData, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        warehouseID: data.Message.ID,
                    })
                }
            })

        }, function (err) {
            toastShort(err)
        })
        if (_this.props.id == 2) {
            //疫苗详情
            _this.setState({
                petSource: {
                    GestName: _this.props.vaccine.GestName,
                    GestCode: _this.props.vaccine.GestCode,
                    PetName: _this.props.vaccine.PetName,
                    GestID: _this.props.vaccine.GestID,
                    MobilePhone:_this.props.vaccine.MobilePhone,
                },
                enable: false,
                edit: '编辑',
                VaccineGroupCode: _this.props.vaccine.VaccineGroupCode,
                executorName: _this.props.vaccine.ExecutorName,
                shootStatus: _this.props.vaccine.ShootStatus,
            });
            //获取疫苗信息列表
            var postdata = {
                "items": [{
                    "Childrens": null,
                    "Field": "VaccineGroupCode",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.VaccineGroupCode,
                    "Conn": 0
                }],
                "sorts": [{
                    "Field": "EstimateTime",
                    "Title": null,
                    "Sort": {"Name": "Asc", "Title": "升序"},
                    "Conn": 0
                }]
            };
            NetUtil.getAuth(function (user, hos) {
                let header = NetUtil.headerClientAuth(user, hos);
                ///service/Api/Medic_Vaccine/GetModelListWithSort
                NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetModelListWithSort', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        var _totalAmount = 0
                        var _totalNum = 0
                        data.Message.forEach((item, index, array)=> {
                            _totalAmount += (item.ItemCost * item.ItemNum);
                            _totalNum += 1;
                        })
                        _this.setState({
                            vaccine: data.Message,
                            totalAmount: _totalAmount,
                            totalNum: _totalNum,
                            loaded: true,
                        });
                    } else {
                        toastShort("获取数据失败" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                })
            }, function (err) {
                toastShort(err)
            })

        } else if (_this.props.id === 1) {
            //新增疫苗详情
            NetUtil.getAuth(function (user, hos) {
                let header = NetUtil.headerClientAuth(user, hos);
                //http://test.tuoruimed.com/service/Api/BusinessInvoices/VaccineGroupCode?
                NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/VaccineGroupCode?', header, function (data) {
                    _this.setState({
                        VaccineGroupCode: data.Message,
                        canEdit: true,
                        loaded: true,
                    });
                })
            }, function (err) {
                toastShort(err);
            })
        }

    }

    _saveAndSet(isResult) {
        let _this = this;
        if (_this.state.petSource.PetName == '' || _this.state.petSource.length == 0) {
            toastShort('请选择宠物信息');
            return;
        } else if (_this.state.executorName == '' || _this.state.executorName == null) {
            toastShort('请选择执行人');
            return;
        } else if (_this.state.vaccine.length == 0) {
            toastShort('请选择疫苗');
            return;
        }
        if (isResult) {
            _this._onSaveInfo(false);
        }
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'VaccineSettlement',
                component: VaccineSettlement,
                params: {
                    vaccine: _this.state.vaccine,
                    member: {
                        ID: _this.state.petSource.GestID,
                        memberCode: _this.state.petSource.GestCode,
                        memberName: _this.state.petSource.GestName,
                    },
                    headTitle: '疫苗结算',
                    getResult:function(paidStatus){
                        _this.setState({
                            shootStatus:'SM00030'
                        })
                    }
                }
            })
        }
    }

    _onSaveInfo(isCan) {
        //保存疫苗信息
        let _this = this;
        if (_this.state.edit == '编辑') {
            _this.setState({
                edit: '保存',
            })
        }
        else if (_this.state.edit == '保存') {
            if (_this.state.petSource.PetName == '' || _this.state.petSource.length == 0) {
                toastShort('请选择宠物信息');
                return;
            } else if (_this.state.executorName == '' || _this.state.executorName == null) {
                toastShort('请选择执行人');
                return;
            } else if (_this.state.vaccine.length == 0) {
                toastShort('请选择疫苗');
                return;
            }
            if (_this.props.id == 1) {
                //1新增
                NetUtil.getAuth(function (user, hos) {
                    var vaccineGroupCode = _this.state.VaccineGroupCode;
                    let vaccineItems = [];
                    let _vaccine = _this.state.vaccine;
                    var executorID = 0;
                    _this.state.executorSource.forEach((item, index, array)=> {
                        if (item.PersonName == _this.state.executorName) {
                            executorID = item.ID;
                        }
                    });
                    let name = _this.state.executorName;
                    for (let i = 0; i < _vaccine.length; i++) {
                        var items = {
                            "ID": "00000000-0000-0000-0000-000000000000",
                            "VaccineGroupCode": vaccineGroupCode,
                            "PetName": _this.state.petSource.PetName,
                            "GestID": _this.state.petSource.GestID,
                            "GestName": _this.state.petSource.GestName,
                            "GestCode": _this.state.petSource.GestCode,
                            "PetID": _this.state.petSource.PetID,
                            "MobilePhone": _this.state.petSource.MobilePhone,
                            "ItemName": _vaccine[i].ItemName,
                            "ItemCode": _vaccine[i].ItemCode,
                            "ItemCost": _vaccine[i].SellPrice,
                            "ItemStandard": _vaccine[i].ItemStandard,
                            "EstimateTime": _vaccine[i].EstimateTime,
                            "FactShootTime": _vaccine[i].FactShootTime,
                            "ShootLevelNum": null,
                            "ShootProcess": "首免",
                            "IntervalDay": null,
                            "AddType": null,
                            "Remark": null,
                            "PaidStatus": "SM00040",
                            "WarnStatus": "SM00027",
                            "ShootStatus": "SM00029",
                            "PaidTime": null,
                            "CreatedBy": user.Mobile,
                            "CreatedOn": Util.getTime(),
                            "ModifiedBy": user.Mobile,
                            "ModifiedOn": Util.getTime(),
                            "BatchNumber": "",
                            "OutDateTime": null,
                            "ManufacturerCode": _vaccine[i].ManufacturerCode,
                            "ManufacturerName": _vaccine[i].ManufacturerName,
                            "ExecutorID": executorID,
                            "ExecutorName": name,
                            "DoctorID": null,
                            "DoctorName": null,
                            "AssistantDoctorID": null,
                            "AssistantDoctorName": "",
                            "ItemNum": _vaccine[i].ItemNum ? _vaccine[i].ItemNum : 1,
                            "TotalCost": _vaccine[i].TotalCost,
                            "Sign": null,
                            "EntID": "00000000-0000-0000-0000-000000000000",
                            "CreatedByID": "00000000-0000-0000-0000-000000000000",
                            "ModifiedByID": "00000000-0000-0000-0000-000000000000"
                        };
                        vaccineItems.push(items);
                    }
                    let postjson = {
                        vaccineGroupCode: vaccineGroupCode,
                        list: vaccineItems,
                    };
                    let header = NetUtil.headerClientAuth(user, hos);
                    ////save http://test.tuoruimed.com/service/Api/Medic_Vaccine/AddOrUpdate
                    NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/AddOrUpdate', postjson, header, function (data) {
                        if (data.Sign && data.Message) {
                            toastShort('保存成功');
                            _this.setState({
                                vaccine:vaccineItems,
                            })
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            if (isCan) {
                                _this._onBack();
                            }

                        } else {
                            toastShort('获取数据错误' + data.Message);
                        }
                    });
                }, function (err) {
                    toastShort(err);
                })
            }
            else if (_this.props.id == 2) {
                //2 详情修改
                /*{
                    this.state.shootStatus === 'SM00030'
                        ? null :null
                    <View style={{padding:5,}}>
                     <NButton onPress={this._saveAndSet.bind(this)} backgroundColor={'#1E90FF'} text="结算"/>
                     </View>*/
                }
            /*NetUtil.getAuth(function (user, hos) {
                 var vaccineGroupCode = _this.state.VaccineGroupCode;
                 let vaccineItems = [];
                 let _vaccine = _this.state.vaccine;
                 var executorID = 0;
                 _this.state.executorSource.forEach((item, index, array)=> {
                 if (item.PersonName == _this.state.executorName) {
                 executorID = item.ID;
                 }
                 });
                 let name = _this.state.executorName;
                 for (let i = 0; i < _vaccine.length; i++) {
                 var items = {
                 "ID": _vaccine[i].ID,
                 "VaccineGroupCode": vaccineGroupCode,
                 "PetName": _this.state.petSource.PetName,
                 "GestID": _this.state.petSource.GestID,
                 "GestName": _this.state.petSource.GestName,
                 "GestCode": _this.state.petSource.GestCode,
                 "PetID": _this.state.petSource.PetID,
                 "MobilePhone": _this.state.petSource.MobilePhone,
                 "ItemName": _vaccine[i].ItemName,
                 "ItemCode": _vaccine[i].ItemCode,
                 "ItemCost": _vaccine[i].SellPrice,
                 "ItemStandard": _vaccine[i].ItemStandard,
                 "EstimateTime": _vaccine[i].EstimateTime,
                 "FactShootTime": _vaccine[i].FactShootTime,
                 "ShootLevelNum": _vaccine[i].ShootLevelNum,
                 "ShootProcess": _vaccine[i].ShootProcess,
                 "IntervalDay": _vaccine[i].IntervalDay,
                 "AddType": _vaccine[i].AddType,
                 "Remark": _vaccine[i].Remark,
                 "PaidStatus": _vaccine[i].PaidStatus,
                 "WarnStatus": _vaccine[i].WarnStatus,
                 "ShootStatus": _vaccine[i].ShootStatus,
                 "PaidTime": _vaccine[i].PaidTime,
                 "CreatedBy": _vaccine[i].CreatedBy,
                 "CreatedOn": _vaccine[i].CreatedOn,
                 "ModifiedBy": user.FullName,
                 "ModifiedOn": Util.getTime(),
                 "IsDeleted": _vaccine[i].IsDeleted,
                 "BatchNumber": _vaccine[i].BatchNumber,
                 "OutDateTime": _vaccine[i].OutDateTime,
                 "ManufacturerCode": _vaccine[i].ManufacturerCode,
                 "ManufacturerName": _vaccine[i].ManufacturerName,
                 "ExecutorID": executorID,
                 "ExecutorName": name,
                 "DoctorID": _vaccine[i].DoctorID,
                 "DoctorName": _vaccine[i].DoctorName,
                 "AssistantDoctorID": _vaccine[i].AssistantDoctorID,
                 "AssistantDoctorName": _vaccine[i].AssistantDoctorName,
                 "ItemNum": _vaccine[i].ItemNum,
                 "TotalCost": _vaccine[i].TotalCost,
                 "Sign": null,
                 "EntID": "00000000-0000-0000-0000-000000000000"
                 };
                 vaccineItems.push(items);
                 }
                 let postjson = {
                 vaccineGroupCode: vaccineGroupCode,
                 list: vaccineItems,
                 };
                 let header = NetUtil.headerClientAuth(user, hos);
                 ////save http://test.tuoruimed.com/service/Api/Medic_Vaccine/AddOrUpdate
                 NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/AddOrUpdate', postjson, header, function (data) {
                 if (data.Sign && data.Message) {
                 toastShort('修改成功');
                 if (_this.props.getResult) {
                 _this.props.getResult();
                 }
                 _this._onBack();
                 } else {
                 toastShort('获取数据错误' + data.Message);
                 }
                 });
                 }, function (err) {
                 toastShort(err);
                 })*/
            }
            _this.setState({
                edit: '编辑',
            })
        }

    _onChoosePet(){
        //选择宠物
        let _this = this;
        if (!_this.props.canEdit || _this.state.edit != '保存') {
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

    _onChoosePerson() {
        let _this = this;
        if (!_this.props.canEdit || _this.state.edit != '保存') {
            return false;
        }
        _this.picker.toggle();
    }

    chooseVaccine() {
        //疫苗添加
        let _this = this;
        if (!_this.props.canEdit) {
            return false;
        }
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseVaccineInfo',
                component: ChooseVaccineInfo,
                params: {
                    headTitle: '选择疫苗',
                    WarehouseID: _this.state.warehouseID,
                    getResult: function (vaccine) {
                        var _vaccine = _this.state.vaccine, _exists = false;
                        _vaccine && _vaccine.forEach((item, index, array) => {
                            if (item.BarCode == vaccine.BarCode) {
                                _exists = true;
                            }
                        })
                        if (!_exists) {
                            _vaccine.push(vaccine);
                            _this.state.totalAmount += vaccine.SellPrice;
                            _this.state.totalNum += 1;
                        }
                        _this.setState({
                            vaccine: _vaccine,
                        })
                    }
                }
            })
        }
    }

    _remove(vaccine) {
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
                    //删除此条数据
                    if (_this.props.id === 2) {
                        if (vaccine.PaidStatus !== 'SM00040') {
                            Alert.alert('提示', '此项已收费', [{text: '确定'}]);
                            return false;
                        }
                    }

                    var _vaccine = _this.state.vaccine;
                    let newSource = [];
                    _vaccine.forEach((item, index, array)=> {
                        if (vaccine.ItemCode !== item.ItemCode) {
                            newSource.push(item);
                        } else {
                            let amount = _this.state.totalAmount - (vaccine.SellPrice ? vaccine.SellPrice : vaccine.TotalCost);
                            _this.setState({
                                totalAmount: amount,
                                totalNum: _this.state.totalNum - 1,
                            })
                        }
                    });
                    _this.setState({vaccine: newSource});
                }
                },
            ]
        )
    }

    _renderHeader() {
        return (
            <View>
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
                            <Text style={AppStyle.rowTitle}>名称</Text>
                            <Text style={AppStyle.rowVal}>{this.state.petSource.GestName}</Text>
                        </View>
                        <View style={AppStyle.row}>
                            <Text style={AppStyle.rowTitle}>手机</Text>
                            <Text style={AppStyle.rowVal}>{this.state.petSource.MobilePhone}</Text>
                        </View>
                    </View> : null
                }
                <TouchableOpacity onPress={this._onChoosePet.bind(this)}
                                  style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>宠物名称</Text>
                    <Text style={AppStyle.rowVal}>{this.state.petSource.PetName}</Text>
                    {this.state.canEdit ? <Icon name={'angle-right'} size={20} color={'#ccc'}/> : null}
                </TouchableOpacity>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>服务信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>组号</Text>
                    <Text style={AppStyle.rowVal}>{this.state.VaccineGroupCode}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePerson.bind(this)}
                                  style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>执行人</Text>
                    <Text style={AppStyle.rowVal}>{this.state.executorName}</Text>
                    {this.state.canEdit ? <Icon name={'angle-right'} size={20} color={'#ccc'}/> : null}
                </TouchableOpacity>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>疫苗数</Text>
                    <Text style={AppStyle.rowVal}>{this.state.totalNum.toString()}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>金额</Text>
                    <Text style={AppStyle.rowVal}>¥{this.state.totalAmount.toString()}</Text>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>疫苗信息</Text>
                    {this.state.canEdit ?
                        <TouchableOpacity
                            style={AppStyle.smallBtn}
                            onPress={this.chooseVaccine.bind(this)}>
                            <Text>添加</Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
        )
    }

    _renderRow(vaccine) {
        return (
            <View style={AppStyle.row}>
                <View style={{flex:1,flexDirection:'column'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={[AppStyle.mpName,{flex:2}]}>{vaccine.ItemName}</Text>
                        <Text
                            style={AppStyle.mpTitle}>单价:¥ {vaccine.SellPrice ? vaccine.SellPrice : vaccine.ItemCost}</Text>
                        <Text style={AppStyle.mpTitle}>数量:</Text>
                        {this.state.canEdit ?
                            <View style={AppStyle.mpBorder}>
                                <TextInput value={vaccine.ItemNum}
                                           defaultValue={this.state.num.toString()}
                                           editable={true}
                                           underlineColorAndroid={'transparent'}
                                           keyboardType={'numeric'}
                                           style={AppStyle.input}
                                           onChangeText={(text)=>{
                                       vaccine.ItemNum=text;
                                       let _price=vaccine.SellPrice ? vaccine.SellPrice : vaccine.ItemCost;
                                       vaccine.TotalCost=_price*text;
                                       let _countAmount=0;
                                       if(this.state.vaccine.length>1){
                                       this.state.vaccine.forEach((item,index,array)=>{
                                            if(item.ItemCode===vaccine.ItemCode){return false;}
                                            _countAmount+=item.SellPrice*item.ItemNum;
                                        })
                                       }
                                        this.setState({totalAmount:_countAmount+(_price*text)})
                                       }}/>
                            </View>
                            : <Text style={AppStyle.mpTitle}>{vaccine.ItemNum.toString() ? vaccine.ItemNum.toString() : 1}</Text>
                        }

                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <Text style={{}}>日期:</Text>
                        {this.state.canEdit ?
                            <DatePicker
                                date={vaccine.FactShootTime?vaccine.FactShootTime:Util.getTime()}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{padding:0, margin:0,width:100,marginLeft:10,flex:2}}
                                enabled={true}
                                customStyles={{dateInput: {
                                       alignItems:'flex-start',
                                       height:30,
                                       padding:0,
                                       margin:0,
                                       borderWidth:0,},
                                       dateTouchBody:{ height:30,}
                                  }}
                                onDateChange={(date) => {vaccine.FactShootTime=date;this.setState({loaded:true,})  }}/>
                            : <Text
                            style={{flex:2}}>{vaccine.FactShootTime ? vaccine.FactShootTime.substr(0, 10) : Util.getTime("YYYY-MM-dd")}</Text>
                        }
                        <Text style={{}}>下次执行:</Text>
                        {this.state.canEdit ?
                            <DatePicker
                                date={vaccine.EstimateTime}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{padding:0, margin:0,width:100,marginLeft:10,}}
                                enabled={true}
                                customStyles={{
                                    dateInput: {
                                        alignItems:'flex-start',
                                        height:30,
                                        padding:0,
                                        margin:0,
                                      borderWidth:0,
                                    },
                                    dateTouchBody:{
                                        height:30,
                                    }
                                  }}
                                onDateChange={(date) => {vaccine.EstimateTime=date;this.setState({loaded:true})}}/>
                            : <Text
                            style={{flex:1}}>{vaccine.EstimateTime ? vaccine.EstimateTime.substr(0, 10) : null}</Text>
                        }
                    </View>
                </View>
                {this.state.canEdit ?
                    <TouchableOpacity style={AppStyle.mpBtn}
                                      onPress={()=>this._remove(vaccine)}>
                        <Text style={{color:'white',textAlign:'center'}}>删除</Text>
                    </TouchableOpacity>
                    : null
                }
            </View>
        )

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
                <Head title={this.props.headTitle}
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={this.props.canEdit}
                      edit={this.state.edit}
                      editInfo={this._onSaveInfo.bind(this)}/>
                <ListView enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
                          renderHeader={this._renderHeader.bind(this)}
                          renderRow={this._renderRow.bind(this)}
                />

                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.picker = picker}
                    pickerData={this.state.executorNameData}
                    selectedValue={this.state.executorName}
                    onPickerDone={(text)=>{
                 this.setState({
                     executorName: text!==null?text[0]:'',
                 })
                 }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({});
module.exports = VaccineService;