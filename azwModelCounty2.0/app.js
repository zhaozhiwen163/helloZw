//app.js
const utils = require('/utils/md5.js');
App({
  onLaunch: function (options) {
     //this.loginFn();
  },
  getUserInfoFn: function () {
    //获取用户信息接口
    const userData = this.globalData.userData;
    wx.getUserInfo({
      success: function (res) {
        userData.userInfo = res.userInfo;
      }
    }) 
  },
  globalData: {
    appId: 'wx053afd8bdbf79282',
    categoryId: '21,2101,210101;21,2101,210102;21,2101,210103;21,2104,210402',
    //testRequestPath: "https://lz.51test.com/dsi-qd",       //李钊
    //testRequestPath: "https://test.aizhongwang.cn/dsi",    //黄美青
    //imgPath:'http://192.168.0.116:8020/',

    testRequestPath: "https://dsi.51zhongzi.com",
    imgPath: "https://img.51zhongzi.com/",
    key: '&key=YjU5YTA3NzEtMDI2MS00YzhiLTljM2ItYzE2MTljZDQwNDNhNGExYjEzZTUtYmIx'
  }
})