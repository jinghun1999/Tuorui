/**
 * Created by tuorui on 2016/8/31.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    Image,
    ListView,
    ScrollView,
} from 'react-native';
import Head from '../../commonview/Head';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class ChooseVaccineInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            vaccineDataSource:'',
            loaded:false,
            value:null,
        }
    }
    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._fetchData();
            }, 500
        )
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    _fetchData(){
        var _this = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = {
            'data': [
                {'id': 1, 'name': '金犬五联', 'unit': '瓶', 'price': 15,'batchNumber':'20160831001','validityDate':'20180830'},
                {'id': 2, 'name': '抗病毒1号', 'unit': '瓶', 'price': 50,'batchNumber':'20160831002','validityDate':'20180830'},
                {'id': 3, 'name': '抗病毒2号', 'unit': '瓶', 'price': 100,'batchNumber':'20160831003','validityDate':'20180830'},
                {'id': 4, 'name': '抗病毒5号', 'unit': '瓶', 'price': 200,'batchNumber':'20160831004','validityDate':'20180830'},
            ]
        };
        _this.setState({
            vaccineDataSource:ds.cloneWithRows(data.data),
            loaded: true,
        })
    }
    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    search(txt){
        this.setState({
            value: txt,
            loaded: false,
        });
        this._fetchData();
    }
    pressRow(vaccine){
        if (this.props.getResult) {
            this.props.getResult(vaccine);
        }
        this._onBack();
    }
    _renderVaccine(vaccine){
        return(
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(vaccine)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>名称: {vaccine.name}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>编号: {vaccine.id}</Text>
                        <Text style={{flex: 1,}}>单位: {vaccine.unit}</Text>
                        <Text style={{flex: 1,}}>单价: {vaccine.price}</Text>
                        <Text style={{flex: 1,}}>批号: {vaccine.batchNumber}</Text>
                        <Text style={{flex: 1,}}>有效期: {vaccine.validityDate}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        var body;
        if (!this.state.loaded) {
            body = (
                <View style={styles.loadingBox}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            )
        } else {
            body = (
                <ListView dataSource={this.state.vaccineDataSource} enableEmptySections={true}
                          renderRow={this._renderVaccine.bind(this)}/>
            )
        }
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.searchRow}>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="always"
                            onChangeText={this.search.bind(this)}
                            placeholder="输入疫苗名称..."
                            value={this.state.value}
                            style={styles.searchTextInput}
                        />
                    </View>
                    {body}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchRow: {
        backgroundColor: '#eeeeee',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchTextInput: {
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },
})
module.exports = ChooseVaccineInfo;