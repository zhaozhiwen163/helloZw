const globalData = getApp().globalData, utils = require('../../utils/md5.js');
// pages/shoppingcar/shoppingcar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:0,
    isDisable:true,
    isEmpty:false,
    itemsData: {
      itemsList:null,
      isShowOperation: true,
      // isShowCheckbox: true,
      imgPath: globalData.imgPath
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const userData = wx.getStorageSync('userData');
    this.getShoppingcarDataFn(globalData.appId, userData.region, userData.wxOpenId, globalData.categoryIds);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      totalPrice: 0,
      isDisable: true,
      itemsData: {
        itemsList: null,
        isShowOperation: true,
        imgPath: globalData.imgPath
      }
    })
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

  incrNumFn: function (event) {
    // 购物车商品数量加法
    let that = this,
        itemsList = that.data.itemsData.itemsList,
        currentSkusId = event.target.dataset.skusid;
    for (var i = 0,l; i < itemsList.length; i++) {
      for (l = 0; l < itemsList[i].items.length; l++) {
        if (itemsList[i].items[l].skuId == currentSkusId) {
          var qty = parseInt(itemsList[i].items[l].qty);
          // 商品数量+1
          itemsList[i].items[l].qty = qty + 1 > 999999 ? 999999 : qty + 1;
        }
        //通知后台修改商品数量
        that.shoppingcarBtnFn(itemsList[i].items[l].qty, itemsList[i].items[l].companyIdSkuId);
      }
    }
    // 重绘页面
    that.setData({ itemsData: that.data.itemsData})
  },




  descNumFn: function (event) {
    // 购物车商品数量减法
    let that = this,
        itemsList = that.data.itemsData.itemsList,
        currentSkusId = event.target.dataset.skusid;
    for (var i = 0, l; i < itemsList.length; i++) {
      for (l = 0; l < itemsList[i].items.length; l++) {
        if (itemsList[i].items[l].skuId == currentSkusId) {
          var moq = parseInt(itemsList[i].items[l].moq) < 1 ? 1 : parseInt(itemsList[i].items[l].moq);
          var qty = parseInt(itemsList[i].items[l].qty);
          // 商品数量-1
          itemsList[i].items[l].qty = qty - 1 < moq ? moq : qty - 1;
        }
        //通知后台修改商品数量
        that.shoppingcarBtnFn(itemsList[i].items[l].qty, itemsList[i].items[l].companyIdSkuId);
      }
    }
    // 重绘页面
    that.setData({ itemsData: that.data.itemsData});
  },




  setNumFn: function (event) {
    // 手动输入商品数量
    let that = this,
        itemsList = that.data.itemsData.itemsList,
        currentSkusId = event.target.dataset.skusid,
        setNum = (event.detail.value == "" || parseInt(event.detail.value) < 1) ? 1 : parseInt(event.detail.value);
    for (var i = 0, l; i < itemsList.length; i++) {
      for (l = 0; l < itemsList[i].items.length; l++) {
        if (itemsList[i].items[l].skuId == currentSkusId) {
          var moq = parseInt(itemsList[i].items[l].moq) < 1 ? 1 : parseInt(itemsList[i].items[l].moq);
          var qty = parseInt(itemsList[i].items[l].qty);
          // 商品数量-1
          itemsList[i].items[l].qty = setNum < moq ? moq : setNum;
          if (setNum > 999999) {
            itemsList[i].items[l].qty = 999999;
          } else if (setNum < moq) {
            itemsList[i].items[l].qty = moq;
          } else {
            itemsList[i].items[l].qty = setNum;
          }
        }
        //通知后台修改商品数量
        that.shoppingcarBtnFn(itemsList[i].items[l].qty, itemsList[i].items[l].companyIdSkuId);
      }
    }
    // 重绘页面
    that.setData({ itemsData: that.data.itemsData});
  },



  getShoppingcarDataFn: function (appId, region, wxOpenId, categoryIds){
    wx.showLoading({ title: '玩命加载中...' });
    // 获取商品列表的方法
    const that = this, sign = utils.hexMD5('appId=' + appId + '&categoryIds=' + globalData.categoryId + '&region=' + region + '&wxOpenId=' + wxOpenId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/shopping/showcarts',
      data: {
        appId: appId,
        categoryIds: globalData.categoryId,
        region: region,
        wxOpenId: wxOpenId,
        sign: sign
      },
      success: function (res) {
        if (res.data.result.code == 200){
          let shoppingcarData = res.data.data[0].myCarts;
          for (var i = 0; i < shoppingcarData.length; i++){
            for (var l = 0; l < shoppingcarData[i].items.length; l++){
              var shoppingItems = shoppingcarData[i].items
              shoppingItems[l].price = shoppingItems[l].price.toFixed(2);
              if (shoppingItems[l].img != ''){
                shoppingItems[l].img = shoppingItems[l].img.split('.')[0] + '.' + shoppingItems[l].img.split('.')[1] + '.220x220.' + shoppingItems[l].img.split('.')[1];
              }else{
                shoppingItems[l].img = shoppingItems[l].defaultImg.split('.')[0] + '.' + shoppingItems[l].defaultImg.split('.')[1] + '.220x220.' + shoppingItems[l].defaultImg.split('.')[1];
              }
            }
          }
          that.data.itemsData.itemsList = shoppingcarData;
          // 渲染活动数据
          that.setData({
            itemsData: that.data.itemsData,
            isDisable: false,
            isEmpty: true
          })
          // 重新计价
          that.sumPriceFn();
        }else{
          that.setData({
            itemsData: null,
            totalPrice: (0).toFixed(2),
            isDisable: true,
            isEmpty:false
          })
          
        }; 
        // 隐藏加载提示
        wx.hideLoading();
      }
    })
  },

  itemFn:function(event){
    let that = this,
        companyIdSkuId = event.currentTarget.dataset.companyidskuid,
        wxOpenId = wx.getStorageSync('userData').wxOpenId;
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除该商品？',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({ title: '玩命加载中...' });
          const userData = wx.getStorageSync('userData');
          // 重新渲染页面
          that.delItemFn(globalData.appId, companyIdSkuId, wxOpenId);
          
          that.setData({ itemsData: that.data.itemsData});
        }
      }
    })
  },
  delItemFn: function (appId, companyIdSkuIds, wxOpenId){
    let that = this, sign = utils.hexMD5('appId=' + appId + '&companyIdSkuIds=' + companyIdSkuIds + '&wxOpenId=' + wxOpenId + globalData.key);
    // 删除购物车商品方法
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/shopping/delcarts',
      data: {
        appId: appId,
        companyIdSkuIds: companyIdSkuIds,
        wxOpenId: wxOpenId,
        sign: sign
      },
      success: function (res) {
        let userData = wx.getStorageSync('userData');
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        
        that.getShoppingcarDataFn(globalData.appId, userData.region, userData.wxOpenId, globalData.categoryIds);          
      }
    })
  },
  shoppingcarBtnFn: function (qty, companyIdSkuId) {
    // 修改订单数量
    const that = this,
      userData = wx.getStorageSync('userData'), sign = utils.hexMD5('appId=' + globalData.appId + '&companyIdSkuId=' + companyIdSkuId + '&qty=' + qty + '&wxOpenId=' + userData.wxOpenId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/shopping/addorupdate',
      data: {
        appId: globalData.appId,
        companyIdSkuId: companyIdSkuId,
        qty: qty,
        wxOpenId: userData.wxOpenId,
        sign: sign
      },
      success: function (res) {
          // 重新计价
        that.sumPriceFn();
      }
    })
  },
  sumPriceFn: function () {
    // 重新计价方法
    let that = this,
        priceSum = 0,
        shoppingcarData = this.data.itemsData.itemsList;
    if (shoppingcarData.length) {
      for (var i = 0; i < shoppingcarData.length; i++) {
        for (var l = 0; l < shoppingcarData[i].items.length; l++) {
          // 重新计价
          priceSum += parseInt(shoppingcarData[i].items[l].qty) * (shoppingcarData[i].items[l].price - 0);
        }
      }
      that.setData({ totalPrice: priceSum.toFixed(2) });
    }
  },
  goSettlementFn:function(){
    let that = this,
        orderData = that.setOrderDataFn(that.data.itemsData.itemsList);
    // 订单缓存本地
    wx.setStorageSync("orderData", orderData);
    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm?isCart=1'
    })
  },
  setOrderDataFn: function (itemsData) {
    let itemsDataSer = {},itemData,userData = wx.getStorageSync('userData');
    return (function(data){
      for (var i = 0; i < data.length; i++){
        // 清空商品数组，重新添加
        itemData = {};
        // 循环服务商
        itemsDataSer[`N${data[i].companyId}`] = {
          "companyId": data[i].companyId,
          "region": userData.region,
          "items": (function (items) {
            // 循环服务商下的商品
            for (var l = 0; l < items.length; l++) {
              itemData[items[l].skuId] = {
                id: items[l].skuId,
                qty: items[l].qty
              }
            }
            // 循环结果返回
            return itemData;
          })(data[i].items),
          "key": 'N' + data[i].companyId
        }
      }
      // 循环结果返回
      return itemsDataSer
    })(itemsData)
  }
})