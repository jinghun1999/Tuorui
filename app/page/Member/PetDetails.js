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
    } from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
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
                        <FormInput value={this.props.petSource.PetName}
                                   title="宠物昵称"
                                   style={{height:30,}}
                                   enabled={this.state.enable}
                                   onChangeText={(text)=>{this.setState({ nikeText: text })}}
                            />
                        <FormInput value={this.props.petSource.SickFileCode}
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
                                date={this.props.petSource.PetBirthday}
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
                                selectedValue={this.props.petSource.BirthStatus}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(lang) => this.setState({sterilizationState: lang})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="未绝育" value="未绝育"/>
                                <Picker.Item label="已绝育" value="已绝育"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物性别</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.PetSex}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(sex) => this.setState({petSex: sex})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="雌性" value="雌性"/>
                                <Picker.Item label="雄性" value="雄性"/>
                                <Picker.Item label="其它" value="其它"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物颜色</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.PetSkinColor}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(color) => this.setState({petColor: color})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="黄色" value="yellow"/>
                                <Picker.Item label="白色" value="white"/>
                                <Picker.Item label="黑色" value="black"/>
                                <Picker.Item label="金色" value="DM00005"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物种类</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.PetRace.toString()}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(type) => this.setState({petType: type})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="小型犬" value="小型犬"/>
                                <Picker.Item label="中型犬" value="中型犬"/>
                                <Picker.Item label="大型犬" value="大型犬"/>
                                <Picker.Item label="其他" value="其他"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物品种</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.PetBreed.toString()}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(type) => this.setState({petType: type})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="柴犬" value="柴犬"/>
                                <Picker.Item label="中国沙皮犬" value="中国沙皮犬"/>
                                <Picker.Item label="拉布拉多犬" value="拉布拉多犬"/>
                                <Picker.Item label="腊肠" value="腊肠"/>
                                <Picker.Item label="喜乐蒂" value="喜乐蒂"/>
                                <Picker.Item label="萨摩耶" value="萨摩耶"/>
                                <Picker.Item label="松狮" value="松狮"/>
                                <Picker.Item label="哈士奇" value="哈士奇"/>
                                <Picker.Item label="其他" value="其他"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.optionBox}>
                        <View style={styles.optionTxt}>
                            <Text style={{color:'#666'}}>宠物状态</Text>
                        </View>
                        <View style={styles.optionValue}>
                            <Picker
                                selectedValue={this.props.petSource.PetStatus}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{height: 39, borderWidth:0, backgroundColor:'#fff',flex:1,justifyContent:'center',}}
                                onValueChange={(state) => this.setState({petState: state})}>
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="在世" value="SM00052"/>
                                <Picker.Item label="离世" value="die"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={{marginTop:15, backgroundColor:'#fff'}}>
                    <FormInput value={this.props.petSource.ReMarks}
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