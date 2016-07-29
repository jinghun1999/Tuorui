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
    ViewPagerAndroid
    } from 'react-native';
import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import GoodsAdd from './app/page/Sales/AddGood';
import Head from './app/commonview/Head';
import Sale from './app/page/Sales/Sale';
var deviceWidth = Dimensions.get('window').width;
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

    componentWillReceiveProps() {
        //alert(this.state.store);
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title='首页'/>
                <ViewPager
                    style={{height:300}}
                    renderPage={this._renderViewPage}
                    dataSource={this.state.dataSource}
                    isLoop={true}
                    autoPlay={true}/>
                <View style={{flex: 1, flexDirection:'row'}}>
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
                <View style={styles.HomeInfoStyle}>
                    <Text> 我是咨询简介</Text>
                    <Text> 我是咨询简介</Text>
                    <Text> 我是咨询简介</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
    },
    grid_view: {
        flex: 1,
        top: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    page: {
        width: deviceWidth,
        backgroundColor: '#088856',
        height: 300,
        flex: 1,
        //height: 130,
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
    HomeInfoStyle:{
        flex:1,
        flexDirection:'column',
    }
});

module.exports = TopScreen;