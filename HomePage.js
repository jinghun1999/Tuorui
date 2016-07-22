/**
 * Created by User on 2016-07-18.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
    ToastAndroid,
    ViewPagerAndroid,
    BackAndroid,
    Image,
    View
    } from 'react-native';
var _navigator;
var MainPage = require('./MainPage');
import NButton from './app/commonview/NButton';
class HomePage extends Component {
    configureScenceAndroid() {
        return Navigator.SceneConfigs.FadeAndroid;
    }
    renderSceneAndroid(route, navigator) {
        _navigator = navigator;
        if (route.id === 'main') {
            return (
                <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
                    <View style={styles.pageStyle}>
                        <Image source={require('./image/guide1.png')} style={styles.image}/>
                    </View>
                    <View style={styles.pageStyle}>
                        <Image source={require('./image/guide2.png')} style={styles.image}/>
                    </View>
                    <View style={styles.pageStyle}>
                        <Image source={require('./image/guide3.png')} style={styles.image}>
                            <NButton onPress={() => {
                                    _navigator.push({title:'MainPage',id:'page'});
                                    ToastAndroid.show('欢迎使用拓瑞宠物医生', ToastAndroid.SHORT);
                                }} text="立即使用" style={styles.button1}/>
                        </Image>
                    </View>
                </ViewPagerAndroid>
            );
        }
        if (route.id === 'page') {
            return (
                <MainPage navigator={navigator} route={route}/>
            );
        }
    }

    render() {
        var renderScene = this.renderSceneAndroid;
        var configureScence = this.configureScenceAndroid;
        return (
            <Navigator debugOverlay={false} initialRoute={{ title: 'Main', id:'main'}}
                       configureScence={{configureScence}} renderScene={renderScene}/>
        );
    }

    componentWillReceiveProps() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }

    shouldComponentUpdate() {
        return true;
    }
}

var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    pageStyle: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        position: 'relative',
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
        width: width,
        height: height,
    },
    button1: {
        width: 200,
        alignSelf: 'flex-start',
        flexDirection: 'row',

    },
    messageText: {
        fontSize: 27,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CDCDCD',
        alignSelf: 'center',
    },
});

module.exports = HomePage;