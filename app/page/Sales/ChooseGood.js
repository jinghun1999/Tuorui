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
    Alert,
    ActivityIndicator,
    InteractionManager,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import SearchBar from './../../commonview/SearchBar';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
class ChooseGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loaded: false,
            dataloaded: false,
            //storeId: this.props.storeId,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            kw: null,
            pageSize: 20,
            pageIndex: 0,
            sellStoreId: this.props.storeId,
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
        toastShort('pageindex'+page)
        let _this = this;
        _this.setState({dataloaded: false});
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let postjson = {
                WarehouseID: _this.state.sellStoreId,
                CateNo: null,
                InputTxt: _this.state.kw,
                BusiTypeCodes: [1, 2, 3, 7, 8, 9, 12],
                pageSize: _this.state.pageSize,
                pageIndex: page
            };
            NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeLeftJoinItemCount/SearchSellListByPage', postjson, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let dataSource = _this.state.dataSource;
                    if (page > 1) {
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
                        dataloaded: true,
                    });
                } else if (data.Message == null || data.Message.length === 0) {
                    toastShort('no data')
                    _this.setState({
                        loaded: true,
                        dataloaded: true,
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        dataSource: [],
                        loaded: true,
                        dataloaded: true,
                    });
                }
            });
        }, function (err) {
            toastShort(err);
        });
    }

    search() {
        this.fetchData(1);
    }

    _onEndReached() {
        this.fetchData(this.state.pageIndex + 1);
    }

    renderRow(good, sectionID, rowID) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this.pressRow(good)}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{flex: 1,fontSize:14, fontWeight:'bold'}}>{good.ItemName} ({good.ItemStyle})</Text>
                    <Text style={{fontSize:14, color:'#FF7F24', marginRight:10, }}>¥{good.SellPrice.toFixed(2)}</Text>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    _renderFooter() {
        if (!this.state.dataloaded) {
            return (
                <View style={{height:100,}}>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return <View/>
        }
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
                          initialListSize={20}
                          pageSize={20}
                          onEndReachedThreshold={400}
                          onEndReached={this._onEndReached.bind(this)}
                          renderFooter={this._renderFooter.bind(this)}/>
            )
        }
        return (
            <View style={AppStyle.container}>
                <SearchBar placeholder="输入商品名称"
                           onChangeText={(text)=>{this.setState({kw: text})}}
                           keyboardType={'default'}
                           onBack={this._onBack.bind(this)}
                           onPress={this.search.bind(this)}
                    />
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({});

module.exports = ChooseGood;