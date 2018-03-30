var globalData = getApp().globalData,
  WxParse = require('../../wxParse/wxParse.js'), utils = require('../../utils/md5.js');

// pages/detail/detail.js
Page({
  data: {
    detData: [],
    serIdx: 0,
    imgPath: globalData.imgPath,
    itemId: '',
    region: '',
  },
  onLoad: function (options) {

    var that = this;
    var userData = wx.getStorageSync('userData')
    // console.log("正常ID" + options.itemId, userData.region)
    // console.log("转发ID" + options.id, options.rg)
    //判断是否是通过转发进的页面
    if (typeof (options.id) == 'undefined') {
      var userData = wx.getStorageSync('userData')
      that.setData({
        itemId: options.itemId,
        region: userData.region
        // itemId: '107',
        // region: 110101
      });
    } else {
      that.setData({
        itemId: options.id,
        region: options.rg
        // itemId: '107',
        // region: 110101
      });
    }
    //是否有本地数据，从而判断是直接进详情页，还是通过列表页进来的
    if (typeof (wx.getStorageSync('userData').region) == 'undefined') {
      wx.login({
        success: function (res) {
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

              //判断是否为新用户
              if (res.data.data.clientId == 0) {
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
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

                        //此方法为，判断此产品是否在用户所属的region区域销售。
                        //that.regionFn(options.id, userData.region)

                        //此方法为， 获取详情页数据
                        that.getDetailDataFn(that.data.itemId, userData.region, 0, 0)

                        // 商品参数信息
                        that.getItemParameterFn();
                      }
                    })
                  },
                  fail: function () {
                    // 用户拒绝授权位置信息，页面跳转至重新授权页 
                    wx.redirectTo({
                      url: "../../pages/authorization/authorization"
                    })
                  }
                })
              } else {
                //此处表示为本地没有存数据的老用户，老用户则取存在本地的数据作为参数调用方法

                //此方法为，判断此产品是否在用户所属的region区域销售。
                //that.regionFn(options.itemId, userData.region)

                //此方法为， 获取详情页数据
                that.getDetailDataFn(that.data.itemId, userData.region, 0, 0)

                // 商品参数信息
                that.getItemParameterFn();
              }
            }
          })
        }
      });
    } else {
      //此处表示为本地有存数据的老用户，老用户则取存在本地的数据作为参数调用方法

      var userData = wx.getStorageSync('userData')

      //此方法为，判断此产品是否在用户所属的region区域销售。
      //that.regionFn(options.itemId, userData.region)

      //此方法为， 获取详情页数据
      that.getDetailDataFn(that.data.itemId, userData.region, 0, 0);

      // 商品参数信息
      that.getItemParameterFn();

    }
  },
  onShow: function (options) {

  },
  onHide: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var itemId = this.data.itemId
    var rg = this.data.region
    return {
      path: 'pages/detail/detail?id=' + itemId + '&rg=' + rg,
    }
  },
  incrNumFn: function () {
    var detData = this.data.detData;
    /* 商品数量加法运算 */
    detData.qty = parseInt(detData.qty) + 1 > 999999 ? 999999 : parseInt(detData.qty) + 1;
    this.setData({ detData: detData });
  },
  descNumFn: function () {
    var detData = this.data.detData;
    /* 商品数量减法运算 */
    detData.qty = parseInt(detData.qty) - 1 < (detData.moq) ? (detData.moq) : parseInt(detData.qty) - 1;
    this.setData({ detData: detData });
  },
  setNumFn: function (event) {
    var detData = this.data.detData, inpVal = (event.detail.value == "" || parseInt(event.detail.value) < 1) ? 1 : parseInt(event.detail.value);
    /* 商品数量输入运算 */
    if (inpVal > 999999) {
      detData.qty = 999999;
    } else if (inpVal < detData.moq) {
      detData.qty = detData.moq;
    } else {
      detData.qty = inpVal;
    }
    this.setData({ detData: detData });
  },
  purchaseBtnFn: function () {
    var detData = this.data.detData, orderData = null, that = this;
    // 缓存数据 orderData ;
    wx.setStorageSync("orderData", that.setOrderDataFn(detData));
    // 跳转到确认订单页面
    wx.navigateTo({ url: '../../pages/orderConfirm/orderConfirm?isCart=0' });
  },
  shoppingcarBtnFn: function () {
    // 加入购物车
    var detData = this.data.detData, companyIdSkuId = (detData.serviceId + '_' + detData.skuId).toString(), userData = wx.getStorageSync('userData'), sign = utils.hexMD5('appId=' + globalData.appId + '&companyIdSkuId=' + companyIdSkuId + '&qty=' + detData.qty + '&wxOpenId=' + userData.wxOpenId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/shopping/addorupdate',
      data: {
        appId: globalData.appId,
        companyIdSkuId: companyIdSkuId,
        qty: detData.qty,
        wxOpenId: userData.wxOpenId,
        sign: sign
      },
      success: function (res) {
        // 成功加入购物车提示面板
        wx.showToast({
          title: '成功加入购物车',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  btnTipFn: function () {
    // 价格待定是提示面板
    wx.showModal({
      title: '温馨提示',
      content: '此价格待定,无法购买'
    })
  },
  specChange: function (event) {
    // 规格切换时，获取规格Id, 商品Id, 区域Id
    var specId = event.target.dataset.specid,
      detData = this.data.detData,
      itemId = this.data.itemId,
      userData = wx.getStorageSync('userData');
    detData.skuId = specId
    // 重置detData中的规格specId
    this.setData({ detData: detData, serIdx: 0 })
    // 重新获取该规格的商品数据，以此渲染页面
    this.getDetailDataFn(itemId, userData.region, specId, 0);
  },

  getDetailDataFn: function (itemId, region, skuId, companyId) {
    // 获取商品详情的方法
    var that = this, serNames = [], sign = utils.hexMD5('companyId=' + companyId + '&itemId=' + itemId + '&region=' + region + '&skuId=' + skuId + globalData.key);
    // console.log("接口" + that.data.itemId, that.data.region)
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/iteminfo',
      method: 'POST',
      data: {
        itemId: itemId,
        region: region,
        skuId: skuId,
        companyId: companyId,
        // sign: sign
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)
        var detData = res.data.data;
        if (detData == null) {
          // console.log("数据为null" + that.data.itemId, that.data.region)
          // that.regionFn(that.data.itemId, that.data.region)
          wx.showLoading({ 
            title: '此区域不展示',
            icon: 'loading',
            duration: 4000
          }),
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/list/list'
            })
          }, 3000)

        } else {

          //设置图片大小
          for (var i = 0; i < detData.itemImgs.length; i++) {
            detData.itemImgs[i] = detData.itemImgs[i].split('.')[0] + '.' + detData.itemImgs[i].split('.')[1] + '.400x400.' + detData.itemImgs[i].split('.')[1];
          }
          // 摘选服务商名称
          for (var s = 0; s < detData.companys.length; s++) {
            serNames.push(detData.companys[s].name);
          }
          //渲染详情页数据
          detData.qty = parseInt(detData.moq) < 1 ? 1 : parseInt(detData.moq);//数量的初始化
          detData.moq = parseInt(detData.moq) < 1 ? 1 : parseInt(detData.moq);//起订量的初始化
          // 格式化价格变为两位小数
          detData.price = detData.price.toFixed(2);
          detData.retailPrice = detData.retailPrice.toFixed(2);

          that.setData({
            detData: detData,
            serNames: serNames
          })
          //隐藏加载提示
          wx.hideLoading();
        }
      },
      fail: function () {
        // console.log(987)

      }
      // fail: function(){
      //   console.log(itemId, region, skuId, companyId)
      // }
    })
  },
  getItemParameterFn: function () {
    var that = this, sign = utils.hexMD5('itemId=' + that.data.itemId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/item/detail',
      method: 'POST',
      data: {
        itemId: that.data.itemId,
        // sign: sign
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var parameterData = res.data.data
        WxParse.wxParse('parameterData', 'html', parameterData, that, 5);
        that.setData({
          wxParseData: parameterData,
          tabIndex: 1
        })
      }
    })
  },
  getItemAttrFn: function () {
    var that = this, sign = utils.hexMD5('itemId=' + that.data.itemId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/item/attr',
      data: {
        itemId: that.data.itemId,
        sign: sign
      },
      success: function (res) {
        that.setData({
          attrData: res.data.data,
          tabIndex: 2
        });
      }
    })
  },
  getItemPolicyFn: function () {
    var that = this, sign = utils.hexMD5('itemId=' + that.data.itemId + globalData.key);
    wx.request({
      url: globalData.testRequestPath + '/item/policy',
      data: {
        itemId: that.data.itemId,
        sign: sign
      },
      success: function (res) {
        var policyData = res.data.data
        WxParse.wxParse('policyData', 'html', policyData, that, 5);
        that.setData({
          wxParseData: policyData,
          tabIndex: 3
        });
      }
    })
  },
  setOrderDataFn: function (detData) {
    var region = wx.getStorageSync('userData').region || this.data.region;
    return {
      [`N${detData.serviceId}`]: {
        "companyId": detData.serviceId,
        "region": region,
        "items": {
          [detData.skuId]: {
            id: detData.skuId,
            qty: detData.qty
          }
        },
        "key": 'N' + detData.serviceId
      }
    }
  },
  bindPickerChange: function (event) {
    // console.log(event)
    var that = this,
      serNames = [].companys,
      userData = wx.getStorageSync('userData'),
      detData = that.data.detData,
      serviceId = detData.companys[event.detail.value].id;
    // console.log(serviceId);
    this.setData({
      serIdx: event.detail.value
    })
    that.getDetailDataFn(that.data.itemId, userData.region, detData.skuId, serviceId);
  },
  regionFn: function (itemId, region) {
    wx.request({
      url: globalData.testRequestPath + '/local/xcx/itemauth',
      method: 'POST',
      data: {
        itemId: itemId,
        region: region
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.data.status;
        if (status == 0) {
          wx.showLoading({
            title: '跳转中...',
            icon: 'loading',
            duration: 4000
          })
          setTimeout(function () {
            wx.navigateTo({ url: '../../pages/index/index' });
          }, 2000)
        }
      }
    })
  }
})