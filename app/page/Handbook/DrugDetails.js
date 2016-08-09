/**
 * Created by tuorui on 2016/7/29.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    WebView,
} from 'react-native';
import Head from './../../commonview/Head'
var WEBVIEW_REF;
class DrugDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            url:null,
        }
    }
    _onBack(){
        var _this=this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render(){
        return(
            <View>
                <Head title={this.props.headTitle}  canBack={true} onPress={this._onBack.bind(this)}/>
                <View>
                    {/*<WebView ref={WEBVIEW_REF}
                             automaticallyAdjustContentInsets={false}
                             style={styles.webView}
                             source={{uri: this.state.url}}
                             javaScriptEnabled={true}
                             domStorageEnabled={true}
                             decelerationRate="normal"
                             onNavigationStateChange={this.onNavigationStateChange}
                             onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                             startInLoadingState={true}
                             scalesPageToFit={this.state.scalesPageToFit}
                    />*/}
                    <Text>{this.props.id}</Text>
                </View>
            </View>
        )
    }

}

const styles= StyleSheet.create({
    TextStyle:{

    }
})
module.exports=DrugDetails;