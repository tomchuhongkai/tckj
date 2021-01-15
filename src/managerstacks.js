import { createStackNavigator } from 'react-navigation-stack'
import HomePage from './pages/home/index'
import MechinePartsPage from './pages/mechineparts/index'
import ShopPage from './pages/mechineparts/shop'
import MachinePartDetail from './pages/mechineparts/detail'
import PingguPage from './pages/home/pinggu'
import HengjiPage from './pages/home/hengji'
import PostPage from './pages/home/post'
import PostAdPage from './pages/home/postad'
import ForumsPage from './pages/home/forumindex'
import ErshoujiPage from './pages/home/ershouji'
import ActionsPage from './pages/home/actions'
import ActionDetailPage from './pages/home/actiondetail'
import NewMachinePage from './pages/home/newmachine'
import ForumDetailPage from './pages/home/forumdetail'
import ServiceListPage from './pages/home/servicelist'
import ZhaofahuoPage from './pages/home/zhaofahuo/index'
import ZhaofahuoDetailPage from './pages/home/zhaofahuo/detail'
import ZhaofahuoFormPage from './pages/home/zhaofahuo/form'
import MinePage from './pages/mine/index'
import AuctionPage from './pages/mine/AuctionPage'
import PublishPage from './pages/mine/PublishPage'
import PrivacyPage from './pages/mine/privacy'
import PublishDetailPage from './pages/mine/PublishDetail'
import InfoEditPage from './pages/mine/infoedit'
import NicknameEdit from './pages/mine/editors/nickname'
import CertificationEdit from './pages/mine/editors/certification'
import ResetPassword from './pages/mine/resetpassword'
import Certification from './pages/mine/Certification'
import NewMechineList from './pages/newmechine/index'
import SecondMechinePage from './pages/secondmechine/index'
import SecondMechineDetailPage from './pages/secondmechine/detail'
import LocationSelector from './pages/commons/locationselector'
import SignIn from './signin'
import Register from './register'
import ForgotPassword from './forgotpassword'
import AuthResetPassword from './authresetpassword'
import PopHistory from './pages/home/pophistory'
import JoinUs from './pages/home/joinus'
import Jubao from './pages/home/jubao'
import Advertisement from './pages/home/advertisement'
import AdvDetail from './pages/home/advdetail'
import ServiceDetail from './pages/home/servicedetail'
import Location from './pages/components/location'
import BaoMing from './pages/home/baoming'
import Agreement from './pages/agreement'


const HomeStack = createStackNavigator({
    HomePage: HomePage,
    MachineDetail: SecondMechineDetailPage,
    Pinggu: PingguPage,
    Hengji: HengjiPage,
    Post: PostPage,
    ServiceList: ServiceListPage,
    Forums: ForumsPage,
    Ershouji: ErshoujiPage,
    ForumDetail: ForumDetailPage,
    Zhaofahuo: ZhaofahuoPage,
    ZhaofahuoDetail: ZhaofahuoDetailPage,
    ZhaofahuoForm: ZhaofahuoFormPage,
    LocationSelector: LocationSelector,
    PostNewMachine: NewMachinePage,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    PopHistory: PopHistory,
    JoinUs: JoinUs,
    Advertisement: Advertisement,
    AdvDetail: AdvDetail,
    Detail: ServiceDetail,
    Actions: ActionsPage,
    ActionDetail: ActionDetailPage,
    Location: Location,
    BaoMing:BaoMing,
    MechineParts:MechinePartsPage,
    Shop:ShopPage,
    MachinePartDetail: MachinePartDetail,
    Jubao: Jubao,
    PostAd:PostAdPage,Agreement:Agreement

})



const NewMechineStack = createStackNavigator({
    List: NewMechineList,
    Detail: SecondMechineDetailPage,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    PostNewMachine: NewMachinePage,
    PopHistory: PopHistory,
    Jubao: Jubao,
    Location: Location,Agreement:Agreement


})

const SecondMechineStack = createStackNavigator({
    SecondMechineList: SecondMechinePage,
    SecondMechineDetail: SecondMechineDetailPage,
    Ershouji: ErshoujiPage,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    PopHistory: PopHistory,
    Jubao: Jubao,
    Location: Location,Agreement:Agreement


})

const MechinePartsStack = createStackNavigator({
    MechinePartsList: MechinePartsPage,
    Shop:ShopPage,
    MachinePartDetail: MachinePartDetail,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    PopHistory: PopHistory,Agreement:Agreement

})
const ActionsStack = createStackNavigator({
    Actions: ActionsPage,
    ActionDetail: ActionDetailPage,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    PopHistory: PopHistory,Agreement:Agreement

})
const MyInfoStack = createStackNavigator({
    MyInfo: MinePage,
    SignIn: SignIn,
    Register: Register,
    ForgotPassword: ForgotPassword,
    AuthResetPassword: AuthResetPassword,
    Privacy: PrivacyPage,
    InfoEdit: InfoEditPage,
    NicknameEdit: NicknameEdit,
    ResetPassword: ResetPassword,
    PublishDetail: PublishDetailPage,
    Certification: Certification,
    CertificationEdit: CertificationEdit,
    AuctionPage: AuctionPage,
    PublishPage: PublishPage,
    ActionDetail: ActionDetailPage,Agreement:Agreement

})
HomeStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let tabBarVisible = true;
    switch (routeName) {
        default:
            break;
        case 'MachineDetail':
        case 'Pinggu':
        case 'Hengji':
        case 'Forums':
        case 'ForumDetail':
        case 'Post':
        case 'Zhaofahuo':
        case 'ZhaofahuoForm':
        case 'ZhaofahuoDetail':
        case 'LocationSelector':
        case 'SignIn':
        case 'Register':
        case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
        case 'PostNewMachine':
        case 'ResetPassword':
        case 'JoinUs':
        case 'Advertisement':
        case 'AdvDetail':
        case 'PopHistory':
        case 'ServiceList':
        case 'Actions':
        case 'ActionDetail':
        case 'Location':
        case 'BaoMing':
        case 'MachinePartDetail':
            case 'MechineParts':
                case 'Shop':
            
        case 'PostAd':
        case 'Jubao':
            tabBarVisible = false;
            break;
    }
    return {
        tabBarVisible
    }
}
NewMechineStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let tabBarVisible = true;
    switch (routeName) {
        default:
            break;
        case 'PopHistory':
        case 'PostNewMachine':
        case 'Detail':
        case 'SignIn':
        case 'Register':
       case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
        case 'Location':
            tabBarVisible = false;
            break;
    }
    return {
        tabBarVisible
    }
}
SecondMechineStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let option = {
        tabBarVisible: true
    }
    switch (routeName) {
        default:
            break;
        case 'PopHistory':
        case 'SecondMechineDetail':
        case 'Ershouji':
        case 'SignIn':
        case 'Register':
       case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
        case 'Location':
            option.tabBarVisible = false;
            break;
    }
    return option;
}

ActionsStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let tabBarVisible = true;
    switch (routeName) {
        default:
            break;
        case 'ActionDetail':
        case 'PopHistory':
        case 'SignIn':
        case 'Register':
       case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
            tabBarVisible = false;
            break;
    }
    return {
        tabBarVisible
    }
}
MechinePartsStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let tabBarVisible = true;
    switch (routeName) {
        default:
            break;
        case 'MachinePartDetail':
        case 'PopHistory':
        case 'SignIn':
        case 'Register':
       case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
            case 'Shop':
            tabBarVisible = false;
            break;
    }
    return {
        tabBarVisible
    }
}
MyInfoStack.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    let tabBarVisible = true;
    switch (routeName) {
        default:
            break;
        case 'Other':
        case 'SignIn':
        case 'Register':
       case 'Agreement':
        case 'ForgotPassword':
        case 'AuthResetPassword':
        case 'Privacy':
        case 'InfoEdit':
        case 'NicknameEdit':
        case 'PublishDetail':
        case 'Certification':
        case 'CertificationEdit':
        case 'AuctionPage':
        case 'PublishPage':
        case 'ActionDetail':
            tabBarVisible = false;
            break;
    }
    return {
        tabBarVisible
    }
}
const ManagerStacks = {
    Home: HomeStack,
    NewMechine: NewMechineStack,
    Actions:ActionsStack,
    SecondMechine: SecondMechineStack,
    MechineParts: MechinePartsStack,
    MyInfo: MyInfoStack
}
export default ManagerStacks