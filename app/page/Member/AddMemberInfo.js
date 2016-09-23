/**
 * Created by tuorui on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    ListView,
    TextInput,
    DatePickerAndroid,
    TouchableOpacity,
    ToastAndroid,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
import AddPet from './AddPet';
import Picker from 'react-native-picker';
import NButton from '../../commonview/NButton';
class AddMemberInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: true,
            loaded: false,
            memberName: null,
            memberPhone: null,
            memberSex: '女',
            memberLevel: '8',
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
            levelLoaded: false,
        }
    };

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onPetDetails(pet) {
        alert(pet.PetName);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    _save(needback) {
        let _this = this;
        if (_this.state.memberName == null) {
            alert("请输入姓名");
            return false;
        } else if (_this.state.memberPhone == null) {
            alert("请输入手机号码");
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
            //POST /service/Api/Gest/AddGest 保存会员信息
            //DM00001 男 DM00002 女
            if (_this.state.memberItem.GestCode == null) {
                alert('GestCode null');
                return false;
            }
            if (_this.state.memberID == null) {
                alert('memberID null');
                return false;
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
                "GestAddress": null,
                "IsVIP": "SM00054",
                "VIPNo": null,
                "VIPAccount": null,
                "LastPaidTime": null,
                "GestStyle": "HYDJ000000003",
                "Status": "SM00001",
                "PaidStatus": null,
                "Remark": _this.state.memberRemarks,
                "CreatedBy": null,
                "CreatedOn": _this.state.memberRegistrationTime,
                "ModifiedBy": null,
                "ModifiedOn": "0001-01-01T00:00:00",
                "IsDeleted": 0,
                "RewardPoint": null,
                "PrepayMoney": null,
                "EntID": "00000000-0000-0000-0000-000000000000",
                "LevelName": null
            };
            let header = NetUtil.headerClientAuth(user, hos);
            ////save http://test.tuoruimed.com/service/Api/Gest/AddGest
            NetUtil.postJson(CONSTAPI.HOST + '/Gest/AddGest', item, header, function (data) {
                if (data.Sign) {
                    alert('保存成功');
                    if (_this.props.getResult) {
                        _this.props.getResult();
                    }
                    if (needback) {
                        _this._onBack();
                    }
                } else {
                    alert("获取数据错误" + data.Exception);
                }
            });
        }, function (err) {
            alert(err);
        });
    }

    _saveAndAddPet() {
        let _this = this;
        _this._save(false);
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'AddPet',
                component: AddPet,
                params: {
                    headTitle: '新增宠物',
                    member: {
                        name: _this.state.memberName,
                        phone: _this.state.memberPhone,
                        memberID: _this.state.memberID,
                        gestCode: _this.state.memberItem.GestCode
                    },
                }
            })
        }
    }

    fetchData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            //http://test.tuoruimed.com/service/Api/Gest/GetVipAddPageConfig?
            NetUtil.get(CONSTAPI.HOST + '/Gest/GetVipAddPageConfig?', header, function (data) {
                if (data.Sign && data.Message != null) {
                    var levelData = data.Message.Levels, _level = [];
                    levelData.forEach((item, index, array)=> {
                        _level.push(item.LevelName);
                    })
                    _this.setState({
                        levelData: _level,
                        memberItem: data.Message.Item,//vip编号
                        memberLevelData: data.Message.Levels,//普通，金卡会员
                        memberSexData: data.Message.SexTypes,//男，女
                        memberStatusData: data.Message.GestStatus,//正常，停用
                        memberType: data.Message.GestTypes,//会员，散客
                        levelLoaded: true,
                        loaded: true,
                    })
                } else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            }, function (err) {
                alert(err);
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

    render() {
        var body = (<View style={styles.container}>
            <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
            <Loading type='text'/>
        </View>);
        if (!this.state.levelLoaded) {
            return body;
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle}
                      canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit='保存' editInfo={this._save.bind(this, true)}
                />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>基本信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>编号</Text>
                        <Text style={styles.rowVal}>{this.state.memberItem.GestCode}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>登记日期</Text>
                        <Text
                            style={styles.rowVal}>{this.state.memberRegistrationTime}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>姓名</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberName}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30,padding:0,margin:0,}]}
                                       onChangeText={(text)=>{
                                        this.setState({
                                            memberName:text
                                        })
                                   }}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>生日</Text>
                        <DatePicker
                            date={this.state.memberBirthday}
                            mode="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            minDate="1980-01-01"
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
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>电话</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberPhone}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30,padding:0,margin:0,}]}
                                       onChangeText={(text)=>{this.setState({ memberPhone:text })}}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>性别</Text>
                        <Text style={styles.rowVal}>{this.state.memberSex}</Text>
                    </TouchableOpacity>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>会员信息</Text>
                    </View>
                    <TouchableOpacity onPress={this._onChooseLevel.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>会员等级</Text>
                        <Text style={styles.rowVal}>{this.state.memberLevel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>会员状态</Text>
                        <Text style={styles.rowVal}>{this.state.memberState}</Text>
                    </TouchableOpacity>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>备注</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberRemarks}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30,padding:0,margin:0,}]}
                                       onChangeText={(text)=>{this.setState({ memberRemarks:text })}}/>

                        </View>
                    </View>
                    {/*<View style={{height:130, flexDirection:'row'}}>
                     <View style={{flex:1}}>
                     <NButton onPress={this._save.bind(this, true)} backgroundColor={'#87CEFA'} text="保存"/>
                     </View>
                     <View style={{flex:1}}>
                     <NButton onPress={this._saveAndAddPet.bind(this)} backgroundColor={'#87CEFA'}
                     text="保存并添加宠物"/>
                     </View>
                     </View>*/}
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
    },
    titleText: {
        color:'#CC0033'
    },
    textTitle: {
        width: 100,
        fontSize: 16,
        marginLeft: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    inputViewStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    rowVal: {
        borderWidth: 0,
        flex: 1,
        color: 'black'
    },
    rowView: {
        flex: 1,
        height: 30,
        borderWidth: 1,
        borderColor: '#e7e7e7',
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
})
module.exports = AddMemberInfo;