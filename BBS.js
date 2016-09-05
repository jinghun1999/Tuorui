/*tom Created at 20160902*/

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    WebView,
    View,
    Text,
    } from 'react-native';
import NetUtil from './app/util/NetUtil';
import Head from './app/commonview/Head';

//import ScrollableTabView  from 'react-native-scrollable-tab-view';

class BBS extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Head title="健康社区"/>
                {/*<ScrollableTabView>
                 <WebView tabLabel="个人体重"
                 style={styles.webView_style}
                 source={{uri: NetUtil.url_healthmonitnorm("IA-003")}}
                 startInLoadingState={true}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}>
                 </WebView>
                 <WebView tabLabel="腰围尺寸"
                 style={styles.webView_style}
                 source={{uri: NetUtil.url_healthmonitnorm("IA-006")}}
                 startInLoadingState={true}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}>
                 </WebView>
                 <WebView tabLabel="BIM指数"
                 style={styles.webView_style}
                 source={{uri: NetUtil.url_healthmonitnorm("IA-005")}}
                 startInLoadingState={true}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}>
                 </WebView>
                 <WebView tabLabel="血压值"
                 style={styles.webView_style}
                 source={{uri: NetUtil.url_healthmonitnorm("IA-012")}}
                 startInLoadingState={true}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}>
                 </WebView>
                 <WebView tabLabel="心跳频率"
                 style={styles.webView_style}
                 source={{uri: NetUtil.url_healthmonitnorm("IA-000")}}
                 startInLoadingState={true}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}>
                 </WebView>
                 </ScrollableTabView>*/}
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text>功能开发中...</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    webView_style: {

    },
});
module.exports = BBS;
