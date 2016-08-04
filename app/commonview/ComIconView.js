/**
 * Created by tuorui on 2016/7/27.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OtherIcon from 'react-native-vector-icons/MaterialIcons';
class ComIconView extends React.Component {
    render(){
        return(
            <TouchableOpacity style={{flex:1,flexDirection:'row'}} onPress={this.props.onPress}>
                <View style={styles.ViewBorder}>
                    <View style={[{backgroundColor:this.props.IconColor},styles.IconStyle]}>
                        <OtherIcon name={this.props.icon} size={30} color={this.props.color}  />
                    </View>
                    <Text style={styles.TextStyle}>{this.props.text}</Text>
                    <View style={styles.IconRightOuter}>
                        <Icon name={'ios-arrow-forward'} size={25} color={'black'} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    ViewBorder:{
        flex:1,
        flexDirection:'row',
        height:60,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ddd',
    },
    IconStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
        marginTop:8,
        width: 45,
        height: 45,
        borderRadius: 25,
    },
    TextStyle:{
        flex:1,
        alignSelf: 'center',
        marginLeft:20,
        fontSize:20,
        color:'#666',
    },
    IconRightOuter:{
        backgroundColor: 'white',
        justifyContent:'center',
        alignSelf:'center',
        width:25,
        height:25,
        marginRight:10,
    },
})
module.exports = ComIconView;