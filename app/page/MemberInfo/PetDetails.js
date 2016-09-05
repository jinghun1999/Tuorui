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
    Picker,
    Dimensions,
    DatePickerAndroid,
    TouchableOpacity,
    NativeModules,
    } from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
//import FormPicker from '../../commonview/FormPicker';
import DatePicker from 'react-native-datepicker';
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

    //进行创建时间日期选择器
    async showPicker(stateKey, options) {
        let openState = this.state.enable;
        if (openState == true) {
            try {
                var newState = {};
                const {action, year, month, day} = await DatePickerAndroid.open(options);
                if (action === DatePickerAndroid.dismissedAction) {
                    //newState[stateKey + 'Text'] = datetext;
                } else {
                    let date = new Date(year, month, day);
                    let datetext = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                    newState[stateKey + 'Text'] = datetext;
                    newState[stateKey + 'Date'] = date;
                }
                this.setState(newState);
            } catch (o) {
                alert('控件异常。');
            }
        } else {
            return false;
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

    _onChooseImage(cropit) {
        alert('选择图片');
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
                    <View style={{backgroundColor:'#fff',}}>
                        {/*<FormInput value={this.props.memberName}
                                   title="会员姓名"
                                   style={{height:30,}}
                                   enabled={false}
                                   onChangeText={(text)=>{this.setState({ nameText: text })}}
                            />
                        <FormInput value={this.props.memberPhone}
                                   title="手机号码"
                                   style={{height:30,}}
                                   enabled={false}
                                   onChangeText={(text)=>{this.setState({ phoneText: text })}}
                            />*/}
                        <FormInput value={this.props.petSource.petName}
                                   title="宠物昵称"
                                   style={{height:30,}}
                                   enabled={this.state.enable}
                                   onChangeText={(text)=>{this.setState({ nikeText: text })}}
                            />
                        <FormInput value={this.props.petSource.petCaseNum}
                                   title="病历编号"
                                   style={{height:30, borderBottomWidth:0,}}
                                   enabled={this.state.enable}
                                   onChangeText={(text)=>{this.setState({ caseText: text })}}
                            />
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>出生日期</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <DatePicker
                                date={this.state.birthDate}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="1980-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                enabled = {this.state.enable}
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
                                onDateChange={(date) => {this.setState({birthDate: date})}} />
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>绝育状态</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.sterilizationState}
                                mode="dropdown"
                                enabled={this.state.enable}
                                onValueChange={(lang) => this.setState({sterilizationState: lang})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="未绝育" value="1"/>
                                <Picker.Item label="已绝育" value="2"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物性别</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.petSex}
                                mode="dropdown"
                                enabled={this.state.enable}
                                onValueChange={(sex) => this.setState({petSex: sex})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="雌性" value="1"/>
                                <Picker.Item label="雄性" value="2"/>
                                <Picker.Item label="其它" value="3"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物颜色</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.petColor}
                                mode="dropdown"
                                enabled={this.state.enable}
                                onValueChange={(color) => this.setState({petColor: color})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="黄色" value="yellow"/>
                                <Picker.Item label="白色" value="white"/>
                                <Picker.Item label="黑色" value="black"/>
                                <Picker.Item label="金色" value="gold"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物类型</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.petType}
                                mode="dropdown"
                                enabled={this.state.enable}
                                onValueChange={(type) => this.setState({petType: type})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="小型犬" value="small"/>
                                <Picker.Item label="中型犬" value="middle"/>
                                <Picker.Item label="大型犬" value="big"/>
                                <Picker.Item label="其他" value="other"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物状态</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.petState}
                                mode="dropdown"
                                enabled={this.state.enable}
                                onValueChange={(state) => this.setState({petState: state})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="在世" value="alive"/>
                                <Picker.Item label="离世" value="die"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={{marginTop:15, backgroundColor:'#fff'}}>
                    <FormInput value={this.props.petSource.reMarks}
                               title="备注"
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ reMarks: text })}}
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
        flexDirection: 'column',
        backgroundColor: '#e7e7e7',
    },
    basicStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
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
    basicContentStyle: {
        flex: 1,
        marginTop:15,
    },
    imageStyle: {
        margin: 2,
        height: 200,
        width: 180,
        borderColor: '#666',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentStyle: {
        backgroundColor: '#e7e7e7',
    },
})
module.exports = PetDetails