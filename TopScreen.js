'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Navigator,
    BackAndroid,
    Platform,
    ToastAndroid,
    TouchableOpacity,
    Image,
    ViewPagerAndroid,
    ListView,
    ScrollView,
    } from 'react-native';
import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import GoodsAdd from './app/page/Sales/AddGood';
import Head from './app/commonview/Head';
import Sale from './app/page/Sales/Sale';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
var deviceWidth = Dimensions.get('window').width;
var fetchPath = 'http://192.168.1.105:8088/api/AppInfo/GetHomeInfo';
import IconView from 'react-native-vector-icons/MaterialIcons';

var _navigator; //全局navigator对象
let IMGS = [
    require('./image/job1.jpg'),
    require('./image/job2.jpg'),
    require('./image/job3.jpg'),
];

class TopScreenAAA extends Component {
    render() {
        var defaultName = 'TopScreenMain';
        var defaultComponent = TopScreenMain;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}
                configureScene={(route) => {
                        let gestureType = Navigator.SceneConfigs.HorizontalSwipeJump;
                        gestureType.gestures.jumpForward=null;
                        gestureType.gestures.jumpBack=null;
                        return gestureType
                    }
                }
                renderScene={(route, navigator) => {
                    this._navigator = navigator;
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator} />
                }}/>
        );
    }

    componentDidMount() {
        var nav = this._navigator;
        BackAndroid.addEventListener('hardwareBackPress', function () {
            if (nav && nav.getCurrentRoutes().length > 1) {
                nav.pop();
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }
}

/****************MainTopSceen*****************/
class TopScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
            informationSource:null,
            pid:null,
            infoloaded: false,
            pageIndex:1,
            pageSize:10,
            total:0,
            totalPage:0,
        };
    }

    //组件刷新前调用，类似componentWillMount
    componentWillUpdate() {
    }

    //更新后的hook
    componentDidUpdate() {
    }

    //销毁期，用于清理一些无用的内容，如：点击事件Listener
    componentWillUnmount() {

    }

    componentDidMount() {
        this.fetchData(this.state.pid, this.state.pageSize, this.state.pageIndex);
    }
    fetchData(pid, pageSize, pageIndex){
        let _this = this;
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        fetch(fetchPath + "?pid=&PageSize="+pageSize+"&PageIndex="+pageIndex)
            .then((response) => response.text())
            .then((responseData) => {
                let dt = JSON.parse(responseData);
                if(dt.Status){
                    _this.setState({
                        informationSource: ds.cloneWithRows(dt.Data.rows),
                        total:dt.Data.total,
                        totalPage:dt.Data.TotalPage,
                        pid:null,
                        infoloaded: true,
                        pageIndex:pageIndex,
                        pageSize:pageSize,
                        isRefreshing:false,
                    });
                }
                else{
                    alert("get data error")
                }
            }).done();
    }
    _salesPress() {
        const { navigator } = this.props;
        var _this = this;
        if (navigator) {
            navigator.push({
                name: 'Sale',
                id:'page',
                component: Sale,
                params: {
                    id: _this.state.id,
                }
            })
        }
    }

    _onPressButton2() {
        alert("###");
        ToastAndroid.show("###", ToastAndroid.SHORT);
    }

    _renderViewPage(data) {
        return (<Image source={data} style={styles.page}/>);
    }
    _ClickPress(Info){
        alert('111');
    }
    renderInfo(Info){
        return (
            <TouchableOpacity style={{height:50,}} onPress={()=>this._ClickPress(Info)}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <IconView name={'lens'} size = {20} color={'#99CCFF'} style={{marginLeft:10,justifyContent:'center',alignSelf:'center'}} />
                    {/*<Image resource={Info.ImagePath}/>*/}
                    <Text style={{flex:1,marginLeft:10,justifyContent:'center',alignSelf:'center'}} >{Info.InfoTitle}</Text>
                    <IconView name={'chevron-right'} size={20} color={'#888'} style={{justifyContent:'center',alignSelf:'center'}} />
                </View>

            </TouchableOpacity>
        )
    }
    componentWillReceiveProps() {
        //alert(this.state.store);
       //this.timer && clearTimeout(this.timer);
    }
    _onEndReached() {
        let _this = this;
        let index = _this.state.pageIndex;
        let pagesize = _this.state.pageSize+10;
        index++;
        this.fetchData(null,pagesize,index);
    }

    render() {
        var infolist;
        if (!this.state.infoloaded) {
            infolist = (
                <View style={styles.loadingBox}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            )
        } else {
            infolist = (
                <ListView dataSource={this.state.informationSource}
                          enableEmptySections={true}
                          renderRow={this.renderInfo.bind(this)}
                          onEndReached={ this._onEndReached.bind(this)}
                          initialListSize={10}
                />
            )
        }
            return (
                <View style={styles.container}>
                    <Head title='首页'/>
                    <ViewPager
                        style={{height:300}}
                        renderPage={this._renderViewPage}
                        dataSource={this.state.dataSource}
                        isLoop={true}
                        autoPlay={true}/>
                    <View style={{ flexDirection:'row'}}>
                        <TouchableOpacity style={styles.grid_view} onPress={this._salesPress.bind(this)}>
                            <View style={[styles.iconOuter, {backgroundColor:'#C67171'}]}>
                                <Icon name={'ios-cart'} size={40} color={'white'}/>
                            </View>
                            <View style={styles.iconText}>
                                <Text style={{fontSize:15}}>
                                    商品销售
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton2}>
                            <View style={[styles.iconOuter, {backgroundColor:'#CD8500'}]}>
                                <Icon name={'ios-cog'} size={40} color={'white'}/>
                            </View>
                            <View style={styles.iconText}>
                                <Text style={{fontSize:15}}>
                                    配置管理
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton2}>
                            <View style={[styles.iconOuter, {backgroundColor:'#9A32CD'}]}>
                                <Icon name={'logo-googleplus'} size={40} color={'white'}/>
                            </View>
                            <View style={styles.iconText}>
                                <Text style={{fontSize:15}}>
                                    Google+
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection:'column',width: deviceWidth,}}>
                        {infolist}
                    </View>
                </View>
            )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    grid_view: {
        flex: 1,
        top: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height:100,
    },
    page: {
        width: deviceWidth,
        backgroundColor: '#088856',
        height:300,
        resizeMode: 'stretch'
    },
    iconOuter: {
        backgroundColor: "orange",
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    iconText: {
        width: 100,
        alignItems: 'center',
    },
});

module.exports = TopScreen;