/**
 * Created by tuorui on 2016/8/31.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Picker,
    ScrollView,
    } from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
import ChooseVaccineInfo from './../Vaccine/ChooseVaccineInfo';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
class VaccineInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccine: [],
            selectVaccine: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    pressRow(vaccine) {
        alert(vaccine.name);
    }

    _renderRowVaccine(vaccine) {
        return (
            <TouchableOpacity
                style={{flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10,
                borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(vaccine)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>名称: {vaccine.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>编号: {vaccine.ItemCode}</Text>
                        <Text style={{flex: 1,}}>单价: ￥{vaccine.SellPrice}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    chooseVaccine() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseVaccineInfo',
                component: ChooseVaccineInfo,
                params: {
                    headTitle: '选择疫苗',
                    getResult: function (vaccine) {
                        var _vaccine = _this.state.vaccine, _exists = false;
                        _vaccine && _vaccine.forEach((item, index, array) => {
                            if (item.BarCode == vaccine.BarCode) {
                                _exists = true;
                            }
                        })
                        if (!_exists) {
                            _vaccine.push(vaccine);
                        }
                        _this.setState({
                            vaccine: _vaccine,
                        })
                    }
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>宠物信息</Text>
                    </View>
                    <View style={styles.contentStyle}>
                        <View style={{flex:1}}>
                            <FormInput value={this.props.memberName}
                                       title="会员姓名"
                                       style={{height:30,}}
                                       enabled={this.state.enabled}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                                />
                            <FormInput value={this.props.memberPhone}
                                       title="手机号码"
                                       style={{height:30,}}
                                       enabled={this.state.enabled}
                                       onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                                />
                            <FormInput value={this.props.petSource.petName}
                                       title="宠物昵称"
                                       style={{height:30,}}
                                       enabled={this.state.enabled}
                                       onChangeText={(text)=>{this.setState({ petName: text })}}
                                />
                            <FormInput value={this.props.petSource.petCaseNum}
                                       title="病历编号"
                                       style={{height:30,}}
                                       enabled={this.state.enabled}
                                       onChangeText={(text)=>{this.setState({ petCaseNum: text })}}
                                />
                        </View>
                        <View style={{borderColor:'#ccc',margin:5,borderWidth:StyleSheet.hairlineWidth}}>
                            <Image source={require('../../../image/pet.jpg')}
                                   style={{width:150,height:200}}
                                />
                        </View>
                    </View>
                    <View
                        style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:80,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>宠物性别</Text>
                        </View>
                        <Picker
                            selectedValue={this.props.petSource.petSex}
                            mode="dropdown"
                            enabled={this.state.enabled}
                            style={{backgroundColor:'#fff',height:45,flex:1,justifyContent:'center'}}
                            onValueChange={(sex) => this.setState({petSex: sex})}>
                            <Picker.Item label="雌性" value="1"/>
                            <Picker.Item label="雄性" value="2"/>
                            <Picker.Item label="其它" value="3"/>
                        </Picker>
                    </View>
                    <View
                        style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:80,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>品种</Text>
                        </View>

                        <Picker
                            selectedValue={this.props.petSource.petType}
                            mode="dropdown"
                            enabled={this.state.enabled}
                            style={{backgroundColor:'#fff',height:45,flex:1,justifyContent:'center'}}
                            onValueChange={(type) => this.setState({petType: type})}>
                            <Picker.Item label="小型犬" value="small"/>
                            <Picker.Item label="中型犬" value="middle"/>
                            <Picker.Item label="大型犬" value="big"/>
                            <Picker.Item label="其他" value="other"/>
                        </Picker>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>疫苗信息</Text>
                    </View>
                    <FormPicker title="添加疫苗"
                                tips="选择/扫码"
                                onPress={this.chooseVaccine.bind(this)}
                                showbottom={true}
                        />
                    <View>
                        <ListView enableEmptySections={true}
                                  dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
                                  renderRow={this._renderRowVaccine.bind(this)}
                            />
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
    titleStyle: {
        height: 20,
        margin: 2,
        flexDirection: 'row',
        backgroundColor: '#ccc',
    },
    borderStyle: {
        height: 50,
        flexDirection: 'row',
    },
    contentStyle: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})
module.exports = VaccineInfo;