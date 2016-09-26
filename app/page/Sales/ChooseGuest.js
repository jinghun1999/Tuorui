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
    Alert,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    Image,
    ListView,
    ScrollView,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            pageSize: 15,
            recordCount: 0,
        };
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

    fetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postjson = {
                "items": [{
                    "Childrens": null,
                    "Field": "isVIP",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "SM00054",
                    "Conn": 0
                }],
                "sorts": [{"Field": "ModifiedOn", "Title": null, "Sort": {"Name": "Desc", "Title": "降序"}, "Conn": 0}],
                "index": page,
                "pageSize": _this.state.pageSize
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
            let header = NetUtil.headerClientAuth(user, hos);
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
                        loaded: true,
                    });
                } else {
                    Alert.alert('提示', "获取数据失败：" + data.Message, [{text: '确定'}]);
                    _this.setState({
                        dataSource: [],
                        loaded: true,
                    });
                }
            });
            postjson = [{
                "Childrens": null,
                "Field": "isVIP",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "SM00054",
                "Conn": 0
            }];
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
                    }], "Field": null, "Title": null, "Operator": null, "DataType": 0, "Value": null, "Conn": 1
                };
                postjson.push(query);
            }
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Gest/GetRecordCount', postjson, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                            loaded: true,
                        });
                    } else {
                        Alert.alert('提示', "获取记录数失败：" + data.Message, [{text: '确定'}]);
                    }
                });
            }
        }, function (err) {
            Alert.alert('提示', err, [{text: '确定'}]);
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
            <TouchableOpacity style={styles.rowBox} onPress={()=>this._pressRow(p)}>
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

    _onEndReached() {
        this.fetchData(this.state.pageIndex + 1, true);
    }

    _renderFooter() {
        if (this.state.pageIndex >= this.state.recordCount / this.state.pageSize) {
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
    rowBox: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        backgroundColor: '#fff',
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
    },
    guestDetail: {
        fontSize: 12,
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'center',
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