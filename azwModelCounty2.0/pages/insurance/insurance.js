// pages/insurance/insurance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    insuranceData:[
      {
        id: '0',
        imgUrl: 'https://www.51zhongzi.com/article/20170505/imgs/img11493976442651.jpg',
        title: '河南玉米种植保险扩展保险金额保险(中国人民财产保险股份有限公司)',
        intro: '第一条 本条款为《中国人民财产保险股份有限公司河南省分公司玉米种植保险》（以下简称主险）的附加险条款，在投保了主险的基础上，且玉米种植面积在100亩以上（含）的种植户，方可投保本附加险。',
        companyName: "中国人民财产保险股份有限公司",
        insuranceAmount: "详情查看合同内容",
        premiumRate: "6%",
        formula: "保险费=每亩保险金额（元/亩）×保险费率×保险面积（亩）",
        period: '详情咨询商家',
        detImgUrls: ['https://www.51zhongzi.com/article/20170505/imgs/img14939765423932.jpg','https://www.51zhongzi.com/article/20170505/imgs/img31493976437270.jpg']
      },
      {
        id: '1',
        imgUrl: 'https://www.51zhongzi.com/article/20170505/imgs/img16493976092310.jpg',
        title: '河南小麦种植保险扩展保险金额保险(中国人民财产保险股份有限公司)',
        intro: '第一条 本条款为《中国人民财产保险股份有限公司河南省分公司小麦种植保险》（以下简称主险）的附加险条款，在投保了主险的基础上，且小麦种植面积在100亩以上（含）的种植户，方可投保本附加险。',
        companyName: "中国人民财产保险股份有限公司  ",
        insuranceAmount: "每亩保险金额最高不超过600元。",
        premiumRate: "6%",
        formula: "保险费=每亩保险金额（元/亩）×保险费率×保险面积（亩）",
        period: '详情咨询商家',
        detImgUrls: ['https://www.51zhongzi.com/article/20170505/imgs/img14993976015025.jpg','https://www.51zhongzi.com/article/20170505/imgs/img14939876078696.jpg']
      },
      {
        id: '2',
        imgUrl: 'https://www.51zhongzi.com/article/20170505/imgs/img14939771178791.jpg',
        title: '河南小麦产值保险(中国人民财产保险股份有限公司)',
        intro: '第一条 本保险合同由保险条款、投保单、保险单、保险凭证以及批单组成。凡涉及本保险合同的约定，均应采用书面形式。',
        companyName: "中国人民财产保险股份有限公司",
        insuranceAmount: "保险金额=每亩保险金额×保险面积 ",
        premiumRate: "6%",
        formula: "每亩保险金额=每亩保险产量（公斤）×每公斤保险目标价格（元/公斤）×保障比例 ",
        period:'本保险合同的保险责任期间自保险小麦出苗时起，至保险小麦收获时止，但不得超出保险单载明的保险期间范围。',
        detImgUrls: ['https://www.51zhongzi.com/article/20170505/imgs/img14939758214869.jpg']
      },
      {
        id: '3',
        imgUrl: 'https://www.51zhongzi.com/article/20170505/imgs/img51493975243244.jpg',
        title: '河南水稻种植保险扩展保险金额保险(中国人民财产保险股份有限公司)',
        intro: '第一条 本条款为《中国人民财产保险股份有限公司河南省分公司水稻种植保险》（以下简称主险）的附加险条款，在投保了主险的基础上，且水稻种植面积在100亩以上（含）的种植户，方可投保本附加险。',
        companyName: "中国人民财产保险股份有限公司",
        insuranceAmount: "发生主险合同保险责任范围内的损失，保险人根据本附加险合同项下的保险金额，按主险合同约定的赔偿处理方式进行赔偿。",
        premiumRate: "6%",
        formula: "保险费=每亩保险金额（元/亩）×保险费率×保险面积（亩）",
        period: '详情咨询商家',
        detImgUrls: ['https://www.51zhongzi.com/article/20170505/imgs/img14293975173103.jpg','https://www.51zhongzi.com/article/20170505/imgs/img14939735190986.jpg']
      },
      {
        id: '4',
        imgUrl: 'https://www.51zhongzi.com/article/20170504/imgs/img14093880983252.jpg',
        title: '水稻种植保险（华农财产保险股份有限公司）',
        intro: '保险期间：本保险合同的保险责任期限自保险签单的次日零时起至作物收割完毕时止，或 以各区县事先约定期限为准。',
        companyName: "华农财产保险股份有限公司 ",
        insuranceAmount: "详情咨询商家",
        premiumRate: "详情咨询商家",
        formula: "赔偿金额=水稻不同生长期每亩赔偿标准×损失率×受损面积 ",
        period: '本保险合同的保险责任期限自保险签单的次日零时起至作物收割完毕时止，或 以各区县事先约定期限为准。',
        detImgUrls: ['https://www.51zhongzi.com/article/20170504/imgs/img14938810529202.jpg', 'https://www.51zhongzi.com/article/20170504/imgs/img14938824794673.jpg', 'https://www.51zhongzi.com/article/20170504/imgs/img14938825029220.jpg', 'https://www.51zhongzi.com/article/20170504/imgs/img14938825122088.jpg', 'https://www.51zhongzi.com/article/20170504/imgs/img14293882602370.jpg','https://www.51zhongzi.com/article/20170504/imgs/img14938826140725.jpg']
      },
      {
        id: '5',
        imgUrl: 'https://www.51zhongzi.com/article/20170505/imgs/img14939860656407.jpg',
        title: '小麦种植保险（华农财产保险股份有限公司） ',
        intro: '本保险合同的保险责任期限自保险签单的次日零时起至作物收割完毕时止，或 以各区县事先约定期限为准。',
        companyName: "华农财产保险股份有限公司",
        insuranceAmount: "详情咨询商家",
        premiumRate: "7%",
        formula: "赔偿金额=小麦不同生长期每亩赔偿标准×损失率×受损面积 ",
        period: '本保险合同的保险责任期限自保险签单的次日零时起至作物收割完毕时止，或 以各区县事先约定期限为准。',
        detImgUrls: ['https://www.51zhongzi.com/article/20170505/imgs/img14973961504584.jpg', 'https://www.51zhongzi.com/article/20170505/imgs/img14939615170329.jpg', 'https://www.51zhongzi.com/article/20170505/imgs/img14939615228898.jpg', 'https://www.51zhongzi.com/article/20170505/imgs/img14939615391795.jpg', 'https://www.51zhongzi.com/article/20170505/imgs/img14939615451901.jpg','https://www.51zhongzi.com/article/20170505/imgs/img14930961658515.jpg']
      },
    ]
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
  onShareAppMessage: function () {
  
  },
  strogeFn:function(event){
    var id = event.currentTarget.dataset.id, insuranceData = this.data.insuranceData
    wx.setStorageSync('insuranceDatail', insuranceData[id])
  },
  tipFn: function (e) {
    wx.showToast({
      title: '功能开发中...',
      icon: 'loading',
      duration: 1000
    })
  },
})