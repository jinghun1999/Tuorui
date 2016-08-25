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
    Dimensions,
    TouchableOpacity,
    DatePickerAndroid,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
class AddMemberInfo extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            memberName: '',
            registrationText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            registrationDate: now,
            birthText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            birthDate: now,
            memberPhone: '',
            memberSex: '',
            memberMail: '',
            memberLevel: '普通会员',
            memberMoney: 0.00,
            memberPoint: 0,
            memberAddress:'',
            memberRemark:'',
            memberInfo:{name:null,registrationTime:null,birthday:null,
                        phone:null,sex:null,mail:null,level:null,
                        money:null,point:null,address:null,remarks:null,}
        }
    };

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //进行创建时间日期选择器
    async showPicker(stateKey, options) {
        try {
            var newState = {};
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                newState[stateKey + 'Text'] = 'dismissed';
            } else {
                var date = new Date(year, month, day);
                newState[stateKey + 'Text'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                newState[stateKey + 'Date'] = date;
            }
            this.setState(newState);
        } catch (o) {
            alert('控件异常。');
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
                    <View style={styles.pickerBoxStyle}>

                        <FormPicker title="登记日期" tips={this.state.registrationText}
                                    onPress={this.showPicker.bind(this, 'registration', {date: this.state.registrationDate})}/>
                        <FormInput title="姓名"
                                   enabled={true}
                                   onChangeText={(text)=>{this.setState({ memberName: text })}}
                        />
                        <FormPicker title="生日" tips={this.state.birthText}
                                    onPress={this.showPicker.bind(this, 'birth', {date: this.state.birthDate})}/>

                        <FormInput title="电话"
                                   enabled={true}
                                   keyboardType={'numeric'}
                                   onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                        />
                        <FormInput title="性别"
                                   enabled={true}
                                   onChangeText={(text)=>{this.setState({ memberSex: text })}}
                        />
                        <FormInput title="邮箱"
                                   enabled={true}
                                   onChangeText={(text)=>{this.setState({ memberMail: text })}}
                        />
                    </View>
                    <View style={[styles.pickerBoxStyle,{marginTop:10}]}>
                        <FormInput title="等级"
                                   enabled={false}
                                   placeholder={this.state.memberLevel}
                                   onChangeText={(text)=>{this.setState({ memberLevel: text })}}
                        />
                        <FormInput title="账户金额"
                                   enabled={false}
                                   placeholder={this.state.memberMoney}
                                   onChangeText={(text)=>{this.setState({ memberMoney: text })}}
                        />
                        <FormInput title="积分"
                                   enabled={false}
                                   placeholder={this.state.memberPoint}
                                   onChangeText={(text)=>{this.setState({ memberPoint: text })}}
                        />
                    </View>
                    <View style={[styles.pickerBoxStyle,{marginTop:10}]}>
                        <FormInput title="地址"
                                   enabled={true}
                                   onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                        />
                        <FormInput title="备注"
                                   enabled={true}
                                   onChangeText={(text)=>{this.setState({ memberRemark: text })}}
                        />
                    </View>
                    <View style={styles.buttonStyle}>
                        <TouchableOpacity style={styles.saveStyle} onPress={this._save.bind(this)}>
                            <Text style={styles.textStyle}>保存</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveStyle} onPress={this._saveAndAddPet.bind(this)}>
                            <Text style={styles.textStyle}>保存并新增宠物</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    pickerBoxStyle: {
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttonStyle:{
        height:50,
        flexDirection:'row',
    },
    saveStyle:{
        flex:1,
        height:35,
        borderRadius:5,
        margin:10,
        justifyContent:'center',
        backgroundColor:'#63B8FF',
    },
    textStyle:{
        color:'#FFF',
        fontSize:16,
        textAlign:'center',
    },
})
module.exports = AddMemberInfo;