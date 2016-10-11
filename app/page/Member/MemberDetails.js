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
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import AddPet from './AddPet';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';

import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import AppStyle from '../../theme/appstyle';
class MemberDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            petSource: [],
            enable: false,
            registrationDate: now,
            birthDate: now,
            edit: '编辑',
            memberLoaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            memberSex: '男',
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
                    _this.setState({
                        petSource: dataSource,
                        memberLoaded: true,
                        pageIndex: page,
                        memberName: _this.props.memberInfo.GestName,
                        birthDate: _this.props.memberInfo.GestBirthday,
                        memberPhone: _this.props.memberInfo.MobilePhone,
                        memberSex: _this.props.memberInfo.GestSex,
                        memberAddress: _this.props.memberInfo.GestAddress,
                        memberRemark: _this.props.memberInfo.Remark,
                    });
                } else {
                    toastShort("获取数据错误，" + data.Exception);
                    _this.setState({
                        memberLoaded: true,
                    });
                }
            });
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
                var _sex = _this.state.memberSex === '男' ? 'DM00001' : 'DM00002';
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
                    "GestStyle": _this.props.memberInfo.GestStyle,
                    "Status": _this.props.memberInfo.Status,
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
                            let id = _this.props.memberInfo.ID;
                            _this.props.getResult(id);
                        }
                        _this._onBack()
                    } else {
                        toastShort("保存失败，" + data.Exception);
                    }
                });
            }, function (err) {
                toastShort(err);
            })
            _this.setState({
                enable: false,
                edit: '编辑',
            });
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
        this.pickerSex.toggle();
    }

    _onRenderRow(pet) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onPetDetails(pet)}>
                <Text style={AppStyle.mpName}>{pet.PetName}</Text>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'}/>
            </TouchableOpacity>
        )
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
                        <Text style={AppStyle.groupText}>会员信息</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>登记日期</Text>
                        <Text style={AppStyle.rowVal}>{Util.getFormateTime(this.props.memberInfo.CreatedOn, 'day')}</Text>
                    </View>
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>姓名</Text>
                        <TextInput value={this.state.memberName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{this.setState({ memberName: text })}}
                        />

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
                        <Text style={AppStyle.rowTitle}>电话</Text>
                        <TextInput value={this.state.memberPhone}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
                                   onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>性别</Text>
                        <Text style={AppStyle.rowVal}>{this.state.memberSex == 'DM00001' ? '男' : '女'}</Text>
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
                    <View style={AppStyle.row}>
                        <Text style={AppStyle.rowTitle}>备注</Text>
                        <TextInput value={this.state.memberRemark}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={AppStyle.input}
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
                    selectedValue={this.state.memberSex=='DM00001'?'男':'女'}
                    onPickerDone={(sex)=>{
                        this.setState({
                            memberSex: sex,
                        })
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = MemberDetails;