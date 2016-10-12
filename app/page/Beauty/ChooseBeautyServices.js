/**
 * Created by tuorui on 2016/9/6.
 */
/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    Alert,
    ListView,
    TouchableOpacity,
    InteractionManager,
    }from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';

class ChooseBeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            recordCount: 0,
            dataSource: [],
            value:'',
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onFetchData(1,this.state.value,false);
        });
    }

    componentWillUnmount() {
    }

    _onEndReached() {
        this._onFetchData(this.state.pageIndex + 1, this.state.value,true);
    }
    _onFetchData(page, value,isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = {
                "items":[{
                    "Childrens":[{
                        "Childrens":null,
                        "Field":"BarCode",
                        "Title":null,
                        "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                        "DataType":0,
                        "Value":value,
                        "Conn":0
                    },{
                        "Childrens":null,
                        "Field":"ItemName",
                        "Title":null,
                        "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                        "DataType":0,
                        "Value":value,
                        "Conn":2
                    },{
                        "Childrens":null,
                        "Field":"InputCode",
                        "Title":null,
                        "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                        "DataType":0,
                        "Value":value,
                        "Conn":2
                    }],
                    "Field":null,
                    "Title":null,
                    "Operator":null,
                    "DataType":0,
                    "Value":null,
                    "Conn":0
                },{
                    "Childrens":null,
                    "Field":"1",
                    "Title":null,
                    "Operator":{"Name":"=","Title":"等于","Expression":null},
                    "DataType":0,
                    "Value":"1",
                    "Conn":1
                },{
                    "Childrens":[{
                        "Childrens":null,
                        "Field":"BusiTypeCode",
                        "Title":null,
                        "Operator":{"Name":"=","Title":"等于","Expression":null},
                        "DataType":0,
                        "Value":"7",
                        "Conn":0
                    },{
                        "Childrens":null,
                        "Field":"BusiTypeCode",
                        "Title":null,
                        "Operator":{"Name":"=","Title":"等于","Expression":null},
                        "DataType":0,
                        "Value":"8",
                        "Conn":2
                    },{
                        "Childrens":null,
                        "Field":"BusiTypeCode",
                        "Title":null,
                        "Operator":{"Name":"=","Title":"等于","Expression":null},
                        "DataType":0,
                        "Value":"12",
                        "Conn":2
                    }],
                    "Field":null,
                    "Title":null,
                    "Operator":null,
                    "DataType":0,
                    "Value":null,
                    "Conn":1
                }],
                sorts: null,
                index: page,
                pageSize: _this.state.pageSize
            };
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeWithBranchDefine/GetPageRecord', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
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
                        loaded: true,
                        pageIndex: page,
                    });
                } else {
                    toastShort('获取数据失败，' + data.Exception);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            postdata = [{"Childrens":
                [{"Childrens":null,
                "Field":"BarCode",
                "Title":null,
                "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                "DataType":0,
                "Value":value,
                "Conn":0},
                {"Childrens":null,
                "Field":"ItemName",
                "Title":null,
                "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                "DataType":0,
                "Value":value,
                "Conn":2
                },
                {"Childrens":null,
                "Field":"InputCode",
                "Title":null,
                "Operator":{"Name":"like","Title":"相似","Expression":" @File like '%' + @Value + '%' "},
                "DataType":0,
                "Value":value,
                "Conn":2
            }],
                "Field":null,
                "Title":null,
                "Operator":null,
                "DataType":0,
                "Value":null,
                "Conn":0
            },
                {"Childrens":null,
                "Field":"1",
                "Title":null,
                "Operator":{"Name":"=","Title":"等于","Expression":null},
                "DataType":0,
                "Value":"1",
                "Conn":1
            },
                {"Childrens":[{
                    "Childrens":null,
                    "Field":"BusiTypeCode",
                    "Title":null,
                    "Operator":{"Name":"=","Title":"等于","Expression":null},
                    "DataType":0,
                    "Value":"7",
                    "Conn":0},
                    {"Childrens":null,
                    "Field":"BusiTypeCode",
                    "Title":null,
                    "Operator":{"Name":"=","Title":"等于","Expression":null},
                    "DataType":0,
                    "Value":"8",
                    "Conn":2},
                    {"Childrens":null,
                    "Field":"BusiTypeCode",
                    "Title":null,
                    "Operator":{"Name":"=","Title":"等于","Expression":null},
                    "DataType":0,
                    "Value":"12",
                    "Conn":2}],
                "Field":null,
                "Title":null,
                "Operator":null,
                "DataType":0,
                "Value":null,
                "Conn":1
            }]
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeWithBranchDefine/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    }else{
                        toastShort('获取数据条目失败，' + data.Exception);
                    }
                });
            }
        }, function (err) {
            toastShort(err);
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    pressRow(beauty) {
        let _this = this;
        if (_this.props.getResult) {
            _this.props.getResult(beauty);
        }
        _this._onBack();
    }

    _onRenderRow(beauty) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this.pressRow(beauty)}>
                <Text style={[AppStyle.titleText,{flex:1,}]}>{beauty.ItemName}</Text>
                <Text style={AppStyle.money}>￥{beauty.SellPrice}</Text>
            </TouchableOpacity>
        )
    }
    search(txt) {
        this._onFetchData(1,txt,false);
        this.setState({
            value: txt,
            loaded: false,
        });
    }

    render() {
        var body = <Loading type="text"/>
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          enableEmptySections={true}
                          renderRow={this._onRenderRow.bind(this)}
                          onEndReached={this._onEndReached.bind(this)}
                    />
            );
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={AppStyle.searchRow}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        onChangeText={this.search.bind(this)}
                        placeholder="输入美容名称..."
                        value={this.state.value}
                        style={AppStyle.searchTextInput}
                    />
                </View>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = ChooseBeautyServices