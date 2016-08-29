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
    Dimensions,
    DatePickerAndroid,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';

class MemberDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            enable: false,
            registrationText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            registrationDate: now,
            birthText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            birthDate: now,
            memberPhone: null,
        }
    };

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

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _editInfo() {
        alert('123');
    }

    render() {
        var picker = <View style={styles.pickerStyle}>
            <Text style={{width:80,marginLeft:15,justifyContent: 'center',}}>姓名</Text>
            <Picker
                selectedValue={this.state.memberSex}
                mode="dropdown"
                style={{flex:1,height:50,backgroundColor:'#fff',}}
                onValueChange={(lang) => this.setState({memberSex: lang})}>
                <Picker.Item label="男" value="男"/>
                <Picker.Item label="女" value="女"/>
            </Picker>
        </View>
        return (
            <View style={styles.container}>
                <Head title="会员列表" canAdd={true} canBack={true} edit="编辑" onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <View style={styles.pickerBoxStyle}>
                    <FormPicker title="登记日期" tips={this.state.registrationText}
                                onPress={this.showPicker.bind(this, 'registration', {date: this.state.registrationDate})}/>
                    <FormInput value={this.props.name}
                               title="姓名"
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberName: text })}}
                    />
                    <FormPicker title="生日" tips={this.state.birthText}
                                onPress={this.showPicker.bind(this, 'birth', {date: this.state.birthDate})}/>

                    <FormInput value={this.props.phone}
                               title="电话"
                               enabled={this.state.enable}
                               keyboardType={'numeric'}
                               onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                    />
                </View>
                {picker}
                <View style={styles.pickerBoxStyle}>
                    <FormInput value={this.props.phone}
                               title="邮箱"
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberMail: text })}}
                    />
                </View>
                <View style={[styles.pickerBoxStyle,{marginTop:10}]}>
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
                    />
                </View>
                <View style={[styles.pickerBoxStyle,{marginTop:10}]}>
                    <FormInput value={this.props.name}
                               title="地址"
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberAddress: text })}}
                    />
                    <FormInput value={this.props.name}
                               title="备注"
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberRemark: text })}}
                    />
                </View>
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
    pickerStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})
module.exports = MemberDetails;