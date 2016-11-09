/**
 * Created by tuorui on 2016/11/9.
 */
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class SearchTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.searchSize}>当前筛选：{this.props.selectedItem}</Text>
                <TouchableOpacity
                    onPress={this.props.onPress}
                    style={styles.iconStyle}>
                    <Text>筛选条件</Text>
                    <Icon name={'filter'} size={20} color={'#ccc'}/>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{flexDirection:'row',margin:5},
    searchSize:{flex:4,},
    iconStyle:{flex:1,flexDirection:'row',justifyContent:'flex-end',},
})
module.exports = SearchTitle;