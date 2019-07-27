import Dialog from '../../components/dist/dialog/dialog.js'
//地图
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'EXABZ-VJ3KQ-RHJ5X-GEC65-ES25F-6CBTM'
});

//获取应用实例
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myImage:'',
    isHidden:false,
    search: '',
    //户型
    currentTab: 0,

    // 地图内容数据开始
    latitude: 22.540822,
    longitude: 113.934457,
    scale: 16,
    markers: [{
        latitude: 22.540822,
        longitude: 113.934457,
        name: '腾讯大厦',
        callout: {
          content: '',
          color: '#fff',
          fontSize: 15,
          borderRadius: 10,
          bgColor: '#000',
          display: 'ALWAYS'
        },
        label: {
          //这是文字图形标记
          content: '这是你所在的位置',
          color: '#333',
          x: 4,
          y: 0,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 5,
          bgColor: '#fff',
          padding: 2,
          textAlign: 'center',

        },
        // iconPath: "../../lib/img/location.png",//这是图片标记
      },

    ],

    controls: [{
      id: 1,
      position: {
        left: 10,
        top: 20,
        width: 30,
        height: 30
      },
      iconPath: "../../lib/img/plus.png",
      clickable: true
    }, {
      id: 19,
      position: {
        left: 10,
        top: 55,
        width: 30,
        height: 30
      },
      iconPath: "../../lib/img/minus.png",
      clickable: true
    }],
    // 地图内容数据结束
    huxingInfo: [
      '/lib/img/5.png',
      '/lib/img/6.png',
      '/lib/img/5.png',
      '/lib/img/6.png',
      '/lib/img/5.png',

    ],
    current: 0,
    title: '深圳家天下',
    //楼盘详细
    houseDetail: '',
    time: '2018年7月22日',
    ids: '',
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: false, //发现自动播最后一页到第一页有问题
    interval: 5000,
    duration: 1000
  },
  onSlideChangeEnd: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options.id)
    let _this = this;
    let id = options.id;
    // 获取楼盘详情
    wx.request({
      url: 'https://salesv2-ccw-test.colourlife.com/v1/build/detail',
      method: 'get',
      data: {
        id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
          

          //地图数据
          var mapData = [{
              latitude: res.data.content.buildingDetail.location.lat,
              longitude: res.data.content.buildingDetail.location.lng,
              name: res.data.content.buildingDetail.name,
              callout: {
                content: '',
                color: '#fff',
                fontSize: 15,
                borderRadius: 10,
                bgColor: '#000',
                display: 'ALWAYS'
              },
              label: {
                //这是文字图形标记
                content: res.data.content.buildingDetail.name,
                color: '#333',
                x: 4,
                y: 0,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                bgColor: '#fff',
                padding: 2,
                textAlign: 'center',

              },
              // iconPath: "../../lib/img/location.png",//这是图片标记
            },

          ]
          console.log(mapData)

          // console.log(res.data.content.banner)
          let data = res.data.content.buildingDetail;
          //增加是否显示福利

          if (data.buy_send == '' && data.welfare_buy == '' && data.welfare_recommend==''){
            console.log(11)
            _this.setData({
              isHidden:true
            })
          }

          let date = data.open_time.split('-');
          data.quality = data.quality.length == 0 ? ["住宅", "学区房", "公交直达", "地铁沿线"] : data.quality;
          // data.welfare_buy = data.welfare_buy.split(',');
          // console.log(data.welfare_buy)
          _this.setData({
            myImage:data.images[0],
            title: data.name,
            houseDetail: data,
            time: date[0] + '年' + date[1] + '月' + date[2] + '日',
            ids: id,
            latitude: data.location.lat,
            longitude: data.location.lng,

            markers: mapData

          })
        } else {

        }
      }
    })
    wx.request({
      url: 'https://salesv2-ccw-test.colourlife.com/v1/house/image',
      method: 'get',
      data: {
        id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {

          _this.setData({
            huxingInfo: res.data.content.list
          })
        } else {

        }
      }
    })

    _this.setData({
      navH: App.globalData.navHeight
    })
  },

  //地图搜索方法
  nearby_search: function(e) {
    this.setData({ //设置markers属性，将搜索结果显示在地图中
      markers: [this.data.markers[0]]
    })
    console.log(e)
    this.setData({
      search: e.currentTarget.dataset.value
    })
    var _this = this;

    var locationData = this.data.latitude + "," + this.data.longitude;
    console.log(locationData)
    // 调用接口
    qqmapsdk.search({


      // keyword: '公交站', //搜索关键词
      keyword: _this.data.search, //搜索关键词
      location: locationData, //设置周边搜索中心点
      success: function(res) { //搜索成功后的回调
        console.log("成功调用")
        var mks = _this.data.markers
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,

            iconPath: "../../lib/img/location.png", //图标路径
            // width: 20,
            // height: 20,
            // callout: {
            //   content: '',
            //   color: '#ffa529',
            //   fontSize: 15,
            //   borderRadius: 10,
            //   bgColor: '#000',
            //   display: 'ALWAYS'
            // },
            label: {
              content: res.data[i].title,
              color: '#333',
              x: 4,
              y: 0,
              borderWidth: 1,
              borderColor: '#000',
              borderRadius: 5,
              bgColor: '#fff',
              padding: 2,
              textAlign: 'center',

            }
            // , iconPath: "../../lib/img/location.png",//这是图片标记
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);

      }
    });
  },

  //去推荐页面
  goTuijian: function(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/recommend/index?id=' + data.id + '&title=' + data.title,
    })
  },

  //转发
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '彩住宅小程序',
      path: 'pages/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },


  // 地图逻辑开始
  tapControl(event) {
    // 缩放范围5~20
    const scaleLevel = this.data.scale;
    if (event.controlId === 1) { // 放大
      this.setData({
        scale: scaleLevel < 20 ? scaleLevel + 1 : 20
      })
    } else { // 缩小
      this.setData({
        scale: scaleLevel > 5 ? scaleLevel - 1 : 5
      })
    }
  },
  // regionchange(e) {
  //   console.log('视野发生变化', e);
  // },
  // 地图逻辑结束
  goPhoto: function(e) {
    // 去楼盘相册
    console.log(e);
    wx.navigateTo({
      url: '/pages/photo/index?id=' + this.data.ids
    })

  },
  // 户型滚动
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    // var cur = e.target.dataset.current;
    // if (this.data.currentTaB == cur) {
    //   return false;
    // } else {
    //   this.setData({
    //     currentTab: cur
    //   })
    // }
    wx.navigateTo({
      url: '/pages/photo/index?id=' + this.data.ids + '&lable=户型'
    })

  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  yuYue: function() {

    wx.request({
      url: 'https://salesv2-ccw-test.colourlife.com/v1/booking/new',
      method: 'post',
      data: {
        color_token: wx.getStorageSync('token'),
        building_id: this.data.ids
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
          console.log(11)
          Dialog.alert({
            title: '温馨提示',
            message: '预约看房登记成功'
          }).then(() => {
            // on close
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //拨打电话
  myCall: function(e) {
    console.log(e)
    var phoneNum = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNum //仅为示例，并非真实的电话号码
    })
  }
  

})