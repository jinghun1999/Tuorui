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
    View
    } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import MyHealth from './MyHealth';
import App from './App';
import BBS  from './BBS';
import UC from './UC';
import Head from './app/commonview/Head';
import HomePage from './HomePage';
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
        //get login info
        /*
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
            }).then(ret => {}).catch(err => {
        });*/
    }

    _renderTabItem(ico, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={35} color={'#b2b2b2'}/></View>}
                title={tag}
                renderSelectedIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={35} color={'#63B8FF'}/></View>}
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
                renderView = <BBS navigator={this._navigator} />;
                break;
            case TAB_APP:
                renderView = <App navigator={this._navigator} />;
                break;
            case TAB_UC:
                renderView = <UC navigator={this._navigator} />;
                break;
            default:
                break;
        }
        return (<View style={styles.container}>{renderView}</View>)
    }

    render() {
        let {tabBarShow} = this.props;
        return (
            <View style={{flex: 1}}>
                <TabNavigator hidesTabTouch={true}
                              sceneStyle={{paddingBottom: 0}}
                              tabBarStyle={tabBarShow ? styles.tabNav : styles.tabNavHide}>
                    {this._renderTabItem('ios-home', TAB_HOMEPAGE, this._createChildView(TAB_HOMEPAGE))}
                    {this._renderTabItem('ios-chatbubbles', TAB_BBS, this._createChildView(TAB_BBS))}
                    {this._renderTabItem('ios-easel', TAB_APP, this._createChildView(TAB_APP))}
                    {this._renderTabItem('ios-person', TAB_UC, this._createChildView(TAB_UC))}
                </TabNavigator>
            </View>
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


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabNav: {
        height: 60,
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
    tab: {
        height: 60,
        backgroundColor: '#303030',
        alignItems: 'center',
    },
    tabIcon: {
        flex:1,
        height: 30,
        //resizeMode: 'stretch',
        marginTop: 0.5
    },

});

module.exports = MainPage;