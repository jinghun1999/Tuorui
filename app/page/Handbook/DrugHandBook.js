/**
 * Created by tuorui on 2016/7/27.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import Head from './../../commonview/Head';
import Global from '../../util/Global';
import JsonUtil from '../../util/JsonUitl';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DrugDetails from './DrugDetails';
var fetchPath = 'http://192.168.1.105:8088/api/AppInfo/GetClass';
class DrugHandBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugSource: null,
            loaded: false,
            parentId: null,
        };
    };

    fetchData(parentId) {
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        {
            fetch(fetchPath + "?parentId=" + parentId)
                .then((response) => response.text())
                .then((responseData) => {
                    //let ret=JSON.parse(responseData);
                    this.setState({
                        drugSource: ds.cloneWithRows(JSON.parse(responseData).Data),
                        loaded: true,
                    });
                })
                .done();
        }
    }

    componentDidMount() {
        alert(this.props.headTitle)
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
    _Press(g) {
        var hasChildren = g.HasChildren;
        if (hasChildren) {
            var _this = this;
            const {navigator} = _this.props;
            if (navigator) {
                navigator.push({
                    name: 'DrugHandBook',
                    component: DrugHandBook,
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
                        headTitle: g.ClassName
                    }
                })
            }
        }
    }

    //LIST VIEW 数据
    renderDrug(g, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this._Press(g)}>
                        <Icon name={'lens'} size = {20} color={'#99CCFF'} style={styles.LeftIconStyles} />
                    <Text style={styles.NameStyle}>{g.ClassName}</Text>
                    <Icon name={'chevron-right'} size={30} color={'black'} style={styles.IconStyle}/>
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
                    <ScrollView key={'scrollView'}
                                horizontal={false}
                                showsVerticalScrollIndicator={true}
                                scrollEnabled={true}>
                        <ListView dataSource={ this.state.drugSource}
                                  renderRow={this.renderDrug.bind(this)}
                        />
                    </ScrollView>
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
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        borderBottomColor: '#666',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    LeftIconStyles: {
        marginLeft:20,
    },
    NameStyle: {
        flex: 1,
        fontSize: 20,
        color: '#888',
        marginLeft: 20,
    },
    IconStyle:{
        marginRight:10,
    }
});
module.exports = DrugHandBook;