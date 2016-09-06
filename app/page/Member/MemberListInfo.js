/**
 * Created by tuorui on 2016/8/25.
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
    InteractionManager
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AddMemberInfo from './AddMemberInfo';
import MyHomeIcon from '../../commonview/ComIconView';
import Loading from '../../commonview/Loading';
import MemberDetails from './MemberDetails';
import Icon from 'react-native-vector-icons/Ionicons';
class MemberListInfo extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds: ds,
            dataSource: [],
            pageSize: 15,
            pageIndex: 1,
            recordCount: 0,
            memberLoaded: false,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1, false);
        });
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onEndReached() {
        this.fetchData(this.state.pageIndex + 1, true);
    }

    fetchData(page, isnext) {
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
                NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetPageRecord', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        let dataSource = _this.state.dataSource;
                        if (isnext) {
                            data.Message.forEach((d)=> {
                                dataSource.push(d);
                            });
                        } else {
                            dataSource = data.Message;
                        }
                        _this.setState({
                            dataSource: dataSource,
                            memberLoaded: true,
                            pageIndex: page,
                        });
                    } else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            memberloaded: true,
                        });
                    }
                });
                /*get recordCount from the api*/
                postdata = [{
                    "Childrens": null,
                    "Field": "isVIP",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "SM00054",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 1
                }];
                if (!isnext) {
                    NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetRecordCount', postdata, header, function (data) {
                        if (data.Sign && data.Message != null) {
                            _this.setState({
                                recordCount: data.Message,
                            });
                        } else {
                            alert("获取记录数失败：" + data.Message);
                        }
                    });
                }
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

    _addInfo() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'AddMemberInfo',
                component: AddMemberInfo,
                params: {
                    headTitle: '新增会员'
                }
            })
        }
    }

    _memberShipDetails(g) {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberDetails',
                component: MemberDetails,
                params: {
                    headTitle: '会员详情',
                    memberInfo: _this.state.memberInfo,
                    name: g.name,
                    phone: g.phone,
                    level: g.memberLevel,
                }
            })
        }
    }

    _onRenderRow(g) {
        return (
            <TouchableOpacity style={styles.touchStyle} onPress={()=>this._memberShipDetails(g)}>
                <Icon name={'ios-person'} size={50} color={'#00BBFF'}/>
                <View style={{flex:1, marginLeft:15,}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold', fontSize:16, marginRight:10}}>{g.GestName}</Text>
                        <Text>手机: {g.MobilePhone}</Text>
                    </View>
                    <Text style={{}}>地址: {g.GestAddress}</Text>
                </View>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'}/>
            </TouchableOpacity>
        )
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

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.memberLoaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
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
        flex: 1,
    },
    touchStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
});
module.exports = MemberListInfo;