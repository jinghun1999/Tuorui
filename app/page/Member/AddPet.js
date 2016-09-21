/**
 * Created by tuorui on 2016/9/9.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ListView,
    ScrollView,
    DatePickerAndroid,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import NButton from '../../commonview/NButton';
class AddPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            enabled: true,
            petState: '未绝育',
            petSex: '雌性',
            petID: null,
            edit: '',
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
            let _state = '';
            if (_this.props.petSource.BirthStatus == 'SM00003') {
                _state = '未绝育';
            } else if (_this.props.petSource.BirthStatus == 'SM00004') {
                _state = '已绝育';
            }
            let _sex = '';
            if (_this.props.petSource.PetSex == 'DM00004') {
                _sex = '雌性'
            } else if (_this.props.petSource.PetSex == 'DM00003') {
                _sex = '雄性'
            } else if (_this.props.petSource.PetSex == 'DM00035') {
                _sex = '其他'
            }
            _this.setState({
                edit: '编辑',
                enabled: false,
                disabled: true,
                petSex: _sex,
                petName: _this.props.petSource.PetName,
                petID: _this.props.petSource.PetCode,
                petSickID: _this.props.petSource.SickFileCode,
                petRace: _this.props.petSource.PetRace,
                petState: _state,
                petBirthday: _this.props.petSource.PetBirthday,
                isUpdate:true,
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
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            //宠物ID http://test.tuoruimed.com/service/Api/BusinessInvoices/PetCode? 宠物编号自增加
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
            let postdata = [{
                "Childrens": null,
                "Field": "IsDeleted",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "0",
                "Conn": 0
            }];
            //宠物种类 http://test.tuoruimed.com/service/Api/PetRace/GetModelList
            NetUtil.postJson(CONSTAPI.HOST + '/PetRace/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    var typeSource = data.Message, _type = [];
                    typeSource.forEach((item, index, array)=> {
                        _type.push(item.BigTypeName);
                    })
                    _this.setState({
                        typeSource: typeSource,
                        typeSelectData: _type,
                        petRace: _type[0],
                        loaded: true,
                    })
                }
                else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            alert(err)
        })
    }

    _save() {
        //保存
        let _this = this;
        if (_this.state.edit == '保存' && _this.state.isUpdate == false) {
            if (_this.state.petName == null) {
                alert("请输入宠物昵称");
                return false;
            } else if (_this.state.petBirthday == null) {
                alert("请选择出生日期");
                return false;
            }
            //保存宠物信息
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                let _sex = _this.state.petSex, sexCode = null;
                if (_sex == '雄性') {
                    sexCode = 'DM00003'
                } else if (_sex == '雌性') {
                    sexCode = 'DM00004'
                } else if (_sex == '其他') {
                    sexCode = 'DM00035'
                }
                if (_this.props.member.gestCode == null) {
                    alert('gestCode null');
                    return false
                }
                if (_this.props.member.memberID == null) {
                    alert('ID null');
                    return false
                }

                let item = {
                    "ID": "00000000-0000-0000-0000-000000000000",
                    "PetCode": _this.state.petID,
                    "GestID": _this.props.member.memberID,
                    "GestCode": _this.props.member.GestCode,
                    "GestName": _this.props.member.name,
                    "PetName": _this.state.petName,
                    "PetSex": sexCode,
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
                    "IsDeleted": 0,
                    "EntID": "00000000-0000-0000-0000-000000000000"
                };
                //http://test.tuoruimed.com/service/Api/Pet/AddAndReturn
                NetUtil.postJson(CONSTAPI.HOST + '/Pet/AddAndReturn', item, header, function (data) {
                    if (data.Sign) {
                        alert('保存成功');
                        if (_this.props.getResult) {
                            let id = _this.props.member.memberID;
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
        } else if (_this.state.edit == '保存' && _this.state.isUpdate == true) {
            //修改http://test.tuoruimed.com/service/Api/Pet/UpdateAndReturn
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                let _sex = _this.state.petSex, sexCode = null;
                if (_sex == '雄性') {
                    sexCode = 'DM00003'
                } else if (_sex == '雌性') {
                    sexCode = 'DM00004'
                } else if (_sex == '其他') {
                    sexCode = 'DM00035'
                }
                let _petState = _this.state.petState, _petCode = null;
                if (_petState == '未绝育') {
                    _petCode = 'SM00003'
                } else if (_petState == '已绝育') {
                    _petCode = 'SM00004'
                }
                if (_this.props.member.gestCode == null) {
                    alert('gestCode null');
                    return false
                }
                if (_this.props.member.memberID == null) {
                    alert('ID null');
                    return false
                }
                let date = Util.getTime();
                let item = {
                    "ID": _this.props.petSource.PetID,
                    "PetCode": _this.state.petID,
                    "GestID": _this.props.member.memberID,
                    "GestCode": _this.props.member.GestCode,
                    "GestName": _this.props.member.name,
                    "PetName": _this.state.petName,
                    "PetSex": sexCode,
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
                    "BirthStatus": _petCode,
                    "Status": "SM00052",
                    "PetHead": null,
                    "PetHeadID": null,
                    "DogBandID": null,
                    "MdicTypeName": '',
                    "Remark": null,
                    "CreatedBy": _this.props.member.createdBy,
                    "CreatedOn": _this.props.member.createdOn,
                    "ModifiedBy": user.user.user,
                    "ModifiedOn": date,
                    "IsDeleted": 0,
                    "EntID": hos.hospital.ID
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Pet/UpdateAndReturn', item, header, function (data) {
                    if (data.Sign) {
                        alert('修改成功');
                        if (_this.props.getResult) {
                            let id = _this.props.member.memberID;
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
        }else if(_this.state.edit=='编辑'){
            _this.setState({
                edit:'保存',
                enabled:true,
                disabled:false,
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
            <View style={styles.container}>
                <Head title={this.props.headTitle}
                      canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit={this.state.edit} editInfo={this._save.bind(this)}
                />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>会员信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>会员名</Text>
                        <TextInput value={this.props.member.name}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1,color:'black'}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>手机号码</Text>
                        <TextInput value={this.props.member.phone}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1,color:'black'}}
                        />
                    </View>
                    <View style={styles.titleStyle}>
                        <Text  style={styles.titleText}>宠物信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物编号</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petID}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物病历号</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSickID}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物昵称</Text>
                        <TextInput
                            value={this.state.petName}
                            editable={this.state.enabled}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'default'}
                            style={{height: 40, borderWidth:0, flex:1}}
                            onChangeText={(text)=>{this.setState({ petName:text })}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>出生日期</Text>
                        <View style={{flex:1,height:39}}>
                            <DatePicker
                                date={this.state.petBirthday}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                disabled={this.state.disabled}
                                customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      right: 0,
                                      top: 4,
                                      marginLeft: 0
                                    },
                                    dateInput: {
                                      marginRight: 70,
                                      borderWidth:0,
                                    },
                                  }}
                                onDateChange={(dateBirth) => {this.setState({petBirthday:dateBirth})}}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物性别</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSex}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物状态</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petState}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseRace.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物种类</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petRace}</Text>
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
                            petSex: sex,
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
                            petState: state[0]!=null?state[0]:'',
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
                            petRace: type[0]!=null?type[0]:'',
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
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        color: '#CC0033',
    },
    textTitle: {
        width: 100,
        fontSize: 16,
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
module.exports = AddPet;