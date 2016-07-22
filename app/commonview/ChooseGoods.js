/**
 * Created by User on 2016-07-19.
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
class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            goodsDataSource: null,
            loaded: false,
            storeId: null,
            kw: null,
        };
    }
    _pressRow(good) {
        const { navigator } = this.props;
        if (this.props.getResult) {
            this.props.getResult(good);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    renderGood(good, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this._pressRow(good)}>
                <View style={styles.good_view}>
                    <Text style={styles.goodname}>{good.ItemName}</Text>
                    {/*<Text style={styles.goodno}>编号：{good.ItemCode}</Text>*/}
                </View>
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        this.setState({
            storeId: this.props.storeId,
        });
        this.fetchData();
    }
    shouldComponentUpdate(){
        return true;
    }
    search(txt){
        this.setState({
            kw:txt,
            loaded: false,
        });
        this.fetchData();
    }
    fetchData() {
        var _this = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            var postjson = {
                WarehouseID: _this.state.storeId,
                CateNo: null,
                InputTxt: _this.state.kw && _this.state.kw.length > 0 ? _this.state.kw : null,
                BusiTypeCodes: [],
                pageSize: 10,
                pageIndex: 1
            };
            var header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(encodeURIComponent(ret.personname) + ':' + base64.encode(ret.password) + ':' + Global.ENTCODE + ":" + ret.token)
            };
            NetUitl.postJson(Global.GETGOODS, postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    _this.setState({
                        goodsDataSource: ds.cloneWithRows(data.Message),
                        loaded: true,
                    });
                } else {
                    alert("获取数据错误！" + data.Message);
                    _this.setState({
                        goodsDataSource: ds.cloneWithRows([]),
                        loaded: true,
                    });
                }
            });
        }).catch(err => {
            _this.setState({
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
                    <Head title='选择商品' canBack={true} onPress={this._onBack.bind(this)}/>
                    <ScrollView key={'scrollView'}
                                horizontal={false}
                                showsVerticalScrollIndicator={true}
                                scrollEnabled={true}>
                        <View style={styles.searchRow}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                onChangeText={this.search.bind(this)}
                                placeholder="输入商品名称..."
                                value={this.state.kw}
                                style={styles.searchTextInput}
                                />
                        </View>
                        <ListView dataSource={this.state.goodsDataSource} enableEmptySections={true} renderRow={this.renderGood.bind(this)}/>
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
        flexDirection: 'row',
        backgroundColor:'#fff',
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

module.exports = Goods;