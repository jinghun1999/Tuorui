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
    RefreshControl,
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import GoodsAdd from './app/page/Sales/AddGood';
import Head from './app/commonview/Head';
import Sale from './app/page/Sales/Sale';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var fetchPath = 'http://120.24.89.243:20000/api/AppInfo/GetHomeInfo';
import IconView from 'react-native-vector-icons/MaterialIcons';
import HomeIcon from './app/commonview/HomeIcon';
import DrugHandBook from './app/page/HomePage/DrugHandBook';
import InfoDetail from './app/page/HomePage/InfoDetail';
import Information from './app/page/HomePage/Information';
import Contact from './app/page/HomePage/Contact';
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
            imageSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
            informationSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            infoLoaded: false,
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            totalPage: 0,
            isRefreshing: false,
            dataCache:[]
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
        this._fetchData(this.state.pageSize, this.state.pageIndex);
    }

    _fetchData(pageSize, pageIndex) {
        let _this = this;
        _this.setState({isRefreshing: true})
        fetch(fetchPath + "?pid=&PageSize=" + pageSize + "&PageIndex=" + pageIndex)
            .then((response) => response.text())
            .then((responseData) => {
                let dt = JSON.parse(responseData);
                if (dt.Status) {
                    _this.setState({
                        total: dt.Data.total,
                        totalPage: dt.Data.TotalPage,
                        infoLoaded: true,
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        isRefreshing: false,
                        dataCache:dt.Data.rows,
                    });
                }
                else {
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
                id: 'page',
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
    //点击事件
    _ClickPress(Info) {
        let _this=this;
        const { navigator } = this.props;
        if(navigator){
            navigator.push({
                name:'InfoDetail',
                component:InfoDetail,
                params:{
                    requestId: Info.RequestID,
                    title: Info.InfoTitle,
                    url: 'http://www.sougou.com/'
                }
            })
        }
    }


    componentWillReceiveProps() {
        //alert(this.state.store);
        this.timer && clearTimeout(this.timer);
    }

    _onEndReached() {
        let _this = this;
        let _pageIndex = _this.state.pageIndex + 1;
        let _fetchPath = fetchPath + "?pid=&PageIndex=" + _pageIndex + "&PageSize=" + _this.state.pageSize;
        fetch(_fetchPath)
            .then((responses) => responses.text())
            .then((resData) => {
                let dataTable = JSON.parse(resData);
                let _dataCache = _this.state.dataCache;
                let _data =  dataTable.Data.rows;
                _data.forEach((_data)=>{
                    _dataCache.push(_data);
                })
                if (dataTable.Status) {
                    _this.setState({
                        pageIndex: _pageIndex,
                        isRefreshing: false,
                        dataCache:_dataCache,
                    });
                }
            }).done();
    }
    _informationClick(){
        var _this = this;
        const {navigator} = _this.props;
        if(navigator){
            navigator.push({
                name:'Information',
                component:Information,
                params:{
                    headTitle:'资讯'
                }
            });
        }
    }
    _drugPress() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'DrugHandBook',
                component: DrugHandBook,
                params: {
                    headTitle: '药品信息'
                }
            });
        }
    }

    _laboratoryPress() {
        alert('Contact');
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'Contact',
                component: Contact,
                params: {
                    headTitle: '检验信息'
                }
            });
        }
    }

    _DiagnosisPress() {
        alert('诊断点击弹窗');
    }

    renderInfo(Info) {
        return (
            <TouchableOpacity style={{height:50,overflow:'hidden'}} onPress={()=>this._ClickPress(Info)}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <IconView name={'local-post-office'} size={20} color={'#ADD8E6'}
                              style={{marginLeft:10,justifyContent:'center',alignSelf:'center'}}/>
                    {/*<Image resource={Info.ImagePath}/>*/}
                    <Text
                        style={{flex:1,marginLeft:10,justifyContent:'center',alignSelf:'center'}}>{Info.InfoTitle}</Text>
                    <IconView name={'chevron-right'} size={20} color={'#888'}
                              style={{justifyContent:'center',alignSelf:'center'}}/>
                </View>
            </TouchableOpacity>
        )
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Head title='首页'/>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            </View>
        );
    }
    render() {
        if (!this.state.infoLoaded) {
            return this.renderLoadingView();
        } else {
            return (
                <View style={styles.container}>
                    <Head title='首页'/>
                    <ListView
                        renderHeader={()=>
                              <View>
                                <ViewPager style={{height:300}}
                                        renderPage={this._renderViewPage}
                                        dataSource={this.state.imageSource}
                                        isLoop={true}
                                        autoPlay={true}/>
                                <View style={{flexDirection:'row'}}>
                                    <HomeIcon text="药品" iconName={'ios-git-network'} iconColor={'#33CC99'}
                                              onPress={this._drugPress.bind(this)}/>
                                    <HomeIcon text="检验" iconName={'ios-water'} iconColor={'#6699CC'}
                                              onPress={this._laboratoryPress.bind(this)}/>
                                    <HomeIcon text="诊断" iconName={'ios-medkit'} iconColor={'#9999CC'}
                                              onPress={this._DiagnosisPress.bind(this)}/>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <HomeIcon text="文献" iconName={'ios-book'} iconColor={'#CDB7B5'}
                                              onPress={this._onPressButton2.bind(this)}/>
                                    <HomeIcon text="资讯" iconName={'ios-list-box'} iconColor={'#66CCFF'}
                                              onPress={this._informationClick.bind(this)}/>
                                    <HomeIcon text="工具" iconName={'ios-build'} iconColor={'#FFAEB9'}
                                              onPress={this._salesPress.bind(this)}/>
                                </View>
                              </View>}
                        dataSource={this.state.informationSource.cloneWithRows(this.state.dataCache)}
                        renderRow={this.renderInfo.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={100}
                        initialListSize={this.state.total}
                        pageSize={this.state.total}
                        enableEmptySections={true}
                    />
                </View>
            )
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        width: deviceWidth,
        height: 200,
        resizeMode: 'stretch'
    },
});

module.exports = TopScreen;