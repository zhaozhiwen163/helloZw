var globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/orderConfirm/orderConfirm.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemsData:{},
    isAddrShow: false,
    isFullPayment: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取订单相关活动信息
    this.getActivityDataFn(wx.getStorageSync('orderData'));
    this.setData({ isCart: options.isCart, userData: wx.getStorageSync('userData')});
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
    // console.log(wx.getStorageSync('addrInfo'))
    // 判断用户是否更改地址
    if (wx.getStorageSync('addrInfo')) {
      this.setData({
        // 获取设置的地址
        addrInfo: wx.getStorageSync('addrInfo'),
        isAddrShow: true
      })
      // console.log(this.data.id)
    }else{
      // 获取默认地址
      this.getAddrList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
  onReachBottom: function () {
  
  },

  getActivityDataFn: function (itemCarts) {
    wx.showLoading({ title: '玩命加载中...' });
    // 获取商品详情的方法
    var that = this, itemData = JSON.stringify(itemCarts), sign = utils.hexMD5('data=' + itemData + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/order/promotion',
      data: {
        data: itemData,
        sign:sign
      },
      success: function (res) {
        that.data.itemsData.itemsList = res.data.data
        var totalPrice = 0, discount = 0, totalSumAdvance = 0;
        for (var i = 0; i < res.data.data.length; i++){
          for (var l = 0; l < res.data.data[i].itemList.length; l++) {
            var itemList = res.data.data[i].itemList[l];
            itemList.img = itemList.img.split('.')[0] + '.' + itemList.img.split('.')[1] + '.220x220.' + itemList.img.split('.')[1];
            itemList.price = itemList.price.toFixed(2);
          }
          that.data.itemsData.itemsList[i].items = res.data.data[i].itemList
          totalPrice += that.data.itemsData.itemsList[i].sumPrice;
          discount += that.data.itemsData.itemsList[i].discount;
          totalSumAdvance += that.data.itemsData.itemsList[i].sumAdvance;
          // 设置图片请求前缀
          that.data.itemsData.imgPath = globalData.imgPath
        }
        // 渲染活动数据
        that.setData({
          itemsData: that.data.itemsData,
          sumPrice: (totalPrice).toFixed(2),
          discount: discount.toFixed(2),
          sumAdvance: (totalSumAdvance).toFixed(2),
          totalPrice: (totalPrice - discount).toFixed(2)
        })
        wx.hideLoading();
      } 
    })
  },
  isSumAdvanceFn: function (event) {
    // console.log(event.detail.value);
    var that = this;
    if (event.detail.value) {
      that.setData({
        totalPrice: (that.data.sumAdvance - 0).toFixed(2),
        isFullPayment: 0
      })
    } else {
      that.setData({
        totalPrice: (that.data.sumPrice - that.data.discount).toFixed(2),
        isFullPayment: 1
      })
    }

  },
  getAddrList: function () {
    var that = this, userData = this.data.userData, sign = utils.hexMD5('clientId=' + userData.clientId + '&region=' + userData.region + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/address/list',
      data: {
        clientId: userData.clientId,
        region: userData.region,
        sign:sign
      },
      success: function (res) {
        if (res.data.data.list.length >= 1){
          that.setData({
            addrInfo: res.data.data.list[0],
            isAddrShow: true
          });
          // console.log(that.data)
        }else{
          that.setData({
            isAddrShow: false,
            addrInfo: false
          });
         
        }
        
      }
    })
  },
  saveOrderFn:function(){
    var that = this, userData = that.data.userData, orderData = wx.getStorageSync('orderData'), itemData = JSON.stringify({
      appId: globalData.appId,
      wxOpenId: userData.wxOpenId,
      buyer: userData.clientId,
      clientAddrId: that.data.addrInfo.id,
      isFullPayment: that.data.isFullPayment,
      itemCarts: orderData,
      isCart: that.data.isCart,
      payMode: 1
    }), sign = utils.hexMD5('data=' + itemData + globalData.key);
    if (that.data.isAddrShow){
      // console.log('-----------000000000000-----------')
      // console.log(itemData)
      // console.log('-----------000000000000-----------')
      wx.request({
        url: globalData.testRequestPath + '/local/xcx/order/save',
        data: {
          data: itemData,
          sign:sign
        },
        success: function (res) {
          // console.log('-----------11111111111-----------')
          // console.log(res)
          // console.log('-----------11111111111-----------')
          /*==-----微信支付接口-----==*/

          that.wxPaymentFn(res.data.data.timeStamp, res.data.data.nonceStr, res.data.data.package, res.data.data.paySign);

          /*==-----微信支付接口-----==*/
        }
      })
    }else{
      wx.showToast({
        title: '请填写地址',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  wxPaymentFn: function (timeStamp, nonceStr, packageData, paySign){
    var that = this, userData = that.data.userData;
    /*==-----微信支付接口-----==*/
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packageData,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        wx.switchTab({
          url: '/pages/list/list',
        })
      },
      'fail': function (res) {
        wx.redirectTo({
          url: '/pages/orderList/orderList?clientId=' + userData.clientId
        })
      }
    })
        /*==-----微信支付接口-----==*/
  }
})