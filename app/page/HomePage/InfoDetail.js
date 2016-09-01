/**
 * Created by TOMCHOW on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    WebView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    } from 'react-native';
import Head from './../../commonview/Head';
import Global from './../../util/Global';
import Util from './../../util/Util';
import Icon from 'react-native-vector-icons/Ionicons';
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class DrugDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: Global.WEB + '/wx/home#/InfoDetail/' + this.props.requestId,
            loaded: false,
            title: Util.cutString(this.props.title, 24, '...'),
            isCollect: false,
        }
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onCollect() {
        //alert('收藏' + this.props.requestId);
        let _iscollect = this.state.isCollect;
        this.setState({
            isCollect: !_iscollect,
        });
    }

    renderLoad() {
        return (
            <View>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Head title={this.state.title} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{flex:1}}>
                    <WebView ref='webView'
                             style={styles.webView}
                             source={{uri: this.state.url}}
                             startInLoadingState={true}
                             domStorageEnabled={true}
                             renderLoading={this.renderLoad.bind(this)}
                             javaScriptEnabled={true}
                             decelerationRate="normal"
                             automaticallyAdjustContentInsets={false} />
                    <View style={styles.bottomContainer}>
                        <View style={{flex:1, flexDirection:'row', backgroundColor:'#ccc'}}>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-eye'} size={30} color={'#999'} style={{marginRight:5}}/>
                                <Text>123</Text>
                            </View>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-star'} size={30} color={'#999'} style={{marginRight:5}}/>
                                <Text>123</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewCount} onPress={this._onCollect.bind(this)}>
                            <Icon name={'ios-star'} size={40} color={this.state.isCollect? '#993399': '#ccc'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: 'red',
        flex: 1,
        width: Width,
    },
    bottomContainer: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#ccc',
    },
    readInfo: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'center'
    },
    viewCount: {
        width: 80,
        backgroundColor: '#99CCFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    }
})
module.exports = DrugDetails;