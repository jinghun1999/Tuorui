/**
 * Created by tuorui on 2016/8/23.
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
    TouchableOpacity,
    TextInput,
    } from 'react-native';
import SearchBar from './../../commonview/SearchBar';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
class SearchAnyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kw: '',
        }
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onSearchPress() {
        let _this = this;
        alert(_this.state.kw);
    }

    render() {
        return (
            <View style={styles.container}>
                <SearchBar placeholder="请输入关键字"
                           onChangeText={(text)=>{this.setState({kw:text})}}
                           keyboardType={'default'}
                           onBack={this._onBack.bind(this)}
                           onPress={this._onSearchPress.bind(this)}
                    />
                <View style={{flexDirection:'row'}}>
                    <View style={styles.noResult}>
                        <Text>没有符合条件的查询结果</Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    noResult: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFCC',
        margin: 10,
        height: 50,
        padding: 20,
    },
})
module.exports = SearchAnyInfo;