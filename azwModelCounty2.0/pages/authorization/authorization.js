// pages/authorization/authorization.js
const app = getApp();
Page({
  reGetLocationFn:function(){
    wx.openSetting({
      success: function(res) {
        console.log(res);
        if (res.authSetting['scope.userLocation']==true){
          console.log('true = 允许授权')
          app.getLocation(wx.redirectTo({url: "/pages/index/index"}));//重新获取位置信息
        }else{
          console.log('false = 拒绝授权')
        }        
      }
    })
  }
})