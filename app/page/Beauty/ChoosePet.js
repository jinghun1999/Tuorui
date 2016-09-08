/**
 * Created by tuorui on 2016/9/6.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ListView,
    ScrollView,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
class ChoosePet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            kw: '',
            pageIndex:1,
            pageSize:15,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }
    _onBack(){
        let _this=this;
        const{navigator}=_this.props;
        if(navigator){
            navigator.pop();
        }
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._fetchData(_this.state.kw,1,false);
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _pressRow(pet){
        if (this.props.getResult) {
            this.props.getResult(pet);
        }
        this._onBack();
    }
    _renderPet(pet){
        return(
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this._pressRow(pet)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}> {pet.PetName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>宠物卡: {pet.PetCode}</Text>
                        <Text style={{flex: 1,}}>品种: {pet.PetBreed}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>会员名: {pet.GestName}</Text>
                        <Text style={{flex: 1,}}>会员手机: {pet.MobilePhone}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }
    _fetchData(value,page,isNext){
        let _this =this;
        //http://petservice.tuoruimed.com/service/Api/GestAndPet/GetPageRecord
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
                let postdata = {
                    "items": [{
                        "Childrens": null,
                        "Field": "PetStatus",
                        "Title": null,
                        "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                        "DataType": 0,
                        "Value": "SM00052",
                        "Conn": 0
                        },{
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
                        "Field": "CreatedOn",
                        "Title": null,
                        "Sort": {"Name": "Desc", "Title": "降序"},
                        "Conn": 0
                        }
                    ],
                    index: page,
                    pageSize: _this.state.pageSize
                };
                //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
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
                        alert("获取数据失败：" + data.Message);
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
                            alert("获取记录数失败：" + data.Message);
                        }
                    });
                }
            }
        ).catch(err => {
                _this.setState({
                    petDataSource: [],
                    loaded: true,
                });
                alert('error:' + err.message);
            }
        )
    }

    search(txt) {
        this._fetchData(txt,1,false);
        this.setState({
            kw: txt,
            loaded: false,
        });
    }
    render(){
        var body=<Loading />
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.petDataSource)}
                             enableEmptySections={true}
                             renderRow={this._renderPet.bind(this)}
            />
        }
        return(
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
                            placeholder="输入宠物名称..."
                            value={this.state.kw}
                            style={styles.searchTextInput}
                        />
                    </View>
                    {body}
                </ScrollView>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
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
module.exports=ChoosePet;