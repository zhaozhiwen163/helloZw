var globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemsData: null,
    orderId: null,
    status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '玩命加载中...' })
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
    this.getOrderListFn(1, 0);
    // 重置tab为全部订单
    this.setData({status: 0});

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
  getOrderListFn: function (sdate, status){
    var that = this, clientId = wx.getStorageSync('userData').clientId, sign = utils.hexMD5('clientId=' + clientId + '&sdate=' + sdate + '&status=' + status + '&type=33' + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/order/list',
      data: {
        clientId: clientId,
        sdate: sdate,
        status: status,
        type:33,
        sign: sign
      },
      success: function (res) {
        wx.hideLoading();
        // 价格数组格式化为两位小数
        for (var i = 0; i < res.data.data.length; i++){
          for (var l = 0; l < res.data.data[i].items.length; l++){
            var itemData = res.data.data[i].items
            itemData[l].price = itemData[l].price.toFixed(2);
            itemData[l].img = itemData[l].img.split('.')[0] + '.' + itemData[l].img.split('.')[1] + '.220x220.' + itemData[l].img.split('.')[1];
          }
          res.data.data[i].amount = res.data.data[i].amount.toFixed(2);
        }
        that.setData({
          itemsData:{
            itemsList:res.data.data,
            isShowOperation: false, //是否显示运算组件
            isShowOrderBtn: true, //是否显示订单操作组件
            imgPath: globalData.imgPath
          }
        })
        wx.hideLoading();
      }
    })
  },
  orderChangeFn: function (event) {
    wx.showLoading({ title: '玩命加载中...' });
    // 规格切换时，获取规格Id, 商品Id, 区域Id
    var status = event.target.dataset.status;
    // 切换tab选中状态
    this.setData({ status: status });
    
    // 重新加载商品列表
    this.getOrderListFn( 1, status);
  },
  orderDatailFn:function(event){
    console.log(event.currentTarget.dataset)
    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({ url: '../../pages/orderDetail/orderDetail?orderId=' + orderId });    
  },
  receivedFn: function (event){
    // 确认收货按钮
    var that = this, userData = wx.getStorageSync('userData'), orderId = event.currentTarget.dataset.orderid, sign = utils.hexMD5('clientId=' + userData.clientId + '&id=' + orderId + globalData.key);
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
          duration: 1500
        })
        // 刷新订单
        that.getOrderListFn( 1, 0);
        that.setData({ status: 0 });
      }
    })
  },
  postOrderFn: function (event) {
    // 下单成功，调支付
    var that = this, orderId = event.currentTarget.dataset.orderid, sign = utils.hexMD5('orderId=' + orderId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/common/wx/pay',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        orderId: orderId,
        sign: sign
      },
      success: function (res) {
        // 刷新订单
        that.getOrderListFn( 1, 0);
        that.setData({ status: 0 });
        /*==-----微信支付接口-----==*/

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
        
      },
      'fail': function (res) {

      },
      'compalate':function(){
       
      }
    })
    /*==-----微信支付接口-----==*/
  }
})