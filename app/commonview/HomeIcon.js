/**
 * Created by tuorui on 2016/8/3.
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
class HomeIcon extends React.Component {
    render(){
        return(
            <TouchableOpacity style={styles.grid_view} onPress={this.props.onPress}>
                <View style={[styles.iconOuter, {backgroundColor:this.props.iconColor}]}>
                    <Icon name={this.props.iconName} size={40} color={'white'}/>
                </View>
                <View style={styles.iconText}>
                    <Text style={{fontSize:15}}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({
   grid_view:{
       flex: 1,
       top: 1,
       alignItems: 'center',
       justifyContent: 'center',
       height: 80,
   },
    iconOuter:{
        backgroundColor: "orange",
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    iconText:{
        width: 80,
        alignItems: 'center',
    }
});
module.exports=HomeIcon;