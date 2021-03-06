/**
 * Created by tuorui on 2016/11/10.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ListView,
    InteractionManager,
    ActivityIndicator,
} from 'react-native';
import Head from '../../commonview/Head';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import { toastShort } from '../../util/ToastUtil';
import Loading from '../../commonview/Loading';
import SearchTitle from '../../commonview/SearchTitle';
import AppStyle from '../../theme/appstyle';
import SideMenu from 'react-native-side-menu';
import FeesMenu from './FeesMenu';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeeSettlement from './FeeSettlement';
class FeesInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource: [],
            loaded: false,
            selectedItem: '全部',
            value: '',
            pageIndex: 1,
            pageSize: 15,
            isOpen: false,
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
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1,false);
        });
    }

    fetchData(page,isNext) {
        let _this =this;
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            //http://test.tuoruimed.com/service/Api/NoPaidGest/GetPageRecord?gestInfo=&index=1&pageSize=15
            let API= CONSTAPI.HOST + '/NoPaidGest/GetPageRecord?gestInfo='+_this.state.value+'&index='+page+'&pageSize='+_this.state.pageSize
            NetUtil.get(API,header,function(data){
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
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
            /*NetUtil.postJson(CONSTAPI.HOST + '/NoPaidGest/GetPageRecord', postdata, header, function (data) {
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
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            postdata = [];
            if(_this.state.value!=='' && _this.state.value !== null){
                postdata = [
                    {
                        "Childrens":null,
                        "Field":"GestCode",
                        "Title":null,
                        "Operator":{
                            "Name":"like",
                            "Title":"相似",
                            "Expression":" @File like '%' + @Value + '%' "
                        },
                        "DataType":0,
                        "Value":_this.state.value,
                        "Conn":0
                    },
                    {
                        "Childrens":null,
                        "Field":"GestName",
                        "Title":null,
                        "Operator":{
                            "Name":"like",
                            "Title":"相似",
                            "Expression":" @File like '%' + @Value + '%' "
                        },
                        "DataType":0,
                        "Value":_this.state.value,
                        "Conn":2
                    },
                    {
                        "Childrens":null,
                        "Field":"MobilePhone",
                        "Title":null,
                        "Operator":{
                            "Name":"like",
                            "Title":"相似",
                            "Expression":" @File like '%' + @Value + '%' "
                        },
                        "DataType":0,
                        "Value":_this.state.value,
                        "Conn":2
                    }
                ]
            }
            if (!isNext) {
                //http://test.tuoruimed.com/service/Api/NoPaidGest/GetRecordCount
                NetUtil.postJson(CONSTAPI.HOST + '/NoPaidGest/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        toastShort("获取记录数失败：" + data.Message);
                    }
                });
            }*/
        },function(err){
            toastShort(err);
        })

    }


    _onFeeDetails(fee){
        let _this =this;
        const{navigator}=_this.props;
        if(navigator){
            navigator.push({
                name:'FeeSettlement',
                component:FeeSettlement,
                params:{
                    headTitle:'费用结算',
                    gestID:fee.ID,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onRenderRow(fee) {
        return(
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onFeeDetails(fee)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText,{flex:1,}]}>会员: {fee.GestName}</Text>
                        <Text style={{flex:1,color:'#FF8247',textAlign:'right'}}>¥ {fee.TotalSum}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex:2}}>会员编号: {fee.GestCode}</Text>
                        <Text style={{flex:1, textAlign:'right'}}>手机:{fee.MobilePhone}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    _onEndReached() {
        let _this =this;
        if(_this.state.pageSize>=_this.state.dataSource.length){return false;}
        this.fetchData(_this.state.pageIndex+1,true);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        //修改值
        let _this = this;
        _this.setState({isOpen,});
    }

    render() {
        var body = <Loading type="text"/>
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             renderRow={this._onRenderRow.bind(this)}
                             onEndReached={this._onEndReached.bind(this)}
                             enableEmptySections={true}
            />
        }
        const menu =<FeesMenu value={this.state.value}
                              onItemSelected = {(item)=>{
                                if(item==='submit'){
                                this.setState({isOpen:false,selectedItem:'关键字:'+this.state.value})
                                if(this.state.value ==null || this.state.value ==''){
                                    this.setState({selectedItem:'全部'})
                                }
                                this.fetchData(1, false);
                                }else if(item ==='Cancel'){
                                    this.setState({isOpen:false})
                                } else if(item.indexOf('ey')>0){
                                    var key = item.split(':')[1];
                                    this.setState({value:key,})
                                }
                              }
                              }
        />
        return (
            <SideMenu menu={menu}
                      menuPosition={'right'}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={(isOpen)=>this.updateMenuState(isOpen)}
            >
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({});
module.exports = FeesInfo;