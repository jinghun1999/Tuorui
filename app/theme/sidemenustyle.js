/**
 * Created by tuorui on 2016/11/9.
 */
import { StyleSheet,Dimensions } from 'react-native';
import theme from './theme';
const width=Dimensions.get('window').width;
let Sidemenustyle = StyleSheet.create({
    menu: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#FCFCFC',
    },
    item: {
        fontSize: 14,
        margin: 5,
    },
    searchView: {
        marginTop:5,
        paddingBottom: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    payContentView: {
        flex: 1,
        padding: 5,
        margin: 5,
        height:40,
        borderRadius:10,
        justifyContent:'center',
    },
    bottomContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buttonView: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    searchKey:{
        flex:1,
        margin:10,
        padding:5,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#ccc',
    },
    datePic:{
        width:(width/2)-100,
    },
    datePickerView:{
        flexDirection:'row',
        alignItems:'center',
        margin:5,
    },
    text:{
        textAlign:'center'
    },
    payView:{flexDirection:'row',alignItems:'center',},
})
export default Sidemenustyle;