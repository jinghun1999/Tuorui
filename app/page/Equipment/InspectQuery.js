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
import DatePicker from 'react-native-datepicker';
class InspectQuery extends Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let end=new Date();
        let start=new Date(end.getTime() - 1000 * 60 * 60 * 24 * 7);
        super(props);
        this.state = {
            loaded: false,
            startDate:start.getFullYear()+"-"+start.getMonth()+"-"+start.getDay(),
            endDate:end.getFullYear()+"-"+end.getMonth()+"-"+end.getDay(),
            ds: ds,
            dataSource:[]

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
                let querystr ='deviceid=48430101010005b2'+ '&starttime=' + _this.state.startDate+' 00:00:00' + '&endtime=' + _this.state.endDate + ' 23:59:59';
            NetUtil.get('http://wx.tuoruimed.com/Device/njy/getchecklist?' + querystr, header, function (data) {
                    if (data.result) {
                        _this.setState({
                            dataSource: data.lists,//data.Message,
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
        for (var Inspect of obj.data) {
            inspectBody.push((
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{alignItems:'center',width: 30, height: 25, marginLeft: 10,marginTop:10}}>
                    <Text>{Inspect.item}.</Text>
                     </View>
                    <View style={{alignItems:'center',width: 160, height: 25, backgroundColor: '#FFAEB9', marginTop:10,borderRadius:5}}>
                        <Text>{Inspect.itemname}</Text>
                    </View>
                    <View style={{alignItems:'center',width: 70, height: 25, backgroundColor: '#1E90FF', marginLeft: 10,marginTop:10,borderRadius:5}}>
                        <Text>{Inspect.description}</Text>
                    </View>
                    <View style={{alignItems:'center',width: 100, height: 25, marginLeft: 10,marginTop:10,borderRadius:5,color:'#6C7B8B'}}>
                        <Text>{Inspect.expect}</Text>
                    </View>
                </View>
            ));
        }
        return (
            <View style={{flex: 1, marginTop:20, paddingLeft:10}}>
                <Text>检测时间 <Text style={{color:'#EE0000'}}>{obj.timeformat}</Text></Text>
                {inspectBody}
            </View>
        );
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            if(this.state.dataSource.length>0) {
                body = (<View style={{backgroundColor: '#fff', flex: 1}}>
                        <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                  renderRow={this._onRenderRow.bind(this)}
                                  initialListSize={15}
                                  pageSize={15}
                                  enableEmptySections={true}
                        />
                    </View>
                )
            }
            else{
                body = (
                    <View style={styles.PromptContainer}>
                        <View style={styles.PromptBody}>
                            <Text>没有查询的数据！</Text>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canAdd={false} canBack={true}
                      onPress={this._onBack.bind(this)}/>
                <View style={{backgroundColor:'#FFFAFA',height:40}}>
                    <Text>当前设备:{this.props.equipmentNo}</Text>
                </View>
                <View style={{marginTop:20,marginLeft:10,flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                    <Text>从</Text>
                    <DatePicker
                        date={this.state.startDate}
                        mode="date"
                        placeholder="选择日期"
                        format="YYYY-MM-DD"
                        minDate="2015-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={true}
                        enabled={this.state.enable}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                right: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginRight: 36,
                                borderRadius:7
                            },
                        }}
                        onDateChange={(date) => {this.setState({startDate: date})}}/>
                    <Text>到</Text>
                    <DatePicker
                        date={this.state.endDate}
                        mode="date"
                        placeholder="选择日期"
                        format="YYYY-MM-DD"
                        minDate="2015-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={true}
                        enabled={this.state.enable}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                right: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginRight: 36,
                                borderRadius:7
                            },
                        }}
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
const styles=StyleSheet.create({
    PromptContainer:{
        flex:1,
        alignItems:'center',
        marginTop:20
    },
    PromptBody:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFE1FF',
        borderRadius: 6,
        borderColor: '#FFDAB9',
        width: 300,
        height: 40,
        fontSize: 15,
        fontWeight: 'bold'
    },
    searchBtn: {
        marginLeft: 30,
        width:80,
        height: 35,
        borderRadius: 5,
        backgroundColor: '#FF9999',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
module.exports = InspectQuery;