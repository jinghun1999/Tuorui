'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    View,
    InteractionManager,
    Alert,
    Picker,
    ListView,
    TextInput,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../../commonview/Loading';
import FormPicker from '../../commonview/FormPicker';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import ModalPicker from 'react-native-modal-picker'
import DatePicker from 'react-native-datepicker';
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            memberMobile:'',
            memberSex: '男',
            memberSexKey: 0,
            memberNickName: '',
            memberEmail: '',
            memberAddress: '',
            memberSchool: '',
            birthDay:'',
            dataSource: [],
            loaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _loadData() {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let hospitals = user.Hospitals;
            hospitals.forEach(v => {
                if (hos != null && hos.hospital != null && v.ID === hos.hospital.ID) {
                    v.IsBind = true;
                } else {
                    v.IsBind = false;
                }
            });
            _this.setState({
                user: user,
                isRefreshing: false,
                dataSource: hospitals,
                loaded: true,
                memberMobile: user.Mobile,
                memberSex: user.Sex == 0 ? '男' : '女',
                memberSexKey: user.Sex,
                memberNickName: user.FullName,
                birthDay: Util.cutString(user.Birthday,10, ''),
                memberEmail: '@',
                memberAddress: user.Address,
                memberSchool: user.School,
            });
        }, function (msg) {
            Alert.alert('提示', msg, [{text: '确定'}]);
            _this.setState({
                loaded: true,
            });
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
    }

    pressRow(hos) {
        try {
            storage.save({
                key: 'HOSPITAL',
                rawData: {
                    hospital: hos
                }
            });
            Alert.alert('提示', '设置默认医院成功', [{text: '确定'}]);
        } catch (e) {
            Alert.alert('提示', '设置失败', [{text: '确定'}]);
        }
    }

    _onSave() {
        let _this = this;
        let postjson = {
            Name: 'mo',
            data: {
                Mobile : _this.state.memberMobile,
                Name : _this.state.memberNickName,
                Sex  : _this.state.memberSexKey,
                Birthday : _this.state.birthDay,
                School  : _this.state.memberAddress,
                Address  : _this.state.memberSchool,
            }
        };
        let header = NetUtil.headerClientAuth(_this.state.user, null)
        NetUtil.postJson(CONSTAPI.Auth + '/ad', postjson, header, function (data) {
            if (data.Sign) {
                Alert.alert('提示', '修改成功', [{text: '确定'}]);
            } else {
                Alert.alert('提示', data.Exception, [{text: '确定'}]);
            }
        });

    }

    _onRenderRow(h) {
        let d = null;
        if (h.IsBind) {
            d = <View
                style={{marginLeft:10, width:40, height:18, justifyContent:'center', alignItems:'center', borderRadius:2, backgroundColor:'#FF9900'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>默认</Text>
            </View>
        }
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this.pressRow(h)}>
                <Icon name="md-home" size={30} color="#CCCCFF"/>
                <Text style={{marginLeft:10,fontSize:14, fontWeight:'bold'}}>{h.FULLName}</Text>
                {d}
            </TouchableOpacity>
        )
    }

    render() {
        const sexdata = [
            {key: 0, label: '男'},
            {key: 1, label: '女'},
        ];
        var body = (
            <Loading type={'text'}/>
        );
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          renderRow={this._onRenderRow.bind(this)}
                          enableEmptySections={true}/>
            )
        }
        return (
            <View style={styles.container}>
                <Head title="我的信息"
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={true}
                      edit="保存"
                      editInfo={this._onSave.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            style={{flex:1, backgroundColor:'#efefef'}}>
                    <View style={styles.title}>
                        <Text>基本信息</Text>
                    </View>
                    <View onPress={()=>{}} style={[styles.headBox]}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>头像</Text>
                        </View>
                        <View style={[styles.contentStyle, {alignItems:'flex-end'}]}>
                            <Image source={require('../../../image/Head_physician_128px.png')}
                                   style={{height: 50,width: 50, borderWidth:StyleSheet.hairlineWidth,borderColor:'#ccc'}}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>姓名</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <TextInput
                                style={{flex:1, textAlign:'right', alignItems:'center',}}
                                onChangeText={(text) => this.setState({memberNickName: text})}
                                value={this.state.memberNickName}
                                maxLength={20}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>性别</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <ModalPicker
                                style={{alignItems:'flex-end', borderWidth:0, borderColor:'#fff',}}
                                selectStyle={{padding:0,borderWidth:0}}
                                data={sexdata}
                                initValue={this.state.memberSex}
                                cancelText={'取消'}
                                onChange={(option)=>{ this.setState({memberSex: option.label, memberSexKey:option.key});}}/>
                            {/*<Picker
                             style={{alignItems:'flex-end', borderWidth:0, borderColor:'#fff', marginRight:10,}}
                             selectedValue={this.state.memberSex}
                             onValueChange={(lang) => this.setState({language: lang})}>
                             <Picker.Item label="男" value="0" />
                             <Picker.Item label="女" value="1" />
                             </Picker>*/}
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>手机</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            {/*<TextInput
                                style={{flex:1, textAlign:'right', alignItems:'center',}}
                                onChangeText={(text) => this.setState({memberMobile: text})}
                                value={this.state.memberMobile}
                                maxLength={20}
                                underlineColorAndroid={'transparent'}/>*/}
                            <Text style={{color:'#000'}}>{this.state.memberMobile}</Text>
                        </View>
                    </View>
                    {/*<View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>邮箱</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <TextInput
                                style={{flex:1, textAlign:'right', alignItems:'center',}}
                                onChangeText={(text) => this.setState({memberEmail: text})}
                                value={this.state.memberEmail}
                                maxLength={50}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    </View>*/}
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>生日</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <DatePicker
                                date={this.state.birthDay}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1910-01-01"
                                maxDate={Util.GetDateStr(0)}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{width:100}}
                                customStyles={{
                                    dateInput: {
                                      height:30,
                                      alignItems:'flex-end',
                                      borderWidth:0,
                                    },
                                  }}
                                onDateChange={(date) => {this.setState({birthDay: date})}}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>毕业学校</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <TextInput
                                style={{flex:1, textAlign:'right', alignItems:'center',}}
                                onChangeText={(text) => this.setState({memberSchool: text})}
                                value={this.state.memberSchool}
                                maxLength={50}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>地址</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <TextInput
                                style={{flex:1, textAlign:'right', alignItems:'center',}}
                                onChangeText={(text) => this.setState({memberAddress: text})}
                                value={this.state.memberAddress}
                                maxLength={120}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    </View>
                    <View style={styles.title}>
                        <Text>我的医院</Text>
                        <Text style={{fontSize:12, color:'#FFCC99'}}>(点击切换默认医院)</Text>
                    </View>
                    <View style={styles.basicBox}>
                        {body}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    basicBox: {
        backgroundColor: '#fff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    title: {
        padding: 10,
        flexDirection: 'row'
    },
    contentStyle: {
        flex: 1,
        //backgroundColor:'#ccf',
        alignItems: 'flex-end',
        justifyContent:'center',
        height: 50,
        //alignItems:'center'
    },
    ititle: {
        width: 100,
    },
    ititletxt: {
        fontSize: 16,
    },
    headBox: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputStyle: {
        flexDirection: 'row',
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#666',
    },
});

module.exports = MyAccount;