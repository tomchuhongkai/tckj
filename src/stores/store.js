import Chat from '../stores/chats/chat'
import ChatPersons from '../stores/chats/chatpersons'
import UserProfile from '../stores/userprofile'
import User from '../stores/users/user'
import ComunityProfile from '../stores/comunity/profile'
import Activity from '../stores/commons/activity'
import config from '../stores/config'
import topic from '../stores/friends/topic'
import FriendCircle from '../stores/friends/friendcircle'
import FriendMyFocused from '../stores/comunity/friends_myfocused'
import ComunityFriendList from '../stores/comunity/friends_list'
import FriendFocusedOnMe from '../stores/comunity/friends_focusedonme'
import MyFate from '../stores/users/myfate'
import HerFate from '../stores/users/herfate'
import Location from '../stores/commons/location'
import Common from '../stores/commons/common'
import PostPhotos from '../stores/commons/postphotos'
import BigPhoto from '../stores/commons/bigphoto'
import FormsProfile from '../stores/forms/formsinfo'

const stores = {
    config: config,
    userprofile: UserProfile,
    chat: Chat,
    chatpersons: ChatPersons,
    user: User,//inited
    myfate:MyFate,//inited
    herfate:HerFate,//inited
    comunity_profile: ComunityProfile,//inited
    activity: Activity,//inited
    comunity_friends_myfocused:FriendMyFocused,//inited
    comunity_friends_list:ComunityFriendList,//inited
    comunity_friends_focusedonme:FriendFocusedOnMe,//inited
    friends_topic: topic,//inited
    friends_cicle:FriendCircle,//inited
    location:Location,
    bigphoto:BigPhoto,
    common:Common,
    formsProfile:FormsProfile,
    formsProfile:FormsProfile,
    postphotos:PostPhotos
}

export default stores