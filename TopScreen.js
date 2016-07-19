'use strict';

//var React = require('react-native');
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Navigator,
    WebView,
    BackAndroid,
    ToastAndroid,
    TouchableOpacity,
    Image,
    ViewPagerAndroid
} from 'react-native';


var deviceWidth = Dimensions.get('window').width;
var _navigator; //全局navigator对象
let IMGS = [
    require('./image/job1.jpg'),
    require('./image/job2.jpg'),
    require('./image/job3.jpg'),
];
import Head from './Head';
import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sale from './Sale';
class TopScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
        };
        this._onPressButton = this._onPressButton.bind(this);
    }

    //一般用于优化，可以返回false或true来控制是否进行渲染
    shouldComponentUpdate() {
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

    _onPressButton1() {
        //alert("销售单");
        ToastAndroid.show("-销售单", ToastAndroid.SHORT);
    }

    _onPressButton2() {
        alert("健康道场");
        ToastAndroid.show("健康道场", ToastAndroid.SHORT);
    }

    _onPressButton3() {
        alert("健康小伙伴");
        ToastAndroid.show("健康小伙伴", ToastAndroid.SHORT);
    }

    /**
     *设置跳转方式
     */
    configureScenceAndroid() {
        return Navigator.SceneConfigs.FadeAndroid;
    }

    /**
     *组件将要被加载在视图
     */
    componentWillMount() {

    }
    _onPressButton() {
        alert("1111");
        ToastAndroid.show("--oooooooo-", ToastAndroid.SHORT);
        // _navigator.push({title:'Login',id:'login'});
    }
    /**
     *配置跳转路由
     */
    renderSceneAndroid(route, navigator) {
        _navigator = navigator;
        if (route.id === 'main') {
            return (
                <View style={styles.container} onPress={this._onPressButton}>
                    <Head/>
                    <View style={styles.container}>
                        <View style={{flex: 1, flexDirection:'row', height:80,}}>
                            <TouchableOpacity style={styles.view} onPress={() => {_navigator.push({title:'Sale',id:'sale'});
              ToastAndroid.show('销售单', ToastAndroid.SHORT); }}>
                                <View style={styles.view}>
                                    <Text style={styles.icon_box}>
                                        <Icon name={'list'} size={50} color={'white'}/>
                                    </Text>
                                    <Text style={{fontSize:15}}> 销售单</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

            );

        }

        if (route.id === 'sale') {
            return (
                <Sale navigator={navigator} route={route}/>
            );
        }
    }

    render() {
        var renderScene = this.renderSceneAndroid;
        var configureScence = this.configureScenceAndroid;
        return (
            <Navigator
                debugOverlay={false}
                initialRoute={{ title: 'Main', id:'main'}}
                configureScence={{configureScence}}
                renderScene={renderScene} />
        );

    }

    _renderPage(data) {
        return (<Image source={data} style={styles.page}/>);
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    grid_view: {
        flex: 1,
        top: 1,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    page: {
        width: deviceWidth,
        backgroundColor: '#088856',
        height: 270,
    },
    icon_box: {
        width: 50,
        height: 50,
        borderRadius: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "orange"
    }
});

module.exports = TopScreen;
