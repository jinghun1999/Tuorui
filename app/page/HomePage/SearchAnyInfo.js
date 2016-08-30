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
            searchTextInput:'',
        }
    }
    _onSearchPress(){
        let _this=this;
        alert(_this.state.searchTextInput);
    }
    _onBack() {
        let _this=this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <SearchBar placeholder="search"
                           onChangeText={(text)=>{this.setState({searchTextInput:text})}}
                           keyboardType={'default'}
                           onBack ={this._onBack.bind(this)}
                           onPress={this._onSearchPress.bind(this)}
                />
                <ScrollableTabView style={{marginTop: 5, }} renderTabBar={() => <DefaultTabBar />}>
                    <View tabLabel='资讯'>
                        <Text>老实了老师锻炼腹肌锻炼法</Text>
                    </View>
                </ScrollableTabView>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    }
})
module.exports = SearchAnyInfo;