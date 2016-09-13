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
            enabled:true,
            petType:'兔',
            petState:'未绝育',
            petSex:'雌性',
            petID:null,
            petSickID:null,
        };
    }
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onFetchBasicData();
        });
    }

    _onFetchBasicData(){
        let _this= this;
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
            NetUtil.get(CONSTAPI.HOST+'/BusinessInvoices/SickFileCode?',header,function(data){
                if(_this.state.petSickID==null){
                    _this.setState({
                        petSickID:data.Message,
                    })
                }
            })
            let postdata=[{
                "Childrens":null,
                "Field":"IsDeleted",
                "Title":null,
                "Operator":{"Name":"=","Title":"等于","Expression":null},
                "DataType":0,
                "Value":"0",
                "Conn":0}];
            //宠物种类 http://test.tuoruimed.com/service/Api/PetRace/GetModelList
            NetUtil.postJson(CONSTAPI.HOST + '/PetRace/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    var typeSource = data.Message,_type = [];
                    typeSource.forEach((item,index,array)=>{
                        _type.push(item.BigTypeName);
                    })
                    _this.setState({
                        typeSource: typeSource,
                        typeSelectData:_type,
                        petType:_type[0],
                        loaded:true,
                    })
                }
                else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        },function(err){alert(err)})
    }
    _save(){
        //保存
        let _this = this;
        if (_this.state.petName == null) {
            alert("请输入宠物昵称");
            return false;
        }else if(_this.state.petBirthday ==null){
            alert("请选择出生日期");
            return false;
        }
        //保存宠物信息

        NetUtil.getAuth(function (user, hos) {
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            let item = {
                "ID":"00000000-0000-0000-0000-000000000000",
                "PetCode":_this.state.petID,
                "GestID":_this.props.member.memberID,
                "GestCode":_this.props.member.GestCode,
                "GestName":_this.props.member.name,
                "PetName":_this.state.petName,
                "PetSex":_this.state.petSex,
                "PetBirthday":_this.state.petBirthday,
                "Age":null,
                "PetSkinColor":null,
                "PetRace":_this.state.petRace,
                "PetBreed":"",
                "PetWeight":null,
                "PetHeight":null,
                "PetSWidth":null,
                "PetBodyLong":null,
                "SickFileCode":_this.state.petSickID,
                "BirthStatus":_this.state.petState,
                "Status":"SM00052",
                "PetHead":null,
                "PetHeadID":null,
                "DogBandID":null,
                "MdicTypeName":"DM00017",
                "Remark":null,
                "CreatedBy":null,
                "CreatedOn":"0001-01-01T00:00:00",
                "ModifiedBy":null,
                "ModifiedOn":"0001-01-01T00:00:00",
                "IsDeleted":0,
                "EntID":"00000000-0000-0000-0000-000000000000"
            };
            NetUtil.postJson(CONSTAPI.HOST + '/Gest/AddGest', item, header, function (data) {
                if (data.Sign) {
                    alert('保存成功');
                    if (_this.props.getResult) {
                        _this.props.getResult();
                    }
                        _this._onBack()
                } else {
                    alert("获取数据错误" + data.Exception);
                }
            });
        },function(err){
            alert(err)
        })
    }

    _onBack() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _onChooseSex(){
        this.pickerSex.toggle();
    }
    _onChooseState(){
        this.pickerState.toggle();
    }
    _onChooseRace(){
        this.pickerRace.toggle();
    }

    render() {
        var load = (<View>
            <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
            <Loading type='text'/>
        </View>)
        if(!this.state.loaded){
            return load;
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',textAlign:'center',marginLeft:10,fontSize:16,}}>会员信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员名</Text>
                        <TextInput value={this.props.member.name}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>手机号码</Text>
                        <TextInput value={this.props.member.phone}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',textAlign:'center',marginLeft:10,fontSize:16,}}>宠物信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物编号</Text>
                        <TextInput value={this.state.petID}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物病历号</Text>
                        <TextInput value={this.state.petSickID}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物昵称</Text>
                        <TextInput value={this.state.petName}
                                   editable={this.state.enabled}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1}}
                                   onChangeText={(text)=>{this.setState({ petName:text })}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>出生日期</Text>
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
                                disabled={false}
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
                                onDateChange={(dateBirth) => {this.setState({petBirthday:dateBirth})}}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物性别</Text>
                        <Text style={{flex:1,}}>{this.state.petSex}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物状态</Text>
                        <Text style={{flex:1,}}>{this.state.petState}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseRace.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物种类</Text>
                        <Text style={{flex:1,}}>{this.state.petRace}</Text>
                    </TouchableOpacity>
                    <NButton onPress={this._save.bind(this)} backgroundColor={'#87CEFA'} text="保存"/>
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
                            petState: state,
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
                            petRace: type,
                        })
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {flex: 1,},
    titleStyle: {
        padding: 2,
        flexDirection: 'row',
        backgroundColor: '#FF6347',
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
module.exports = AddPet;