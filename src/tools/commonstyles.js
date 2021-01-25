import { StyleSheet, PixelRatio, Platform, Dimensions } from 'react-native';
import { scaleSizeW, setSpText, scaleSize } from '../tools/util'
const { width, height } = Dimensions.get('window');

var commonStyle = StyleSheet.create({
    commonText:{
        fontSize:scaleSize(28)
    },
    // 按钮
    fullWidthButton: {
        backgroundColor: '#ec5947',
        justifyContent: 'center',
        alignItems: 'center',
        height: scaleSizeW(70),
        borderRadius: scaleSizeW(60),
    },
    fullWidthButton_Disabled: {
        backgroundColor: '#ccc'
    },
    fullWidthButton_text: {
        fontSize: setSpText(30),
        color: '#fff',
        fontWeight: 'normal'
    },
    btnblue_text: { color: '#4574f8', fontSize: scaleSizeW(24) },
    bluebtn: {
        backgroundColor: '#cfdcfc',
        borderRadius: scaleSizeW(10),
        width: scaleSizeW(295),
        paddingTop: scaleSizeW(10),
        paddingBottom: scaleSizeW(10),
        alignItems: 'center'
    },
    promore: {
        fontSize: scaleSizeW(22),
        fontWeight: 'bold',
        color: '#4575f6'
    },

    safeView: {
        flex: 1,
        position: 'relative'
    },
    safeViewWithCusHead: {
        flex: 1,
        position: 'relative',
        paddingTop: scaleSizeW(90)
    },
    safeViewWithCustomHead: {
        flex: 1,
        position: 'relative', paddingTop: scaleSizeW(90)
    },
    fixheight:{height:scaleSize(82)},
    scrollViewContainer: {
        minHeight:'100%'
    },
    scrollViewContainerLogin: {
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        paddingTop: scaleSizeW(25)
    },
    formTitle: {
        marginBottom: scaleSizeW(95),
    },
    formTitle_text: {
        color: '#000',
        fontSize: setSpText(48)
    },
    fields_line: {
        marginBottom: scaleSizeW(40),
        position: 'relative'
    },
    fields_label: {
        color: '#666666',
        fontSize: setSpText(24),
        marginBottom: scaleSizeW(30)
    },
    fields_textbox: {
        height: scaleSizeW(60),
        borderBottomWidth: scaleSizeW(1),
        borderBottomColor: '#cccccc',
        paddingBottom: scaleSizeW(10),
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: scaleSizeW(60),
        fontSize: setSpText(30),
        color: '#0d0d0d'
    },
    wrapinput: {
        paddingVertical: scaleSizeW(6),
        paddingHorizontal: scaleSizeW(0),
        backgroundColor: '#fff',
        flexDirection: 'row', alignContent: 'center', justifyContent: 'flex-start', alignItems: 'center',
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1
    },
    describe: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: scaleSizeW(10)
    },
    describe_center: {
        justifyContent: 'center',
    },
    describe_image: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
        marginRight: scaleSizeW(10)
    },
    describe_text: {
        fontSize: setSpText(24),
        color: '#fc4185'
    },
    textinput: {
        fontSize: setSpText(30),
        color: '#4e484f'
    },
    normalTextInput:{
        fontSize: setSpText(30),
        borderWidth:scaleSizeW(1),
        borderColor:'#dedede',
        borderRadius:scaleSizeW(5),
        paddingVertical:scaleSizeW(10),
        paddingHorizontal:scaleSizeW(30)
    },
    fields_textroundbox: {
        height: scaleSizeW(62),
        flex: 1, fontSize: setSpText(30),
        paddingVertical: 0
    },
    fields_textroundboxbottom: {
        height: scaleSizeW(62), width: width - scaleSize(40),
        flex: 1, fontSize: setSpText(30),
        paddingVertical: 0,
        backgroundColor: '#efefef',
        borderRadius: scaleSize(40), paddingHorizontal: scaleSize(42),
        position: 'absolute', bottom: scaleSize(10), left: scaleSize(20)
    },
    clearBox: {
        width: scaleSizeW(50),
        position: 'absolute',
        right: 0,
        bottom: scaleSizeW(14),
        zIndex: 1
    },

    rowItem: {
        height: scaleSizeW(100),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: scaleSizeW(50),
        paddingRight: scaleSizeW(30),
        backgroundColor: '#fff',
        marginTop: scaleSizeW(25)
    },
    rowItem_left_text: {
        fontSize: setSpText(30),
        color: '#000'
    },
    rowItem_right_text: {
        fontSize: setSpText(30),
        color: '#cccccc'
    },
    rowItem_right_text_oneline: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        textAlign: 'right',
        marginLeft: scaleSizeW(50)
    },
    formRowItem: {
        paddingLeft: scaleSizeW(50),
        paddingRight: scaleSizeW(30),
        backgroundColor: '#fff',
        marginTop: scaleSizeW(25)
    },
    formRowItem_row_left: {
        flexDirection: 'row', alignItems: 'center',
    },
    formRowItem_row_right: {
        flexDirection: 'row', alignItems: 'center',
        flex: 1, flexDirection: 'row', justifyContent: 'flex-end'

    },
    formRowItem_row: {
        height: scaleSizeW(99),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: scaleSizeW(1)
    },
    formRowItem2: {
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        backgroundColor: '#fff',
    },
    avatar: {
        width: scaleSizeW(90),
        height: scaleSizeW(90),
        borderRadius: scaleSizeW(45)
    },
    avatar2: { width: scaleSizeW(132), height: scaleSizeW(132), borderRadius: scaleSizeW(8) },
    notification: {
        width: scaleSizeW(32),
        height: scaleSizeW(32),
        borderRadius: scaleSizeW(16),
        backgroundColor: '#ff5040',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notification_text: {
        color: '#fff',
        fontSize: setSpText(24)
    },
    block: {
        marginTop: scaleSizeW(20),
        paddingTop: scaleSizeW(45),
        paddingLeft: scaleSizeW(45),
        paddingRight: scaleSizeW(45),
        paddingBottom: scaleSizeW(60),
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    block_line: {
        fontSize: setSpText(30),
        color: '#000',
        marginBottom: scaleSizeW(30)
    },
    commonflex: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    commonflexbetween: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    list_item: {
        height: scaleSizeW(180),
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: scaleSizeW(1),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        position: 'relative'
    }, message_common: {
        position: 'absolute',
        opacity: 0.7,
        top: 10,
        left: scaleSizeW(100),
        right: scaleSizeW(100),
        minHeight: scaleSizeW(60),
        flexDirection: 'row',
        borderRadius: scaleSizeW(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    message_warning: {
        backgroundColor: '#000',
    },
    message_warning_text: {
        color: '#fff',
        fontSize: setSpText(26),
        zIndex: 100
    },
    message_error: {
        backgroundColor: 'red',
    },
    message_error_text: {
        color: '#fff',
        fontSize: setSpText(26),
        zIndex: 100
    },
    message_success: {
        backgroundColor: 'green',
    },
    message_success_text: {
        color: '#fff',
        fontSize: setSpText(26),
        zIndex: 100
    },
    bigtitle: {
        color: '#252321',
        fontSize: setSpText(48), marginTop: scaleSizeW(120), marginBottom: scaleSizeW(60)
    },
    subtitle: {
        color: '#7e7e7e',
        fontSize: setSpText(32), alignSelf: "center", marginBottom: scaleSizeW(70)
    },
    agreement: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: scaleSizeW(20)
    },
    agreementtext: {
        color: '#ababab',
    },
    agreementcontent: { lineHeight: scaleSizeW(42) },
    registericon: { width: scaleSizeW(41), height: scaleSizeW(41) },
    capture: {
        borderColor: '#ff8fb8', borderWidth: 1, borderRadius: scaleSizeW(4),
        paddingHorizontal: scaleSizeW(24), height: scaleSizeW(70), lineHeight: scaleSizeW(70),
        color: '#ff8fb8', fontSize: setSpText(30)
    },
    capturebtn: { position: 'absolute', right: scaleSizeW(12), bottom: scaleSizeW(18) },
    underline: { textDecorationLine: 'underline', color: '#333' },
    customericon: { width: scaleSizeW(44), height: scaleSizeW(44) },
    avatar2: { width: scaleSizeW(132), height: scaleSizeW(132), borderRadius: 4 },
    rightarrow: { width: scaleSizeW(48), height: scaleSizeW(48) },
    rightarrowblack: { width: scaleSizeW(15), height: scaleSizeW(26), marginLeft: scaleSizeW(20) },
    qcode: { width: scaleSizeW(37), height: scaleSizeW(37) },
    searchbox: { width: 0.9 * width, backgroundColor: '#eeeeee', height: scaleSizeW(84), borderRadius: scaleSizeW(42), flexDirection: 'row', alignItems: 'center', marginLeft: 0.05 * width, marginTop: scaleSizeW(30), marginBottom: scaleSizeW(30) },
    searchicon: { width: scaleSizeW(32), height: scaleSizeW(32), marginLeft: scaleSizeW(40) },
    searchtxt: { marginLeft: scaleSizeW(0) },
    ffftxt: { color: '#fff' },
    loding: { flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    loading_info: { minWidth: scaleSizeW(200), height: scaleSizeW(80), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    loading_text: { fontSize: setSpText(24), color: '#dedede' },
    dialog_container: {
        backgroundColor: '#fff',
        marginBottom: scaleSizeW(40),
        borderRadius: scaleSizeW(20)
    },
    dialog_item: {
        height: scaleSizeW(100),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: scaleSizeW(1)
    },
    dialog_item_last: {
        borderBottomWidth: 0
    },
    dialog_footer: {
        height: scaleSizeW(100),
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(20)
    },
    dialog_title_firstText: {
        color: '#a4a4a4',
        fontSize: setSpText(30),
    },
    dialog_title_text: {
        fontSize: setSpText(36),
        color: '#3377f6'
    },
    popup_container: { width: width - scaleSizeW(80), marginLeft: scaleSizeW(40), height: height - scaleSizeW(160), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    popup_container_closeline: { height: scaleSizeW(90), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: scaleSizeW(80) },
    popup_container_view: { width: '100%', flex: 1, margin: 0, padding: 0 },
    popup_container_closeline_close: { position: 'absolute', right: scaleSizeW(30), top: scaleSizeW(30), width: scaleSizeW(31), height: scaleSizeW(31) },
    popup_container_closeline_close_img: { width: scaleSizeW(31), height: scaleSizeW(31) },
    popup_container_closeline_button: { position: 'absolute', right: scaleSizeW(30) },
    popup_container_back: { position: 'absolute', width: scaleSizeW(100), left: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: scaleSizeW(90) },
    popup_container_back_img: { width: scaleSizeW(18), height: scaleSizeW(32), marginLeft: scaleSizeW(30) },
    popup_container_main: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' },
    tabBar_detail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: scaleSizeW(75),
    },
    tabBar_detail_item: {
        paddingRight: scaleSizeW(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSizeW(90),
        textAlign: 'center'
    },
    tabBar_detail_item_text: {
        paddingTop: scaleSizeW(50),
        paddingBottom: scaleSizeW(40),
        fontSize: setSpText(30),
        color: '#9f9f9f',
    },
    tabBar_detail_item_text_cur: {
        paddingTop: scaleSizeW(50),
        paddingBottom: scaleSizeW(40),
        fontSize: setSpText(42),
        color: '#1c1e1e',
    },
    tabBar_detail_item_selected: {
        borderBottomColor: 'red',
        borderBottomWidth: scaleSizeW(4),
        fontSize: setSpText(42),
        color: '#1c1e1e'
    },
    tabBar_detail_item_underline: {
        height: scaleSizeW(4),
        bottom: scaleSizeW(5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    tabBar_detail_item_underline_bg: {
        backgroundColor: '#4576f7',
        width: scaleSizeW(100),
        height: scaleSizeW(4),
    },
    header_send_btn: {
        backgroundColor: '#dedede',
        paddingTop: scaleSizeW(10),
        paddingBottom: scaleSizeW(10),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        borderRadius: scaleSizeW(10)
    },
    header_send_btn_active: {
        backgroundColor: '#fc4185'
    },
    header_send_btn_text: {
        fontSize: setSpText(28),
        color: '#333'
    },
    header_send_btn_text_active: {
        color: '#fff',
    },
    loading: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    profile_nothing: {
        flex: 1,
        minHeight: scaleSizeW(100),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scaleSizeW(30),
        paddingBottom: scaleSizeW(30)
    },
    profile_nothing_text: {
        fontSize: setSpText(28),
        color: '#a5a5a5'
    },
    profile_link: {
        color: '#fc4186'
    },
    customize_tab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customize_tab_item_2: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: scaleSizeW(20),
        paddingTop: scaleSizeW(20),
    },
    customize_tab_item_bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: scaleSizeW(5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customize_tab_item_bottom_line: {
        backgroundColor: 'red',
        width: scaleSizeW(80),
        height: scaleSizeW(5)
    },
    customize_tab_item_txt: {
        fontSize: setSpText(38),
    },
    badges: {
        backgroundColor: '#fc4185',
        color: '#ffffff',
        height: scaleSizeW(20),
        width: scaleSizeW(20),
        borderRadius: scaleSizeW(10),
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        right: scaleSizeW(-5),
        top: scaleSizeW(-5)
    },
    bottom_area: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: scaleSizeW(100)
    },
    rightbutton_text: {
        fontSize: setSpText(28)
    },
    button_list: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button_list_row: {
        height: scaleSizeW(80),
        borderRadius: scaleSizeW(40),
        paddingLeft: scaleSizeW(40),
        paddingRight: scaleSizeW(40),
        borderColor: '#fc4185',
        borderWidth: scaleSizeW(1),
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSizeW(30)
    },
    commonIcon: { width: scaleSizeW(20), height: scaleSizeW(20) },
    title1: {
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        paddingTop: scaleSizeW(6),
        paddingBottom: scaleSizeW(6),
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    leftborder: {
        width: scaleSizeW(8),
        height: scaleSizeW(28),
        marginRight: scaleSizeW(16)
    },
    title1txt: {
        fontSize: scaleSizeW(28),
        color: '#111010',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left'
    },
    titlemore: {
        fontSize: scaleSizeW(24),
        color: '#979797',
    },
    cols2pros: {
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: scaleSizeW(15),
        paddingRight: scaleSizeW(15),
    },
    cols2pro: {
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        width: scaleSizeW(345),
        height: scaleSizeW(425),
        display: 'flex',
        borderTopLeftRadius:scaleSize(10),
        borderTopRightRadius:scaleSize(10),
        marginLeft: scaleSizeW(5),
        marginRight: scaleSizeW(5),
        marginBottom: scaleSizeW(15),
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(10)
    },
    proimgcontainer: {
        width: scaleSizeW(345),
        height: scaleSizeW(240),
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    proimg: {
        width: scaleSizeW(345),
        height: scaleSizeW(240),
        borderTopLeftRadius:scaleSize(10),
        borderTopRightRadius:scaleSize(10),
    },
    protitle1: {
        fontSize: scaleSizeW(24),
        fontWeight: 'bold',
        color: '#111010',
        marginTop:scaleSize(10),
        marginRight: scaleSizeW(20),
        marginLeft: scaleSizeW(20),
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
    protitle2: {
        fontSize: scaleSizeW(22),
        color: '#585757',
        marginRight: scaleSizeW(20),
        marginLeft: scaleSizeW(20),
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginTop: scaleSizeW(6)
    },
    postshow: {
        paddingHorizontal: scaleSizeW(30),
        paddingVertical: scaleSizeW(14),
        marginBottom: scaleSizeW(10),
        backgroundColor: '#fff'
    },
    posttop: {
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    posttype: {
        borderRadius: scaleSizeW(4),
        borderColor: '#eb5946',
        borderWidth: scaleSizeW(1),
        paddingHorizontal: scaleSizeW(2),
        paddingVertical: scaleSizeW(0),
        marginRight: scaleSize(6)
    },
    posttypetxt: {
        fontSize: scaleSizeW(18),
        color: '#eb5946',
        fontWeight: 'bold',
    },
    postphone: {
        width: scaleSizeW(28),
        height: scaleSizeW(30),
        marginRight: scaleSizeW(10)
    },
    phonetxt: {
         fontSize: scaleSizeW(26),
         color: '#25231f',
         fontWeight: 'bold',
    },
    postdesc: {
        fontSize: scaleSizeW(24),
        fontWeight:'bold',
        paddingTop: scaleSizeW(10),
        paddingBottom: scaleSizeW(10),
        lineHeight: scaleSizeW(50),
        color: '#111010'
    },
    postinfo: {
        justifyContent: "flex-start",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: scaleSizeW(20)
    },
    postpition: {
        width: scaleSizeW(22),
        height: scaleSizeW(26),
        marginRight: scaleSizeW(10)
    },
    postaddress: {
        color: '#a2a2a4',
        fontSize: scaleSizeW(24),
        marginRight: scaleSizeW(20)
    },
    posttime: {
        color: '#a2a2a4',
        fontSize: scaleSizeW(20),
    },
    postImgs: {
        justifyContent: "flex-start",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    postImg: {
        width: scaleSizeW(210),
        height: scaleSizeW(210),
        marginRight: scaleSizeW(10),
        borderRadius: scaleSizeW(20),
        borderWidth: scaleSizeW(1),
        borderColor: '#dedede'
    },
    postImg1: {
        width: scaleSizeW(420),
        height: scaleSizeW(420),
        marginRight: scaleSizeW(10),
        borderRadius: scaleSizeW(20),
        borderWidth: scaleSizeW(1),
        borderColor: '#dedede'
    },
    popheader: {
        position: 'absolute',
        zIndex: 9,
        top: 0,
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        paddingBottom: scaleSizeW(10),
        paddingTop: scaleSizeW(10),
        backgroundColor: '#fff',
        height: scaleSizeW(160),
        width: '100%'
    },
    backbtn: {
        width: scaleSizeW(18),
        height: scaleSizeW(30)
    },
    flexb: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    tag_wrap_list: { flexDirection: 'row', alignItems: 'center' },
    tag_wrap: { borderWidth: 1, borderRadius: 4, marginLeft: scaleSizeW(14), paddingVertical: scaleSizeW(4), paddingHorizontal: scaleSizeW(8) },
    tag_wrap_red: { borderColor: '#eb5946', borderWidth: 1, borderRadius: 6, marginRight: scaleSizeW(14), paddingVertical: scaleSizeW(2), paddingHorizontal: scaleSizeW(8) },
    tag_successful: { borderColor: "#299c3f" },
    tag_failed: { backgroundColor: "#555555" },
    tag_completed: { backgroundColor: "#4576f7", borderColor: "#4576f7" },
    tag_successful_txt: { color: "#299c3f" },
    tag_white_txt: { color: '#fff' },
    tag_green_txt: { color: '#299c3f' },
    tag_red_txt: { color: '#eb5946' },
    imgLoading: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: '#dedede', borderWidth: scaleSizeW(1), width: scaleSizeW(198), height: scaleSizeW(198), borderRadius: scaleSizeW(10)
    },
    imgLoading_img: {
        width: scaleSizeW(100), height: scaleSizeW(100)
    },
    flexrow:{
        flexDirection:'row',alignItems:'center',justifyContent:'space-between'
    },
    companyHeader:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:scaleSizeW(20),
        paddingBottom:scaleSizeW(20),
    },
    companyColumn:{
        paddingLeft:scaleSizeW(20),
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        flex:1
    },
    companyRow:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    companyIcon:{
    },  
    companyYearIcon:{
        color:'#13227a',
        borderColor:'#13227a',
        borderRadius:scaleSizeW(3),
        borderWidth:scaleSizeW(1),
        height:scaleSizeW(22),
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:scaleSizeW(10),
        paddingHorizontal:scaleSizeW(5),
        marginBottom:scaleSizeW(5)
    },
    companyShiMingIcon:{
        width:scaleSizeW(30),
        height:scaleSizeW(30)
    },
    companyTitle:{

    },
    companyTitleText:{
        fontSize:setSpText(32)
    },
    companySmallText:{
        fontSize:setSpText(12),
        color:'#13227a',
        fontWeight:'bold'
    },
    avatar:{
        width:scaleSizeW(90),
        height:scaleSizeW(90),
        borderRadius:scaleSizeW(45)
    },
    processBar:{
        position:'absolute',
        top:scaleSizeW(90),
        left:0,
        right:0,
        zIndex:99999
    },
    location_row:{
        display: 'flex',
        alignItems: 'center',
        height: scaleSizeW(90),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
    },location_content:{
        marginLeft: scaleSizeW(20),
        flex: 1
    },
    location_content_text:{
        fontSize: scaleSizeW(24),
        color: '#dedede'
    }
})
export default commonStyle;