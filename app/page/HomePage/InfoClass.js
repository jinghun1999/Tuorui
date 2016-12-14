/**
 * Created by tuorui on 2016/7/27.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    InteractionManager,
    } from 'react-native';
import Head from './../../commonview/Head';
import NetUtil from '../../util/NetUtil';
import Util from '../../util/Util';
import DrugDetails from './DrugDetails';
import Loading from '../../commonview/Loading';

import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Icon from 'react-native-vector-icons/MaterialIcons';

class InfoClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            drugHeaderSource: null,
            loaded: false,
            parentId: null,
            classSource:[],
        };
    }

    fetchData(parentId) {
        let _this = this;
        NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/GetClass?parentId=" + parentId, false, function (data) {
            _this.setState({
                classSource: data.Data,
                //drugHeaderSource: data.Pin,
                loaded: true,
            });
        });
    }

    componentWillMount() {
        var parentId = this.props.parentId;
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(parentId);
        });
    }

    //返回方法
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //加载数据后点击事件
    pressRow(g) {
        var hasChildren = g.HasChildren;
        if (hasChildren) {
            var _this = this;
            const {navigator} = _this.props;
            if (navigator) {
                navigator.push({
                    name: 'InfoClass',
                    component: InfoClass,
                    params: {
                        parentId: g.ID,
                        headTitle: g.ClassName,
                    }

                })
            }
        } else {
            var _this = this;
            const {navigator} = _this.props;
            if (navigator) {
                navigator.push({
                    name: 'DrugDetails',
                    component: DrugDetails,
                    params: {
                        requestId: g.ID,
                        parentId: g.ID,
                        headTitle: g.ClassName,
                        url: CONSTAPI.WEB + '/App/New/NewsCat?ClassRequestID='+g.ID,
                    }
                })
            }
        }
    }

    //LIST VIEW 数据
    _renderDrug(g, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this.pressRow(g)}>
                <Icon name={'lens'} size={20} color={'#7A67EE'} style={styles.LeftIconStyles}/>
                <Text style={styles.NameStyle}>{g.ClassName}</Text>
                <Icon name={'chevron-right'} size={20} color={'black'} style={styles.IconStyle}/>
            </TouchableOpacity>
        )
    }

    render() {
        let body = <Loading type={'text'}/>
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.classSource)}
                          renderRow={this._renderDrug.bind(this)}
                          initialListSize={10}
                          pageSize={10}
                          enableEmptySections={true}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title={Util.cutString(this.props.headTitle, 20, '..')} canBack={true} onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    LeftIconStyles: {
        margin: 15,
    },
    NameStyle: {
        flex: 1,
        fontSize: 16,
        color: '#888',
    },
    IconStyle: {
        marginRight: 10,
    }
});

module.exports = InfoClass;