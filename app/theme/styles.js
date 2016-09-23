/**
 * Created by User on 2016-09-19.
 */
import { StyleSheet, } from 'react-native';
import theme from './theme';
let style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#e7e7e7'
    },
    rowBox:{
        backgroundColor:'#fff',
        flexDirection:'row',
        padding:10,
        alignItems:'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    titleText: {
        //fontWeight: 'bold',
        flex:1,
        fontSize:18
    },
    rowRight: {
    },
});
export default style;