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
    Image,
    ListView,
    ScrollView,
    } from 'react-native';
import Util from '../util/Util';
import Global from '../util/Global';
import NetUitl from '../net/NetUitl';
import JsonUitl from '../util/JsonUitl';
import Head from './Head';
var base64 = require('base-64');
class ChooseGuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            goodsDataSource: null,
            loaded: false,
            GoodInfo: null,
        };
        //this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(){
        this.setState({
            tabBarShow: this.props.tabBarShow
        })
    }
    _pressRow(p) {
        const { navigator } = this.props;
        if (this.props.getResult) {
            this.props.getResult(p);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    renderGest(p, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this._pressRow(p)}>
                <View style={styles.good_view}>
                    <Text style={styles.goodname}>{p.GestName}</Text>
                    {/*<Text style={styles.goodno}>编号：{p.ItemCode}</Text>*/}
                </View>
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        this.fetchData('');
    }

    fetchData(key) {
        var thiz = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            var postjson = {
                items: [],
                sorts: []
            };
            var header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(encodeURIComponent(ret.personname) + ':' + base64.encode(ret.password) + ':' + Global.ENTCODE + ":" + ret.token)
            };
            NetUitl.postJson(Global.GETGUEST, postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    thiz.setState({
                        goodsDataSource: ds.cloneWithRows(data.Message),
                        loaded: true,
                    });
                } else {
                    alert("获取数据错误！" + data.Message);
                    thiz.setState({
                        goodsDataSource: ds.cloneWithRows([]),
                        loaded: true,
                    });
                }
            });
        }).catch(err => {
            thiz.setState({
                goodsDataSource: ds.cloneWithRows([]),
                loaded: true,
            });
            alert('error:' + err);
        });
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    数据加载中...
                </Text>
            </View>
        );
    }

    search(val) {
        this.setState({
            loaded: false,
        });
        this.fetchData(val);
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        } else {
            return (
                <View style={{flex:1}}>
                    <Head title='选择会员' canBack={true} onPress={this._onBack.bind(this)}/>
                    <ScrollView key={'scrollView'}
                                horizontal={false}
                                showsVerticalScrollIndicator={true}
                                scrollEnabled={true}>
                        {/*<View style={styles.searchRow}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                onChange={(event) => this.search(event.nativeEvent.text)}
                                placeholder="输入会员名称..."
                                style={styles.searchTextInput}
                                />
                        </View>*/}
                        <ListView dataSource={this.state.goodsDataSource} renderRow={this.renderGest.bind(this)}/>
                        <View style={{height:100}}></View>
                    </ScrollView>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    good_view: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    goodname: {
        fontWeight: 'bold',
        fontSize: 22,
        backgroundColor: '#fff',
    },
    goodno: {
        fontSize: 12,
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        backgroundColor: "#ccc"
    },
    searchRow: {
        backgroundColor: '#eeeeee',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchTextInput: {
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },
});

module.exports = ChooseGuest;