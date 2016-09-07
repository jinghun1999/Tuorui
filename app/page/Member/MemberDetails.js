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
    Picker,
    ListView,
    TextInput,
    DatePickerAndroid,
    TouchableOpacity,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import PetDetails from './PetDetails';
import Loading from '../../commonview/Loading';
import DatePicker from 'react-native-datepicker';
class MemberDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            petSource: [],
            enable: false,
            registrationDate: now,
            birthDate: now,
            memberId:'438e09fc-0ef4-4209-8daa-078e22bd9b46',
            edit: '编辑',
            memberLoaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    };

    componentDidMount() {
        var _this = this;
        _this._fetchData(_this.state.memberId,1, false);
    }

    componentWillUnmount() {

    }

    _fetchData(memberId,page, isnext) {
        //http://petservice.tuoruimed.com/service/Api/GestAndPet/GetModelList
        let _this = this;
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
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
                'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
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
                        memberloaded: true,
                    });
                }
            });
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
        alert('add Pet');
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'PetDetails',
                component: PetDetails,
                params: {
                    headTitle: '宠物详情',
                    isAdd: true,
                    memberName: _this.props.name,
                    memberPhone: _this.props.phone,
                    petSource: [],
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
                name: 'PetDetails',
                component: PetDetails,
                params: {
                    headTitle: '宠物详情',
                    isAdd: false,
                    petSource: pet,
                }
            })
        }
    }

    _onRenderRow(pet) {
        return (
            <TouchableOpacity style={{flexDirection:'row',flex:1,height:45,justifyContent:'center',alignItems:'center',
            borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth,}}
                              onPress={()=>this._onPetDetails(pet)}>
                <Image source={require('./../../../image/pet.jpg')}
                       style={{width:40,height:35,marginLeft:10,justifyContent:'center'}}
                />
                <Text style={{flex:1,marginLeft:10,fontSize:16}}>{pet.PetName}</Text>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'} style={{marginRight:10}}/>
            </TouchableOpacity>
        )
    }

    render() {
        var listBody = <Loading type="text"/>
        if (this.state.memberLoaded) {
            listBody = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.petSource)}
                          renderRow={this._onRenderRow.bind(this)}
                          enableEmptySections={true}
                />)
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
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>登记日期</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <DatePicker
                                date={this.props.memberInfo.CreatedOn}
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
                                onDateChange={(date) => {this.setState({registrationDate: date})}}/>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>姓名</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <TextInput value={this.props.memberInfo.GestName}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 45, borderWidth:0, flex:1}}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />

                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>生日</Text>
                        </View>
                        <View style={styles.optionValue}>
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
                                      marginRight: 36,
                                      borderWidth:StyleSheet.hairlineWidth,
                                    },
                                  }}
                                onDateChange={(date) => {this.setState({birthDate: date})}}/>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>电话</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <TextInput value={this.props.memberInfo.MobilePhone}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 45, borderWidth:0, flex:1}}
                                       onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>性别</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.memberInfo.GestSex}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{flex:1,marginRight: 10,backgroundColor:'#fff',}}
                                onValueChange={(lang) => this.setState({memberSex: lang})}>
                                <Picker.Item label="男" value="DM00001"/>
                                <Picker.Item label="女" value="DM00002"/>
                            </Picker>
                        </View>
                    </View>
                    {/*<FormInput value={this.props.phone}
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
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>地址</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <TextInput value={this.props.memberInfo.GestAddress}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 45, borderWidth:0, flex:1}}
                                       onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>备注</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <TextInput value={this.props.memberInfo.Remark}
                                       editable={this.state.enable}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 45, borderWidth:0, flex:1}}
                                       onChangeText={(text)=>{this.setState({ memberRemark: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.petViewStyle}>
                        <Text style={{flex:1,marginLeft:10,color:'#fff'}}>宠物信息</Text>
                        <TouchableOpacity onPress={this._onAddPet.bind(this)} style={{width:50,}}>
                            <Text style={{marginRight:10,textAlign:'center',color:'#0000CD'}}>新增</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {listBody}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pickerBoxStyle: {flex: 1,},
    pickerStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    petViewStyle: {
        height: 20,
        backgroundColor: '#ccc',
        flexDirection: 'row'
    },
    imageStyle: {
        height: 20,
        width: 20,
    },
    optionBox: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionTxt: {
        width: 100,
        justifyContent: 'center',
        marginLeft: 10,
    },
    optionValue: {
        flex: 1,
        justifyContent: 'center',
    },
})
module.exports = MemberDetails;