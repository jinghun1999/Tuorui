/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import AppointDetails from './AppointDetails';
class AppointListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
            ds:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._onFetchData(1,false);
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onFetchData(page,isNext) {
        //获取数据http://petservice.tuoruimed.com/service/Api/Persons/GetModelList
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
                let postdata = {
                    items: [{
                        Childrens: null,
                        Field: "isVIP",
                        Title: null,
                        Operator: {"Name": "=", "Title": "等于", "Expression": null},
                        DataType: 0,
                        Value: "SM00054",
                        Conn: 0
                    }, {
                        Childrens: null,
                        Field: "IsDeleted",
                        Title: null,
                        Operator: {"Name": "=", "Title": "等于", "Expression": null},
                        DataType: 0,
                        Value: "0",
                        Conn: 1
                    }],
                    sorts: [{
                        Field: "ModifiedOn",
                        Title: null,
                        Sort: {"Name": "Desc", "Title": "降序"},
                        Conn: 0
                    }],
                    index: page,
                    pageSize: _this.state.pageSize
                };
                //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Persons/GetModelList', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        let dataSource = _this.state.dataSource;
                        if (isNext) {
                            data.Message.forEach((d)=> {
                                dataSource.push(d);
                            });
                        } else {
                            dataSource = data.Message;
                        }
                        _this.setState({
                            dataSource: dataSource,
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
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    memberLoaded: true,
                });
                alert('error:' + err.message);
            }
        );
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAppointDetails(a) {
        let _this= this;
        const {navigator} = _this.props;
        if(navigator){
            navigator.push({
                name:'AppointDetails',
                component:AppointDetails,
                params:{
                    headTitle:'预约详情',
                    appointInfo: a,
                }
            })
        }
    }

    _onRenderRow(a) {
        let isStateBody = null;
        if (a.appointState == '1') {
            isStateBody = <View style={{marginLeft:10, width:50, height:18, borderRadius:5, backgroundColor:'#FF9900'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>已确认</Text>
            </View>
        } else {
            isStateBody = <View style={{marginLeft:10, width:50, height:18, borderRadius:5, backgroundColor:'#BEBEBE'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>已取消</Text>
            </View>
        }
        return (
            <TouchableOpacity style={{
            flexDirection:'row',marginLeft:15, marginRight:15,paddingTop:10, paddingBottom:10,
            borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                              onPress={()=>this._onAppointDetails(a)}>
                <View style={{flex:1,}}>
                        <Text style={{fontSize:14, fontWeight:'bold'}}>{a.PersonName}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <Text style={{flex: 1,}}>手机: {a.MobilePhone}</Text>
                        <Text style={{flex:1,}}>预约会诊时间:{a.appointTime}</Text>
                    </View>
                </View>
                {isStateBody}
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let body = (
            <Loading type="text"/>
        );
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          enableEmptySections={true}
                          renderRow={this._onRenderRow.bind(this)}
                />
            );
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
module.exports = AppointListInfo;