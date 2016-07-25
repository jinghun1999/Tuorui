'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    Navigator,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    WebView,
    BackAndroid,
    View
    } from 'react-native';
import Head from './app/commonview/Head';
let _navigator;
import Login from './app/page/Login';
import NButton from './app/commonview/NButton';
class MyAccount extends React.Component {

    constructor(props) {
        super(props);
        this._onPressButton = this._onPressButton.bind(this);
    }

    _onPressButton() {
        alert("1111");
        ToastAndroid.show("--oooooooo-", ToastAndroid.SHORT);
        // _navigator.push({title:'Login',id:'login'});
    }

    _onPressButton1() {
        alert("1111");
        ToastAndroid.show("--rrrrrrrr-", ToastAndroid.SHORT);
        // _navigator.push({title:'Login',id:'login'});
    }

    configureScenceAndroid() {
        return Navigator.SceneConfigs.FadeAndroid;
    }
    /**
     *组件将要被加载在视图
     */
    componentWillMount() {

    }
    /**
     *配置跳转路由
     */
    renderSceneAndroid(route, navigator) {
        _navigator = navigator;
        if (route.id === 'main' && false) {
            return (
                <View style={styles.container} onPress={this._onPressButton}>
                    <Head/>
                    <TouchableOpacity style={styles.view} onPress={() => {
                        _navigator.push({title:'Login',id:'login'}); ToastAndroid.show('启动应用', ToastAndroid.SHORT); }}>
                        <View style={styles.view}>
                            <Image source={require('./image/base_health.png')} style={styles.imageIcon}/>
                            <Text style={styles.t0}>登 录</Text>
                            <Image source={require('./image/arrows_right.png')} style={styles.imageArr}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        if (route.id === 'login') {
            return (
                <Login navigator={navigator} route={route}/>
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
    //用了render方法后，组件加载成功并被成功渲染出来以后所执行的hook函数，一般会将网络请求等加载数据的操作，放在这个函数里进行，来保证不会出现UI上的错误
    componentDidMount() {
        var navigator = this._navigator;
        BackAndroid.addEventListener('hardwareBackPress', function() {
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
                return true;
            }
            return false;
        });
    }

    //指父元素对组件的props或state进行了修改
    componentWillReceiveProps() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }
    //一般用于优化，可以返回false或true来控制是否进行渲染
    shouldComponentUpdate() {
        return false;
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
}


const styles = StyleSheet.create({
    container1: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    view: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#F8F8FF',
    },
    line: {
        height: 1,
        alignSelf: 'stretch',
        backgroundColor: '#708090',
    },
    imageIcon: {
        height: 30,
        width: 30,
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    t0: {
        alignSelf: 'center',
        fontSize: 20,
        flex:1,
    },

    imageArr: {
        height: 20,
        width: 20,
        alignSelf: 'center',
        marginLeft: 150,
    },

});

module.exports = MyAccount;