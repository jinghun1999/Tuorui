/**
 * Created by User on 2016-09-24.
 */
import { StyleSheet, } from 'react-native';
import theme from './theme';
let AppStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    groupTitle: {
        flexDirection:'row',
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
    },
    groupText: {
        flex:1,
        color: '#CC0033'
    },
    inputViewStyle: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    titleText: {
        width: 100,
        fontSize: 16,
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    rowVal: {
        flex: 1,
        color: 'black',
    },
    input: {
        flex: 1,
        height: 30,
        margin: 0,
        padding: 0,
        borderWidth: 0,
    },

    /*MemberDetail*/
    mpName: {
        flex: 1,
        color: '#27408B',
        fontWeight: 'bold',
    },
    smallBtn: {
        alignItems: 'center',
    },
});
export default AppStyle;