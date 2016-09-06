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
    } from 'react-native';
import Head from './../../commonview/Head';
import NetUtil from '../../util/NetUtil';
import DrugDetails from './DrugDetails';

import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Icon from 'react-native-vector-icons/MaterialIcons';

const classuri = CONSTAPI.APIAPP + '/AppInfo/GetClass';
const detailpage = CONSTAPI.WEB + '/App/home';
class InfoClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            drugHeaderSource: null,
            loaded: false,
            parentId: null,
            data: null,
        };
    }

    fetchData(parentId) {
        let _this = this;
        NetUtil.get(classuri + "?parentId=" + parentId, false, function (data) {
            _this.setState({
                drugSource: _this.state.drugSource.cloneWithRows(data.Data),
                data: data.Data,
                drugHeaderSource: data.Pin,
                loaded: true,
            });
        });
    }

    componentDidMount() {
        var parentId = this.props.parentId;
        this.timer = setTimeout(
            () => {
                this.fetchData(parentId);
            }, 500
        );
    }

    //返回方法
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount() {
        var _this = this;
        _this.timer && clearTimeout(_this.timer);
    }

    renderLoadingView() {
        return (
            <View>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            </View>
        );
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
                        url: detailpage,
                    }
                })
            }
        }
    }

    //LIST VIEW 数据
    _renderDrug(g, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this.pressRow(g)}>
                <Icon name={'lens'} size={20} color={'#99CCFF'} style={styles.LeftIconStyles}/>
                <Text style={styles.NameStyle}>{g.ClassName}</Text>
                <Icon name={'chevron-right'} size={20} color={'black'} style={styles.IconStyle}/>
            </TouchableOpacity>
        )
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        } else {
            return (
                <View>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <ListView dataSource={this.state.drugSource}
                              renderRow={this._renderDrug.bind(this)}/>

                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderBottomColor: '#666',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    LeftIconStyles: {
        marginLeft: 20,
    },
    NameStyle: {
        flex: 1,
        fontSize: 16,
        color: '#888',
        marginLeft: 20,
    },
    IconStyle: {
        marginRight: 10,
    }
});

module.exports = InfoClass;