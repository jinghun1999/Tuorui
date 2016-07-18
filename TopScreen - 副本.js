'use strict';

//var React = require('react-native');
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    Image,
    } from 'react-native';

import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/FontAwesome';
var deviceWidth = Dimensions.get('window').width;

let IMGS = [
    require('./image/job1.jpg'),
    require('./image/job2.jpg'),
    require('./image/job3.jpg'),
];
import Head from './Head';
var sale = require('./Sale');
class TopScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
        };
    }
    _onPressButton1() {
        //alert("销售单");
        ToastAndroid.show("---销售单", ToastAndroid.SHORT);
        //const navigator = this.props.navigator;
    }

    _onPressButton2() {
        alert("健康道场");
        ToastAndroid.show("健康道场", ToastAndroid.SHORT);
    }

    _onPressButton3() {
        alert("健康小伙伴");
        ToastAndroid.show("健康小伙伴", ToastAndroid.SHORT);
    }
    _renderScene(route, navigator) {
        var routeId = route.id;
        if(routeId =='Sale'){
            return (<Sale navigator={navigator}/>);
        }
        if(routeId=='TopScreen'){
            return (<TopScreen navigator{navigator} />);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Head/>

                <ViewPager
                    style={this.props.style}
                    renderPage={this._renderPage}
                    dataSource={this.state.dataSource}
                    isLoop={true}
                    autoPlay={true}/>
                <View style={{flex: 1, flexDirection:'row', height:80,}}>
                    <Navigator
                        initialRoute={{ id:'TopScreen', name: 'TopScreen', component: TopScreen }}
                        renderScene={ (route, navigator) => this._renderScene(route, navigator) }
                    />
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton1.bind(this)}>
                        <View>
                            <Text style={styles.icon_box}>
                                <Icon name={'list'} size={50} color={'white'} />
                            </Text>
                            <Text style={{fontSize:15}}>
                                销售单
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton2}>
                        <View>
                            <Image source={require('./image/base_health.png')} style={{width:50,height:50}}/>
                            <Text style={{fontSize:15}}>
                                健康道场
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.grid_view} onPress={this._onPressButton3}>
                        <View>
                            <Image source={require('./image/base_health.png')} style={{width:50,height:50}}/>
                            <Text style={{fontSize:15}}>
                                健康小伙伴
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
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
        width:50,
        height:50,
        borderRadius:5,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"orange"
    }
});

module.exports = TopScreen;
