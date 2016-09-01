/**
 * Created by User on 2016-07-21.
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

class ChooseGuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            kw: null,
            guestDataSource: null,
            loaded: false,
            GoodInfo: null,
        };
        //this.fetchData = this.fetchData.bind(this);
    }

    componentWillReceiveProps() {

    }

    _pressRow(p) {
        const { navigator } = this.props;
        if (this.props.getResult) {
            this.props.getResult(p);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        let _this = this;
        _this.timer = setTimeout(
            () => {
                _this.fetchData();
            }, 500
        );
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    fetchData(key) {
        let _this = this;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            let postjson = {
                items: [],
                sorts: []
            };
            let header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Mobile ' + Util.base64Encode(ret.user.Mobile + ':' + Util.base64Encode(ret.pwd) + ':' + (ret.user.Hospitals[0]!=null ? ret.user.Hospitals[0].Registration : '') + ":" + ret.user.Token)
            };
            NetUtil.postJson(global.GLOBAL.GETGUEST, postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    _this.setState({
                        guestDataSource: ds.cloneWithRows(data.Message),
                        loaded: true,
                    });
                } else {
                    alert("获取数据失败：" + data.Message);
                    _this.setState({
                        guestDataSource: ds.cloneWithRows([]),
                        loaded: true,
                    });
                }
            });
        }).catch(err => {
            _this.setState({
                guestDataSource: ds.cloneWithRows([]),
                loaded: true,
            });
            alert('error:' + err);
        });
    }

    search(val) {
        this.setState({
            loaded: false,
        });
        this.fetchData(val);
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    renderGest(p, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this._pressRow(p)}>
                <View style={styles.gestWrap}>
                    <Text style={styles.guestName}>{p.GestName}</Text>
                    <Text style={styles.guestDetail}>手机：{p.MobilePhone}</Text>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        );
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
                <ListView dataSource={this.state.guestDataSource} enableEmptySections={true}
                          renderRow={this.renderGest.bind(this)}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title='选择会员' canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.searchRow}>
                     <TextInput
                         autoCapitalize="none"
                         autoCorrect={false}
                         clearButtonMode="always"
                         onChangeText={(txt) => this.setState({kw: txt})}
                         placeholder="输入会员名称..."
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
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gestWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    guestName: {
        fontWeight: 'bold',
        fontSize: 18,
        backgroundColor: '#fff',
    },
    guestDetail: {
        fontSize: 12,
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
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

module.exports = ChooseGuest;