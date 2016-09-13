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
import Icon from 'react-native-vector-icons/Ionicons';
//import ScrollableTabView  from 'react-native-scrollable-tab-view';

class BBS extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Head title="社区首页"/>
                <View style={styles.noResult}>
                    <Icon name={'ios-people'} size={85} color={'#CC9933'}/>
                    <Text style={{color:'#FF6600'}}>社区暂未开放，敬请期待</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    noResult: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFCC',
        height: 50,
    },
});
module.exports = BBS;
