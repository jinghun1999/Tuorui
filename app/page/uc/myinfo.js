'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    View,
    Alert,
    Picker,
    ListView,
    TextInput,
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import AlertForm from '../../commonview/AlertInputForm';
import FormPicker from '../../commonview/FormPicker';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Modal from 'react-native-modalbox';
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberNumber: 123,
            memberNickName: '张三丰',
            memberSex: 1,
            loaded: false,
            memberEmail: '123@qq.com',
            memberAddress: '徐汇区桂果园8号楼4楼',
            memberSchool: '家里',
            hospitalSource: null,
            default: '默认',
            isOpenName: false,
            isOpenSex: false,
            isOpenEmail: false,
            isOpenAddress: false,
            isOpenSchool: false,
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
        /*从缓存中读取*/
        let _this = this;
        let hosds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        /*storage.getBatchData([
         {key: 'USER', autoSync: false, syncInBackground: false},
         {key: 'HOSPITAL', autoSync: false, syncInBackground: false},
         ]).then(results => {

         })*/
        storage.load({key: 'USER', autoSync: false, syncInBackground: false}).then(ret => {
            let hos = ret.user.Hospitals;
            hos.forEach(v =>
                    v.IsBind = true
            );
            _this.setState({
                user: ret.user,
                infoLoaded: true,
                isRefreshing: false,
                userloaded: true,
                hospitalSource: hosds.cloneWithRows(hos),
                loaded: true,
            });
        }).catch(err => {
            _this.setState({userloaded: true,});
            alert('请登录' + err);
        });
        storage.load({key: 'HOSPITAL', autoSync: false, syncInBackground: false}).then(ret => {
            _this.setState({
                hospital: ret.hospital,
                hosloaded: true,
            });
        }).catch(err => {
            _this.setState({hosloaded: true,});
            alert('您还没有选择默认医院' + err.message);
        });
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._loadData();
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    pressRow(h) {
        Alert.alert('设置提示', '设置默认医院成功');
    }

    _onRenderRow(h) {
        let d = null;
        if (h.IsBind) {
            d = <View style={{marginLeft:10, width:40, height:18, borderRadius:5, backgroundColor:'#FF9900'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>默认</Text>
            </View>
        }
        return (
            <TouchableOpacity style={styles.headBox} onPress={()=>this.pressRow(h)}>
                <View style={{flex:1, flexDirection:'row', height:20}}>
                    <Text style={{marginLeft:20,fontSize:14, fontWeight:'bold'}}>{h.FULLName}</Text>
                    {d}
                </View>
                <View style={{width:20, alignItems:'center', justifyContent:'center'}}>
                    <Icon name={'ios-arrow-forward'} size={15} color={'#ccc'}/>
                </View>
            </TouchableOpacity>
        )
    }

    //修改姓名弹窗
    _onNickName() {
        this.setState({isOpenName: true});
    }

    closeModal() {
        this.setState({isOpenName: false});
    }

    closeModalAndSave() {
        let nikeName = this.state.nikeNameText, oldNikeName = this.state.memberNickName;
        if (nikeName == null || nikeName == oldNikeName) {
            this.setState({
                isOpenName: false,
            })
        } else {
            this.setState({
                memberNickName: nikeName,
                isOpenName: false,
            })
        }
    }

    //修改邮箱方法体
    onEmail() {
        this.setState({isOpenEmail: true});
    }

    closeEmailModal() {
        this.setState({isOpenEmail: false});
    }

    closeEmailModalAndSave() {
        let emailText = this.state.emailText, memberEmail = this.state.memberEmail;
        if (emailText == null || emailText == memberEmail) {
            this.setState({
                isOpenEmail: false,
            })
        } else {
            this.setState({
                memberEmail: emailText,
                isOpenEmail: false,
            })
        }
    }

    //修改性别方法体
    _onMemberSex() {
        this.setState({isOpenSex: true});
    }

    closeSexModal() {
        this.setState({isOpenSex: false});
    }

    closeSexModalAndSave() {
        let sexText = this.state.sexText, memberSex = this.state.memberSex;
        if (sexText == null || sexText == memberSex) {
            this.setState({
                isOpenSex: false,
            })
        } else {
            this.setState({
                memberSex: sexText,
                isOpenSex: false,
            })
        }
    }

    //修改地址方法体
    onAddress() {
        this.setState({isOpenAddress: true});
    }

    closeAddressModal() {
        this.setState({isOpenAddress: false});
    }

    closeAddressModalAndSave() {
        let addressText = this.state.addressText, memberAddress = this.state.memberAddress;
        if (addressText == null || addressText == memberAddress) {
            this.setState({
                isOpenAddress: false,
            })
        } else {
            this.setState({
                memberAddress: memberAddress,
                isOpenAddress: false,
            })
        }
    }

    //修改学校方法体
    onSchool() {
        this.setState({isOpenSchool: true});
    }

    closeSchoolModal() {
        this.setState({isOpenSchool: false});
    }

    closeSchoolModalAndSave() {
        let schoolText = this.state.schoolText, memberSchool = this.state.memberSchool;
        if (schoolText == null || schoolText == memberSchool) {
            this.setState({
                isOpenSchool: false,
            })
        } else {
            this.setState({
                memberSchool: memberSchool,
                isOpenSchool: false,
            })
        }
    }

    render() {
        var body = (
            <View style={styles.loadingBox}>
                <Bars size={10} color="#1CAFF6"/>
            </View>
        );
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.hospitalSource}
                          renderRow={this._onRenderRow.bind(this)}
                          enableEmptySections={true}
                    />
            )
        }
        return (
            <View style={styles.container}>
                <Head title="我的信息" canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            style={{flex:1, backgroundColor:'#efefef'}}>
                    <View style={{height:30, justifyContent:'center', paddingLeft:10}}>
                        <Text>基本信息</Text>
                    </View>
                    <View style={styles.basicBox}>
                        <TouchableOpacity onPress={()=>{Errorr('')}} style={styles.headBox}>
                            <Text style={{width:100,}}>头像</Text>
                            <View style={styles.contentStyle}>
                                <Image source={require('../../../image/Head_physician_128px.png')}
                                       style={styles.imageStyle}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onNickName.bind(this)} style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>姓名</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <Text>{this.state.memberNickName}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onMemberSex.bind(this)} style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>性别</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <Text>{this.state.memberSex == 1 ? '男' : '女'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onEmail.bind(this)} style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>邮箱</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <Text>{this.state.memberEmail}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onAddress.bind(this)} style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>地址</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <Text>{this.state.memberAddress}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onSchool.bind(this)}
                                          style={[styles.headBox,{borderBottomWidth:0}]}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>毕业学校</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <Text>{this.state.memberSchool}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:30, justifyContent:'center', paddingLeft:10}}>
                        <Text>我的医院</Text>
                    </View>
                    <View style={styles.basicBox}>
                        <View>
                            {body}
                        </View>
                    </View>
                </ScrollView>
                <Modal isOpen={this.state.isOpenName}
                       onClosed={this.closeModal.bind(this)}
                       style={styles.modal}
                       position={"bottom"}>
                    <View style={styles.modalViewStyle}>
                        <Text style={{fontSize:16}}>请输入姓名</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput placeholder={this.state.memberNickName}
                                       editable={true}
                                       autoFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 35,flex:1,}}
                                       onChangeText={(text)=>{
                                             this.setState({
                                                nikeNameText:text,
                                             })
                                       }}
                                />
                        </View>
                        <View style={styles.modalButtonViewStyle}>
                            <TouchableOpacity onPress={this.closeModal.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#BEBEBE'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.closeModalAndSave.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#1E90FF'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isOpen={this.state.isOpenEmail}
                       onClosed={this.closeEmailModal.bind(this)}
                       style={styles.modal}
                       position={"bottom"}>
                    <View style={styles.modalViewStyle}>
                        <Text style={{fontSize:16}}>请输入邮箱</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput placeholder={this.state.memberEmail}
                                       editable={true}
                                       autoFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 35,flex:1,}}
                                       onChangeText={(text)=>{
                                             this.setState({
                                                emailText:text,
                                             })
                                       }}
                                />
                        </View>
                        <View style={styles.modalButtonViewStyle}>
                            <TouchableOpacity onPress={this.closeEmailModal.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#BEBEBE'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.closeEmailModalAndSave.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#1E90FF'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isOpen={this.state.isOpenSex}
                       onClosed={this.closeSexModal.bind(this)}
                       style={styles.modal}
                       position={"bottom"}>
                    <View style={styles.modalViewStyle}>
                        <Text style={{fontSize:16}}>请选择性别</Text>
                        <View style={{height:40,width:100,marginTop:10,
                        borderColor:'#ccc',borderWidth:StyleSheet.hairlineWidth,}}>
                            <Picker mode='dropdown'
                                    selectedValue={this.state.sexText==null?this.state.memberSex:this.state.sexText}
                                    style={{backgroundColor:'#fff',justifyContent:'center'}}
                                    onValueChange={(sex) => this.setState({sexText: sex})}>
                                <Picker.Item label="男" value="1"/>
                                <Picker.Item label="女" value="2"/>
                            </Picker>
                        </View>
                        <View style={styles.modalButtonViewStyle}>
                            <TouchableOpacity onPress={this.closeSexModal.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#BEBEBE'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.closeSexModalAndSave.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#1E90FF'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isOpen={this.state.isOpenAddress}
                       onClosed={this.closeAddressModal.bind(this)}
                       style={styles.modal}
                       position={"bottom"}>
                    <View style={styles.modalViewStyle}>
                        <Text style={{fontSize:16}}>请输入地址</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput placeholder={this.state.memberAddress}
                                       editable={true}
                                       autoFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 35,flex:1,}}
                                       onChangeText={(text)=>{
                                             this.setState({
                                                addressText:text,
                                             })
                                       }}
                                />
                        </View>
                        <View style={styles.modalButtonViewStyle}>
                            <TouchableOpacity onPress={this.closeAddressModal.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#BEBEBE'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.closeAddressModalAndSave.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#1E90FF'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isOpen={this.state.isOpenSchool}
                       onClosed={this.closeSchoolModal.bind(this)}
                       style={styles.modal}
                       position={"bottom"}>
                    <View style={styles.modalViewStyle}>
                        <Text style={{fontSize:16}}>请输入学校</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput placeholder={this.state.memberAddress}
                                       editable={true}
                                       autoFocus={true}
                                       underlineColorAndroid={'transparent'}
                                       keyboardType={'default'}
                                       style={{height: 35,flex:1,}}
                                       onChangeText={(text)=>{
                                             this.setState({
                                                schoolText:text,
                                             })
                                       }}
                                />
                        </View>
                        <View style={styles.modalButtonViewStyle}>
                            <TouchableOpacity onPress={this.closeSchoolModal.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#BEBEBE'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.closeSchoolModalAndSave.bind(this)}
                                              style={[styles.modalButtonStyle,{backgroundColor:'#1E90FF'}]}>
                                <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    headBox: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    imageStyle: {
        height: 30,
        width: 30,
        borderRadius: 20,
    },
    modal: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
        borderRadius: 5,
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        padding: 10
    },
    btnModal: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        backgroundColor: "transparent",
    },
    contentStyle: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 20,
        height: 30,
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalViewStyle: {
        height: 150,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
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
    modalButtonViewStyle: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    modalButtonStyle: {
        margin: 5,
        width: 40,
        borderRadius: 5,
    },
});

module.exports = MyAccount;