/**
 * Created by tuorui on 2016/8/1.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    WebView,
    Image,
    View,
} from 'react-native';
import NetUtil from './../util/NetUtil';
class ComWebView extends React.Component {
    render(){
        return(
            <TouchableOpacity style = {styles.container}>
                <Text style={styles.TextStyle}>{this.props.text}</Text>
                <WebView tabLabel={this.props.title}
                         style={styles.webview_style}
                         source={{uri: NetUtil.url_healthmonitnorm("IA-003")}}
                         startInLoadingState={true}
                         domStorageEnabled={true}
                         javaScriptEnabled={true} />
            </TouchableOpacity>
        )
    }
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    TextStyle:{
        fontSize:20,
        height:30,
        marginLeft:30,
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
    },
    webview_style:{
        flex:1,
        height:20,
        borderBottomColor:'#666',
        borderBottomWidth:StyleSheet.hairlineWidth,
    }
});
module.exports=ComWebView;