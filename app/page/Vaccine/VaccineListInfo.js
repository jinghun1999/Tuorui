/**
 * Created by tuorui on 2016/9/14.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Picker from 'react-native-picker';
import VaccineService from './VaccineService';
import Icon from 'react-native-vector-icons/FontAwesome';
class VaccineListInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccine: [],
            selectVaccine: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            recordCount: 0,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onFetchData(1, false);
        });
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    onFetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = {
                "items":[
                    {
                        "Childrens":null,
                        "Field":"IsDeleted",
                        "Title":null,
                        "Operator":{
                            "Name":"=",
                            "Title":"等于",
                            "Expression":null
                        },
                        "DataType":0,
                        "Value":"0",
                        "Conn":0
                    }
                ],
                "sorts":[
                    {
                        "Field":"ShootStatus",
                        "Title":null,
                        "Sort":{
                            "Name":"Asc",
                            "Title":"升序"
                        },
                        "Conn":0
                    },
                    {
                        "Field":"CreatedOn",
                        "Title":null,
                        "Sort":{
                            "Name":"Desc",
                            "Title":"降序"
                        },
                        "Conn":0
                    }
                ],
                "index":page,
                "pageSize":_this.state.pageSize
            }
            //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = NetUtil.headerClientAuth(user, hos);
            //http://test.tuoruimed.com/service/Api/Medic_Vaccine/GetPageRecord
            NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetPageRecord', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let dataSource = _this.state.vaccine;
                    if (isNext) {
                        data.Message.forEach((d)=> {
                            dataSource.push(d);
                        });
                    } else {
                        dataSource = data.Message;
                    }
                    _this.setState({
                        vaccine: dataSource,
                        loaded: true,
                        pageIndex: page,
                    });
                } else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            /*get recordCount from the api*/
            postdata = [
                {
                    "Childrens":null,
                    "Field":"IsDeleted",
                    "Title":null,
                    "Operator":{
                        "Name":"=",
                        "Title":"等于",
                        "Expression":null
                    },
                    "DataType":0,
                    "Value":"0",
                    "Conn":0
                }
            ]
            //http://test.tuoruimed.com/service/Api/Medic_Vaccine/GetRecordCount
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Medic_Vaccine/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        alert("获取记录数失败：" + data.Message);
                    }
                });
            }
        }, function (err) {
            alert(err)
        })
    }

    _onVaccDetails(vacc) {
        //疫苗详情
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'VaccineService',
                component: VaccineService,
                params: {
                    headTitle: '疫苗详情',
                    isLook: true,
                    vaccine: vacc,
                    id:2,
                    getResult: function () {
                        _this.onFetchData(1, false);
                    }
                }
            })
        }
    }

    _onRenderRow(vacc) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onVaccDetails(vacc)}>
                <View style={{flex:1,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text
                            style={{flex:1, fontSize:16, color:'#27408B',fontWeight:'bold'}}>会员名: {vacc.GestName}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{width:100,}}>宠物名: {vacc.PetName}</Text>
                        <Text style={{flex:1, }}>疫苗名称: {vacc.ItemName}</Text>
                    </View>
                </View>
                <View style={{width:20,marginLeft:10, alignItems:'center', justifyContent:'center'}}>
                    <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                </View>
            </TouchableOpacity>
        )
    }

    _onEndReached() {
        this.onFetchData(this.state.pageIndex + 1, true);
    }

    _renderFooter() {
        //计算总页数，如果最后一页，则返回没有数据啦~
        let totalPage = this.state.recordCount / this.state.pageSize;
        if (this.state.pageIndex >= totalPage) {
            return (
                <View style={{height: 40, justifyContent:'center', alignItems:'center'}}>
                    <Text>没有更多数据了~</Text>
                </View>
            )
        }
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
        );
    }

    _addInfo() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'VaccineService',
                component: VaccineService,
                params: {
                    headTitle: '添加疫苗',
                    isLook:false,
                    id:1,
                    getResult: function () {
                        _this.onFetchData(1, false);
                    }
                }
            })
        }
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
                body = (
                    <ListView dataSource={this.state.ds.cloneWithRows(this.state.vaccine)}
                              renderRow={this._onRenderRow.bind(this)}
                              initialListSize={15}
                              pageSize={15}
                              onEndReached={this._onEndReached.bind(this)}
                              enableEmptySections={true}
                              renderFooter={this._renderFooter.bind(this)}
                    />
                )
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit="新增"
                      onPress={this._onBack.bind(this)}
                      editInfo={this._addInfo.bind(this)}/>

                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
})
module.exports = VaccineListInfo;