/**
 * Created by tuorui on 2016/8/31.
 */
'use strict';
import React, {Component} from 'react';
import{
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
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class ChooseVaccineInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccineDataSource: [],
            loaded: false,
            value: '',
            pageIndex: 1,
            pageSize: 15,
            recordCount: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._fetchData(_this.state.value);
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _fetchData(value) {
        //http://petservice.tuoruimed.com/service/Api/ItemTypeWithBranchDefine/GetPageRecord
        var _this = this;
        NetUtil.getAuth(function (user, hos) {
            let postdata = [{
                "Childrens": null,
                "Field": "BusiTypeCode",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "9",
                "Conn": 0
            }, {
                "Childrens": null,
                "Field": "WarehouseID",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "a574a9fb-038a-4221-8f33-675d5b305b30",
                "Conn": 1
            }, {
                "Childrens": [{
                    "Childrens": null,
                    "Field": "ItemName",
                    "Title": null,
                    "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                    "DataType": 0,
                    "Value": value,
                    "Conn": 0
                }, {
                    "Childrens": null,
                    "Field": "InputCode",
                    "Title": null,
                    "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                    "DataType": 0,
                    "Value": value,
                    "Conn": 2
                }, {
                    "Childrens": null,
                    "Field": "BarCode",
                    "Title": null,
                    "Operator": {"Name": "like", "Title": "相似", "Expression": " @File like '%' + @Value + '%' "},
                    "DataType": 0,
                    "Value": value,
                    "Conn": 2
                }],
                "Field": null,
                "Title": null,
                "Operator": null,
                "DataType": 0,
                "Value": null,
                "Conn": 1
            }]
            //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
            let header = NetUtil.headerClientAuth(user, hos);
            //http://test.tuoruimed.com/service/Api/ItemTypeAndItemCount/GetModelList
            NetUtil.postJson(CONSTAPI.HOST + '/ItemTypeAndItemCount/GetModelList', postdata, header, function (data) {
                if (data.Sign && data.Message != null) {
                    _this.setState({
                        vaccineDataSource: data.Message,
                        loaded: true,
                    });
                } else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
        }, function (err) {
            alert(err)
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    search(txt) {
        this._fetchData(txt);
        this.setState({
            value: txt,
            loaded: false,
        });
    }

    pressRow(vaccine) {
        if (this.props.getResult) {
            this.props.getResult(vaccine);
        }
        this._onBack();
    }

    _renderVaccine(vaccine) {
        return (
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(vaccine)}>
                <View style={{flex:1}}>
                    <Text style={{flex:1, fontSize:16, color:'#27408B',fontWeight:'bold'}}>名称: {vaccine.ItemName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>编号: {vaccine.ItemCode}</Text>
                        <Text style={{flex: 1,}}>单价: ￥{vaccine.SellPrice}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var body = <Loading type="text"/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.vaccineDataSource)}
                             enableEmptySections={true}
                             renderRow={this._renderVaccine.bind(this)}/>
        }
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
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
                            placeholder="输入疫苗名称..."
                            value={this.state.value}
                            style={styles.searchTextInput}
                        />
                    </View>
                    {body}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
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
})
module.exports = ChooseVaccineInfo;