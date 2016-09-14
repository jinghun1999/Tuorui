/**
 * Created by tuorui on 2016/9/14.
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
    ScrollView,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import ChoosePet from '../Beauty/ChoosePet';
import Picker from 'react-native-picker';
import ChooseVaccineInfo from './ChooseVaccineInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
class VaccineService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccine: [],
            petSource: {
                PetName: '', PetCode: '', PetBreed: '', BarCode: '', SellPrice: 0, PetStatus: '',
                GestName: '', MobilePhone: '', GestID: '', GestCode: '', TotalCost: 0, PackageUnit: '',
            },
            selectVaccine: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            VaccineGroupCode:'',
            executorName:'',
            executorNameData:[''],
        }
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onLoadVaccInfo();
        });
    }

    onLoadVaccInfo() {
        let _this = this;
        NetUtil.getAuth(function(user,hos){
            //执行人初始化
            //http://test.tuoruimed.com/service/Api/Persons/GetPersonsByAppconfigID?appconfigID=97
            let header = {
                'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
            };
            NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=97', header, function (data) {
                var serviceData = data.Message;
                var _data = [];
                serviceData.forEach((item, index, array)=> {
                    _data.push(item.PersonName);
                })
                _this.setState({
                    executorSource: serviceData,
                    executorNameData: _data,
                    executorName: _data[0],
                    loaded: true,
                });
            })

        },function(err){alert(err)})
        if (_this.props.isLook == true) {
            //false 为详情不是新增数据
            _this.setState({
                petSource: {
                    GestName: _this.props.vaccine.GestName,
                    GestCode: _this.props.vaccine.GestCode,
                    PetName: _this.props.vaccine.PetName,
                },
                VaccineGroupCode:_this.props.vaccine.VaccineGroupCode,
            })
        }else if(_this.props.isLook==false){
            //新增时添加服务号
            NetUtil.getAuth(function (user, hos) {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(user.user.Mobile, hos.hospital.Registration, user.user.Token)
                };
                //http://test.tuoruimed.com/service/Api/BusinessInvoices/VaccineGroupCode?
                NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/VaccineGroupCode?', header, function (data) {
                    _this.setState({
                        VaccineGroupCode:data.Message,
                        loaded: true,
                    });
                })
            },function(err){alert(err)})
        }

    }

    _onChoosePet() {
        //选择宠物
        let _this = this;
        const {navigator} =_this.props;
        if (navigator) {
            navigator.push({
                name: 'ChoosePet',
                component: ChoosePet,
                params: {
                    headTitle: '选择宠物',
                    getResult: function (pet) {
                        _this.setState({
                            petSource: pet,
                        });
                    }
                },
            })
        }
    }

    chooseVaccine() {
        //疫苗添加
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

    _onChoosePerson(){
        this.picker.toggle();
    }
    _renderHeader() {
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>宠物信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>会员编号</Text>
                    <Text style={{flex:1}}>{this.state.petSource.GestCode}</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>会员名称</Text>
                    <Text style={{flex:1}}>{this.state.petSource.GestName}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePet.bind(this)}
                                  style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>宠物名称</Text>
                    <Text style={{flex:1}}>{this.state.petSource.PetName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>服务信息</Text>
                </View>
                <View style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>组号</Text>
                    <Text style={{flex:1}}>{this.state.vaccinePerson}</Text>
                </View>
                <TouchableOpacity onPress={this._onChoosePerson.bind(this)}
                                  style={styles.inputViewStyle}>
                    <Text style={{width:100,}}>执行人</Text>
                    <Text style={{flex:1}}>{this.state.petSource.executorName}</Text>
                    <Icon name={'angle-right'} size={20} color={'#ccc'} style={{marginRight:10}}/>
                </TouchableOpacity>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>疫苗信息</Text>
                    <TouchableOpacity
                        style={{width:50,alignItems:'center', backgroundColor:'#99CCFF', justifyContent:'center'}}
                        onPress={this.chooseVaccine.bind(this)}>
                        <Text>添加</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _onVaccineDetails(vaccine) {
        alert(vaccine.ItemName);
    }

    _onRenderRow(vaccine) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onVaccineDetails(vaccine)}>
                <Text style={{flex: 1,fontSize:14, fontWeight:'bold'}}>{vaccine.ItemName}</Text>
                <Text style={{flex: 1,fontSize:14,}}>单价: ￥{vaccine.SellPrice}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
                          renderHeader={this._renderHeader.bind(this)}
                          renderRow={this._onRenderRow.bind(this)}
                />
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.picker = picker}
                    pickerData={this.state.executorNameData}
                    selectedValue={this.state.executorName}
                    onPickerDone={(text)=>{
                 this.setState({
                     executorName: text,
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
        padding: 5,
        paddingLeft: 10,
        flexDirection: 'row',
    },
    titleText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
module.exports = VaccineService;