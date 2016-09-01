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
} from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-root-modal';
import AlertForm from '../../commonview/AlertInputForm';
import FormPicker from '../../commonview/FormPicker';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberNumber: 123,
            memberNickName: '张三丰',
            loaded: false,
            memberEmail: '123@qq.com',
            memberAddress: '徐汇区桂果园8号楼4楼',
            memberSchool:'家里',
            hospitalSource: null,
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _fetchData() {
        var _this = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = {
            'data': [
                {'id': 1, 'name': '1号医院',},
                {'id': 2, 'name': '2号医院',},
                {'id': 3, 'name': '3号医院',},
                {'id': 4, 'name': '4号医院',},
                {'id': 5, 'name': '5号医院',},
            ]
        };
        _this.setState({
            hospitalSource: ds.cloneWithRows(data.data),
            loaded: true,
        })
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._fetchData();
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    pressRow(h) {
        alert('绑定成功' + h.name);
    }

    _onRenderRow(h) {
        return (
            <TouchableOpacity style={styles.headBox} onPress={()=>this.pressRow(h)}>
                <View style={{marginLeft:10,}}>
                    <Icon name={'ios-person'} size={20} color={'#ccc'}/>
                </View>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{h.name}</Text>
                </View>
                <View style={{width:30,alignItems:'center', justifyContent:'center'}}>
                    <Icon name={'ios-arrow-forward'} size={20} color={'#ccc'}/>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var body;
        if (!this.state.loaded) {
            body = (
                <View style={styles.loadingBox}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            )
        } else {
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
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>姓名</Text>
                            </View>
                            <View style={styles.contentStyle}>
                                <AlertForm name='请输入姓名'
                                           title={this.state.memberNickName}
                                           text={this.state.memberNickName}
                                />
                            </View>
                        </View>
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>性别</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <Picker selectedValue={this.state.sex}
                                        mode="dialog"
                                        enabled={true}
                                        style={{height:40,backgroundColor:'#fff',}}
                                        onValueChange={(sex) => this.setState({sex: sex})}>
                                    <Picker.Item label="请选择" value="0"/>
                                    <Picker.Item label="男" value="1"/>
                                    <Picker.Item label="女" value="2"/>
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>邮箱</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <View style={styles.contentStyle}>
                                    <AlertForm name='请输入邮箱'
                                               title={this.state.memberEmail}
                                               text={this.state.memberEmail}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>地址</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <View style={styles.contentStyle}>
                                    <AlertForm name='请输入地址'
                                               title={this.state.memberAddress}
                                               text={this.state.memberAddress}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={{width:100,}}>毕业学校</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <View style={styles.contentStyle}>
                                    <AlertForm name='请输入毕业学校'
                                               title={this.state.memberSchool}
                                               text={this.state.memberSchool}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{height:30, justifyContent:'center',backgroundColor:'#ccc', paddingLeft:10}}>
                            <Text>我的医院</Text>
                        </View>
                        <View>
                            {body}
                        </View>
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
    title: {},
    contentStyle: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: 20,
        height: 40,
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

module.exports = MyAccount;