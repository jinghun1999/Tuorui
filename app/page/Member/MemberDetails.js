/**
 * Created by tuorui on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    ListView,
    TextInput,
    TouchableOpacity,
    InteractionManager,
    Dimensions,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AddPet from './AddPet';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import AppStyle from '../../theme/appstyle';
const width=Dimensions.get('window').width;
class MemberDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            petSource: [],
            enable: false,
            registrationDate: now,
            birthDate: Util.GetDateStr(0),
            edit: '编辑',
            memberLoaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            memberSex: '男',
            memberLevel: '',
            levelData: [''],
            memberState: '',
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData(this.props.memberInfo.ID, 1, false);
        });
    }

    componentWillUnmount() {

    }

    _fetchData(memberId, page, isnext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = [
                {
                    "Childrens": null,
                    "Field": "GestID",
                    "Title": null,
                    "Operator": {
                        "Name": "=",
                        "Title": "等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": memberId,
                    "Conn": 0
                }
            ];
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/GestAndPet/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let dataSource = _this.state.dataSource;
                    if (isnext) {
                        data.Message.forEach((d)=> {
                            dataSource.push(d);
                        });
                    } else {
                        dataSource = data.Message;
                    }
                    var gestStatus = _this.props.memberInfo.Status,gestSex = _this.props.memberInfo.GestSex;
                    var gestStatusName='',sex='';
                    if(gestStatus=='SM00001'){gestStatusName='正常'}else{gestStatusName='停用'};
                    if(gestSex=='DM00001'){sex='男'}if(gestSex=='DM00002'){sex='女'};
                    _this.setState({
                        petSource: dataSource,
                        memberLoaded: true,
                        pageIndex: page,
                        memberName: _this.props.memberInfo.GestName,
                        birthDate: _this.props.memberInfo.GestBirthday,
                        memberPhone: _this.props.memberInfo.MobilePhone,
                        memberSex: sex,
                        memberAddress: _this.props.memberInfo.GestAddress,
                        memberRemark: _this.props.memberInfo.Remark,
                        memberState:gestStatusName,
                    });
                } else {
                    toastShort("获取数据错误，" + data.Exception);
                    _this.setState({
                        memberLoaded: true,
                    });
                }
            })
            ///service/Api/Gest/GetVipUpdatePageConfig?id=875f40b2-c40f-4ef5-935e-ceba855fa491
            NetUtil.get(CONSTAPI.HOST + '/Gest/GetVipAddPageConfig?', header, function (data) {
                if (data.Sign && data.Message != null) {
                    var levelData = data.Message.Levels, _level = [];
                    var levelCode = _this.props.memberInfo.GestStyle;
                    var levelName='';
                    levelData.forEach((item, index, array)=> {
                        if(item.LevelCode ==levelCode){
                            levelName=item.LevelName;
                        }
                        _level.push(item.LevelName);
                    });

                    _this.setState({
                        levelData: _level,
                        memberLevel:levelName,
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
            })
        }, function (err) {
            toastShort(err);
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAddPet() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'AddPet',
                component: AddPet,
                params: {
                    headTitle: '新增宠物',
                    isAdd: true,
                    member: {
                        name: _this.props.memberInfo.GestName,
                        phone: _this.props.memberInfo.MobilePhone,
                        memberID: _this.props.memberInfo.ID,
                        gestCode: _this.props.memberInfo.GestCode,
                    },
                    getResult: function (id) {
                        _this._fetchData(id, 1, false);
                    }
                }
            })
        }
    }

    _editInfo() {
        let _this = this;
        let edit = _this.state.edit;
        if (edit == '编辑') {
            //可修改状态
            _this.setState({
                enable: true,
                edit: '保存',
            })
        } else if (edit == '保存') {
            if (_this.state.memberName === null
                || _this.state.memberPhone === null
                || _this.state.memberName === ''
                || _this.state.memberPhone === '') {
                toastShort("会员姓名和手机不能为空");
                return false;
            }


            NetUtil.getAuth(function (user, hos) {
                let header = NetUtil.headerClientAuth(user, hos);
                //验证手机是否存在
                let postdata = [{
                        Childrens: null,
                        Field: "MobilePhone",
                        Title: null,
                        Operator: {"Name": "=", "Title": "等于", "Expression": null},
                        DataType: 0,
                        Value: _this.state.memberPhone,
                        Conn: 0
                    },{
                        "Childrens":null,
                        "Field":"ID",
                        "Title":null,
                        "Operator":{"Name":"<>","Title":"不等于","Expression":null},
                        "DataType":0,
                        "Value":_this.props.memberInfo.ID,
                        "Conn":1
                    }];
                NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetModelList', postdata, header, function (data) {
                    if (data.Sign) {
                        if (data.Message != null && data.Message.length > 0) {
                            toastShort("该手机已存在，请更换其他手机！");
                            return false;
                        }
                        else
                        {
                            //保存会员信息
                            var _sex = _this.state.memberSex === '男' ? 'DM00001' : 'DM00002';
                            var _status =_this.state.memberState ==='正常'?'SM00001':'SM00002';
                            var _memberLevel =_this.state.memberLevel;
                            var _memberLevelCode = '';
                            _this.state.memberLevelData.forEach((item,index,array)=>{
                                if(item.LevelName=_memberLevel){
                                    _memberLevelCode=item.LevelCode;
                                }
                            })
                            let item = {
                                "ID": _this.props.memberInfo.ID,
                                "GestCode": _this.props.memberInfo.GestCode,
                                "LoseRightDate": _this.props.memberInfo.LoseRightDate,
                                "GestName": _this.state.memberName,
                                "GestSex": _sex,
                                "GestBirthday": _this.state.birthDate,
                                "MobilePhone": _this.state.memberPhone,
                                "TelPhone": _this.props.memberInfo.TelPhone,
                                "EMail": _this.props.memberInfo.EMail,
                                "GestAddress": _this.state.memberAddress,
                                "IsVIP": _this.props.memberInfo.IsVIP,
                                "VIPNo": _this.props.memberInfo.VIPNo,
                                "VIPAccount": _this.props.memberInfo.VIPAccount,
                                "LastPaidTime": _this.props.memberInfo.LastPaidTime,
                                "GestStyle": _memberLevelCode,
                                "Status": _status,
                                "PaidStatus": _this.props.memberInfo.PaidStatus,
                                "Remark": _this.state.memberRemark,
                                "CreatedBy": _this.props.memberInfo.CreatedBy,
                                "CreatedOn": _this.props.memberInfo.CreatedOn,
                                "ModifiedBy": user.FullName,
                                "ModifiedOn": Util.getTime(),
                                "RewardPoint": _this.props.memberInfo.RewardPoint,
                                "PrepayMoney": _this.props.memberInfo.PrepayMoney,
                                "EntID": _this.props.memberInfo.EntID,
                                "LevelName": _this.props.memberInfo.LevelName
                            };
                            let postJson = {
                                "gest": item,
                                "oldRewardPoint": 0,
                            };
                            NetUtil.postJson(CONSTAPI.HOST + '/Gest/UpdateGest', postJson, header, function (data) {
                                if (data.Sign) {
                                    if (_this.props.getResult) {
                                        toastShort("保存成功");
                                        _this.props.getResult();
                                    }
                                    _this._onBack();
                                } else {
                                    toastShort("保存失败，" + data.Exception);
                                }
                            });
                        }
                    }
                });
            }, function (err) {
                toastShort(err);
            })
        }
    }

    _onPetDetails(pet) {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'AddPet',
                component: AddPet,
                params: {
                    headTitle: '宠物详情',
                    isAdd: false,
                    member: {
                        name: _this.props.memberInfo.GestName,
                        phone: _this.props.memberInfo.MobilePhone,
                        gestCode: _this.props.memberInfo.GestCode,
                        memberID: _this.props.memberInfo.ID,
                        createdBy: _this.props.memberInfo.CreatedBy,
                        createdOn: _this.props.memberInfo.CreatedOn,
                    },
                    petSource: pet,
                    getResult: function (id) {
                        _this._fetchData(id, 1, false);
                    }
                }
            })
        }
    }

    _onChooseSex() {
        let _this = this;
        if (_this.state.edit == '编辑') {
            return false;
        }
        _this.pickerSex.toggle();
    }

    _onChooseLevel() {
        let _this = this;
        if (_this.state.edit == '编辑') {
            return false;
        }
        _this.pickerLevel.toggle();
    }

    _onChooseState() {
        let _this = this;
        if (_this.state.edit == '编辑') {
            return false;
        }
        _this.pickerState.toggle();
    }

    _onRenderRow(pet) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onPetDetails(pet)}>
                <Text style={AppStyle.mpName}>{pet.PetName}</Text>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    _checkPhone(){
        //验证手机号码
        let _this= this;
        var re =/^1\d{10}$/;
        var phone = _this.state.memberPhone;
        if(isNaN(phone)|| phone ==''){
            toastShort('请输入手机号');
            return false;
        }
        if(!re.test(phone)){
            toastShort("输入的手机有误，请重新输入");
            _this.setState({memberPhone:''})
        }
    }

    render() {
        var listBody = <Loading type="text"/>
        if (this.state.memberLoaded) {
            listBody = <ListView dataSource={this.state.ds.cloneWithRows(this.state.petSource)}
                                 renderRow={this._onRenderRow.bind(this)}
                                 enableEmptySections={true}/>
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle}
                      canAdd={true}
                      canBack={true}
                      edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>基本信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>编号</Text>
                        <Text style={[AppStyle.rowVal,{color:'#ccc'}]}>{this.props.memberInfo.GestCode}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>登记日期</Text>
                        <Text style={[AppStyle.rowVal,{color:'#ccc'}]}>{Util.getFormateTime(this.props.memberInfo.CreatedOn, 'day')}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>姓名</Text>
                        {this.state.edit==='保存'?
                            <TextInput value={this.state.memberName}
                                       editable={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={AppStyle.input}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />
                        :
                            <Text style={AppStyle.rowVal}>{this.state.memberName}</Text>
                        }


                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>生日</Text>
                        {this.state.edit === '保存' ?
                            <DatePicker
                                date={this.state.birthDate}
                                mode="date"
                                placeholder="选择生日"
                                format="YYYY-MM-DD"
                                minDate="1921-01-01"
                                maxDate={Util.GetDateStr(0)}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{padding:0, margin:0,}}
                                customStyles={{
                                    dateInput: {
                                        alignItems:'flex-start',
                                        height:30,
                                        padding:0,
                                        margin:0,
                                      borderWidth:0,
                                    },
                                    disabled:{backgroundColor:'transparent'},
                                    dateTouchBody:{height:30,}
                                  }}
                                onDateChange={(date) => {
                                        if(this.state.edit=='编辑'){return false;}
                                        this.setState({birthDate: date})
                                    }
                                }
                            />
                            :
                            <Text style={AppStyle.rowVal}>{Util.getFormateTime(this.state.birthDate, 'day')}</Text>
                        }
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>手机</Text>
                        {this.state.edit==='保存'?
                            <TextInput value={this.state.memberPhone}
                                       editable={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'numeric'}
                                       style={AppStyle.input}
                                       onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                                       onBlur={this._checkPhone.bind(this)}
                            />
                            :
                            <Text style={AppStyle.rowVal}>{this.state.memberPhone}</Text>
                        }

                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>性别</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberSex}</Text>
                        {this.state.edit === '保存'?<Icon name={'angle-right'} size={20} color={'#ccc'}/>:null}
                    </TouchableOpacity>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>地址</Text>
                        <TextInput value={this.state.memberAddress}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                        />
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>会员信息</Text>
                    </View>
                    <TouchableOpacity onPress={this._onChooseLevel.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员等级</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberLevel}</Text>
                        {this.state.edit === '保存'?<Icon name={'angle-right'} size={20} color={'#ccc'}/>:null}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>会员状态</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberState}</Text>
                        {this.state.edit === '保存'?<Icon name={'angle-right'} size={20} color={'#ccc'}/>:null}
                    </TouchableOpacity>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>备注</Text>
                        <TextInput value={this.state.memberRemark}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={[AppStyle.input,{width:width-100,}]}
                                   onChangeText={(text)=>{this.setState({ memberRemark: text })}}
                        />
                    </View>
                    <View style={AppStyle.groupTitle}>
                        <Text style={AppStyle.groupText}>宠物信息</Text>
                        {this.state.edit === '保存' ?
                            <TouchableOpacity style={AppStyle.smallBtn} onPress={this._onAddPet.bind(this)}>
                                <Text>添加</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    {listBody}
                </ScrollView>
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerSex = picker}
                    pickerData={['男','女','其他']}
                    selectedValue={this.state.memberSex}
                    onPickerDone={(sex)=>{
                        this.setState({
                            memberSex: sex[0]?sex[0]:'',
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
                            memberLevel: level[0]?level[0]:'',
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
                            memberState:cardState[0]?cardState[0]:'',
                        })
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = MemberDetails;