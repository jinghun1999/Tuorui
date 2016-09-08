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
    TouchableOpacity,
    ToastAndroid,
    InteractionManager,
}from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import FormPicker from '../../commonview/FormPicker';
import ChooseBeautyServices from './ChooseBeautyServices';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import ChoosePet from './ChoosePet';
import NetUtil from '../../util/NetUtil';
import Picker from 'react-native-picker';
class BeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enable: false,
            beautySource: [],
            petSource: [{PetName: null, PetCode: null, PetBreed: null, GestName: null, MobilePhone: null,}],
            totalAmount: 0.00,
            isOpen: false,
            totalNum: 0,
            servicesID: null,
            loaded: false,
            serviceSource: [],
            serviceName: '张艺弦',
            pickerData: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentWillMount() {
        this._onFetchServices();
    }

    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onFetchServices() {
        //http://petservice.tuoruimed.com/service/Api/BusinessInvoices/ServiceCode?
        let _this = this;
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                NetUtil.get(CONSTAPI.HOST + '/BusinessInvoices/ServiceCode?', header, function (data) {
                    _this.setState({
                        servicesID: data.Message,
                    });
                });
                //http://petservice.tuoruimed.com/service/Api/Persons/GetPersonsByAppconfigID?appconfigID=82
                NetUtil.get(CONSTAPI.HOST + '/Persons/GetPersonsByAppconfigID?appconfigID=82', header, function (data) {
                        var serviceData = data.Message;
                        var _data = [];
                        serviceData.forEach((item, index, array)=> {
                            _data.push(item.PersonName);
                        })
                        _this.setState({
                            serviceSource: data.Message,
                            loaded: true,
                            ServicerNameData: _data,
                        });
                    }
                )

            }
        ).catch(err => {
                _this.setState({
                    servicesID: '',
                    serviceSource: [],
                    loaded: true,
                });
                alert('error:' + err.message);
            }
        );
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
                            _this.state.totalAmount += beauty.RecipePrice;
                            _this.state.totalNum += 1;
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
                        <Text style={{flex: 1,}}>单位: {beauty.RecipeUnit == 'DM0000000056' ? '次' : ''}</Text>
                        <Text style={{flex: 1,}}>单价: ￥{beauty.RecipePrice}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    _onChoosePet() {
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
                        })
                    }
                },
            })
        }
    }

    _onEditInfo() {
        let _this = this;
        if (_this.state.petSource.PetCode == null) {
            ToastAndroid.show("请选择宠物", ToastAndroid.SHORT);
            return false;
        } else if(_this.state.serviceName == null){
            ToastAndroid.show('请选择服务师',ToastAndroid.SHORT);
            return false;
        } else if(_this.state.beautySource.length == 0){
            ToastAndroid.show('请选择美容项目',ToastAndroid.SHORT);
            return false;
        }
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            let items = [];
            let _goods = _this.state.SelectedGoods.items;
            for (let i = 0; i < _goods.length; i++) {
                var item = {
                    BarCode: null,
                    BusiTypeCode: _goods[i].BusiTypeCode,
                    CreatedBy: 'a',
                    CreatedOn: '2016-12-12',
                    ModifiedBy: 'a',
                    ModifiedOn: '2016-12-12',
                    DirectSellCode: null,
                    DirectSellID: null,
                    EntID: null,
                    ID: null,
                    IsBulk: '否',
                    IsDeleted: null,
                    ItemCode: _goods[i].ItemCode,
                    ItemName: _goods[i].ItemName,
                    ItemNum: _goods[i].Count,
                    ItemStandard: _goods[i].ItemStandard,
                    ManufacturerCode: null,
                    ManufacturerName: null,
                    PaidStatus: 'SM00040',
                    PaidTime: null,
                    SellContent: null,
                    SellPrice: _goods[i].SellPrice,
                    SellUnit: null,
                    TotalCost: null,
                    WarehouseID: _this.state.Store.WarehouseID
                };
                items.push(item);
            }
            let postjson = {
                gest: _this.state.Guest,
                sellItemList: items,
            }
            let header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Mobile ' + Util.base64Encode(ret.user.Mobile + ':' + Util.base64Encode(ret.pwd) + ':' + (ret.user.Hospitals[0] != null ? ret.user.Hospitals[0].Registration : '') + ":" + ret.user.Token)
            };
            ////save http://petservice.tuoruimed.com/service/Api/Service/AddList
            NetUtil.postJson(CONSTAPI.HOST+'/Service/AddList', postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    ToastAndroid.show("保存成功", ToastAndroid.SHORT);
                    _this._onBack();
                } else {
                    ToastAndroid.show("获取数据错误" + data.Exception, ToastAndroid.SHORT);
                }
            });
        }).catch(err => {
            alert('error:' + err);
        });

    }

    _onChooseService() {
        this.picker.toggle();
    }

    render() {
        if (!this.state.loaded) {
            return <Loading />
        }
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
                        <Text style={{width:100,}}>会员名称</Text>
                        <TextInput value={this.state.petSource.GestName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>手机号码</Text>
                        <TextInput value={this.state.petSource.MobilePhone}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物卡</Text>
                        <TextInput value={this.state.petSource.PetCode}
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
                        <Text style={{width:100,}}>宠物名称</Text>
                        <TextInput value={this.state.petSource.PetName}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>宠物品种</Text>
                        <TextInput value={this.state.petSource.PetBreed}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,fontSize:16,}}>服务信息</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>服务单号</Text>
                        <TextInput value={this.state.servicesID}
                                   editable={this.state.enable}
                                   underlineColorAndroid={'transparent'}
                                   keyboardType={'default'}
                                   style={{height: 35, borderWidth:0, flex:1}}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onChooseService.bind(this)} style={styles.inputViewStyle}>
                        <Text style={{width:100,}}>服务师</Text>
                        <Text style={{flex:1}}>{this.state.serviceName}</Text>
                    </TouchableOpacity>
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
                <Picker
                    style={{height: 300}}
                    showDuration={300}
                    showMask={true}
                    pickerBtnText={'确认'}
                    pickerCancelBtnText={'取消'}
                    ref={picker => this.picker = picker}
                    pickerData={this.state.ServicerNameData}
                    selectedValue={this.state.serviceName}
                    onPickerDone={(text)=>{
                        this.setState({
                            serviceName: text,
                        })
                    }}//when confirm your choice
                />
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
        backgroundColor: '#efefef',
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
})
module.exports = BeautyServices