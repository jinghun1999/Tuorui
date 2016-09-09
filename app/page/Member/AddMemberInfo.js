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
        var now = new Date();
        this.state = {
            enable: true,
            loaded: false,
            memberInfo: {
                name: null, registrationTime: now, birthday: '',
                phone: null, sex: '女', mail: null, level: '', state: '',
                money: null, point: null, address: null, remarks: null,
            },
            memberName:null,
            memberPhone:null,
            memberSex:'女',
            memberLevel:'金卡会员',
            memberState:'正常',
            memberBirthday:now,
            memberItem: [],
            petSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            pageSize: 15,
            pageIndex: 1,
            levelData: [],
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
        let _this = this;
        _this._onFetchData();
    }

    _save() {
        let _this = this;
        if (_this.state.memberInfo.memberName == null) {
            ToastAndroid.show("请输入姓名", ToastAndroid.SHORT);
            return false;
        } else if (_this.state.memberInfo.memberName == null) {
            ToastAndroid.show("请输入姓名", ToastAndroid.SHORT);
            return false;
        }
    }

    _saveAndAddPet() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'AddPet',
                component: AddPet,
                params: {
                    headTitle: '新增宠物',
                    memberInfo: _this.state.memberInfo,
                }
            })
        }
    }

    _onFetchData() {
        let _this = this;
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            let header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Mobile ' + Util.base64Encode(ret.user.Mobile + ':' + Util.base64Encode(ret.pwd) + ':' + (ret.user.Hospitals[0] != null ? ret.user.Hospitals[0].Registration : '') + ":" + ret.user.Token)
            };
            //http://petservice.tuoruimed.com/service/Api/Gest/GetVipAddPageConfig?
            NetUtil.get(CONSTAPI.HOST + '/Gest/GetVipAddPageConfig?', header, function (data) {
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
                    loaded: true,
                })
            })
        }).catch(err => {
            _this.setState({
                loaded: true,
            });
            alert('error:' + err);
        });
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
        if (!this.state.loaded) {
            return <Loading type='text'/>
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle}
                      canBack={true} onPress={this._onBack.bind(this)}
                />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>基本信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>编号</Text>
                        <TextInput placeholder={this.state.memberItem.GestCode}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>登记日期</Text>
                        <View style={{flex:1,height:39}}>
                            <DatePicker date={this.state.memberInfo.registrationTime}
                                        mode="date"
                                        placeholder="选择日期"
                                        format="YYYY-MM-DD"
                                        minDate="1980-01-01"
                                        maxDate="2020-01-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        enabled={false}
                                        customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      right: 0,
                                      top: 4,
                                      marginLeft: 0
                                    },
                                    dateInput: {
                                      marginRight: 36,
                                      borderWidth:StyleSheet.hairlineWidth,
                                    },
                                  }}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>姓名</Text>
                        <TextInput value={this.state.memberName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                                   onChangeText={(text)=>{
                                        this.setState({
                                            memberName:text
                                        })
                                   }}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>生日</Text>
                        <View style={{flex:1,height:39}}>
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
                                enabled={this.state.enable}
                                customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      right: 0,
                                      top: 4,
                                      marginLeft: 0
                                    },
                                    dateInput: {
                                      marginRight: 36,
                                      borderWidth:StyleSheet.hairlineWidth,
                                    },
                                  }}
                                onDateChange={(dateBirth) => {this.setState({memberBirthday:dateBirth})}}/>
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>电话</Text>
                        <TextInput value={this.state.memberInfo.phone}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                                   onChangeText={(text)=>{this.setState({ memberInfo: {phone:text} })}}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>性别</Text>
                        <Text style={{flex:1,}}>{this.state.memberInfo.sex}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseLevel.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员等级</Text>
                        <Text style={{flex:1,}}>{this.state.memberInfo.level}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员状态</Text>
                        <Text style={{flex:1,}}>{this.state.memberInfo.state}</Text>
                    </TouchableOpacity>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>备注</Text>
                        <TextInput value={this.state.memberRemarks}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                                   onChangeText={(text)=>{this.setState({ memberRemarks:text })}}
                        />
                    </View>
                    <NButton onPress={this._save.bind(this)} backgroundColor={'#87CEFA'} text="保存"/>
                    <NButton onPress={this._saveAndAddPet.bind(this)} backgroundColor={'#87CEFA'} text="保存并添加宠物"/>
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
                    onPickerDone={(text)=>{
                        this.setState({
                            memberSex: text
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
                    onPickerDone={(text)=>{
                        this.setState({
                            memberLevel: text
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
                    onPickerDone={(text)=>{
                        this.setState({
                            memberState:text
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
    },
    titleStyle: {
        height: 20,
        margin: 2,
        flexDirection: 'row',
        backgroundColor: '#EEB4B4',
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})
module.exports = AddMemberInfo;