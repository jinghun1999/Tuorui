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
    ListView,
    Dimensions,
    DatePickerAndroid,
    TouchableOpacity,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
import FormPicker from '../../commonview/FormPicker';
import Icon from 'react-native-vector-icons/Ionicons';
import PetDetails from './PetDetails';
class MemberDetails extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var petData = {
            'data': [{'id': 1, 'petName': '宠物A', 'imagePath': './../../../image/pet.jpg',},
                {'id': 2, 'petName': '宠物B', 'imagePath': './../../../image/pet.jpg',},
                {'id': 3, 'petName': '宠物C', 'imagePath': './../../../image/pet.jpg',},
                {'id': 4, 'petName': '宠物D', 'imagePath': './../../../image/pet.jpg',},
            ]
        };
        this.state = {
            petSource: ds.cloneWithRows(petData.data),
            enable: false,
            registrationText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            registrationDate: now,
            birthText: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            birthDate: now,
            memberPhone: null,
            edit: '编辑',
        }
    };

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

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAddPet() {
        alert('add Pet');
    }

    _editInfo(g) {
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

    _onPetDetails(g) {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'PetDetails',
                component: PetDetails,
                params: {
                    headTitle: '宠物详情',
                    memberName: _this.props.memberName,
                    petInfo: {
                        petName: g.petName,
                        petId: g.id,
                        sterilizationState: false,
                    }
                }
            })
        }
    }

    _onRenderRow(g) {
        return (
            <TouchableOpacity style={styles.pickerStyle} onPress={()=>this._onPetDetails(g)}>
                <Image source={require('./../../../image/pet.jpg')}
                       style={{width:50,height:50,marginLeft:10,}}
                />
                <Text style={{flex:1,marginLeft:10}}>{g.petName}</Text>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'} style={{marginRight:10}}/>
            </TouchableOpacity>
        )
    }

    render() {
        var picker = <View style={styles.pickerStyle}>
            <View style={{width:100,justifyContent:'center', marginLeft:10,}}>
                <Text style={{color:'#666'}}>性别</Text>
            </View>
            <Picker
                selectedValue={this.state.memberSex}
                mode="dropdown"
                style={{flex:1,marginRight: 10,backgroundColor:'#fff',}}
                onValueChange={(lang) => this.setState({memberSex: lang})}>
                <Picker.Item label="男" value="男"/>
                <Picker.Item label="女" value="女"/>
            </Picker>
        </View>
        var listBody = <View style={styles.pickerStyle}>
            <ListView dataSource={this.state.petSource}
                      renderRow={this._onRenderRow.bind(this)}
                      enableEmptySections={true}
            />
        </View>
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <FormPicker title="登记日期" tips={this.state.registrationText}
                                onPress={this.showPicker.bind(this, 'registration', {date: this.state.registrationDate})}/>
                    <FormInput value={this.props.name}
                               title="姓名"
                               style={styles.pickerStyle}
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberName: text })}}
                    />
                    <FormPicker title="生日" tips={this.state.birthText}
                                style={styles.pickerStyle}
                                onPress={this.showPicker.bind(this, 'birth', {date: this.state.birthDate})}/>

                    <FormInput value={this.props.phone}
                               title="电话"
                               style={styles.pickerStyle}
                               enabled={this.state.enable}
                               keyboardType={'numeric'}
                               onChangeText={(text)=>{this.setState({ memberPhone: text })}}
                    />
                    {picker}
                    <FormInput value={this.props.phone}
                               title="邮箱"
                               style={styles.pickerStyle}
                               enabled={this.state.enable}
                               onChangeText={(text)=>{this.setState({ memberMail: text })}}
                    />
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
                    <View style={styles.petViewStyle}>
                        <Text style={{flex:1,marginLeft:10}}>宠物信息</Text>
                        <TouchableOpacity onPress={this._onAddPet.bind(this)} style={{width:50,}}>
                            <Text style={{marginRight:10,color:'#0000CD'}}>新增</Text>
                        </TouchableOpacity>
                    </View>
                        {listBody}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {flex: 1,},
    pickerBoxStyle: {flex: 1,},
    pickerStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    petViewStyle: {
        height: 20,
        backgroundColor: '#BEBEBE',
        flexDirection: 'row'
    },
    imageStyle: {
        height: 20,
        width: 20,
    },
})
module.exports = MemberDetails;