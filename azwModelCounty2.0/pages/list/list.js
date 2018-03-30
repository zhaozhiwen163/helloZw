
var globalData = getApp().globalData, utils = require('../../utils/md5.js');

// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countyNoticeInfo: null,
    itemsData: [],
    imgPath: globalData.imgPath,
    totalPages: 10,
    pageNum: 1,
    perpage: 10,
    isShow: true,
    userData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (typeof (wx.getStorageSync('userData').region) == 'undefined'){
      // const key = '&key=YjU5YTA3NzEtMDI2MS00YzhiLTljM2ItYzE2MTljZDQwNDNhNGExYjEzZTUtYmIx';
      wx.login({
        success: function (res) {
          // const key = key;
          // const sign = utils.hexMD5('code=' + res.code + key);
          //请求登陆数据
          wx.request({
            url: globalData.testRequestPath + '/local/xcx/login',
            method: 'POST',
            data: {
              code: res.code,
              // sign: sign
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            success: function (res) {
              /* 缓存用户微信信息 */
              wx.setStorageSync('userData', {
                wxOpenId: res.data.data.wxOpenid,
                clientId: res.data.data.clientId,
                region: res.data.data.region,
                mob: res.data.data.mob,
                fullName: res.data.data.fullName,
                regionName: res.data.data.regionName
              });
              var userData = wx.getStorageSync('userData'); 
              // 判断新获取的regin 是否等于 页面上的regin

              //判断是否为新用户
              if (res.data.data.clientId == 0) {
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    // const sign = utils.hexMD5('x=' + res.latitude + '&y=' + res.longitude + key);
                    //请求登陆数据
                    wx.request({
                      url: globalData.testRequestPath + '/local/xcx/region',
                      method: 'POST',
                      data: {
                        x: res.latitude,
                        y: res.longitude,
                        // sign: sign
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        wx.setStorageSync('userData', {
                          wxOpenId: wx.getStorageSync('userData').wxOpenId,
                          clientId: wx.getStorageSync('userData').clientId,
                          mob: wx.getStorageSync('userData').mob,
                          fullName: res.data.data.fullName,
                          regionName: res.data.data.regionName,
                          region: res.data.data.region
                        });
                        var userData = wx.getStorageSync('userData');
                        that.setData({
                          itemsData: [],
                          countyNoticeInfo: wx.getStorageSync('countyNoticeInfo'),
                          imgPath: globalData.imgPath,
                        })
                        // 获取首页数据
                        that.getItemsFn(globalData.categoryId, that.data.pageNum, that.data.perpage, userData.region);
                        // 动态设置列表也的title
                        wx.setNavigationBarTitle({ title: '爱种网 ' + userData.fullName });
                      }
                    })
                  },
                  fail: function () {
                    /* 用户拒绝授权位置信息，页面跳转至重新授权页 */
                    wx.redirectTo({
                      url: "../../pages/authorization/authorization"
                    })
                  }
                })
              } else {
                // 动态设置列表也的title
                wx.setNavigationBarTitle({ title: '爱种网 ' + userData.fullName });
                that.getItemsFn(globalData.categoryId, that.data.pageNum, that.data.perpage, userData.region);
              }
            }
          })
        }
      });
    }else{
      var userData = wx.getStorageSync('userData'); 
      // 动态设置列表也的title
      wx.setNavigationBarTitle({ title: '爱种网 ' + userData.fullName });
      // 获取首页数据
      that.getItemsFn(globalData.categoryId, that.data.pageNum, that.data.perpage, userData.region);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isShow: true });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    var userData = wx.getStorageSync('userData');
    // 下拉加载
    this.setData({ pageNum: ++this.data.pageNum });
    if (this.data.pageNum <= this.data.totalPages) {
      wx.showLoading({ title: '玩命加载中...' });
      this.getItemsFn(globalData.categoryId, this.data.pageNum, this.data.perpage, userData.region);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
  },
  getItemsFn: function (categoryId, pageNum, perpage, region) {
    
    // 显示加载提示
    wx.showLoading({ title: '玩命加载中...' });
    setTimeout(function () {
      wx.hideLoading();
    }, 3000)
    const that = this, sign = utils.hexMD5('categoryId=' + categoryId + '&pageNum=' + pageNum + '&perpage=' + perpage + '&region=' + region + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/itemlist',
      data: {
        categoryId: categoryId,
        pageNum: pageNum,
        perpage: perpage,
        region: region,
        sign: sign
      },
      success: function (res) {
 
        // 格式化价格变为两位小数
        var itemData = res.data.data.items;
        for (var i = 0; i < itemData.length; i++) {
          itemData[i].minPrice = itemData[i].minPrice.toFixed(2);
          itemData[i].defaultImg = itemData[i].defaultImg.split('.')[0] + '.' + itemData[i].defaultImg.split('.')[1] + '.220x220.' + itemData[i].defaultImg.split('.')[1];
        }
        // console.log(res.data.data.items.length)
        // 渲染首页列表数据
        that.setData({
          itemsData: that.data.itemsData.concat(res.data.data.items),
          totalPages: Math.ceil(res.data.data.fullListSize / 10),
          region: wx.getStorageSync('userData').region
        });

        // 隐藏加载提示
        wx.hideLoading();
      },
      fail: function () {

      }
    })
  },
  tipFn: function (e) {
    wx.showToast({
      title: '功能开发中...',
      icon: 'loading',
      duration: 1000
    })
  },
  openAdFn: function () {
    this.setData({ isShow: false });
  },
  closeAdFn: function () {
    this.setData({ isShow: true });
  }
})