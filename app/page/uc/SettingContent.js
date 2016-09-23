/**
 * Created by tuorui on 2016/9/23.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    WebView,
} from 'react-native';
import Head from '../../commonview/Head';
import Style from '../../theme/styles';
class SettingContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        var webBody;
        if (this.props.headTitle == '服务条款') {
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#ccc',flex:1,}}
                    source={require('./html/Service.html')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                />)
        }else if(this.props.headTitle == '使用帮助'){
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#ccc',flex:1,}}
                    source={require('./html/Help.html')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                />)
        }else if(this.props.headTitle=='关于我们'){
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#ccc',flex:1,}}
                    source={require('./html/About.html')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                />)
        }else if(this.props.headTitle=='联系我们'){
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#ccc',flex:1,}}
                    source={require('./html/Contact.html')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                />)
        }
        return (
            <View style={Style.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                {webBody}
            </View>
        )
    }
}
module.exports = SettingContent;