let globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/index/index.js
Page({
  /* 页面的初始数据 */
  data: {
    userData: {
      regionName: wx.getStorageSync('userData').regionName,
      fullName: wx.getStorageSync('userData').fullName
    },
    imgPath: globalData.imgPath,
    countyNoticeInfo: {
      oneImg:  '/images/loading.gif',
      twoImg:  '/images/loading.gif',
      threeImg: '/images/loading.gif',
      fourImg: '/images/loading.gif'
    },
    // isMask: true
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {

    //判断本地是否有region值，没有的时候调登录接口
    if (!wx.getStorageSync('userData') || !wx.getStorageSync('countyNoticeInfo') ) {
      this.loginFn(); 
    }

    //取本地缓存数据设置title
    wx.setNavigationBarTitle({
      title: '爱种网 ' + wx.getStorageSync('userData').fullName
    })

    this.setData({
      countyNoticeInfo: wx.getStorageSync('countyNoticeInfo')
      // isMask: false 
    });
  },

  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
    // this.setData({
    //   countyNoticeInfo: wx.getStorageSync('countyNoticeInfo')
    //   // isMask: false 
    // });
  },
 
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    if (wx.getStorageSync('userData').fullName == "") {
      this.setData({ isMask: false });
    }
  },

  onHide: function () {
    this.setData({ isMask: false });
  },

  /* 用户点击右上角分享 */
  onShareAppMessage: function () {

  },
  loginFn: function () {
    //调用登录接口
    let that = this;
    wx.login({
      success: function (res) {
        const sign = utils.hexMD5('code=' + res.code + globalData.key);
        //请求登陆数据
        wx.request({
          url: globalData.testRequestPath + '/local/xcx/login',
          data: {
            code: res.code,
            sign: sign
          },
          success: function (res) {

            // 动态设置首页的title
            wx.setNavigationBarTitle({ title: '爱种网 ' + res.data.data.fullName });

            /* 缓存用户微信信息 */
            wx.setStorageSync('userData', {
              wxOpenId: res.data.data.wxOpenid,
              clientId: res.data.data.clientId,
              region: res.data.data.region,
              mob: res.data.data.mob,
              fullName: res.data.data.fullName,
              regionName: res.data.data.regionName
            });
            if (res.data.data.clientId == 0) {
              /* wxOpenid == 0 为新用户，否则为老用户 */
              that.getLocation();/* 获取该用户位置信息 */
            } else {
              if (res.data.data.fullName == "") {
                wx.redirectTo({
                  url: '../download/download'
                })
              } else { 
                res.data.data.countyNotice.oneImg = globalData.imgPath + res.data.data.countyNotice.oneImg;
                res.data.data.countyNotice.twoImg = globalData.imgPath + res.data.data.countyNotice.twoImg;
                res.data.data.countyNotice.threeImg = globalData.imgPath + res.data.data.countyNotice.threeImg;
                res.data.data.countyNotice.fourImg = globalData.imgPath + res.data.data.countyNotice.fourImg;
                /* 使用老用户的注册地信息，返回相对应的信息 */
                wx.setStorageSync('countyNoticeInfo', res.data.data.countyNotice);  /* 缓存首页公告 + banner */
                that.setData({ countyNoticeInfo: res.data.data.countyNotice, isMask: false });
              }
            }
          }
        })
      }
    });
  },
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const sign = utils.hexMD5('x=' + res.latitude + '&y=' + res.longitude + globalData.key);
        //请求登陆数据
        wx.request({
          url: globalData.testRequestPath + '/local/xcx/region',
          data: {
            x: res.latitude,
            y: res.longitude,
            sign: sign
          },
          success: function (res) {
            if (res.data.data.fullName == "") {
              wx.redirectTo({
                url: '../download/download'
              })
            } else {
              // 动态设置首页的title
              wx.setNavigationBarTitle({ title: '爱种网 ' + res.data.data.fullName });
              /* 使用新用户的位置信息，返回相对应信息 */

              /* 追加用户位置信息 */
              wx.setStorageSync('userData', {
                wxOpenId: wx.getStorageSync('userData').wxOpenId,
                clientId: wx.getStorageSync('userData').clientId,
                mob: wx.getStorageSync('userData').mob,
                fullName: res.data.data.fullName,
                regionName: res.data.data.regionName,
                region: res.data.data.region
              });
              // 首页地标图
              res.data.data.countyNotice.oneImg = globalData.imgPath + res.data.data.countyNotice.oneImg;
              res.data.data.countyNotice.twoImg = globalData.imgPath + res.data.data.countyNotice.twoImg;
              res.data.data.countyNotice.threeImg = globalData.imgPath + res.data.data.countyNotice.threeImg;
              res.data.data.countyNotice.fourImg = globalData.imgPath + res.data.data.countyNotice.fourImg;
              wx.setStorageSync('countyNoticeInfo', res.data.data.countyNotice);  /* 缓存首页公告 + banner */
              that.setData({ countyNoticeInfo: res.data.data.countyNotice, isMask: false });
            }

          }
        })
      },
      fail: function () {
        /* 用户拒绝授权位置信息，页面跳转至重新授权页 */
        wx.redirectTo({
          url: "/pages/authorization/authorization"
        })
      }
    })
  },
  tipFn: function (e) {
    wx.showToast({
      title: '功能开发中...',
      icon: 'loading',
      duration: 1000
    })
  }
})