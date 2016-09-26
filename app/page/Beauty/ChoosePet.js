/**
 * Created by tuorui on 2016/9/6.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity,
    InteractionManager,
    ListView,
    ScrollView,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
import AppStyle from '../../theme/appstyle';

class ChoosePet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            kw: '',
            pageIndex: 1,
            pageSize: 15,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchData(this.state.kw, 1, false);
        });
    }

    componentWillUnmount() {
    }

    _pressRow(pet) {
        if (this.props.getResult) {
            this.props.getResult(pet);
        }
        this._onBack();
    }

    _fetchData(value, page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = {
                "items": [{
                    "Childrens": null,
                    "Field": "PetStatus",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "SM00052",
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "GestStatus",
                    "Title": null,
                    "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                    "DataType": 0,
                    "Value": "SM00001",
                    "Conn": 1
                }, {
                    "Childrens": null,
                    "Field": "PetName",
                    "Title": null,
                    "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                    "DataType": 0,
                    "Value": value,
                    "Conn": 1
                },
                ],
                "sorts": [{
                    "Field": "CreatedOn",
                    "Title": null,
                    "Sort": {"Name": "Desc", "Title": "降序"},
                    "Conn": 0
                }, {
                    "Field": "PetName",
                    "Title": null,
                    "Sort": {"Name": "ASC", "Title": "升序"},
                    "Conn": 0
                }
                ],
                index: page,
                pageSize: _this.state.pageSize
            };
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST + '/GestAndPet/GetPageRecord', postdata, header, function (data) {
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
                        petDataSource: dataSource,
                        loaded: true,
                        pageIndex: page,
                    });
                } else {
                    Alert.alert('提示', "获取数据失败：" + data.Message, [{text: '确定'}]);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            /*get recordCount from the api*/
            postdata = [{
                "Childrens": null,
                "Field": "PetStatus",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "SM00052",
                "Conn": 0
            }, {
                "Childrens": null,
                "Field": "GestStatus",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "SM00001",
                "Conn": 1
            }, {
                "Childrens": null,
                "Field": "PetName",
                "Title": null,
                "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                "DataType": 0,
                "Value": value,
                "Conn": 1
            }]
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/GestAndPet/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        Alert.alert('提示', "获取记录数失败：" + data.Message, [{text: '确定'}]);
                    }
                });
            }
        }, function (err) {
            Alert.alert('错误', err, [{text: '确定'}]);
        })
    }

    search(txt) {
        this._fetchData(txt, 1, false);
        this.setState({
            kw: txt,
            loaded: false,
        });
    }

    _renderPet(pet) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._pressRow(pet)}>
                <View style={{flex:1, marginRight:10,}}>
                    <Text style={AppStyle.titleText}> {pet.PetName}</Text>
                    <View style={{flexDirection:'row',}}>
                        <Text style={{flex: 1,}}>会员: {pet.GestName}</Text>
                        <Text style={{flex: 2,}}>手机: {pet.MobilePhone}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    render() {
        var body = <Loading />
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.petDataSource)}
                             enableEmptySections={true}
                             renderRow={this._renderPet.bind(this)}
                />
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={AppStyle.searchRow}>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="always"
                            onChangeText={this.search.bind(this)}
                            placeholder="输入宠物名称..."
                            value={this.state.kw}
                            style={AppStyle.searchTextInput}
                            />
                    </View>
                    {body}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = ChoosePet;