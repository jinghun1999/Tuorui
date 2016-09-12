/**
 * Created by tuorui on 2016/7/29.
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
    //Dimensions,
    } from 'react-native';
import Head from './../../commonview/Head'
//var Width=Dimensions.get('window').width;
//var Height=Dimensions.get('window').height;
//import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Loading from './../../commonview/Loading';

class DrugDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            loaded: true,
        }
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    renderLoad() {
        return (
            <Loading type={'text'}/>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{flex: 1}}>
                    <WebView ref='webView'
                             style={styles.webView}
                             source={{uri: this.state.url}}
                             startInLoadingState={true}
                             domStorageEnabled={true}
                             renderLoading={this.renderLoad.bind(this)}
                             javaScriptEnabled={true}
                             decelerationRate="normal"
                             automaticallyAdjustContentInsets={false}
                        />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    TextStyle: {},
    webView: {
        backgroundColor: '#ccc',
        flex: 1,
        //width: Width,
        //height: Height,
    }
})
module.exports = DrugDetails;