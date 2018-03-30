let globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetData:null,
    imgPath: globalData.imgPath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('订单ID=', options.orderId);
    this.setData({ orderId: options.orderId});
    this.getOrderInfoFn(options.orderId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  getOrderInfoFn: function (){
    let that = this, sign = utils.hexMD5('orderId=' + that.data.orderId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/order/detail',
      data: {
        orderId: that.data.orderId,
        sign: sign
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        for (var i = 0; i < data.items.length; i++){
          data.items[i].price = data.items[i].price.toFixed(2);
          data.items[i].img = data.items[i].img.split('.')[0] + '.' + data.items[i].img.split('.')[1] + '.220x220.' + data.items[i].img.split('.')[1];
        }
        data.amount = data.amount.toFixed(2);
        data.discount = data.discount.toFixed(2);
        data.retailPayAmount = data.retailPayAmount.toFixed(2);
        data.prepaid = data.prepaid.toFixed(2);
        data.payPrepaid = data.payPrepaid.toFixed(2);
        data.spareMoney = data.spareMoney.toFixed(2);
        that.setData({
          orderDetData: data
        })
      }
    })
  },
  receivedFn: function (event) {
    // 确认收货按钮
    let that = this, userData = wx.getStorageSync('userData'), orderId = event.currentTarget.dataset.orderid, sign = utils.hexMD5('clientId=' + userData.clientId + '&id=' + orderId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/order/signbyId',
      data: {
        clientId: userData.clientId,
        id: orderId,
        sign: sign
      },
      success: function (res) {
        wx.showToast({
          title: '签收成功',
          icon: 'success',
          duration: 800
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 800)
        // 刷新订单
        that.getOrderListFn(userData.clientId, 1, 0);
        that.setData({ status: 0 });
      }
    })
  },
  cancelOrderFn: function (event) {
    // 取消订单
    let that = this, orderId = event.currentTarget.dataset.orderid, sign = utils.hexMD5('id=' + orderId + globalData.key);
    wx.showModal({
      title: '温馨提示',
      content: '您确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: globalData.testRequestPath + '/local/xcx/order/del',
            data: {
              id: orderId,
              sign: sign
            },
            success: function (res) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 800
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 800)
            }
          })
        }
      }
    })
  },
  postOrderFn: function (event){
    let that = this, orderId = event.currentTarget.dataset.orderid, sign = utils.hexMD5('orderId=' + orderId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/common/wx/pay',
      data: {
        orderId: orderId,
        sign: sign
      },
      success: function (res) {
         /*==-----微信支付接口-----==*/
        console.log(res)
        that.wxPaymentFn(res.data.data.timeStamp, res.data.data.nonceStr, res.data.data.package, res.data.data.paySign);

        /*==-----微信支付接口-----==*/
      }
    })
  },
  wxPaymentFn: function (timeStamp, nonceStr, packageData, paySign) {
    /*==-----微信支付接口-----==*/
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packageData,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        wx.navigateBack({
          delta: 1
        })
      },
      'fail': function (res) {
        
      }
    })
    /*==-----微信支付接口-----==*/
  }
})