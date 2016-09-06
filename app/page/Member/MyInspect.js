/**
 * Created by tuorui on 2016/9/6.
 */
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
import Icon from 'react-native-vector-icons/Ionicons';
class MyInspect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:null,
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
            }
            ,
            {
                'BillNo': 'C00041',
                'ItemName': '苯巴比妥药物浓度',
                'StyleBook': '血清',
                'State': '检测中',
                'CreatedOn': '2016-08-18',
            }
            ,
            {
                'BillNo': 'B00050',
                'ItemName': '弓形虫PCR',
                'StyleBook': '血清',
                'State': '检测中',
                'CreatedOn': '2016-09-1',
            }
            ,
            {
                'BillNo': 'D00050',
                'ItemName': '犬瘟热病毒PCR',
                'StyleBook': '血清',
                'State': '已接收',
                'CreatedOn': '2016-09-3',
            }
            ,
            {
                'BillNo': 'D00051',
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
        return (
            <TouchableOpacity style={styles.touchStyle}>
                <View style={{flex:1, marginLeft:15,flexDirection:'row'}}>
                    <View style={{flex:1,flexDirection:'column'}}>
                        <Text style={{fontWeight:'bold', fontSize:16, marginRight:10}}>{Inspect.BillNo}</Text>
                        <Text>检测项目: {Inspect.ItemName}</Text>
                        <Text>样本: {Inspect.StyleBook}</Text>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={{fontWeight:'bold', fontSize:16,color:'#FFFFFF',backgroundColor:'#FFB90F',alignItems: ''}}>{Inspect.State}</Text>
                        <Text>{Inspect.CreatedOn}</Text>
                    </View>
                </View>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'}/>
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
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit="新增"
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
    touchStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
});
module.exports = MyInspect;