const globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/addrList/addrList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openType:'navigateBack',
    addrListData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.isOrder == 1){
      this.setData({
        openType:'navigateBack'
      })
    }else{
      this.setData({
        openType: null
      })
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
    wx.removeStorageSync('addrInfo');
    // 获取地址列表
    this.getAddrList();
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
  getAddrList:function(){
    // 显示加载提示
    wx.showLoading({ title: '玩命加载中...' });
    const that = this, userData = wx.getStorageSync('userData'), sign = utils.hexMD5('clientId=' + userData.clientId + '&region=' + userData.region + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/address/list',
      data: {
        clientId: userData.clientId,
        region: userData.region,
        sign: sign
      },
      success: function (res) {
        that.setData({
          addrListData:res.data.data.list
        })
        // 隐藏加载提示
        wx.hideLoading();
      }
    }) 
  },
  useAddrFn:function(event){
    let idx = event.target.dataset.idx,
        addrList = this.data.addrListData;
    wx.setStorageSync('addrInfo', addrList[idx]);
  }
})