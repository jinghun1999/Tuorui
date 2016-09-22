/**
 *MainPage
 * @author: TOM CHOW
 * @date：2016-07-15
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    Navigator,
    TouchableOpacity,
    ToastAndroid,
    WebView,
    BackAndroid,
    View,
    } from 'react-native';
import Head from './app/commonview/Head';
import HomePage from './HomePage';
import BBS  from './BBS';
import App from './App';
import UC from './UC';
import BackAndroidTool from './app/util/BackAndroidTool';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons';
const TAB_HOMEPAGE = '首页';
const TAB_KNOWLEDGE = '知识库';
const TAB_BBS = '健康社区';
const TAB_APP = '应用服务';
const TAB_UC = '我的';
var _navigator;
class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: TAB_HOMEPAGE,
            tabBarShow: true
        };
        this._renderTabItem = this._renderTabItem.bind(this);
        this._navigator = this.props.navigator;
    }
    componentDidMount(){
        // 添加返回键监听
        BackAndroidTool.addBackAndroidListener(this.props.navigator);
    }

    componentWillUnmount(){
        // 移除返回键监听
        BackAndroidTool.removeBackAndroidListener();
    }
    /*
    componentDidMount() {
        var nav = this._navigator;
        BackAndroid.addEventListener('hardwareBackPress', function () {
            if (nav && nav.getCurrentRoutes().length > 1) {
                nav.pop();
                return true;
            }
            //return false;
            // 当前页面为root页面时的处理
            if (this.lastBackPressed && (this.lastBackPressed + 2000 >= Date.now())) {
                //最近2秒内按过back键，可以退出应用。
                NativeCommonTools.onBackPressed();
                if (nav && nav.getCurrentRoutes().length > 1) {
                    nav.pop();
                    return true;
                }
                return true;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        });
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }
*/
    _renderTabItem(ico, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#b2b2b2'}/></View>}
                title={tag}
                renderSelectedIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#63B8FF'}/></View>}
                onPress={() => this.setState({ selectedTab: tag })}>
                {childView}
            </TabNavigator.Item>
        );
    }

    _createChildView(tag) {
        let renderView;
        switch (tag) {
            case TAB_HOMEPAGE:
                renderView = <HomePage navigator={this._navigator}/>;
                break;
            case TAB_BBS:
                renderView = <BBS navigator={this._navigator}/>;
                break;
            case TAB_APP:
                renderView = <App navigator={this._navigator}/>;
                break;
            case TAB_UC:
                renderView = <UC navigator={this._navigator}/>;
                break;
            default:
                break;
        }
        return (<View style={styles.container}>{renderView}</View>)
    }

    render() {
        let { tabBarShow } = this.props;
        return (
            <View style={{flex: 1}}>
                <TabNavigator hidesTabTouch={true}
                              sceneStyle={{paddingBottom: 0}}
                              tabBarStyle={tabBarShow ? styles.tabNav : styles.tabNavHide}>
                    {this._renderTabItem('ios-home', TAB_HOMEPAGE, this._createChildView(TAB_HOMEPAGE))}
                    {this._renderTabItem('ios-chatbubbles', TAB_BBS, this._createChildView(TAB_BBS))}
                    {this._renderTabItem('ios-laptop', TAB_APP, this._createChildView(TAB_APP))}
                    {this._renderTabItem('ios-person', TAB_UC, this._createChildView(TAB_UC))}
                </TabNavigator>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabNav: {
        height: 45,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E8E8E8'
    },
    tabNavHide: {
        //隐藏底部导航
        position: 'absolute',
        top: Dimensions.get('window').height,
        height: 0,
        overflow: 'hidden'
    },

    tabIcon: {
        flex: 1,
        height: 25,
        alignItems: 'center',
        //resizeMode: 'stretch',
        marginTop: 0.5
    },

});

module.exports = MainPage;