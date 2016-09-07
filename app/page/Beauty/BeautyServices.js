/**
 * Created by tuorui on 2016/9/5.
 */
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    Picker,
    TouchableOpacity,
}from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import FormPicker from '../../commonview/FormPicker';
import ChooseBeautyServices from './ChooseBeautyServices';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import ChoosePet from './ChoosePet';
class BeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: false,
            beautySource: [],
            petSource:[{'petId': null,'petName': null,'variety':null,'petCaseNum':null,'birthDate':null,
                'sterilizationState':null,'petSex':null,'petColor':null,'petType':null,'petState':null,
                'image':null,'reMarks':null}],
            totalAmount:0.00,
            isOpen:false,
            totalNum:0,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    chooseBeauty() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseBeautyServices',
                component: ChooseBeautyServices,
                params: {
                    headTitle: '选择美容服务',
                    getResult: function (beauty) {
                        var _beauty = _this.state.beautySource, _exists = false;
                        _beauty && _beauty.forEach((item, index, array) => {
                            if (item.BarCode == beauty.BarCode) {
                                _exists = true;
                            }
                        })
                        if (!_exists) {
                            _beauty.push(beauty);
                            _this.state.totalAmount+=beauty.RecipePrice;
                            _this.state.totalNum+=1;
                        }
                        _this.setState({
                            beautySource: _beauty,
                        })
                    }
                }
            })
        }
    }

    _onBeautyDetails(beauty) {
        alert(beauty.ItemName);
    }

    _onRenderRow(beauty) {
        return (
            <TouchableOpacity
                style={{flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10,
                borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this._onBeautyDetails(beauty)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>名称: {beauty.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>单位: {beauty.RecipeUnit=='DM0000000056'?'次':''}</Text>
                        <Text style={{flex: 1,}}>单价: ￥{beauty.RecipePrice}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    _onChoosePet(){
        let _this =this;
        const {navigator} =_this.props;
        if(navigator){
            navigator.push({
                name:'ChoosePet',
                component:ChoosePet,
                params:{
                    headTitle:'选择宠物',
                    getResult: function (pet){
                            _this.setState({
                                petSource: pet,
                            })
                    }
                },
            })
        }
    }
    _onEditInfo(pet){
        alert('save');
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit="保存" editInfo={this._onEditInfo.bind(this)}
                />
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>宠物信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员编号</Text>
                        <TextInput value={'123'}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>会员名称</Text>
                        <TextInput value={this.props.memberName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物名称</Text>
                        <TextInput value={this.state.petSource.petName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                        <TouchableOpacity onPress={this._onChoosePet.bind(this)}
                                          style={{backgroundColor:'#FF6666',height:35,width:100,
                                                  borderRadius:5,justifyContent:'center',
                                                  margin:5,}}>
                            <Text style={{color:'#fff',textAlign:'center',}}>选择宠物</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>性别</Text>
                        <Picker selectedValue={this.state.petSource.petSex}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                                onValueChange={(sex) => this.setState({petSex: sex})}>
                            <Picker.Item label="请选择" value='0'/>
                            <Picker.Item label="雄性" value='1'/>
                            <Picker.Item label="雌性" value='2'/>
                        </Picker>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物年龄</Text>
                        <TextInput value={this.state.petSource.petAge==null?'':this.state.petSource.petAge}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物种类</Text>
                        <Picker
                            selectedValue={this.state.petSource.petType}
                            mode="dropdown"
                            enabled={this.state.enable}
                            style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                            onValueChange={(type) => this.setState({petType: type})}>
                            <Picker.Item label="请选择" value="0"/>
                            <Picker.Item label="小型犬" value="small"/>
                            <Picker.Item label="中型犬" value="middle"/>
                            <Picker.Item label="大型犬" value="big"/>
                            <Picker.Item label="其他" value="other"/>
                        </Picker>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物品种</Text>
                        <Picker
                            selectedValue={this.state.petSource.variety}
                            mode="dropdown"
                            enabled={this.state.enable}
                            style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                            onValueChange={(variety) => this.setState({variety: variety})}>
                            <Picker.Item label="请选择" value="0"/>
                            <Picker.Item label="金毛" value="金毛"/>
                            <Picker.Item label="美国短毛猫" value="美国短毛猫"/>
                            <Picker.Item label="柴犬" value="柴犬"/>
                            <Picker.Item label="吉娃娃" value="吉娃娃"/>
                            <Picker.Item label="藏獒" value="藏獒"/>
                            <Picker.Item label="茶杯犬" value="茶杯犬"/>
                        </Picker>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>绝育状态</Text>
                        <Picker
                            selectedValue={this.state.petSource.petState}
                            mode="dropdown"
                            enabled={this.state.enable}
                            style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                            onValueChange={(state) => this.setState({petState: state})}>
                            <Picker.Item label="请选择" value="0"/>
                            <Picker.Item label="在世" value="alive"/>
                            <Picker.Item label="离世" value="die"/>
                        </Picker>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>服务信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>服务单号</Text>
                        <TextInput value={'123'}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>服务师</Text>
                        <Picker selectedValue={'2'}
                                mode="dropdown"
                                enabled={true}
                                style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                                onValueChange={(name) => this.setState({serviceName: name})}>
                            <Picker.Item label="请选择" value='0'/>
                            <Picker.Item label="1号服务师" value='1'/>
                            <Picker.Item label="2号服务师" value='2'/>
                            <Picker.Item label="3号服务师" value='3'/>
                            <Picker.Item label="4号服务师" value='4'/>
                            <Picker.Item label="5号服务师" value='5'/>
                        </Picker>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>服务助理</Text>
                        <Picker selectedValue={'3'}
                                mode="dropdown"
                                enabled={true}
                                style={{height: 35, borderWidth:0, flex:1,backgroundColor:'#fff'}}
                                onValueChange={(name) => this.setState({assistantName: name})}>
                            <Picker.Item label="请选择" value='0'/>
                            <Picker.Item label="1号助理" value='1'/>
                            <Picker.Item label="2号助理" value='2'/>
                            <Picker.Item label="3号助理" value='3'/>
                            <Picker.Item label="4号助理" value='4'/>
                            <Picker.Item label="5号助理" value='5'/>
                        </Picker>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>总项</Text>
                        <TextInput value={this.state.totalNum.toString()}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>总金额</Text>
                        <TextInput value={this.state.totalAmount.toString()}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>美容项目</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <FormPicker title="添加美容项目"
                                    tips="选择/扫码"
                                    onPress={this.chooseBeauty.bind(this)}
                                    showbottom={true}
                                    style={{height: 35,flex:1,justifyContent:'center'}}
                        />
                    </View>
                    <View>
                        <ListView enableEmptySections={true}
                                  dataSource={this.state.ds.cloneWithRows(this.state.beautySource)}
                                  renderRow={this._onRenderRow.bind(this)}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    titleStyle: {
        height: 20,
        margin: 2,
        flexDirection: 'row',
        backgroundColor: '#efefef',
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})
module.exports = BeautyServices