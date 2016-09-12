/**
 * Created by tuorui on 2016/9/9.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ListView,
    ScrollView,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
class AddPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            kw: '',
            pageIndex:1,
            pageSize:15,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }
    _onBack(){
        let _this =this;
        const {navigator} = _this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>

            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{flex:1,}
})
module .exports=AddPet;