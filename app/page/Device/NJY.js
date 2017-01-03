/**
 * Created by tuorui on 2016/9/7.
 */
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    Alert,
    ListView,
    InteractionManager,
    TouchableHighlight
} from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import NetUtil from '../../util/NetUtil';
import Util from '../../util/Util';
import { toastShort } from '../../util/ToastUtil';
import DatePicker from 'react-native-datepicker';
import SideMenu from 'react-native-side-menu';
import NJMenu from './NJMenu';
import SearchTitle from '../../commonview/SearchTitle';
import AppStyle from '../../theme/appstyle';
class NJY extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            clues: '您绑定的尿检仪设备号为',
            deviceId: null,
            startDate: Util.GetDateStr(-1),
            endDate: Util.GetDateStr(0),
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource: null,
            isOpen:false,
            selectedItem:'全部',
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    _search() {
        let _this = this;
        if (_this.state.deviceId != null) {
            let querystr = 'deviceid=' + _this.state.deviceId + '&starttime=' + _this.state.startDate + '&endtime=' + _this.state.endDate + ' 23:59:59';
            NetUtil.get('http://wx.tuoruimed.com/Device/njy/getchecklist?' + querystr, null, function (data) {
                if (data.result) {
                    _this.setState({
                        dataSource: data.lists,
                        loaded: true,
                    });
                } else {
                    toastShort("获取数据失败：" + data.message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
        }
    }

    fetchData() {
        let _this = this;
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: false,
        }).then(ret => {
                //获取设备号
                NetUtil.get(CONSTAPI.APIAPP + '/AppInfo/GetNJYDeviceInfo?phone=' + ret.user.Mobile, null, function (data) {
                    if (data.Status) {
                        if(data.Data!=null){
                            let deviceInfo = data.Data;
                            if (deviceInfo.DeviceID != null && deviceInfo.DeviceID != '') {
                                _this.setState({deviceId: deviceInfo.DeviceID});
                                _this._search();   //获取设备号成功，查询数据
                            }
                        }
                        else {
                            _this.setState({clues: '您还没有绑定设备，请先绑定设备',loaded: true,});
                        }
                    }
                });
            }
        ).catch(err => {
                toastShort('error:' + err.message);
            }
        );

    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onRenderRow(obj) {
        let inspectBody = [];
        obj.data.forEach((item, i, a)=> {
            inspectBody.push(
                <View key={i} style={{flexDirection: 'row',marginTop:5, flex: 1}}>
                    <View
                        style={{alignItems:'center', justifyContent:'center',width: 30, height: 25, marginLeft: 10}}>
                        <Text>{item.item}.</Text>
                    </View>
                    <View
                        style={{alignItems:'center', justifyContent:'center',width: 120, height: 25, backgroundColor: '#FFAEB9', borderRadius:2}}>
                        <Text>{item.itemname}</Text>
                    </View>
                    <View
                        style={{alignItems:'center', justifyContent:'center',width: 70, height: 25, backgroundColor: '#99CCFF', marginLeft: 10,borderRadius:2}}>
                        <Text>{item.description}</Text>
                    </View>
                    <View
                        style={{ flex:1, height: 25,  justifyContent:'center',marginLeft: 10}}>
                        <Text>{item.expect}</Text>
                    </View>
                </View>);
        });
        return (
            <View style={{flex: 1, paddingBottom:5,}}>
                <View style={{backgroundColor:'#FFCC99',padding:5,}}>
                    <Text>检测时间 <Text style={{color:'#EE0000'}}>{obj.timeformat}</Text></Text>
                </View>
                {inspectBody}
            </View>
        );
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
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            if (this.state.dataSource != null) {
                body = (<View style={{backgroundColor: '#fff', flex: 1, marginBottom:10}}>
                        <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                  renderRow={this._onRenderRow.bind(this)}
                                  initialListSize={5}
                                  pageSize={5}
                                  enableEmptySections={true}
                        />
                    </View>
                )
            }
            else {
                body = (
                    <View style={styles.noResult}>
                        <Text>无筛选结果,请修改检测时间后重试</Text>
                    </View>
                )
            }
        }
        const menu=<NJMenu dateFrom={this.state.startDate} dateTo={this.state.endDate}
                           onItemSelected={(item)=>{
                                if(item=='submit'){
                                    //完成
                                    this.setState({isOpen:false,selectedItem:'时间:'+this.state.startDate+'至'+this.state.endDate})
                                    this.fetchData();
                                } if(item =='cancel'){
                                    //取消
                                    this.setState({isOpen:false})
                                } if(item.indexOf('Form')>0){
                                    //日期
                                     var dateFrom = item.split(':')[1];
                                     this.setState({startDate:dateFrom,})
                                } if(item.indexOf('To')>0){
                                    var dateTo = item.split(':')[1];
                                    this.setState({endDate:dateTo})
                                }
                                }}/>
        return (
            <SideMenu menu={menu}
                      menuPosition={'right'}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={(isOpen)=>this.updateMenuState(isOpen)}
            >
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canAdd={false} canBack={true}
                          onPress={this._onBack.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    <View style={{backgroundColor:'#e7e7e7', padding:10, height:30, justifyContent:'center'}}>
                        <Text>{this.state.clues}<Text style={{fontWeight:'bold'}}>{this.state.deviceId}</Text></Text>
                    </View>
                    {body}
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    noResult: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderTopWidth: 1,
        borderTopColor: '#e7e7e7',
        padding: 10,
    },
    searchBtn: {
        marginLeft: 5,
        marginRight: 5,
        height: 30,
        width: 50,
        borderRadius: 5,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
module.exports = NJY;