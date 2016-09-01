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
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
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

    pressRow(good) {
        if (this.props.getResult) {
            this.props.getResult(good);
        }
        this._onBack();
    }

    componentDidMount() {
        var _this = this;
        _this.setState({
            storeId: this.props.storeId,
        })
        _this.timer = setTimeout(
            () => {
                _this.fetchData();
            }, 500
        )
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    componentWillReceiveProps() {

    }

    search(txt) {
        this.setState({
            kw: txt,
            loaded: false,
        });
        this.fetchData();
    }

    fetchData() {
        let _this = this;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            let postjson = {
                WarehouseID: _this.state.storeId,
                CateNo: null,
                InputTxt: _this.state.kw && _this.state.kw.length > 0 ? _this.state.kw : null,
                BusiTypeCodes: [1,2,3,7,8,9,12],
                pageSize: 10000,
                pageIndex: 1
            };
            let header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Mobile ' + Util.base64Encode(ret.user.Mobile + ':' + Util.base64Encode(ret.pwd) + ':' + (ret.user.Hospitals[0]!=null ? ret.user.Hospitals[0].Registration : '') + ":" + ret.user.Token)
            };
            NetUtil.postJson(CONSTAPI.GETGOODS, postjson, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        goodsDataSource: ds.cloneWithRows(data.Message),
                        loaded: true,
                    });
                } else {
                    alert("获取数据失败：" + data.Message);
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

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    renderGood(good, sectionID, rowID) {
        return (
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(good)}>
                <Image
                    style={styles.goodHead}
                    source={require('../../img/shopping_81px.png')}
                    />
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{good.ItemName} ({good.ItemStyle})</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>库存: {good.ItemCountNum}</Text>
                        <Text style={{flex: 1,}}>售价: {good.SellPrice}</Text>
                        <Text style={{flex: 1,}}>单位: {good.ItemStandard}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var body;
        if (!this.state.loaded) {
            body = (
                <View style={styles.loadingBox}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            )
        } else {
            body = (
                <ListView dataSource={this.state.goodsDataSource} enableEmptySections={true}
                          renderRow={this.renderGood.bind(this)}
                          initialListSize={10}
                          pageSize={10}
                    />
            )
        }
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
                    {body}
                    <View style={{height:100}}></View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
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
    goodHead: {
        width: 34,
        height: 34,
        marginRight: 10,
        /*borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 17,*/
    },
});

module.exports = Goods;