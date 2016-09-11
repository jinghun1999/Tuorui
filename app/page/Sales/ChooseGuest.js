/**
 * Created by User on 2016-07-21.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    InteractionManager,
    Image,
    ListView,
    ScrollView,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

class ChooseGuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            kw: '',
            dataSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
            GoodInfo: null,
            pageIndex: 1,
            recordCount: 0,
        };
        //this.fetchData = this.fetchData.bind(this);
    }

    _pressRow(p) {
        if (this.props.getResult) {
            this.props.getResult(p);
        }
        this._onBack();
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1, false);
        });
    }

    fetchData(page, isnext) {
        let _this = this;
        _this.setState({
            loaded: false,
        });
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
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
                },],
                "sorts": [{"Field": "ModifiedOn", "Title": null, "Sort": {"Name": "Desc", "Title": "降序"}, "Conn": 0}],
                "index": page,
                "pageSize": 15
            };
            if (_this.state.kw.length > 0) {
                let query = {
                    "Childrens": [{
                        "Childrens": null,
                        "Field": "GestCode",
                        "Title": null,
                        "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                        "DataType": 0,
                        "Value": _this.state.kw,
                        "Conn": 0
                    }, {
                        "Childrens": null,
                        "Field": "GestName",
                        "Title": null,
                        "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                        "DataType": 0,
                        "Value": _this.state.kw,
                        "Conn": 2
                    }, {
                        "Childrens": null,
                        "Field": "MobilePhone",
                        "Title": null,
                        "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                        "DataType": 0,
                        "Value": _this.state.kw,
                        "Conn": 2
                    }],
                    "Field": null,
                    "Title": null,
                    "Operator": null,
                    "DataType": 0,
                    "Value": null,
                    "Conn": 1
                };
                postjson.items.push(query);
            }
            let header = {
                'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
            };
            NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetPageRecord', postjson, header, function (data) {
                if (data.Sign && data.Message) {
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
                        pageIndex: page,
                    });
                } else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        dataSource: [],
                        loaded: true,
                    });
                }
            });
        }).catch(err => {
            _this.setState({
                dataSource: [],
                loaded: true,
            });
            alert('error:' + err.message);
        });
    }

    search() {
        this.fetchData(1, false);
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    renderRow(p, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this._pressRow(p)}>
                <View style={styles.gestWrap}>
                    <Text style={styles.guestName}>{p.GestName}</Text>
                    <Text style={styles.guestDetail}>手机：{p.MobilePhone}</Text>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        var body;
        if (!this.state.loaded) {
            body = (
                <Loading type={'text'}/>
            )
        } else {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          enableEmptySections={true}
                          initialListSize={15}
                          pageSize={15}
                          onEndReached={this._onEndReached.bind(this)}
                          renderRow={this.renderRow.bind(this)}
                          renderFooter={this._renderFooter.bind(this)}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title='选择会员' canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.searchRow}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        onChangeText={(txt) => this.setState({kw: txt})}
                        placeholder="输入会员名称..."
                        style={styles.searchTextInput}
                        />
                    <TouchableOpacity
                        underlayColor='#4169e1'
                        style={styles.searchBtn}
                        onPress={this.search.bind(this)}>
                        <Text style={{color:'#fff'}}>查询</Text>
                    </TouchableOpacity>
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gestWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    guestName: {
        fontWeight: 'bold',
        fontSize: 18,
        backgroundColor: '#fff',
    },
    guestDetail: {
        fontSize: 12,
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
    searchBtn: {
        height: 30,
        width: 50,
        marginLeft: 10,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchTextInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },
});

module.exports = ChooseGuest;