'use strict';

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
    } from 'react-native';
import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/FontAwesome';
import GoodsAdd from './app/commonview/AddGood';
import Head from './app/commonview/Head';
import Sale from './Sale';
var deviceWidth = Dimensions.get('window').width;

let IMGS = [
    require('./image/job1.jpg'),
    require('./image/job2.jpg'),
    require('./image/job3.jpg'),
];

class TopScreen extends Component {
    render() {
        var defaultName = 'TopScreenMain';
        var defaultComponent = TopScreenMain;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}
                configureScene={(route) => {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }
                }
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator} />
                }}/>
        );
    }
}

/****************MainTopSceen*****************/
class TopScreenMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
        };
    }

    _onPressButton1() {
        const { navigator } = this.props;
        var _me = this;
        if (navigator) {
            navigator.push({
                name: 'Sale',
                component: Sale,
                params: {
                    id: _me.state.id,
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
    componentWillReceiveProps(){
        //alert(this.state.store);
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title='首页'/>
                {/*<ViewPager
                    style={{height:150}}
                    renderPage={this._renderViewPage}
                    dataSource={this.state.dataSource}
                    isLoop={true}
                    autoPlay={true}/>*/}
                <View style={{flex: 1, flexDirection:'row', height:80,}}>
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton1.bind(this)}>
                        <View>
                            <View style={[styles.iconouter, {backgroundColor:'#C67171'}]}>
                                <Text style={styles.icon_box}>
                                    <Icon name={'shopping-cart'} size={40} color={'white'}/>
                                </Text>
                            </View>
                            <View style={styles.icontext}>
                                <Text style={{fontSize:15}}>
                                    商品销售
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton2}>
                        <View>
                            <View style={[styles.iconouter, {backgroundColor:'#CD8500'}]}>
                                <Text style={styles.icon_box}>
                                    <Icon name={'cube'} size={40} color={'white'}/>
                                </Text>
                            </View>
                            <View style={styles.icontext}>
                                <Text style={{fontSize:15}}>
                                    XXX
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton2}>
                        <View>
                            <View style={[styles.iconouter, {backgroundColor:'#9A32CD'}]}>
                                <Text style={styles.icon_box}>
                                    <Icon name={'cube'} size={40} color={'white'}/>
                                </Text>
                            </View>
                            <View style={styles.icontext}>
                                <Text style={{fontSize:15}}>
                                    XXX
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
        justifyContent: 'center'
    },
    page: {
        width: deviceWidth,
        backgroundColor: '#088856',
        height: 270,
    },
    iconouter: {
        backgroundColor: "orange",
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
        borderRadius: 25,
    },
    icontext: {
        width: 100,
        alignItems: 'center',
    }
});

module.exports = TopScreen;