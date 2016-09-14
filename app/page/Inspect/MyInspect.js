/**
 * Created by tuorui on 2016/9/6.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    InteractionManager
    } from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import MyHomeIcon from '../../commonview/ComIconView';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/Ionicons';
class MyInspect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loaded: false,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    fetchData() {
        let _this = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = [
            {
                'BillNo': 'A00040',
                'ItemName': '布鲁氏病抗体检测',
                'StyleBook': '血清',
                'State': '已完成',
                'CreatedOn': '2016-01-9',
            },
            {
                'BillNo': 'C00041',
                'ItemName': '苯巴比妥药物浓度',
                'StyleBook': '血清',
                'State': '检测中',
                'CreatedOn': '2016-08-18',
            },
            {
                'BillNo': 'B00050',
                'ItemName': '弓形虫PCR',
                'StyleBook': '血清',
                'State': '检测中',
                'CreatedOn': '2016-09-1',
            },
            {
                'BillNo': 'D00051',
                'ItemName': '犬瘟热病毒PCR',
                'StyleBook': '血清',
                'State': '已接收',
                'CreatedOn': '2016-09-3',
            },
            {
                'BillNo': 'D00052',
                'ItemName': '猫传染性腹膜炎PCR',
                'StyleBook': '血清',
                'State': '已完成',
                'CreatedOn': '2016-07-23',
            }
        ];
        _this.setState({
            dataSource: ds.cloneWithRows(data),
            loaded: true,
        })
    }

    _onRenderRow(Inspect) {
        let stutas = '';
        switch (Inspect.State) {
            case "已接收":
                stutas = (<Text style={[styles.status, {backgroundColor: '#FFB90F',}]}>{Inspect.State}</Text>);
                break;
            case "检测中":
                stutas = (<Text style={[styles.status, {backgroundColor: '#0099CC'}]}>{Inspect.State}</Text>);
                break;
            case "已完成":
                stutas = (<Text style={[styles.status, {backgroundColor: '#8F8F8F'}]}>{Inspect.State}</Text>);
                break;
            default:
                stutas = (<Text style={[styles.status, {backgroundColor: '#FFB90F'}]}>{Inspect.State}</Text>);
                break;
        }
        return (
            <TouchableOpacity style={styles.touchStyle}>
                <View style={{flex:1, marginLeft:15,flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Text style={{fontWeight:'bold', fontSize:16}}>{Inspect.BillNo}</Text>
                        <Text>检测项目: {Inspect.ItemName}</Text>
                        <Text>样本: {Inspect.StyleBook}</Text>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center',marginRight:15}}>
                        {stutas}
                        <Text style={{textAlign:'center'}}>{Inspect.CreatedOn}</Text>
                    </View>
                </View>
                {/*<Icon name={'ios-arrow-forward'} size={15} color={'#666'} />*/}
            </TouchableOpacity>
        )
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.dataSource}
                          renderRow={this._onRenderRow.bind(this)}
                          initialListSize={10}
                          pageSize={10}
                          enableEmptySections={true}
                    />
            )
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true}
                      onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    status: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        width: 90,
        padding: 2,
    },
    touchStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 75,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
});
module.exports = MyInspect;