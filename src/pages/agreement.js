import React, { Component } from 'react'
import { View, Button, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { observer, inject } from 'mobx-react'
// import { WebView } from 'react-native-webview'
import * as api from '../mocks/api'
import * as tools from '../tools/tool'
import BackButton from '../pages/components/backButton'
import commonStyle from '../tools/commonstyles'
import HeaderTitle from '../pages/components/headerTitle'
import CustomizeHeader from '../pages/components/customizeheader'
import { scaleSize, config } from '../tools/util';
import AutoHeightWebView from 'react-native-autoheight-webview-fix'

@inject('store')
@observer
class Agreement extends Component {
    static navigationOptions = {
        header:null
    }
    constructor(props) {
        super(props);
        this.state = {
            Data: null
        }
    }
    componentDidMount = () => {
       
    }
    loadData = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetNewsDetail(id)
            .then(res => {
                that.setState({
                    loaded: true,
                    Data: res.data
                })

            })
        }

    componentWillUnmount = () => {
        tools.CancelAxios();
    }

    render() {
        // if (this.state.Data === null)
        //     return null;
        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff',padding:scaleSize(30) }]}>
           <AutoHeightWebView
                        style={{ width: "100%", }}
                        customScript={`document.body.style.background = 'white';`}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                        }
                        p {
                            font-size: 20px;
                        }
                        `}
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        source={{ uri:`${tools.GetRootUrl()}`+'Home/TopicDetail?systemName=YingSiXieYi' }}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                    />
            {/* <ScrollView style={{ width: '100%', height: '100%'}} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View><Text style={commonStyle.agreementcontent}>特别提示</Text></View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        北京缘缘科技有限公司（以下简称“缘缘科技”）在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。
                    </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={commonStyle.agreementcontent}>
                        本协议约定陌陌科技与用户之间关于“缘缘”软件服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由缘缘科技随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本网站查阅最新版协议条款。在陌陌科技修改协议条款后，如果用户不接受修改后的条款，请立即停止使用陌陌科技提供的服务，用户继续使用缘缘科技提供的服务将被视为接受修改后的协议。
                    </Text>
                </View>
                <View style={{ marginTop: 20 }}><Text style={commonStyle.agreementcontent}>一、帐号注册</Text></View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        1、用户在使用本服务前需要注册一个“缘缘”帐号。“缘缘”帐号应当使用手机号码绑定注册，请用户使用尚未与“陌陌”帐号绑定的手机号码，以及未被陌陌科技根据本协议封禁的手机号码注册“陌陌”帐号。陌陌科技可以根据用户需求或产品需要对帐号注册和绑定的方式进行变更，而无须事先通知用户。
                    </Text>
                </View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        2、“陌陌”系基于地理位置的移动社交产品，用户注册时应当授权陌陌科技公开及使用其地理位置信息方可成功注册“陌陌”帐号。故用户完成注册即表明用户同意陌陌科技提取、公开及使用用户的地理位置信息。如用户需要终止向其他用户公开其地理位置信息，可自行设置为隐身状态。
                    </Text>
                </View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        3、鉴于“陌陌”帐号的绑定注册方式，您同意陌陌科技在注册时将使用您提供的手机号码及/或自动提取您的手机号码及自动提取您的手机设备识别码等信息用于注册。您同意给予运营商授权，授权运营商有权自动提取您的手机号码进行认证并用于“陌陌”账号注册，您保证遵守运营商的相关服务条款（点击查看服务条款），如运营商对您的手机号认证成功，则您的注册即完成。如您不同意对运营商的授权和/或服务条款或者是您的手机号认证失败，您可以手动修改运营商提取的手机号码，采取验证码方式进行注册登录。
                    </Text>
                </View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        4、在用户注册及使用本服务时，陌陌科技需要搜集能识别用户身份的个人信息以便陌陌科技可以在必要时联系用户，或为用户提供更好的使用体验。陌陌科技搜集的信息包括但不限于用户的姓名、性别、年龄、出生日期、身份证号、地址、学校情况、公司情况、所属行业、兴趣爱好、常出没的地方、个人说明；陌陌科技同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。
                    </Text>
                </View>
                <View style={{ marginTop: 20 }}><Text style={commonStyle.agreementcontent}>二、服务内容</Text></View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        1、本服务的具体内容由陌陌科技根据实际情况提供，包括但不限于授权用户通过其帐号进行即时通讯、添加好友、加入群组、关注他人、发布留言。陌陌科技可以对其提供的服务予以变更，且陌陌科技提供的服务内容可能随时变更；用户将会收到陌陌科技关于服务变更的通知。
                    </Text>
                </View>
                <View>
                    <Text style={commonStyle.agreementcontent}>
                        2、陌陌科技提供的服务包含免费服务与收费服务。用户可以通过付费方式购买收费服务，具体方式为：用户通过网上银行、支付宝或其他“陌陌”平台提供的付费途径支付一定数额的人民币购买“陌陌”平台的虚拟货币——陌陌币，然后根据陌陌科技公布的资费标准以陌陌币购买用户欲使用的收费服务，从而获得收费服务使用权限。对于收费服务，陌陌科技会在用户使用之前给予用户明确的提示，只有用户根据提示确认其同意按照前述支付方式支付费用并完成了支付行为，用户才能使用该等收费服务。支付行为的完成以银行或第三方支付平台生成“支付已完成”的确认通知为准。
                    </Text>
                </View>
            </ScrollView>
             */}
            <CustomizeHeader goBack={()=>{this.props.navigation.goBack()}} Title="用户协议"/>
        </View>)
    }
}

export default Agreement
const page_styles = StyleSheet.create({

})