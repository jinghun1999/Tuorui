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
    ListView,
    Dimensions,
    DatePickerAndroid,
    TouchableOpacity,
    NativeModules,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
import ImagePicker from 'react-native-image-picker';
class PetDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        var sterilizationState = this.props.petInfo.sterilizationState;
        this.state = {
            edit: '编辑',
            enable: false,
            birthText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            birthDate: now,
            petNameText: null,
            sterilizationState: sterilizationState,
            image: null,
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
        var openState = this.state.enable;
        if (openState == true) {
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
    _onChooseImage(cropit){
        alert('选择图片');
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <View style={styles.basicStyle}>
                    <View style={styles.basicContentStyle}>
                        <View style={styles.borderStyle}>
                            <FormInput value={this.props.memberName}
                                       title="会员名称"
                                       enabled={false}
                            />
                        </View>
                        <View style={styles.borderStyle}>
                            <FormInput value={this.props.petInfo.petName}
                                       title="编号"
                                       enabled={this.state.enable}
                                       onChangeText={(text)=>{this.setState({ petIdText: text })}}
                            />
                        </View>
                        <View style={styles.borderStyle}>
                            <FormInput value={this.props.petInfo.petCaseNum}
                                       title="病历号"
                                       enabled={this.state.enable}
                                       onChangeText={(text)=>{this.setState({ petCaseNum: text })}}
                            />
                        </View>
                        <View style={styles.borderStyle}>
                            <FormInput value={this.props.petInfo.petName}
                                       title="宠物昵称"
                                       enabled={this.state.enable}
                                       onChangeText={(text)=>{this.setState({ petNameText: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.imageStyle}>
                        <TouchableOpacity onPress={()=>this._onChooseImage(true)}>
                        <Image source={require('./../../../image/pet.jpg')}
                               style={{width:100,height:100,}}
                        />
                            {this.state.image ?
                                <Image style={{width: 100, height: 100, resizeMode: 'contain'}}
                                       source={this.state.image} /> : null}
                            </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'column',}}>
                    <View style={{height:15,backgroundColor:'#ccc'}}>
                    </View>
                    <View style={styles.borderStyle}>
                        <FormPicker title="出生日期" tips={this.state.birthText}
                                    onPress={this.showPicker.bind(this, 'birth', {date: this.state.birthDate})}
                        />
                    </View>
                    <View style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>绝育状态</Text>
                        </View>
                        <View style={{flex:1,}}>
                            <Picker
                                selectedValue={this.state.sterilizationState}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{backgroundColor:'#fff',height:40}}
                                onValueChange={(lang) => this.setState({sterilizationState: lang})}>
                                <Picker.Item label="未绝育" value="1"/>
                                <Picker.Item label="已绝育" value="2"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>宠物性别</Text>
                        </View>
                        <View style={{flex:1,}}>
                            <Picker
                                selectedValue={this.state.petSex}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{backgroundColor:'#fff',height:40}}
                                onValueChange={(sex) => this.setState({petSex: sex})}>
                                <Picker.Item label="雌性" value="雌性"/>
                                <Picker.Item label="雄性" value="雄性"/>
                                <Picker.Item label="其它" value="其它"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>宠物颜色</Text>
                        </View>
                        <View style={{flex:1,}}>
                            <Picker
                                selectedValue={this.state.petColor}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{backgroundColor:'#fff',height:40}}
                                onValueChange={(color) => this.setState({petColor: color})}>
                                <Picker.Item label="黄色" value="yellow"/>
                                <Picker.Item label="白色" value="white"/>
                                <Picker.Item label="黑色" value="black"/>
                                <Picker.Item label="金色" value="gold"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>宠物类型</Text>
                        </View>
                        <View style={{flex:1,}}>
                            <Picker
                                selectedValue={this.state.petColor}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{backgroundColor:'#fff',height:40}}
                                onValueChange={(color) => this.setState({petColor: color})}>
                                <Picker.Item label="小型犬" value="small"/>
                                <Picker.Item label="中型犬" value="middle"/>
                                <Picker.Item label="大型犬" value="big"/>
                                <Picker.Item label="其他" value="other"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.borderStyle,{borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth}]}>
                        <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                            <Text style={{color:'#666'}}>宠物状态</Text>
                        </View>
                        <View style={{flex:1,}}>
                            <Picker
                                selectedValue={this.state.petState}
                                mode="dropdown"
                                enabled={this.state.enable}
                                style={{backgroundColor:'#fff',height:40}}
                                onValueChange={(color) => this.setState({petState: color})}>
                                <Picker.Item label="在世" value="alive"/>
                                <Picker.Item label="离世" value="die"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={{height:15,backgroundColor:'#ccc'}}>
                    </View>
                    <View style={styles.borderStyle}>
                        <FormInput value={this.props.petInfo.reMarks}
                                   title="备注"
                                   enabled={this.state.enable}
                                   onChangeText={(text)=>{this.setState({ reMarks: text })}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
    },
    basicStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop:5,
    },
    borderStyle: {
        height: 50,
        flexDirection: 'row',
    },
    basicContentStyle: {
        flex: 1,
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
})
module.exports = PetDetails