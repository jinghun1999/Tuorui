/**
 * Created by tuorui on 2016/9/9.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity,
    ListView,
    ScrollView,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import NButton from '../../commonview/NButton';
import AppStyle from '../../theme/appstyle';
class AddPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            enabled: true,
            petState: '未绝育',
            petSex: '其他',
            petID: null,
            edit: '',
            petRace: '',
            isUpdate: false,
            petSickID: null,
            disabled: false,
        };
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onFetchBasicData();
        });
    }

    _onFetchBasicData() {
        let _this = this;
        if (!this.props.isAdd) {
            _this.setState({
                edit: '编辑',
                enabled: false,
                disabled: true,
                petSex: _this.props.petSource.PetSex,
                petName: _this.props.petSource.PetName,
                petID: _this.props.petSource.PetCode,
                petSickID: _this.props.petSource.SickFileCode,
                petRace: _this.props.petSource.PetRace,
                petState: _this.props.petSource.BirthStatus,
                petBirthday: _this.props.petSource.PetBirthday,
                isUpdate: true,
                petDataSource: _this.props.petSource,
            })
        } else {
            _this.setState({
                edit: '保存',
                enabled: true,
                disabled: false,
                isUpdate: false,
            })
        }
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/PetCode?', header, function (data) {
                if (_this.state.petID == null) {
                    _this.setState({
                        petID: data.Message,
                    });
                }
            })
            //病历编号
            NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/SickFileCode?', header, function (data) {
                if (_this.state.petSickID == null) {
                    _this.setState({
                        petSickID: data.Message,
                    })
                }
            })
            let postdata = [];
            NetUtil.postJson(CONSTAPI.HOST + '/PetRace/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    var typeSource = data.Message, _type = [];
                    typeSource.forEach((item, index, array)=> {
                        _type.push(item.BigTypeName);
                    });
                    _this.setState({
                        typeSource: typeSource,
                        typeSelectData: _type,
                        petRace: _this.state.petRace === '' ? _type[0] : _this.state.petRace,
                        loaded: true,
                    });
                }
                else {
                    toastShort("初始化宠物种类错误：" + data.Exception);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            toastShort(err);
        })
    }

    _save() {
        //保存
        let _this = this;
        if (_this.state.edit == '保存' && _this.state.isUpdate == false) {
            if (_this.state.petName == null) {
                toastShort("请输入宠物昵称");
                return false;
            } else if (_this.state.petBirthday == null) {
                toastShort("请选择出生日期");
                return false;
            }
            //保存宠物信息
            NetUtil.getAuth(function (user, hos) {
                let header = NetUtil.headerClientAuth(user, hos);
                if (_this.props.member.gestCode == null || _this.props.member.memberID == null) {
                    toastShort("会员信息不正确");
                    return false
                }
                let item = {
                    "ID": "00000000-0000-0000-0000-000000000000",
                    "PetCode": _this.state.petID,
                    "GestID": _this.props.member.memberID,
                    "GestCode": _this.props.member.GestCode,
                    "GestName": _this.props.member.name,
                    "PetName": _this.state.petName,
                    "PetSex": _this.state.petSex,
                    "PetBirthday": _this.state.petBirthday,
                    "Age": null,
                    "PetSkinColor": null,
                    "PetRace": _this.state.petRace,
                    "PetBreed": "",
                    "PetWeight": null,
                    "PetHeight": null,
                    "PetSWidth": null,
                    "PetBodyLong": null,
                    "SickFileCode": _this.state.petSickID,
                    "BirthStatus": _this.state.petState,
                    "Status": "SM00052",
                    "PetHead": null,
                    "PetHeadID": null,
                    "DogBandID": null,
                    "MdicTypeName": 'DM0000000060',
                    "Remark": null,
                    "CreatedBy": null,
                    "CreatedOn": "0001-01-01T00:00:00",
                    "ModifiedBy": null,
                    "ModifiedOn": "0001-01-01T00:00:00",
                    "EntID": "00000000-0000-0000-0000-000000000000"
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Pet/AddAndReturn', item, header, function (data) {
                    if (data.Sign) {
                        if (_this.props.getResult) {
                            let id = _this.props.member.memberID;
                            _this.props.getResult(id);
                        }
                        _this._onBack()
                    } else {
                        toastShort("获取数据错误，" + data.Exception);
                    }
                });
            }, function (err) {
                toastShort(err);
            })
        } else if (_this.state.edit == '保存' && _this.state.isUpdate == true) {
            NetUtil.getAuth(function (user, hos) {
                let header = NetUtil.headerClientAuth(user, hos);
                if (_this.props.member == null || _this.props.member.gestCode == null || _this.props.member.memberID == null) {
                    toastShort('未知的会员信息');
                    return false
                }
                let item = {
                    "ID": _this.props.petSource.PetID,
                    "PetCode": _this.state.petID,
                    "GestID": _this.props.member.memberID,
                    "GestCode": _this.props.member.GestCode,
                    "GestName": _this.props.member.name,
                    "PetName": _this.state.petName,
                    "PetSex": _this.state.petSex,
                    "PetBirthday": _this.state.petBirthday,
                    "Age": _this.state.petDataSource.Age,
                    "PetSkinColor": _this.state.petDataSource.PetSkinColor ? _this.state.petDataSource.PetSkinColor : '',
                    "PetRace": _this.state.petRace,
                    "PetBreed": _this.state.petDataSource.PetBreed ? _this.state.petDataSource.PetBreed : '',
                    "PetWeight": _this.state.petDataSource.PetWeight ? _this.state.petDataSource.PetWeight : '',
                    "PetHeight": _this.state.petDataSource.PetHeight ? _this.state.petDataSource.PetHeight : '',
                    "PetSWidth": _this.state.petDataSource.PetSWidth ? _this.state.petDataSource.PetSWidth : '',
                    "PetBodyLong": _this.state.petDataSource.PetBodyLong ? _this.state.petDataSource.PetBodyLong : '',
                    "SickFileCode": _this.state.petSickID,
                    "BirthStatus": _this.state.petState,
                    "Status": _this.state.petDataSource.Status ? _this.state.petDataSource.Status : '',
                    "PetHead": _this.state.petDataSource.PetHead ? _this.state.petDataSource.PetHead : '',
                    "PetHeadID": _this.state.petDataSource.PetHeadID ? _this.state.petDataSource.PetHeadID : '',
                    "DogBandID": _this.state.petDataSource.DogBandID ? _this.state.petDataSource.DogBandID : '',
                    "MdicTypeName": _this.state.petDataSource.MdicTypeName ? _this.state.petDataSource.MdicTypeName : '',
                    "Remark": _this.state.petDataSource.Remark ? _this.state.petDataSource.Remark : '',
                    "CreatedBy": _this.props.member.createdBy,
                    "CreatedOn": _this.props.member.createdOn,
                    "ModifiedBy": user.FullName,
                    "ModifiedOn": Util.getTime(),
                    "EntID": hos.hospital.ID
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Pet/UpdateAndReturn', item, header, function (data) {
                    if (data.Sign) {
                        if (_this.props.getResult) {
                            let id = _this.props.member.memberID;
                            _this.props.getResult(id);
                        }
                        _this._onBack()
                    } else {
                        toastShort("获取数据错误，" + data.Exception);
                    }
                });
            }, function (err) {
                toastShort(err);
            })
        } else if (_this.state.edit == '编辑') {
            _this.setState({
                edit: '保存',
                enabled: true,
                disabled: false,
            })
        }
    }

    _onBack() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onChooseSex() {
        let _this = this;
        if (_this.state.edit == '保存') {
            this.pickerSex.toggle();
        }
    }

    _onChooseState() {
        let _this = this;
        if (_this.state.edit == '保存') {
            this.pickerState.toggle();
        }
    }

    _onChooseRace() {
        let _this = this;
        if (_this.state.edit == '保存') {
            this.pickerRace.toggle();
        }
    }

    render() {
        var load = (<View>
            <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
            <Loading type='text'/>
        </View>)
        if (!this.state.loaded) {
            return load;
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle}
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={true}
                      edit={this.state.edit}
                      editInfo={this._save.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>会员信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员</Text>
                        <Text style={AppStyle.rowVal}>{this.props.member.name}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>手机</Text>
                        <Text style={AppStyle.rowVal}>{this.props.member.phone}</Text>
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>宠物信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物编号</Text>
                        <Text style={AppStyle.rowVal}>{this.state.petID}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>病历号</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSickID}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物昵称</Text>
                        <TextInput
                            value={this.state.petName}
                            editable={this.state.enabled}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'default'}
                            style={AppStyle.input}
                            onChangeText={(text)=>{this.setState({ petName:text })}}
                            />
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>出生日期</Text>
                        <View style={{flex:1,height:39}}>
                            <DatePicker
                                date={this.state.petBirthday}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate={Util.GetDateStr(0)}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                disabled={this.state.disabled}
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                      alignItems:'flex-start',
                                      borderWidth:0,
                                    },
                                    disabled:{
                                        backgroundColor:'transparent'
                                    }
                                  }}
                                onDateChange={(dateBirth) => {this.setState({petBirthday:dateBirth})}}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseRace.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物种类</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petRace}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物性别</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSex}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>宠物状态</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petState}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerSex = picker}
                    pickerData={['雌性','雄性','其他']}
                    selectedValue={this.state.petSex}
                    onPickerDone={(sex)=>{
                        this.setState({
                            petSex: sex[0]?sex[0]:'',
                        })
                    }}
                    />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerState = picker}
                    pickerData={['未绝育','已绝育']}
                    selectedValue={this.state.petState}
                    onPickerDone={(state)=>{
                        this.setState({
                            petState: state[0]?state[0]:'',
                        })
                    }}
                    />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerRace = picker}
                    pickerData={this.state.typeSelectData}
                    selectedValue={this.state.petRace}
                    onPickerDone={(type)=>{
                        this.setState({
                            petRace: type[0]?type[0]:'',
                        })
                    }}
                    />
            </View>
        )
    }
}

module.exports = AddPet;