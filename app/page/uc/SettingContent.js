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
    InteractionManager
    } from 'react-native';
import Head from '../../commonview/Head';
import Style from '../../theme/styles';
import Loading from '../../commonview/Loading';
class SettingContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loaded: false,
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            let name = '';
            switch (this.props.headTitle) {
                case '服务条款':
                    name = 'Service';
                    break;
                case '使用帮助':
                    name = 'Help';
                    break;
                case '关于我们':
                    name = 'About';
                    break;
                case '联系我们':
                    name = 'Contact';
                    break;
            }
            this.setState({
                url: CONSTAPI.WEB + '/static/app/' + name + '.html',
                loaded: true,
            });
        });
    }

    componentWillUnmount() {

    }

    render() {
        var webBody;
        if (!this.state.loaded) {
            webBody = (
                <Loading type={'text'}/>
            )
        }
        else {
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#e7e7e7',flex:1,}}
                    source={{uri: this.state.url}}
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