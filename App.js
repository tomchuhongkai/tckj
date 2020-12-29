import React, { Component } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation'
import AllNavigations from './src/rootstack'
import { Provider } from 'mobx-react'
import stores from './src/stores/store'
import * as tools from './src/tools/tool'
import * as antd from '@ant-design/react-native';
import Geolocation from '@react-native-community/geolocation'; 
 
import codePush from 'react-native-code-push'

const AntdProvider = antd.Provider;
tools.InitStore(stores);
const AppContainer = createAppContainer(AllNavigations)


class App extends Component {
  constructor(props) {
    super(props)
  }
  getPosition = async () => {
    if (Platform.OS == 'ios') {
      this.doGetPosition();
    } else {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
        this.doGetPosition();
      } else {
        tools.Toast.info("定位权限被禁止")
      }
    }
  }
  setPosition = () => {
    let that = this;
    setTimeout(() => {
      if (global.Coordinate !== undefined && global.Coordinate.Latitude !== 0 && global.Coordinate.Longitude !== 0) {
        if (global.isLoging !== undefined && global.isLoging === true) {
          //connection.invoke('SetUserLocation', global.Coordinate);
        } else {
          that.setPosition();
        }
      }
    }, 1000);
  }
  doGetPosition = () => {
    let that = this
    Geolocation.getCurrentPosition(
      (position) => {
        let coords = position.coords;
        global.Coordinate = {
          Latitude: coords.latitude,
          Longitude: coords.longitude,
          Simple: '',
          Detail: null
        }
        //set location
        that.setPosition();
      },
      (error) => () => {
        global.Coordinate = {
          Latitude: 0,
          Longitude: 0,
          Simple: '',
          Detail: null
        }
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }
  componentDidMount = () => {
    let that = this;

    //进行更新检测
    // codePush.checkForUpdate().then((update) => {
    //   if (update) {
    //     tools.Toast.info('当前有新的更新，正在自动更新\r\n更新完成将会自动重启，请勿退出程序', 200);
    //   }
    // })
    this.getPosition();
  }
  render() {
    return (
      <Provider store={stores}>
        <AntdProvider>
          <AppContainer screenProps={{ userInfo: stores.config.userInfo }} />
        </AntdProvider>
      </Provider>
    );
  }
}

export default App