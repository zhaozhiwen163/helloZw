const globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/addrEdit/addrEdit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fullName: wx.getStorageSync('userData').fullName,
    isDefault:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({ isUpdeAddr:true})
      this.getAddrList(options.id);
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
    
    this.setData({ fullName: wx.getStorageSync('userData').fullName})
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
  saveAddrFn: function () {
    const that = this, userData = wx.getStorageSync('userData'), sign = utils.hexMD5('address=' + that.data.address + '&clientId=' + userData.clientId + '&consignee=' + that.data.consignee + '&isDefault=' + that.data.isDefault + '&mob=' + that.data.mob + '&region=' + userData.region + '&tel=' + that.data.mob + '&wxOpenid=' + userData.wxOpenId + globalData.key);
    console.log(userData.clientId)
    wx.request({
      url: globalData.testRequestPath + '/address/xcx/add',
      method: 'POST',
      data: {
        address: that.data.address,
        clientId: userData.clientId,
        consignee: that.data.consignee,
        isDefault: that.data.isDefault,
        mob: that.data.mob,
        region: userData.region,
        tel: that.data.mob,
        wxOpenid: userData.wxOpenId,
        sign: sign
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data.clientId)
        wx.setStorageSync('userData',{
          wxOpenId: userData.wxOpenId,
          clientId: res.data.data.clientId,
          fullName: userData.fullName,
          area: userData.area,
          region: userData.region
        })
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 800
        })
        setTimeout(function () {
          wx.navigateBack({
            url: '/pages/addrList/addrList'
          })
        }, 800)
      }
    })
  },  
  updateAddrFn: function () {
    const that = this, userData = wx.getStorageSync('userData'), sign = utils.hexMD5('address=' + that.data.address + '&clientId=' + userData.clientId + '&consignee=' + that.data.consignee + '&id=' + that.data.id + '&isDefault=' + that.data.isDefault + '&mob=' + that.data.mob + '&region=' + userData.region + '&tel=' + that.data.mob + '&wxOpenid=' + userData.wxOpenId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/address/update',
      data: {
        address: that.data.address,
        clientId: userData.clientId,
        consignee: that.data.consignee,
        id: that.data.id,
        isDefault: that.data.isDefault,
        mob: that.data.mob,
        region: userData.region,
        tel: that.data.mob,
        wxOpenid: userData.wxOpenId,
        sign:sign
      },
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 800
        })
        setTimeout(function () {
          wx.navigateBack({
            url: '/pages/addrList/addrList'
          })
        }, 800)
      }
    })
  },
  testInfoFn: function () {
    if (this.data.consignee == '' || this.data.consignee == null || (/^[ ]+$/.test(this.data.consignee))){
      wx.showToast({
        title: '收货人不能为空',
        icon: 'loading',
        duration: 1000
      })
      return false
    } else if (this.data.mob == '' || !(/^1[34578]\d{9}$/.test(this.data.mob))) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'loading',
        duration: 1000
      })
      return false
    } else if (this.data.address == '' || this.data.address == null || (/^[ ]+$/.test(this.data.address))) {
      wx.showToast({
        title: '填写详细地址',
        icon: 'loading',
        duration: 1000
      })
      return false
    }else{
      this.data.isUpdeAddr ? this.updateAddrFn() : this.saveAddrFn();
    }
  },
  delAddrFn:function(){
    const that = this, sign = utils.hexMD5('id=' + that.data.id + globalData.key);
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: globalData.testRequestPath + '/address/delete',
            data: {
              id: that.data.id,
              sign: sign
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 800
              })
              setTimeout(function(){
                wx.navigateBack({
                  url: '/pages/addrList/addrList'
                })
              },800)
            }
          })
        }
      }
    })
  },
  getAddrList: function (addrId) {
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
        var data = res.data.data.list
        for (var i = 0; i < data.length; i++){
          if (data[i].id == addrId){
            that.setData({
              address: data[i].address,
              clientId: userData.clientId,
              consignee: data[i].consignee,
              isDefault: data[i].isDefault,
              id: data[i].id,
              mob: data[i].mob,
              region: userData.region,
              tel: data[i].mob,
              wxOpenid: userData.wxOpenId
            })
          }
        }
        // 隐藏加载提示
        wx.hideLoading();
      }
    })
  },
  blurSetValFn: function (event) {
    var key = event.currentTarget.dataset.key, val = event.detail.value;
    this.data[key] = val;
    this.setData({ addrInfo: this.data.addrInfo });
  },
  isDefaultChangeFn: function (event) {
    console.log(event.detail.value);
    var key = event.currentTarget.dataset.key, val = event.detail.value;
    this.data[key] = val ? 1 : 0;
    this.setData({ addrInfo: this.data.addrInfo });
  }
})