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
import HealthTools from './HealthTools';
import HealthSQ  from './HealthSQ';
import MyAccount  from './MyAccount';

//import Login from './app/page/Login';
import Global from './app/util/Global';
import Util from './app/util/Util';
import NetUitl from './app/net/NetUitl';
import Head from './app/commonview/Head';
import TopScreen from './TopScreen';
//import NButton from './app/commonview/NButton';
import Icon from 'react-native-vector-icons/Ionicons';

const MY_HEALTH = '首页';
const MY_HEALTH_CONSULT = '知识库';
const MY_HEALTH_COMMUNITY = '健康社区';
const MY_HEALTH_TOOLS = '应用服务';
const MY_HEALTH_ACCOUNT = '我的';
var _navigator;
class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: MY_HEALTH,
            tabBarShow: true
        };
        this._renderTabItem = this._renderTabItem.bind(this);
        this._navigator = this.props.navigator;
        //get login info
        storage.load({
            key: 'loginState',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
        }).catch(err => {
        })
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
            //case MY_HEALTH_CONSULT:
            //    renderView = <TopScreen navigator={this._navigator}/>;
            //    break;
            case MY_HEALTH:
                //renderView = <MyHealth navigator={this._navigator} />;
                renderView = <TopScreen navigator={this._navigator}/>;
                break;
            case MY_HEALTH_TOOLS:
                renderView = <HealthTools navigator={this._navigator} />;
                break;
            case MY_HEALTH_COMMUNITY:
                renderView = <HealthSQ />;
                break;
            case MY_HEALTH_ACCOUNT:
                renderView = <MyAccount />;
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
                    {this._renderTabItem('ios-home', MY_HEALTH, this._createChildView(MY_HEALTH))}
                    {this._renderTabItem('ios-film', MY_HEALTH_COMMUNITY, this._createChildView(MY_HEALTH_COMMUNITY))}
                    {this._renderTabItem('ios-color-fill', MY_HEALTH_TOOLS, this._createChildView(MY_HEALTH_TOOLS))}
                    {this._renderTabItem('ios-person', MY_HEALTH_ACCOUNT, this._createChildView(MY_HEALTH_ACCOUNT))}
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