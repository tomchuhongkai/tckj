import * as tools from '../tools/tool'
export function UserToken(data) {
    return tools.Post(`/api/Token/RequestToken`, data);
}
//获取验证码
export function GetValidationCode(data) {
    return tools.Post(`/api/Customer/GetValidationCode`, data);
}

export function FindPassword(data) {
    return tools.Post(`/api/Customer/FindPassword`, data);
}

export function ResetPassword(data) {
    return tools.Post(`/api/Customer/ResetPassword`, data);
}

export function Register(data) {
    return tools.Post(`/api/Customer/Register`, data);
}
export function SetProfile(data) {
    return tools.Post(`/api/Customer/SetProfile`, data);
}
export function ChangePassword(data) {
    return tools.Post(`/api/Customer/ChangePassword`, data)
}

export function LoadPhoneCodes() {
    return tools.Get(`/api/Common/LoadCountries`);
}

export function GetCurrentLocation(lat, lng) {
    return tools.Get(`/api/product/GetCurrentLocation?lat=${lat}&lng=${lng}`);
}
export function GetAroundLocations(lat, lng) {
    return tools.Get(`/api/product/GetAroundLocations?lat=${lat}&lng=${lng}`);
}

export function RefreshAuction(id){
    return tools.Get(`/api/auction/auctionprice/${id}`);
}

export function GetLocationArounds(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/product/GetAroundLocations${param}`);
}



export function RelationPost(data) {
    return tools.Post(`/api/News/RelationPost`, data);
}
// 找发货
export function GetNewsList(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/News/List${param}`);
}

export function GetNewsDetail(id) {
    return tools.Get(`/api/News/Detail/${id}`);
}

export function RemoveNewsDetail(id) {
    return tools.Get(`/api/News/Delete/${id}`);
}


//首页信息
export function GetHomePage(location) {
    if (location === undefined) {
        location = "";
    }
    return tools.Get(`/api/News/HomeLoader?location=${location}`);
}
//配件查询
export function GetMachineParts(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/Product/List${param}`);
}
export function GetShops(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/Product/Shops${param}`);
}
export function GetMachinePartDetail(id) {
    return tools.Get(`/api/Product/Detail/${id}`);
}

export function GetCities() {
    return tools.Get(`/api/News/LoadLocations`);
}
// 获取用户信息
export function GetUserInfo() {
    return tools.Get(`/api/Customer/UserDetail`);
}

//保存头像
export function UploadAvatar(formData) {
    return tools.Post(`/api/upload/UploadImage`, formData);
}

export function GetTopNPost() {
    return tools.Get(`/api/News/MyTopPost`);
}

export function ForumTopics(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/forum/ForumTopics${param}`);
}
export function SaveTopic(data) {
    return tools.Post(`/api/forum/SaveTopic`, data);
}

export function TopicDetail(id) {
    return tools.Get(`/api/forum/TopicDetail/${id}`);
}

export function LoadReplies(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/forum/ForumReply${param}`);
}
export function SaveTopicReply(data) {
    return tools.Post(`/api/forum/SaveTopicReply`, data);
}

export function ChangeNickName(data) {
    return tools.Post(`/api/customer/ChangeNickName`, data);
}


export function LoadVersion() {
    return tools.Get(`/api/news/getversion`);
}


export function ShiMingRenZheng(data) {
    return tools.Post(`/api/customer/ShiMingRenZheng`, data);
}

export function ShiMingDetail(id) {
    return tools.Get(`/api/customer/ShiMingDetail/${id}`);
}


//user match 
export function UserMatch(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/SearchUsers${param}`);
}


export function UserDetail(id, showDefault) {
    if (showDefault === undefined) {
        showDefault = true;
    }
    return tools.Get(`/api/user/UserDetail/${id}?showDefault=${showDefault}`);
}

//添加好友
export function AddToFriendList(friendId) {
    return tools.Get(`/api/Friend/AddToFriend/${friendId}`);
}
//取消关注
export function RemoveFriend(friendId) {
    return tools.Get(`/api/Friend/RemoveFriend/${friendId}`);
}

export function GetMyFriends(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/Friend/GetFriendList${param}`);
}

export function GetFriendsFocusedOnMe(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/Friend/GetFriendFocusedOnMeList${param}`);
}


//社区
//我发布的朋友圈消息
export function LoadMyFriendCircle(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/MyFriendCircle${param}`);
}
//他人发布的朋友圈
export function LoadFriendCircle(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/ShowFriendCircle${param}`);
}

//保存朋友圈图片
export function UploadCirclePhoto(formData) {
    return tools.Post(`/api/user/SaveCirclePhoto`, formData);
}

export function SaveFriendCircle(data) {
    return tools.Post(`/api/user/SendText`, data)
}

export function SearchPlayground(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/SearchMyPlayGround${param}`);
}

export function ZanFriend(circleFriendId) {
    return tools.Get(`/api/user/ZanFriendCircle/${circleFriendId}`);
}

export function LoadComments(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/LoadComments${param}`)
}

export function SendComments(comments) {
    return tools.Post(`/api/user/SendComment`, comments)
}

export function DeleteComment(id) {
    return tools.Get(`/api/user/DeleteComment/${id}`)
}

export function DeleteFriendCircle(id) {
    return tools.Get(`/api/user/DeleteFriendCircle/${id}`)
}

export function UserGallery(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/friend/GetGallery${param}`);
}


export function MyInformation() {
    return tools.Post(`/api/user/LoadUser`)
}

export function SaveSignature(data) {
    return tools.Post(`/api/user/ChangeSignature`, data)
}


//chat
export function SendChatPhoto(formData) {
    return tools.Post(`/api/common/UploadChatImage`, formData);
}

export function SendChatInvoice(formData) {
    return tools.Post(`/api/common/UploadChatInvoice`, formData);
}


//profile 
export function SaveProfileBasic(data) {
    return tools.Post(`/api/User/SaveProfileBasic`, data)
}
export function SaveHabit(data) {
    return tools.Post(`/api/User/SaveHabit`, data)
}
export function SaveHobby(data) {
    return tools.Post(`/api/User/SaveHobby`, data)
}
export function SaveSenseSWorth(data) {
    return tools.Post(`/api/User/SaveSenseWorth`, data)
}
//保存背景图片
export function UploadbackgroundImage(formData) {
    return tools.Post(`/api/user/UploadBackgroundImage`, formData);
}
//保存基本项
export function UpdateProfile(data) {
    return tools.Post(`/api/user/updateprofile`, data)
}
//保存Requirements
export function SaveRequirements(data) {
    return tools.Post(`/api/user/SaveRequirementItems`, data)
}

export function SaveReqirementHobby(data) {
    return tools.Post(`/api/user/SaveReqirementHobby`, data)
}

export function LoadRequirements() {
    return tools.Post(`/api/user/LoadRequirements`)
}


export function SetSetting(data) {
    return tools.Post(`/api/user/SetSetting`, data)
}

export function SearchReplyOnMeUsers(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/user/SearchReplyMeUsers${param}`);
}
//added by tom
export function PrepareFormByType(type) {
    return tools.Get(`/api/News/PrepareFormByType/${type}`)
}
export function PostPingGu(data) {
    return tools.Post(`/api/News/SaveForm`, data)
}
export function UploadImage(formData) {
    return tools.Post(`/api/Upload/UploadImage`, formData);
}
export function ListAuctions(data) {
    var param = "";
    for (var key in data) {
        param += `&${key}=${data[key]}`;
    }
    if (param.length > 0) {
        param = param.substring(1);
        param = `?${param}`;
    }
    return tools.Get(`/api/Auction/List${param}`);
}
export function GetAuctionDetail(id) {
    return tools.Get(`/api/Auction/Detail/${id}`);
}
export function PayForBid(id){
    return tools.Get(`/api/Auction/PayForBid/${id}`);
}
export function JoinAuction(data) {

    return tools.Post(`/api/Auction/JoinAuction`, data);
}
export function DoAuction(data) {

    return tools.Post(`/api/Auction/BidAuction`, data);
}
export function GetMyAuctions(type) {
    return tools.Get(`/api/Auction/MyAuction/${type}`);
}























