/**
 * Created by User on 2016-07-19.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
    ListView,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
var base64 = require('base-64');
class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loaded: false,
            //storeId: this.props.storeId,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            kw: null,
            pageSize: 1500,
            pageIndex: 0,
            recordCount: 0,
        };
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    pressRow(good) {
        if (this.props.getResult) {
            this.props.getResult(good);
        }
        this._onBack();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1);
        });
    }

    fetchData(page) {
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
            let postjson = {
                WarehouseID: _this.props.storeId,
                CateNo: null,
                InputTxt: _this.state.kw,
                BusiTypeCodes: [1, 2, 3, 7, 8, 9, 12],
                pageSize: _this.state.pageSize,
                pageIndex: page
            };
            let header = {
                'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
            };
            NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeLeftJoinItemCount/SearchSellListByPage', postjson, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        dataSource: data.Message,
                        pageIndex: page,
                        loaded: true,
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
            alert('error:' + err);
        });
    }

    search() {
        this.fetchData(1);
    }

    renderRow(good, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this.pressRow(good)}>
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
                <Loading type={'text'}/>
            )
        } else {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          enableEmptySections={true}
                          renderRow={this.renderRow.bind(this)}
                          initialListSize={15}
                          pageSize={15}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title='选择商品' canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.searchRow}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        onChangeText={(txt)=>{this.setState({kw:txt})}}
                        placeholder="输入商品名称..."
                        value={this.state.kw}
                        style={styles.searchTextInput}/>
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
        backgroundColor: '#fff',
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        padding:10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
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

module.exports = Goods;