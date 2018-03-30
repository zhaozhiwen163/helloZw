var globalData = getApp().globalData
var utils = require('../../utils/md5.js')
//pages/modelField/modelField.js
Page({
  /**页面的初始数据**/
  data: {
    crop: '',
    cropType: '',
    navidx: 0,
    textData: '',
    currentCrop: [0, 0],
    currentCropTxt: '点击选择作物品种',
    arrcropList: '',
    arrcTypeList: '',
    itemsData: [],
    yiCrop: '',
    erCrop: '全部',
    imgPath: globalData.imgPath,
    pageNo: 1,
    kongDatas: [],
    searchLoading: false,
    searchLoadingComplete: false,
    switchTab: false,
    farmList: ''
  },
  /** 生命周期函数--监听页面加载 **/
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageNo: that.data.pageNo,
      kongDatas: [],
      itemsData: [],
      pageNo: 1,
      switchTab: true
    })
    var region = wx.getStorageSync("userData").region;
    this.getFieldFn(that.data.crop, that.data.cropType, that.data.pageNo++, region, 0);
  },

  /**生命周期函数--监听页面初次渲染完成**/
  onReady: function () {

  },

  /**生命周期函数--监听页面显示 **/
  onShow: function () {

  },

  /**生命周期函数--监听页面隐藏**/
  onHide: function () {

  },

  /**生命周期函数--监听页面卸载**/
  onUnload: function () {

  },

  /**页面相关事件处理函数--监听用户下拉动作**/
  onPullDownRefresh: function () {

  },

  /**页面上拉触底事件的处理函数**/
  onReachBottom: function () {
    var that = this;
    var navidx = that.data.navidx;
    var region = wx.getStorageSync("userData").region;
    that.setData({
      searchLoading: true,
      searchLoadingComplete: false
    })
    var switchTab = that.data.switchTab
    if (navidx == 0) {
      if (switchTab == true) {
        that.getFieldFn(that.data.crop, that.data.cropType, that.data.pageNo++, region, 0);
      } else if (switchTab == false) {
        that.getFieldFn(that.data.crop, that.data.cropType, ++that.data.pageNo, region, 0);
      }
    }
    else if (navidx == 2) {
      that.getFieldFn(that.data.crop, that.data.cropType, that.data.pageNo++, region, 2);
    } else if (navidx == 9) {
      that.getFieldFn(that.data.crop, that.data.cropType, that.data.pageNo++, region, 9);
    }
    if (that.data.farmList == '') {
      that.setData({
        searchLoading: false,
        searchLoadingComplete: false
      })
    }
  },

  /**用户点击右上角分享**/
  onShareAppMessage: function () {

  },
  swichNavFn: function (event) {
    this.setData({
      itemsData: [],
      pageNo: 1,
      switchTab: true
    })
    var navidx = event.target.dataset.navidx;
    this.setData({ navidx: navidx });
    var region = wx.getStorageSync("userData").region;
    // this.getFieldFn(this.data.crop, this.data.cropType, this.data.pageNo++, region, navidx);

    wx.showLoading({ title: '玩命加载中...' });
    // 获取商品详情的方法
    var status = navidx, crop = this.data.crop, cropType = this.data.cropType, pageNo = this.data.pageNo++;
    var that = this, sign = utils.hexMD5('crop=' + crop + '&cropType=' + cropType + '&pageNo=' + pageNo + '&region=' + region + '&status=' + status + globalData.key);
    var liDatas = [];
    wx.request({
      url: globalData.testRequestPath + '/plots/search',
      method: 'POST',
      data: {
        crop: crop,
        cropType: cropType,
        pageNo: pageNo,
        region: region,
        status: status,
        // sign: sign
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        var data = res.data.data;
        that.setData({
          itemsData: [],
        })
        var kongDatas = that.data.kongDatas;
        var valueBom = that.data.currentCrop[0]
        var itemData = res.data.data.listJsonPlots;
        var cropText = res.data.data.crop + res.data.data.cropType;
        // 一级二级分类双重数组
        var cropList = itemData.cropList;
        var cropTypeList = itemData.cropTypeList;
        // 一级二级重组之后数组
        var arrcropList = ['全部'];
        var arrcTypeList = ['全部'];
        // 一级二级合并数组
        //提取数组数据，重组数组
        for (var i = 0; i < cropList.length; i++) {
          arrcropList[i + 1] = cropList[i].name
        }
        if (valueBom != 0) {
          for (var i = 0; i < cropTypeList.length; i++) {
            arrcTypeList[i + 1] = cropTypeList[i].name
          }
        }
        for (var i = 0; i < itemData.farmList.length; i++) {
          kongDatas.push(itemData.farmList[i])
        }
        var nowData = that.data.kongDatas;
        // 渲染首页列表数据
        that.setData({
          itemsData: that.data.itemsData.concat(itemData.farmList),
          // itemsData: kongDatas,   
          textData: [arrcropList, arrcTypeList],
          arrcropList: arrcropList,
          arrcTypeList: arrcTypeList,
          currentCropTxt: data.crop == '' ? '点击选择作物品种' : (data.crop + data.cropType),
          crop: data.crop,
          cropType: data.cropType,
        })
        if (itemData.totalCount % 10 > 0) {
          var num = 1;
        }
        if (that.data.pageNo >= itemData.totalCount / 10 + num) {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true
          })
        }
        // 隐藏加载提示
        wx.hideLoading();
      }
    })
  },

  // 一级二级类作物筛选
  bindchangeCrop: function (e) {
    this.setData({
      itemsData: [],
      pageNo: 1,
      switchTab: true
    })
    var that = this,
      yiCrop = that.data.arrcropList[e.detail.value[0]],
      erCrop = that.data.arrcTypeList[e.detail.value[1]],
      navidx = that.data.navidx;
    var region = wx.getStorageSync("userData").region;
    if (yiCrop == '全部') {
      that.getFieldFn('', '', that.data.pageNo++, region, navidx);
    } else if (yiCrop != '全部' && erCrop == '全部') {
      that.getFieldFn(yiCrop, '', that.data.pageNo++, region, navidx);
    } else {
      that.getFieldFn(yiCrop, erCrop, that.data.pageNo++, region, navidx);
    }
    that.setData({
      yiCrop: yiCrop,
      erCrop: erCrop,
    })
  },
  bindcolumnchangeFn: function (event) {
    var that = this, sign = utils.hexMD5('crop=' + that.data.arrcropList[event.detail.value] + globalData.key);
    var region = wx.getStorageSync("userData").region;
    var erData = ['全部'];
    var column = event.detail.column, value = event.detail.value;
    if (event.detail.column == 0) {
      if (event.detail.value > 0) {
        wx.request({
          url: globalData.testRequestPath + '/plots/plotcropType',
          method: 'POST',
          data: {
            crop: that.data.arrcropList[event.detail.value],
            region: region
            // sign: sign
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {

            for (var i = 0; i < res.data.data.length; i++) {
              erData[i + 1] = res.data.data[i].name
            };

            that.data.textData[1] = erData

            that.setData({
              textData: that.data.textData,
              arrcTypeList: erData,
              currentCrop: [value, column]
            })
          }
        })
      } else {
        that.data.textData[1] = ['全部']
        that.setData({
          textData: that.data.textData,
          arrcTypeList: erData,
          currentCrop: [value, column]
        })
      }
    }
  },
  tipFn: function (e) {
    wx.showToast({
      title: '功能开发中...',
      icon: 'loading',
      duration: 1000
    })
  },
  getFieldFn: function (crop, cropType, pageNo, region, status) {
    var region = wx.getStorageSync("userData").region;
    wx.showLoading({ title: '玩命加载中...' });
    // 获取商品详情的方法
    var status = status;
    var that = this, sign = utils.hexMD5('crop=' + crop + '&cropType=' + cropType + '&pageNo=' + pageNo + '&region=' + region + '&status=' + status + globalData.key);
    var liDatas = [];
    wx.request({
      url: globalData.testRequestPath + '/plots/search',
      method: 'POST',
      data: {
        crop: crop,
        cropType: cropType,
        pageNo: pageNo,
        region: region,
        status: status,
        // sign: sign
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data.data;
        var farmList = data.listJsonPlots.farmList;
        var kongDatas = that.data.kongDatas;
        var valueBom = that.data.currentCrop[0]
        var itemData = res.data.data.listJsonPlots;
        var cropText = res.data.data.crop + res.data.data.cropType;
        // 一级二级分类双重数组
        var cropList = itemData.cropList;
        var cropTypeList = itemData.cropTypeList;
        // 一级二级重组之后数组
        var arrcropList = ['全部'];
        var arrcTypeList = ['全部'];
        // 一级二级合并数组
        //提取数组数据，重组数组
        for (var i = 0; i < cropList.length; i++) {
          arrcropList[i + 1] = cropList[i].name
        }
        if (valueBom != 0) {
          for (var i = 0; i < cropTypeList.length; i++) {
            arrcTypeList[i + 1] = cropTypeList[i].name
          }
        }
        for (var i = 0; i < itemData.farmList.length; i++) {
          kongDatas.push(itemData.farmList[i])
        }
        var nowData = that.data.kongDatas;
        // 渲染首页列表数据
        that.setData({
          itemsData: that.data.itemsData.concat(itemData.farmList),
          // itemsData: kongDatas,
          textData: [arrcropList, arrcTypeList],
          arrcropList: arrcropList,
          arrcTypeList: arrcTypeList,
          currentCropTxt: data.crop == '' ? '点击选择作物品种' : (data.crop + data.cropType),
          crop: data.crop,
          cropType: data.cropType,
        })
        if (itemData.totalCount % 10 > 0) {
          var num = 1;
        }
        if (farmList == '') {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true
          })
        }
        // 隐藏加载提示

        wx.hideLoading()


      },
      
      complete: function () {

      }
    })

  }
})