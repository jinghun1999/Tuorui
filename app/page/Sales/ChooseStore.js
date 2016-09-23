/**
 * Created by User on 2016-07-21.
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
    InteractionManager,
    ListView,
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class ChooseStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeDataSource: null,
            loaded: false,
        };
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
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        NetUtil.getAuth(function (user, hos) {
            let postjson = {
                items: [],
                sorts: []
            };
            let header = NetUtil.headerClientAuth(user, hos);
            NetUtil.postJson(CONSTAPI.HOST+'/Warehouse/GetModelList', postjson, header, function (data) {
                if (data.Sign && data.Message) {
                    _this.setState({
                        storeDataSource: ds.cloneWithRows(data.Message),
                        loaded: true,
                    });
                } else {
                    alert("获取数据错误：" + data.Message);
                    _this.setState({
                        storeDataSource: ds.cloneWithRows([]),
                        loaded: true,
                    });
                }
            });
        },function(err){});
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

    renderRow(p, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._pressRow(p)}>
                <View style={styles.storeWrap}>
                    <Text style={styles.storeName}>{p.WarehouseName}</Text>
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
                <Loading type={'text'}/>
            )
        } else {
            body = (
                <ListView dataSource={this.state.storeDataSource} enableEmptySections={true}
                          renderRow={this.renderRow.bind(this)}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title='选择仓库' canBack={true} onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        backgroundColor:'#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    storeWrap: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
    },
    storeName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    storeDetail: {
        fontSize: 12,
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
});

module.exports = ChooseStore;