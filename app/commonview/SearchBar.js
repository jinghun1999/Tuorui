/**
 * Created by tuorui on 2016/8/19.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput value={this.props.value}
                           onChangeText={this.props.onChangeText}
                           keyboardType={this.props.keyboardType}
                           placeholder={this.props.value}
                           style={styles.textInputStyle}/>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onPress}>
                    <Icon name={'ios-search-outline'} color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        height:40,
    },
    textInputStyle: {
        flex:1,
    },
    buttonStyle:{
        height:30,
        width:30,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:'#87CEFA'
    },

})
module.exports = SearchBar;