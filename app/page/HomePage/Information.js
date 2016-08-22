/**
 * Created by tuorui on 2016/8/19.
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
} from 'react-native';
import Head from './../../commonview/Head';
import SearchBar from './../../commonview/SearchBar';
import IconView from 'react-native-vector-icons/MaterialIcons';
var infoPath = 'http://192.168.1.105:8088/api/AppInfo/GetInformationByName';
class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 20,
            listInfoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            total: 0,
            totalPage: 0,
            infoSearchTextInput: '',
            infoCache: [],
        }
    }

    componentDidMount() {
        this._fetchData(this.state.infoSearchTextInput,this.state.pageIndex, this.state.pageSize);
    }

    componentWillReceiveProps() {
        //alert(this.state.store);
    }

    //返回方法
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _Search() {
        let _this = this;
        let searchName = _this.state.infoSearchTextInput;
        _this.state.infoCache = [];
        this._fetchData(searchName,1,this.state.pageSize);
    }

    _fetchData(infoName, pageIndex, pageSize) {
        let _this = this;
        let fetchPath = infoPath + '?infoName=' + infoName + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize;
        fetch(fetchPath)
            .then((response)=>response.text())
            .then((responseData)=> {
                let dt = JSON.parse(responseData);
                let _dataCache = _this.state.infoCache;
                let _data = dt.Data.rows;
                _data.forEach((_data)=> {
                    _dataCache.push(_data);
                })
                if (dt.Status) {
                    _this.setState({
                        total: dt.total,
                        totalPage: dt.TotalPage,
                        infoCache: _dataCache,
                        pageSize:dt.Data.Pager.PageSize,
                        pageIndex:dt.Data.Pager.PageIndex,
                    })
                }
            })
            .done();
    }

    _ClickPress(info) {
        let id = info.RequestID;
        alert(id);
    }

    _renderInfo(info) {
        return (
            <TouchableOpacity style={{height:50,overflow:'hidden'}} onPress={()=>this._ClickPress(info)}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <IconView name={'local-post-office'} size={20} color={'#ADD8E6'}
                              style={{marginLeft:10,justifyContent:'center',alignSelf:'center'}}/>
                    {/*<Image resource={Info.ImagePath}/>*/}
                    <Text
                        style={{flex:1,marginLeft:10,justifyContent:'center',alignSelf:'center'}}>{info.InfoTitle}</Text>
                    <IconView name={'chevron-right'} size={20} color={'#888'}
                              style={{justifyContent:'center',alignSelf:'center'}}/>
                </View>
            </TouchableOpacity>
        )
    }

    _onEndReached() {
        let _this = this;
        let _pageIndex = _this.state.pageIndex + 1;
        let _infoInput = _this.state.infoSearchTextInput;
        _this._fetchData(_infoInput, _this.state.pageSize, _pageIndex);
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <SearchBar onChangeText={(text)=>{
                                        this.setState({
                                        infoSearchTextInput:text});
                                        }}
                           placeholder="search"
                           keyboardType='default'
                           onPress={this._Search.bind(this)}/>
                <ListView dataSource={this.state.listInfoSource.cloneWithRows(this.state.infoCache)}
                          renderRow={this._renderInfo.bind(this)}
                          onEndReached={this._onEndReached.bind(this)}
                          initialListSize={this.state.total}
                          pageSize={this.state.total}
                          enableEmptySections={true}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listViewStyle: {
        flexDirection: 'row',
    },

});
module.exports = Information;