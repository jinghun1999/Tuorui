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
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../../commonview/Loading';
import FormPicker from '../../commonview/FormPicker';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import ModalPicker from 'react-native-modal-picker'

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            memberSex: '男',
            memberSexKey: 0,
            memberNickName: '张三丰',
            memberEmail: '123@qq.com',
            memberAddress: '徐汇区桂果园8号楼4楼',
            memberSchool: '家里',
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
            let hospitals = user.user.Hospitals;
            hospitals.forEach(v => {
                if (hos != null && hos.hospital != null && v.ID === hos.hospital.ID) {
                    v.IsBind = true
                }
            });
            _this.setState({
                user: user.user,
                isRefreshing: false,
                dataSource: hospitals,
                loaded: true,
            });
        }, function (msg) {
            alert(msg)
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
        try{
            storage.save({
                key: 'HOSPITAL',
                rawData: {
                    hospital: hos
                }
            });
            Alert.alert('提示', '设置默认医院成功', [{text: '确定', onPress: () => {}},]);
        }catch(e){
            Alert.alert('提示', '设置失败', [{text: '确定', onPress: () => {}},]);
        }
    }

    _onEdit() {
        Alert.alert('提示', '保存成功');
    }

    _onRenderRow(h) {
        let d = null;
        if (h.IsBind) {
            d = <View style={{marginLeft:10, width:40, height:18, borderRadius:5, backgroundColor:'#FF9900'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>默认</Text>
            </View>
        }
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this.pressRow(h)}>
                <Text style={{marginLeft:20,fontSize:14, fontWeight:'bold'}}>{h.FULLName}</Text>
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
                      editInfo={this._onEdit.bind(this)}/>
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
                                maxLength={10}
                                underlineColorAndroid={'transparent'}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
                        <View style={styles.ititle}>
                            <Text style={styles.ititletxt}>性别</Text>
                        </View>
                        <View style={styles.contentStyle}>
                            <ModalPicker
                                style={{alignItems:'flex-end', borderWidth:0, borderColor:'#fff', marginRight:10,}}
                                data={sexdata}
                                initValue={this.state.memberSex}
                                cancelText={'取消'}
                                onChange={(option)=>{ this.setState({memberSex: option.label, memberSexKey:option.key});}}/>
                        </View>
                    </View>
                    <View style={styles.headBox}>
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
        justifyContent: 'center',
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