/**
 * Created by tuorui on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    ScrollView,
    View,
    Alert,
    ListView,
    TextInput,
    TouchableOpacity,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
import Loading from '../../commonview/Loading';
import NButton from '../../commonview/NButton';
import AddPet from './AddPet';
import { toastShort } from '../../util/ToastUtil';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

import AppStyle from '../../theme/appstyle';
class AddMemberInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: true,
            loaded: false,
            memberName: null,
            memberPhone: null,
            memberSex: '女',
            memberLevel: '',
            memberState: '正常',
            memberBirthday: Util.GetDateStr(0),
            memberRegistrationTime: Util.GetDateStr(0),
            memberID: Util.guid(),
            memberRemarks: null,
            memberItem: [],
            petSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            pageSize: 15,
            pageIndex: 1,
            levelData: [],
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.get(CONSTAPI.HOST + '/Gest/GetVipAddPageConfig?', header, function (data) {
                if (data.Sign && data.Message != null) {
                    var levelData = data.Message.Levels, _level = [];
                    levelData.forEach((item, index, array)=> {
                        _level.push(item.LevelName);
                    });
                    _this.setState({
                        levelData: _level,
                        memberLevel:_level[0],
                        memberItem: data.Message.Item,//vip编号
                        memberLevelData: data.Message.Levels,//普通，金卡会员
                        memberSexData: data.Message.SexTypes,//男，女
                        memberStatusData: data.Message.GestStatus,//正常，停用
                        memberType: data.Message.GestTypes,//会员，散客
                        loaded: true,
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            }, function (err) {
                toastShort(err);
            })
        })
    }

    _onChooseSex() {
        this.picker.toggle();
    }

    _onChooseLevel() {
        this.pickerLevel.toggle();
    }

    _onChooseState() {
        this.pickerState.toggle();
    }

    _save(needback) {
        let _this = this;
        if (_this.state.memberName == null) {
            toastShort("请输入姓名");
            return false;
        } else if (_this.state.memberPhone == null) {
            toastShort("请输入手机号码");
            return false;
        }

        NetUtil.getAuth(function (user, hos) {
            //验证手机是否存在
            let postdata =[{
                    Childrens: null,
                    Field: "MobilePhone",
                    Title: null,
                    Operator: {"Name": "=", "Title": "等于", "Expression": null},
                    DataType: 0,
                    Value: _this.state.memberPhone,
                    Conn: 0
                },{
                    "Childrens": null,
                    "Field": "ID",
                    "Title": null,
                    "Operator": {"Name": "<>", "Title": "不等于", "Expression": null},
                    "DataType": 0,
                    "Value": _this.state.memberID,
                    "Conn": 1
                }];
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetModelList', postdata, header, function (data) {
                if (data.Sign) {
                    alert(JSON.stringify(data.Message));
                    if (data.Message != null && data.Message.length > 0) {
                        toastShort("该手机已存在，请更换其他手机！");
                        return false;
                    }
                    else {
                        //DM00001 男 DM00002 女
                        if (_this.state.memberItem.GestCode == null || _this.state.memberID == null) {
                            toastShort('初始化会员信息错误，请稍后重试');
                            return false;
                        }
                        var levelName = _this.state.memberLevel;
                        var levelCode = '';
                        _this.state.memberLevelData.forEach((item, index, array)=> {
                            if (item.LevelName == levelName) {
                                levelCode = item.LevelCode;
                            }
                        })
                        var gestStatus = _this.state.memberState, gestStatusCode;
                        if (gestStatus == '正常') {
                            gestStatusCode = 'SM00001'
                        } else {
                            gestStatusCode = 'SM00002'
                        }
                        var item = {
                            "ID": _this.state.memberID,
                            "GestCode": _this.state.memberItem.GestCode,
                            "LoseRightDate": null,
                            "GestName": _this.state.memberName,
                            "GestSex": _this.state.memberSex == '男' ? 'DM00001' : 'DM00002',
                            "GestBirthday": _this.state.memberBirthday,
                            "MobilePhone": _this.state.memberPhone,
                            "TelPhone": null,
                            "EMail": null,
                            "GestAddress": _this.state.memberAddress,
                            "IsVIP": "SM00054",
                            "VIPNo": null,
                            "VIPAccount": null,
                            "LastPaidTime": null,
                            "GestStyle": levelCode,
                            "Status": gestStatusCode,
                            "PaidStatus": null,
                            "Remark": _this.state.memberRemarks,
                            "CreatedBy": user.FullName,
                            "CreatedOn": Util.getTime(),
                            "ModifiedBy": user.FullName,
                            "ModifiedOn": Util.getTime(),
                            "RewardPoint": null,
                            "PrepayMoney": null,
                            "EntID": "00000000-0000-0000-0000-000000000000",
                            "LevelName": null,
                        };
                        //let header = NetUtil.headerClientAuth(user, hos);
                        NetUtil.postJson(CONSTAPI.HOST + '/Gest/AddGest', item, header, function (data) {
                            if (data.Sign) {
                                if (_this.props.getResult) {
                                    _this.props.getResult();
                                }
                                if (needback) {
                                    _this._onBack();
                                }
                            } else {
                                toastShort("获取数据错误" + data.Exception);
                            }
                        });
                    }
                }
            });
        }, function (err) {
            toastShort(err);
        });
    }

    _checkPhone(){
        //验证手机号码
        let _this= this;
        var re =/^1[34578]\d{9}$/;
        var phone = _this.state.memberPhone;
        if(isNaN(phone)|| phone ===''){
            toastShort('请输入手机');
        }
        if(!re.test(phone)){
            toastShort("输入的手机有误，请重新输入");
            _this.setState({memberPhone:''})
        }
    }
    render() {
        if (!this.state.loaded) {
            return <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <Loading type='text'/>
            </View>;
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle}
                      canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit='保存' editInfo={this._save.bind(this, true)}
                    />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            keyboardDismissMode={'none'}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>基本信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>编号</Text>
                        <Text style={[AppStyle.rowVal,{color:'#ccc'}]}>{this.state.memberItem.GestCode}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>登记日期</Text>
                        <Text style={[AppStyle.rowVal,{color:'#ccc'}]}>{this.state.memberRegistrationTime}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>姓名</Text>
                        <TextInput value={this.state.memberName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{
                                        this.setState({
                                            memberName:text
                                        })
                                   }}
                            />
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>生日</Text>
                        <DatePicker
                            date={this.state.memberBirthday}
                            mode="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            minDate="1920-01-01"
                            maxDate="2020-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            style={{padding:0, margin:0,}}
                            enabled={this.state.enable}
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
                            onDateChange={(dateBirth) => {this.setState({memberBirthday:dateBirth})}}/>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>手机</Text>
                        <TextInput value={this.state.memberPhone}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'numeric'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{
                                   this.setState({ memberPhone:text })}}
                                   onBlur={this._checkPhone.bind(this)}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>性别</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberSex}</Text>
                        <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>地址</Text>
                        <TextInput value={this.state.memberAddress}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{this.setState({ memberAddress:text })}}
                        />
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>会员信息</Text>
                    </View>
                    <TouchableOpacity onPress={this._onChooseLevel.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员等级</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberLevel}</Text>
                        <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员状态</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberState}</Text>
                        <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>备注</Text>
                        <TextInput value={this.state.memberRemarks}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{this.setState({ memberRemarks:text })}}/>


                    </View>
                </ScrollView>
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.picker = picker}
                    pickerData={['男','女']}
                    selectedValue={this.state.memberSex}
                    onPickerDone={(sex)=>{
                        this.setState({
                            memberSex: sex,
                        })
                    }}
                    />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerLevel = picker}
                    pickerData={this.state.levelData}
                    selectedValue={this.state.memberLevel}
                    onPickerDone={(level)=>{
                        this.setState({
                            memberLevel: level,
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
                    pickerData={['正常','停用']}
                    selectedValue={this.state.memberState}
                    onPickerDone={(cardState)=>{
                        this.setState({
                            memberState:cardState,
                        })
                    }}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
module.exports = AddMemberInfo;