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

    _editInfo(g) {
        let _this = this;
        let edit = _this.state.edit;
        if (edit == '编辑') {
            _this.setState({
                enable: true,
                edit: '保存',
            })
        } else {
            alert('保存成功');
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
                <Text style={{flex:1}}>{pet.PetName}</Text>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'} style={{marginRight:10}}/>
            </TouchableOpacity>
        )
    }

    _onChooseSex() {
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
                        <Text style={{width:100,}}>登记日期</Text>
                        <View style={{flex:1,height:39}}>
                            <TextInput value={this.props.memberInfo.CreatedOn.replace('T', ' ')}
                                       editable={false}
                                       underlineColorAndroid={'transparent'}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员名</Text>
                        <View style={{flex:1,height:39}}>
                            <TextInput value={this.props.memberInfo.GestName}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{borderWidth:0,flex:1}}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>生日</Text>
                        <View style={{flex:1,height:39}}>
                            <DatePicker
                                date={this.props.memberInfo.GestBirthday}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
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
                                      marginRight: 20,
                                      borderWidth:0,
                                    },
                                  }}
                                onDateChange={(date) => {this.setState({birthDate: date})}}/>
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>电话</Text>
                        <View style={{flex:1,height:39}}>
                            <TextInput value={this.props.memberInfo.MobilePhone}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{borderWidth:0,}}
                                       onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>性别</Text>
                        <Text
                            style={{flex:1,height:39,}}>{this.props.memberInfo.GestSex == 'DM00001' ? '男' : '女'}</Text>
                    </TouchableOpacity>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>地址</Text>
                        <View style={{flex:1,height:39}}>
                            <TextInput value={this.props.memberInfo.GestAddress}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{borderWidth:0,}}
                                       onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>备注</Text>
                        <View style={{flex:1,height:39}}>
                            <TextInput value={this.props.memberInfo.Remark}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{borderWidth:0,}}
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
                    selectedValue={this.props.memberInfo.GestSex=='DM00001'?'男':'女'}
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
        padding: 5,
        paddingLeft: 10,
        flexDirection: 'row',
    },
    titleText: {marginLeft: 10, fontSize: 16, flex: 1,},
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
module.exports = MemberDetails;