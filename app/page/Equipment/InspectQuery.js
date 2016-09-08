/**
 * Created by tuorui on 2016/9/7.
 */
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    ListView,
    InteractionManager,
    TouchableHighlight
    } from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import NetUtil from '../../util/NetUtil';
import Util from '../../util/Util';

import DatePicker from 'react-native-datepicker';
class InspectQuery extends Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            loaded: false,
            deviceId: null,
            startDate: Util.GetDateStr(-1),
            endDate: Util.GetDateStr(0),
            ds: ds,
            dataSource: []
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    _search() {
        this.fetchData();
    }

    fetchData() {
        let _this = this;
        _this.setState({
            loaded: false,
        })
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
                _this.setState({deviceId: '48430101010005b2'});
                let querystr = 'deviceid=' + _this.state.deviceId + '&starttime=' + _this.state.startDate + '&endtime=' + _this.state.endDate + ' 23:59:59';
                NetUtil.get('http://wx.tuoruimed.com/Device/njy/getchecklist?' + querystr, header, function (data) {
                    if (data.result) {
                        _this.setState({
                            dataSource: data.lists,
                            loaded: true,
                        });
                    } else {
                        alert("获取数据失败：" + data.message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    loaded: true,
                });
                alert('error:' + err.message);
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
        obj.data.forEach((item)=> {
            inspectBody.push(
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{alignItems:'center',width: 30, height: 25, marginLeft: 10,marginTop:10}}>
                        <Text>{item.item}.</Text>
                    </View>
                    <View
                        style={{alignItems:'center',width: 160, height: 25, backgroundColor: '#FFAEB9', marginTop:10,borderRadius:5}}>
                        <Text>{item.itemname}</Text>
                    </View>
                    <View
                        style={{alignItems:'center',width: 70, height: 25, backgroundColor: '#1E90FF', marginLeft: 10,marginTop:10,borderRadius:5}}>
                        <Text>{item.description}</Text>
                    </View>
                    <View
                        style={{alignItems:'center',width: 100, height: 25, marginLeft: 10,marginTop:10,borderRadius:5}}>
                        <Text>{item.expect}</Text>
                    </View>
                </View>);
        });
        return (
            <View style={{flex: 1, marginTop:20, paddingLeft:10}}>
                <Text>检测时间 <Text style={{color:'#EE0000'}}>{obj.timeformat}</Text></Text>
                {
                    inspectBody
                }
            </View>
        );
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            if (this.state.dataSource.length > 0) {
                body = (<View style={{backgroundColor: '#fff', flex: 1}}>
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
                    <View style={styles.PromptContainer}>
                        <View style={styles.PromptBody}>
                            <Text>暂无筛选数据，请修改查询条件后重试！</Text>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={{flex:1, flexDirection:'column'}}>
                <Head title={this.props.headTitle} canAdd={false} canBack={true}
                      onPress={this._onBack.bind(this)}/>
                <View style={{backgroundColor:'#CCFFFF', padding:10, height:30, justifyContent:'center'}}>
                    <Text>当前设备:<Text style={{fontWeight:'bold'}}>{this.state.deviceId}</Text></Text>
                </View>
                <View style={{marginTop:20,marginLeft:10,flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                    <Text>从</Text>
                    <DatePicker
                        date={this.state.startDate}
                        mode="date"
                        placeholder="开始日期"
                        format="YYYY-MM-DD"
                        minDate="2015-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        enabled={this.state.enable}
                        style={{width:100}}
                        onDateChange={(date) => {this.setState({startDate: date})}}/>
                    <Text>到</Text>
                    <DatePicker
                        date={this.state.endDate}
                        mode="date"
                        placeholder="结束日期"
                        format="YYYY-MM-DD"
                        minDate="2015-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        enabled={this.state.enable}
                        style={{width:100}}
                        onDateChange={(date) => {this.setState({endDate: date})}}/>
                    <TouchableHighlight
                        underlayColor='#FF0033'
                        style={styles.searchBtn}
                        onPress={this._search.bind(this)}>
                        <Text style={{color:'#fff'}}>查询</Text>
                    </TouchableHighlight>
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    PromptContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    PromptBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#99CCFF',
        margin: 10,
        height: 50,
        padding: 20,
    },
    searchBtn: {
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        height: 40,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
module.exports = InspectQuery;