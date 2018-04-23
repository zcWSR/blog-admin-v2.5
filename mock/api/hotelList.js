export default (req, res) => {
  const data = {
    data : [
      {
        "province": "新疆",
        "hotelId": 1,
        "hotelName": "卡亚木库卡库卡葫芦集团测试酒店",
        "city": "卡亚木库卡库卡"
      }, {
        "province": "新疆",
        "hotelId": 2,
        "hotelName": "两大分销商对接测试酒店",
        "city": "卡亚木库卡库卡"
      }, {
        "province": "比奥比奥",
        "hotelId": 3,
        "hotelName": "卡亚木库卡库卡葫芦单体测试酒店",
        "city": "康塞普西翁"
      }, {
        "province": "黑龙江",
        "hotelId": 4,
        "hotelName": "牡丹江市爱民区牡丹宴商务酒店",
        "city": "牡丹江"
      }, {
        "province": "重庆",
        "hotelId": 5,
        "hotelName": "重庆精通一心酒店",
        "city": "重庆"
      }, {
        "province": "浙江",
        "hotelId": 6,
        "hotelName": "乌镇梦幻风情客栈",
        "city": "嘉兴"
      }, {
        "province": "内蒙古",
        "hotelId": 7,
        "hotelName": "呼和浩特心想是城主题公寓酒店二分店",
        "city": "呼和浩特"
      }, {
        "province": "新疆",
        "hotelId": 8,
        "hotelName": "卡亚木库卡库卡葫芦单体测试酒店",
        "city": "卡亚木库卡库卡"
      }, {
        "province": "广东",
        "hotelId": 9,
        "hotelName": "7天酒店广州花都火车北站秀全公园店",
        "city": "广州"
      }, {
        "province": "新疆",
        "hotelId": 10,
        "hotelName": "卡亚木库卡库卡QTA国内测试酒店",
        "city": "卡亚木库卡库卡"
      }, {
        "province": "新疆",
        "hotelId": 11,
        "hotelName": "卡亚布库卡库卡亚县大酒店",
        "city": "卡亚木库卡库卡"
      }, {
        "province": "山东",
        "hotelId": 12,
        "hotelName": "长岛老侯渔家",
        "city": "烟台"
      }, {
        "province": "河北",
        "hotelId": 13,
        "hotelName": "廊坊坤厚商务酒店",
        "city": "廊坊"
      }, {
        "province": "四川",
        "hotelId": 14,
        "hotelName": "成都窝心的小窝808公寓",
        "city": "成都"
      }, {
        "province": "河北",
        "hotelId": 15,
        "hotelName": "秦皇岛旭日海景公寓",
        "city": "秦皇岛"
      }, {
        "province": "云南",
        "hotelId": 16,
        "hotelName": "昆明长水机场逸兰酒店",
        "city": "昆明"
      }, {
        "province": "河南",
        "hotelId": 17,
        "hotelName": "郑州雅居生活馆酒店公寓",
        "city": "郑州"
      }
    ],
    ret : true
  };
  res.setHeader('Content-Type', 'application/json');
  setTimeout(() => {
    res.end(JSON.stringify(data));
  }, req.query.delay ? ~~req.query.delay : 0);
}
