/**
 * Created by tuorui on 2016/8/29.
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
    DatePickerAndroid,
    TouchableOpacity,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
class PetDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            edit: '编辑',
            enable: false,
            birthText: now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate(),
            birthDate: now,
            petNameText: null,
            image: null,
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        var _this = this;
        var isAdd = _this.props.isAdd;
        if (isAdd) {
            _this.setState({
                enable: true,
                edit: '保存',
            })
        }
    }

    _editInfo() {
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

    _onChooseSex(){
        this.pickerSex.toggle();
    }
    _onChooseState(){
        this.pickerState.toggle();
    }
    _onChooseRace(){
        this.pickerRace.toggle();
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true} style={styles.contentStyle}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>会员信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>会员名</Text>
                        <Text style={{flex:1,color:'black'}}>{this.props.member.name}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>手机号码</Text>
                        <Text style={{flex:1,color:'black'}}>{this.props.member.phone}</Text>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>宠物信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物编号</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petID}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物病历号</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSickID}</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物昵称</Text>
                        <TextInput value={this.state.petName}
                                   editable={this.state.enabled}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 40, borderWidth:0, flex:1,color:'black'}}
                                   onChangeText={(text)=>{this.setState({ petName:text })}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>出生日期</Text>
                        <View style={{flex:1,height:39}}>
                            <DatePicker
                                date={this.state.petBirthday}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                disabled={false}
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
                                onDateChange={(dateBirth) => {this.setState({petBirthday:dateBirth})}}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._onChooseSex.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物性别</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petSex}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseState.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物状态</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petState}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseRace.bind(this)} style={styles.inputViewStyle}>
                        <Text style={styles.textTitle}>宠物种类</Text>
                        <Text style={{flex:1,color:'black'}}>{this.state.petRace}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerSex = picker}
                    pickerData={['雌性','雄性','其他']}
                    selectedValue={this.state.petSex}
                    onPickerDone={(sex)=>{
                        this.setState({
                            petSex: sex,
                        })
                    }}
                />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerState = picker}
                    pickerData={['未绝育','已绝育']}
                    selectedValue={this.state.petState}
                    onPickerDone={(state)=>{
                        this.setState({
                            petState: state,
                        })
                    }}
                />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.pickerRace = picker}
                    pickerData={this.state.typeSelectData}
                    selectedValue={this.state.petRace}
                    onPickerDone={(type)=>{
                        this.setState({
                            petRace: type,
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
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
        flexDirection: 'row',
    },
    textTitle: {
        width: 100,
        fontSize: 16,
    },
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        color: '#CC0033',
    },
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
module.exports = PetDetails