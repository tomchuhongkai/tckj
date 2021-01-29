import { NativeModules, Platform } from 'react-native';
import Alipay from 'react-native-s-alipay';
export default {
    pay: Platform.OS=='android'?NativeModules.Alipay.pay:Alipay.pay
}