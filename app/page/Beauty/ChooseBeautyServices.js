/**
 * Created by tuorui on 2016/9/6.
 */
/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    TouchableOpacity,
    InteractionManager,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
class ChooseBeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            recordCount: 0,
            dataSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onFetchData(1, false);
        });
    }

    componentWillUnmount() {
    }

    _onEndReached() {
        this._onFetchData(this.state.pageIndex + 1, true);
    }

    _onFetchData(page, isNext) {
        //获取数据http://petservice.tuoruimed.com/service/Api/ItemTypeWithBranchDefine/GetPageRecord
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
                let postdata = {
                    items: [{
                        "Childrens": null,
                        "Field": "IsDeleted",
                        "Title": null,
                        "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                        "DataType": 0,
                        "Value": "0",
                        "Conn": 0
                    }, {
                        "Childrens": [{
                            "Childrens": null,
                            "Field": "BusiTypeCode",
                            "Title": null,
                            "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                            "DataType": 0,
                            "Value": "7",
                            "Conn": 0
                        }, {
                            "Childrens": null,
                            "Field": "BusiTypeCode",
                            "Title": null,
                            "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                            "DataType": 0,
                            "Value": "8",
                            "Conn": 2
                        }, {
                            "Childrens": null,
                            "Field": "BusiTypeCode",
                            "Title": null,
                            "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                            "DataType": 0,
                            "Value": "12",
                            "Conn": 2
                        }
                        ],
                        "Field": null,
                        "Title": null,
                        "Operator": null,
                        "DataType": 0,
                        "Value": null,
                        "Conn": 1
                    }
                    ],
                    sorts: null,
                    index: page,
                    pageSize: _this.state.pageSize
                };
                //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = NetUtil.headerClientAuth(user, hos);
                //http://petservice.tuoruimed.com/service/Api/ItemTypeWithBranchDefine/GetPageRecord
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
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
                /*get recordCount from the api http://petservice.tuoruimed.com/service/Api/ItemTypeWithBranchDefine/GetRecordCount*/
                postdata = [{
                    "Childrens": null,
                    "Field": "IsDeleted",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "0",
                    "Conn": 0
                },{"Childrens": [{
                    "Childrens": null,
                    "Field": "BusiTypeCode",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "7",
                    "Conn": 0
                },{"Childrens": null,
                    "Field": "BusiTypeCode",
                    "Title": null,
                    "Operator": {"Name": "=","Title": "等于","Expression": null},
                    "DataType": 0,
                    "Value": "8",
                    "Conn": 2
                    },{
                    "Childrens": null,
                    "Field": "BusiTypeCode",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于","Expression": null},
                    "DataType": 0,
                    "Value": "12",
                    "Conn": 2
                    }],
                    "Field": null,
                    "Title": null,
                    "Operator": null,
                    "DataType": 0,
                    "Value": null,
                    "Conn": 1
                    }
                ];
                if (!isNext) {
                    NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeWithBranchDefine/GetRecordCount', postdata, header, function (data) {
                        if (data.Sign && data.Message != null) {
                            _this.setState({
                                recordCount: data.Message,
                            });
                        } else {
                            alert("获取记录数失败：" + data.Message);
                        }
                    });
                }
            },function(err){
            alert(err);
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
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(beauty)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{beauty.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>条码: {beauty.ItemCode}</Text>
                        <Text style={{flex: 1,}}>售价: {beauty.RecipePrice}</Text>
                        <Text style={{flex: 1,}}>单位: {beauty.RecipeUnit == 'DM0000000056' ? '次' : ''}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
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
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View>
                    {body}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
})
module.exports = ChooseBeautyServices