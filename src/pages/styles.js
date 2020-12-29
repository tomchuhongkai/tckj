import { StyleSheet, PixelRatio, Platform } from 'react-native';
import { scaleSizeW } from '../tools/util';
var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

var styles = StyleSheet.create({
    commonflex: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    flexleft: {
        justifyContent: "flex-start"
    },
    flexright: {
        justifyContent: "flex-end"
    },
    flexbetween: { justifyContent: 'space-between' },
    pagepadding: {
        padding: 10
    },
    welcome: { flex: 1, fontSize: 16, marginLeft: 10, marginTop: 20 },
    avatar: {
        width: 0.18 * width,
        height: 0.24 * width,
        borderRadius: 8
    },
    stars: {
        marginTop: 4,
    },
    info: {
        marginTop: 16
    },
    info2: {
        marginTop: 8
    },
    //message
    mails: { width: 0.3 * width, position: 'relative', alignItems: 'center' },
    mail: { width: 0.28 * width, height: 0.28 * width },
    msgnoti: { position: 'absolute', top: 20, right: 0, backgroundColor: '#ff0000', width: 20, height: 20, alignItems: 'center', borderRadius: 10 },
    msgnum: { color: '#fff' },
    msgitem: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, paddingTop: 10 },
    itemscenter: { alignItems: 'center' },
    msgtitle: { flex: 1, textAlign: 'left', paddingLeft: 20 },
    boxwrap: { marginTop: 25, marginBottom: 25, justifyContent: "space-between" },
    //setting
    psdwrap: {
        flexDirection: "row", alignItems: "center"
    },
    customerlist: {
        padding: 10,
    },
    listitem: { borderBottomWidth: 1, borderBottomColor: '#dedede', marginTop: 20 },
    listitem2: { borderBottomWidth: 1, borderBottomColor: '#dedede' },
    listitem3: {
        flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: "center", justifyContent: "space-between", marginBottom: 15,
        borderColor: "#dedede", borderWidth: 1, padding: 10
    },
    itemleft: {
        alignItems: "center", justifyContent: "center"

    },
    itemright: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1, marginLeft: 10,
        padding: 10
    },
    itemcontent: {
        flex: 1,
        marginLeft: 10,
        padding: 10
    },
    email: {
        width: 26, height: 26, marginTop: 4
    },
    tabCur: {
        borderBottomWidth: 1, borderBottomColor: "#34495e"
    },
    tabText: {
        color: "#34495e"
    },
 
    flexbetween: { justifyContent: 'space-between' },
    txt1: { color: '#000', fontWeight: 'bold', fontSize: 14, alignSelf: 'center' },
    txt1_white: { color: '#fff', fontWeight: 'bold', fontSize: 14, alignSelf: 'center' },
    txt1_red: { color: '#fff' },
    footer: { flex: 1, justifyContent: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    footerColor: { color: '#bfbfbf' },
    footertxt: { flex: 1, marginTop: 10, marginBottom: 10 },
    msgdetail: { paddingTop: 10, paddingBottom: 10 },
    msgtime: { fontSize: 12, color: '#bbb', marginBottom: 10 },
    bluemsg: { backgroundColor: '#34495e', borderRadius: 10, marginRight: 10, padding: 10 },
    smail: { width: 30, height: 30 },
    chat1: { flex: 1, paddingLeft: 15 },
    inputline: { borderBottomColor: "#333", borderBottomWidth: 0.5, flex: 1 },

    btnadd: { backgroundColor: '#003253', borderColor: '#003253' },
    searchwrap: { flexDirection: "row" },
    searchbox: { borderWidth: 1, borderColor: "#ccc", flex: 1, paddingLeft: 5 },
    searchtxt: { backgroundColor: '#003253', borderColor: '#003253' },
    line_password: { height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dedede' },
    label_100: { textAlign: 'right', width: 100 },
    input_pass: { flex: 1 },
    line1: { marginTop: 20 },

    //buttons
    btn: { width: 60, height: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: '#34495e', justifyContent: 'center', borderRadius: 3 },
    btnred: { backgroundColor: '#e70012', borderColor: '#e70012' },
    btnblue: { backgroundColor: '#2e8ded', borderColor: '#2e8ded', marginRight: 8 },

})
export default styles;