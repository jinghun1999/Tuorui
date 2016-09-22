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
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import PetDetails from './PetDetails';
import AddPet from './AddPet';
import Loading from '../../commonview/Loading';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
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
    };

    componentDidMount() {
        var _this = this;
        let id = _this.props.memberInfo.ID;
        InteractionManager.runAfterInteractions(() => {
            _this._fetchData(id, 1, false);
        });
    }

    componentWillUnmount() {

    }

    _fetchData(memberId, page, isnext) {
        //http://petservice.tuoruimed.com/service/Api/GestAndPet/GetModelList
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
            //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
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
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        memberLoaded: true,
                    });
                }
            });
        }, function (err) {
            alert(err)
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
            if (_this.state.memberName == null) {
                alert("请输入姓名");
                return false;
            } else if (_this.state.memberPhone == null) {
                alert("请输入手机号码");
                return false;
            }
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                var _sex;
                if (_this.state.memberSex == '男') {
                    _sex = 'DM00001'
                } else if (_this.state.memberSex == '女') {
                    _sex = 'DM00002'
                }
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
                    "ModifiedBy": user.user.Mobile,
                    "ModifiedOn": Util.getTime(),
                    "IsDeleted": _this.props.memberInfo.IsDeleted,
                    "RewardPoint": _this.props.memberInfo.RewardPoint,
                    "PrepayMoney": _this.props.memberInfo.PrepayMoney,
                    "EntID": _this.props.memberInfo.EntID,
                    "LevelName": _this.props.memberInfo.LevelName
                };
                let postJson = {
                    "gest": item,
                    "oldRewardPoint": 0,
                };
                //http://test.tuoruimed.com/service/Api/Gest/UpdateGest
                NetUtil.postJson(CONSTAPI.HOST + '/Gest/UpdateGest', postJson, header, function (data) {
                    if (data.Sign) {
                        alert('修改成功');
                        if (_this.props.getResult) {
                            let id = _this.props.memberInfo.ID;
                            _this.props.getResult(id);
                        }
                        _this._onBack()
                    } else {
                        alert("获取数据错误" + data.Exception);
                    }
                });
            }, function (err) {
                alert(err)
            })
            _this.setState({
                enable: false,
                edit: '编辑',
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

    _onRenderRow(pet) {
        return (
            <TouchableOpacity style={styles.inputViewStyle}
                              onPress={()=>this._onPetDetails(pet)}>
                <Image source={require('./../../../image/pet.jpg')}
                       style={{width:40,height:35,marginLeft:10,justifyContent:'center'}}
                />
                <Text style={{flex:1,color:'#27408B',fontWeight:'bold'}}>{pet.PetName}</Text>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'} style={{marginRight:10}}/>
            </TouchableOpacity>
        )
    }

    _onChooseSex() {
        let _this = this;
        if (_this.state.edit == '编辑') {
            return false
        }
        this.pickerSex.toggle();
    }

    render() {
        var listBody = <Loading type="text"/>
        if (this.state.memberLoaded) {
            listBody = <ListView dataSource={this.state.ds.cloneWithRows(this.state.petSource)}
                                 renderRow={this._onRenderRow.bind(this)}
                                 enableEmptySections={true}/>
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>会员信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>登记日期</Text>
                        <Text style={styles.rowVal}>{this.props.memberInfo.CreatedOn.replace('T', ' ')}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>会员名</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberName}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30}]}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>生日</Text>
                        <DatePicker
                            date={this.state.birthDate}
                            mode="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            minDate="1900-01-01"
                            maxDate="2020-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            disabled={this.state.edit!=='编辑'}
                            style={{padding:0, margin:0,}}
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
                            onDateChange={(date) => {
                                if(this.state.edit=='编辑'){return false;}
                                this.setState({birthDate: date})}
                                }
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>电话</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberPhone}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30}]}
                                       onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>性别</Text>
                        <TextInput value={this.state.memberSex == 'DM00001' ? '男' : '女'}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={[styles.rowVal,{height:30}]}
                        />
                    </TouchableOpacity>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>地址</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberAddress}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30}]}
                                       onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>备注</Text>
                        <View style={styles.rowView}>
                            <TextInput value={this.state.memberRemark}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={[styles.rowVal,{height:30}]}
                                       onChangeText={(text)=>{this.setState({ memberRemark: text })}}
                            />
                        </View>
                    </View>
                    {/*<View style={styles.optionBox}>
                     <View style={styles.optionTxt}>
                     <Text style={{color:'#666'}}>性别</Text>
                     </View>
                     <View style={styles.optionValue}>
                     <Picker
                     selectedValue={this.props.memberInfo.GestSex}
                     mode="dropdown"
                     enabled={this.state.enable}
                     style={{flex:1,height:45,backgroundColor:'#fff',}}
                     onValueChange={(lang) => this.setState({sex: lang})}>
                     <Picker.Item label="男" value="DM00001"/>
                     <Picker.Item label="女" value="DM00002"/>
                     </Picker>
                     </View>
                     </View>
                     <FormInput value={this.props.phone}
                     title="邮箱"
                     style={styles.pickerStyle}
                     enabled={this.state.enable}
                     onChangeText={(text)=>{this.setState({ memberMail: text })}}
                     />
                     <FormInput value={this.props.level}
                     title="等级"
                     enabled={false}
                     placeholder={this.state.memberLevel}
                     onChangeText={(text)=>{this.setState({ memberLevel: text })}}
                     />
                     <FormInput value={this.props.name}
                     title="账户金额"
                     enabled={false}
                     placeholder={this.state.memberMoney}
                     onChangeText={(text)=>{this.setState({ memberMoney: text })}}
                     />
                     <FormInput value={this.props.name}
                     title="积分"
                     enabled={false}
                     placeholder={this.state.memberPoint}
                     onChangeText={(text)=>{this.setState({ memberPoint: text })}}
                     />*/}
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>宠物信息</Text>
                        <TouchableOpacity
                            style={{width:50,alignItems:'center', backgroundColor:'#99CCFF', justifyContent:'center'}}
                            onPress={this._onAddPet.bind(this)}>
                            <Text>添加</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {listBody}
                    </View>
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
        flexDirection: 'row',
    },
    textTitle: {
        width: 100,
        fontSize: 16,
        marginLeft: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        color: '#CC0033',
    },
    rowVal: {
        borderWidth: 0,
        flex: 1,
        color: 'black'
    },
    inputViewStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
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
module.exports = MemberDetails;