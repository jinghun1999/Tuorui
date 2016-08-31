/**
 * Created by tuorui on 2016/8/31.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
} from 'react-native';
import Head from '../../commonview/Head';
class VaccineInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    _onBack(){
        let _this=this;
        const {navigator}=_this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={styles.petViewStyle}>
                    <View style={styles.titleStyle}>
                        <Text style={{color:'#fff',marginLeft:10,}}>宠物信息</Text>
                    </View>
                    <View>
                        <Text></Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles= StyleSheet.create({
    container:{},
    petViewStyle:{
        flex:1,
        flexDirection:'row',
    },
    titleStyle:{
        margin:5,
        flexDirection:'row',
        backgroundColor:'#ccc',
    },
})
module.exports=VaccineInfo;