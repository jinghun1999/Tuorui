/**
 * Created by tuorui on 2016/9/14.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
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
class VaccineService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
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
            totalAmount:0,
            totalNum:0,
            edit:'保存',
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
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
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=97', header, function (data) {
                var serviceData = data.Message;
                var _data = [];
                serviceData.forEach((item, index, array)=> {
                    _data.push(item.PersonName);
                })
                _this.setState({
                    executorSource: serviceData,
                    executorNameData: _data,
                });
            })

        }, function (err) {
            alert(err)
        })
        if (_this.props.isLook == true) {
            //疫苗详情
            _this.setState({
                petSource: {
                    GestName: _this.props.vaccine.GestName,
                    GestCode: _this.props.vaccine.GestCode,
                    PetName: _this.props.vaccine.PetName,
                },
                enable: false,
                canEdit:false,
                edit:'',
                VaccineGroupCode: _this.props.vaccine.VaccineGroupCode,
                executorName: _this.props.vaccine.ExecutorName,
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
                }, {
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 1
                }],
                "sorts": [{
                    "Field": "EstimateTime",
                    "Title": null,
                    "Sort": {"Name": "Asc", "Title": "升序"}, "Conn": 0
                }]
            };
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                ///service/Api/Medic_Vaccine/GetModelListWithSort
                NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetModelListWithSort', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        var _totalAmount = 0
                        var _totalNum =0
                        data.Message.forEach((item,index,array)=>{
                            _totalAmount+=item.ItemCost;
                            _totalNum+=1;
                        })
                        _this.setState({
                            vaccine: data.Message,
                            totalAmount:_totalAmount,
                            totalNum:_totalNum,
                            loaded: true,
                        });
                    }else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                })
            }, function (err) {
                alert(err)
            })

        } else if (_this.props.isLook == false) {
            //新增疫苗详情
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                //http://test.tuoruimed.com/service/Api/BusinessInvoices/VaccineGroupCode?
                NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/VaccineGroupCode?', header, function (data) {
                    _this.setState({
                        VaccineGroupCode: data.Message,
                        canEdit:true,
                        loaded: true,
                    });
                })
            }, function (err) {
                alert(err)
            })
        }

    }

    _onSaveInfo(){
        //保存疫苗信息
        let _this = this;
        if (_this.state.petSource.GestCode == null) {
            alert('请选择宠物信息');
            return false;
        } else if (_this.state.executorName == '' || _this.state.executorName == null) {
            alert('请选择执行人');
            return false;
        } else if (_this.state.vaccine.length == 0) {
            alert('请选择美容项目');
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
           var vaccineGroupCode ='YM2016091800025';
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
                    "ID":"00000000-0000-0000-0000-000000000000",
                    "VaccineGroupCode":vaccineGroupCode,
                    "PetName":_this.state.petSource.PetName,
                    "GestID":_this.state.petSource.GestID,
                    "GestName":_this.state.petSource.GestName,
                    "GestCode":_this.state.petSource.GestCode,
                    "PetID":_this.state.petSource.PetID,
                    "MobilePhone":null,
                    "ItemName":_vaccine[i].ItemName,
                    "ItemCode":_vaccine[i].ItemCode,
                    "ItemCost":_vaccine[i].SellPrice,
                    "ItemStandard":_vaccine[i].ItemStandard,
                    "EstimateTime":null,
                    "FactShootTime":Util.getTime(),
                    "ShootLevelNum":null,
                    "ShootProcess":"首免",
                    "IntervalDay":null,
                    "AddType":null,
                    "Remark":null,
                    "PaidStatus":"SM00040",
                    "WarnStatus":"SM00027",
                    "ShootStatus":"SM00029",
                    "PaidTime":null,
                    "CreatedBy":null,
                    "CreatedOn":"0001-01-01T00:00:00",
                    "ModifiedBy":null,
                    "ModifiedOn":"0001-01-01T00:00:00",
                    "IsDeleted":0,
                    "BatchNumber":"",
                    "OutDateTime":null,
                    "ManufacturerCode":_vaccine[i].ManufacturerCode,
                    "ManufacturerName":_vaccine[i].ManufacturerName,
                    "ExecutorID":executorID,
                    "ExecutorName":name,
                    "DoctorID":null,
                    "DoctorName":null,
                    "AssistantDoctorID":null,
                    "AssistantDoctorName":"",
                    "ItemNum":_vaccine[i].ItemCountNum,
                    "TotalCost":_vaccine[i].SellPrice,
                    "Sign":null,
                    "EntID":"00000000-0000-0000-0000-000000000000"
                };
                vaccineItems.push(items);
            }
            var item ={
                "ID":"00000000-0000-0000-0000-000000000000",
                "VaccineGroupCode":"YM2016091800025",
                "PetName":"豆豆",
                "GestID":"e9530e2d-b5df-414d-a2d9-32f0261e3e89",
                "GestName":"豆豆",
                "GestCode":"VIP0000000026",
                "PetID":"9f8b6f21-02ef-44dc-9e74-eede3afd9d4c",
                "MobilePhone":null,
                "ItemName":"英特威狂犬疫苗",
                "ItemCode":"WF0000000069",
                "ItemCost":150,
                "ItemStandard":"DM00050",
                "EstimateTime":null,
                "FactShootTime":"2016-09-18T15:36:53.6553714+08:00",
                "ShootLevelNum":null,
                "ShootProcess":"首免",
                "IntervalDay":null,
                "AddType":null,
                "Remark":null,
                "PaidStatus":"SM00040",
                "WarnStatus":"SM00027",
                "ShootStatus":"SM00029",
                "PaidTime":null,
                "CreatedBy":null,
                "CreatedOn":"0001-01-01T00:00:00",
                "ModifiedBy":null,
                "ModifiedOn":"0001-01-01T00:00:00",
                "IsDeleted":0,
                "BatchNumber":"",
                "OutDateTime":null,
                "ManufacturerCode":"JXS0000000003",
                "ManufacturerName":"美国瑞普斯生物药品集团有限公司",
                "ExecutorID":"bcefd6b4-b024-4fe7-96c3-4d8e198d113e",
                "ExecutorName":"阳涛",
                "DoctorID":null,
                "DoctorName":null,
                "AssistantDoctorID":null,
                "AssistantDoctorName":"",
                "ItemNum":1,
                "TotalCost":150,
                "Sign":null,
                "EntID":"00000000-0000-0000-0000-000000000000"
            }
            let postjson = {
                vaccineGroupCode: vaccineGroupCode,
                list: item,
            }
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, user.pwd, hos.hospital.Registration, user.user.Token)
            };
            ////save http://test.tuoruimed.com/service/Api/Medic_Vaccine/AddOrUpdate
            NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/AddOrUpdate', postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    alert('保存成功');
                    if (_this.props.getResult) {
                        _this.props.getResult();
                    }
                    _this._onBack();
                } else {
                    alert('获取数据错误'+data.Message);
                }
            });
        }, function (err) {
            alert(err);
        })
    }

    _onChoosePet() {
        //选择宠物
        let _this = this;
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

    chooseVaccine() {
        //疫苗添加
        let _this = this;
        if(_this.state.canEdit==false){return false;}
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseVaccineInfo',
                component: ChooseVaccineInfo,
                params: {
                    headTitle: '选择疫苗',
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

    _onChoosePerson() {
        this.picker.toggle();
    }

    _renderHeader() {
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={this.state.canEdit} edit={this.state.edit} editInfo={this._onSaveInfo.bind(this)}/>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>会员编号</Text>
                    <Text style={{flex:1}}>{this.state.petSource.GestCode}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>会员名称</Text>
                    <Text style={{flex:1}}>{this.state.petSource.GestName}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePet.bind(this)}
                                  style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>宠物名称</Text>
                    <Text style={{flex:1}}>{this.state.petSource.PetName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>服务信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>组号</Text>
                    <Text style={{flex:1}}>{this.state.VaccineGroupCode}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePerson.bind(this)}
                                  style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>执行人</Text>
                    <Text style={{flex:1}}>{this.state.executorName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>数量</Text>
                    <Text style={{flex:1}}>{this.state.totalNum.toString()}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>金额</Text>
                    <Text style={{flex:1}}>{this.state.totalAmount.toString()}</Text>
                </View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>疫苗信息</Text>
                    <TouchableOpacity
                        style={{width:50,alignItems:'center', backgroundColor:'#99CCFF', justifyContent:'center'}}
                        onPress={this.chooseVaccine.bind(this)}>
                        <Text>添加</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _onVaccineDetails(vaccine) {
        alert(vaccine.ItemName);
    }

    _onRenderRow(vaccine) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onVaccineDetails(vaccine)}>
                <Text style={{flex: 1,fontSize:14, fontWeight:'bold'}}>{vaccine.ItemName}</Text>
                <Text style={{flex: 1,fontSize:14,}}>单价: ￥{vaccine.SellPrice}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    titleStyle: {
        padding: 5,
        paddingLeft: 10,
        flexDirection: 'row',
    },
    titleText: {
        marginLeft: 10, fontSize: 16, flex: 1,
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
module.exports = VaccineService;