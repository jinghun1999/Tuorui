/**
 * Created by User on 2016-07-20.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    ScrollView
    } from 'react-native';
import Util from '../util/Util';
import Global from '../util/Global';
import NetUitl from '../net/NetUitl';
import JsonUitl from '../util/JsonUitl';
import NButton from '../commonview/NButton';
//import QRCodeScreen from '../commonview/QRCodeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChooseGoods from './ChooseGoods'
import Head from './Head';
var base64 = require('base-64');
class GoodsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            goodsDataSource: null,
            loaded: false,
            GoodInfo: {'ItemName': null, 'BarCode': null, 'SellPrice': 0.00, 'Count': 1},
            GoodCount: 1,
            storeId: null,
        };
    }
    componentDidMount() {
        //在组件加载后将上一页面传入的值保存到storeId
        this.setState({
            storeId:this.props.storeId,
        });
    }
    _onPressQRCode() {
        const { navigator } = this.props;
        if (navigator) {
            this.props.navigator.push({
                component: QRCodeScreen,
                title: 'QRCode',
                passProps: {
                    onSucess: this._onSucess,
                },
            });
        }
    }

    _onSucess(v) {
        alert(v);
    }
    _SaveAndContinue(){
        var _this = this;
        const {navigator}= _this.props;
        if (_this.props.getResult) {
            //调用上一页面的回掉函数给上一页面变量赋值
            _this.props.getResult(_this.state.GoodInfo);
        }
        if(navigator){
            navigator.pop();
        }
    }
    _onBack(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    chooseGood(){
        var _this = this;
        const {navigator}= _this.props;
        if(navigator){
            navigator.push({
                name: 'ChooseGoods',
                component: ChooseGoods,
                params: {
                    storeId: _this.state.storeId,
                    getResult: function(res){
                        res.Count = 1;
                        _this.setState({
                            GoodInfo: res,
                        })
                    }
                }
            })
        }
    }
    /*
    changeCount(txt){
        var goodinfo = this.state.GoodInfo;
        goodinfo.Count = txt;
        this.setState({GoodInfo: goodinfo});
    }*/
    componentWillReceiveProps(){
        //alert(this.state.GoodInfo.ItemName);
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title='添加商品' canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    <View style={styles.rowBox}>
                        <View style={styles.searchTitle}>
                            <Text style={styles.titleText}>商品</Text>
                        </View>
                        <View style={styles.searchRow}>
                            <Text style={styles.infobody}>{this.state.GoodInfo.ItemName}</Text>
                        </View>
                        <TouchableOpacity style={{
                            width: 50,
                            height: 50,
                            backgroundColor: '#fff',
                            alignItems:'center',
                            justifyContent: 'center',
                            }} onPress={this.chooseGood.bind(this)}>
                            <Icon name={'search'} size={30} color={'blue'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowBox}>
                        <View style={styles.searchTitle}>
                            <Text style={styles.titleText}>条码</Text>
                        </View>
                        <View style={[styles.searchRow,{flexDirection:'row'}]}>
                            {/*<View style={{width:40, paddingLeft:5,}}>
                                <TouchableOpacity style={styles.scanButton} onPress={this._onPressQRCode.bind(this)}>
                                    <Image style={styles.sacnbtn}
                                           source={require('../../image/scanbarcode.png')}></Image>
                                </TouchableOpacity>
                            </View>*/}
                            <View style={{flex:1, height:50, justifyContent: 'center',}}>
                                <Text> {this.state.GoodInfo.BarCode}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <View style={styles.searchTitle}>
                            <Text style={styles.titleText}>数量</Text>
                        </View>
                        <View style={styles.searchRow}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                placeholder="商品数量..."
                                onChangeText={(text)=>{
                                    var _goodinfo = this.state.GoodInfo;
                                    _goodinfo.Count = parseInt(text);
                                    this.setState({GoodInfo: _goodinfo});
                                }}
                                value = {this.state.GoodInfo.Count.toString()}
                                style={styles.searchTextInput}
                                />
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <View style={styles.searchTitle}>
                            <Text style={styles.titleText}>销售价</Text>
                        </View>
                        <View style={styles.searchRow}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                placeholder="商品售价..."
                                editable={false}
                                value = {this.state.GoodInfo.SellPrice.toString()}
                                style={styles.searchTextInput}
                                />
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <View style={styles.searchTitle}>
                            <Text style={styles.titleText}>金额</Text>
                        </View>
                        <View style={styles.searchRow}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                placeholder="总金额..."
                                value = {(this.state.GoodInfo.SellPrice * this.state.GoodInfo.Count).toString()}
                                style={styles.searchTextInput}
                                />
                        </View>
                    </View>

                    <View style={{height:130}}>
                        <NButton text='保存并继续' onPress={this._SaveAndContinue.bind(this)}></NButton>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        backgroundColor:'#fff',
        flex:1,
    },
    contentContainer: {

    },
    rowBox: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    searchRow: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    infobody: {
        marginLeft: 5,
    },
    searchTextInput: {},
    searchTitle: {
        width: 80,
        height: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    sacnbtn: {
        width: 40,
        height: 40,
    }
});


module.exports = GoodsAdd;