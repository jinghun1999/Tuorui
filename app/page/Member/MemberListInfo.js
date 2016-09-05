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
            memberloaded: false,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    fetchData() {
        let _this = this;
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
                let postjson = {
                    "items": [{
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
                    }],
                    "sorts": [{
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Sort": {"Name": "Desc", "Title": "降序"},
                        "Conn": 0
                    }]
                };
                let header = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Mobile ' + Util.base64Encode(ret.user.Mobile + ':' + Util.base64Encode(ret.pwd) + ':' + (ret.user.Hospitals[0] != null ? ret.user.Hospitals[0].Registration : '') + ":" + ret.user.Token)
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetModelListWithSort', postjson, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            dataSource: data.Message,
                            memberloaded: true,
                        });
                    } else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            dataSource: [],
                            memberloaded: true,
                        });
                    }
                });
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    memberloaded: true,
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

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.memberloaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          renderRow={this._onRenderRow.bind(this)}
                          initialListSize={10}
                          pageSize={10}
                          enableEmptySections={true}
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