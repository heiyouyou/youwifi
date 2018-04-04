import {global,SERVER_BAIDU_KEY,geotableId,CLIENT_BAIDU_KEY,b_notify} from '../common.js'

var dom = document.getElementById("map-container");
var myChart = echarts.init(dom);
var app = {};
let option = null;

var geoCoordMap = {
    "忻州市":[112.697661,38.427257],
    "甘孜藏族自治州":[101.836584,30.895846],
    "内江市":[105.289018,29.339589],
    "雅安市":[103.014175,29.987936],
    "阿坝藏族羌族自治州":[103.484216,31.333305],
    "海门市":[121.15,31.89],
    "六安市":[116.444045,31.692094],
    "安康市":[109.033579,32.685756],
    "三明市":[117.907861,25.728872],
    "天门市":[113.354839,30.434035],
    "恩施土家族苗族自治州":[109.485524,30.347733],
    "遂宁市":[105.279182,30.567794],
    "鄂尔多斯市":[109.781327,39.608266],
    "招远市":[120.38,37.35],
    "黄山市":[118.334304,29.868585],
    "宣城市":[118.036706,30.514585],
    "贺州市":[111.54825,24.333475],
    "眉山市":[103.840344,30.342007],
    "乐山市":[103.720115,29.835307],
    "舟山市":[122.207216,29.985295],
    "齐齐哈尔市":[123.97,47.33],
    "盐城市":[120.13,33.38],
    "赤峰市":[118.87,42.28],
    "青岛市":[120.33,36.07],
    "乳山市":[121.52,36.89],
    "金昌市":[102.188043,38.520089],
    "泉州市":[118.58,24.93],
    "莱西市":[120.53,36.86],
    "日照市":[119.46,35.42],
    "胶南市":[119.97,35.88],
    "南通市":[121.05,32.08],
    "拉萨市":[91.11,29.97],
    "云浮市":[112.02,22.93],
    "梅州市":[116.1,24.55],
    "文登市":[122.05,37.2],
    "上海市":[121.48,31.22],
    "攀枝花市":[101.718637,26.582347],
    "威海市":[122.1,37.5],
    "承德市":[117.93,40.97],
    "厦门市":[118.1,24.46],
    "汕尾市":[115.375279,22.786211],
    "潮州市":[116.63,23.68],
    "丹东市":[124.37,40.13],
    "太仓市":[121.1,31.45],
    "曲靖市":[103.79,25.51],
    "烟台市":[121.39,37.52],
    "福州市":[119.3,26.08],
    "瓦房店市":[121.979603,39.627114],
    "即墨市":[120.45,36.38],
    "抚顺市":[123.97,41.97],
    "玉溪市":[102.52,24.35],
    "张家口市":[114.87,40.82],
    "阳泉市":[113.57,37.85],
    "莱州市":[119.942327,37.177017],
    "湖州市":[120.1,30.86],
    "汕头市":[116.69,23.39],
    "昆山市":[120.95,31.39],
    "宁波市":[121.56,29.86],
    "湛江市":[110.359377,21.270708],
    "揭阳市":[116.35,23.55],
    "荣成市":[122.41,37.16],
    "连云港市":[119.16,34.59],
    "葫芦岛市":[120.836932,40.711052],
    "常熟市":[120.74,31.64],
    "东莞市":[113.75,23.04],
    "河源市":[114.68,23.73],
    "淮安市":[119.15,33.5],
    "泰州市":[119.9,32.49],
    "南宁市":[108.33,22.84],
    "营口市":[122.18,40.65],
    "惠州市":[114.4,23.09],
    "江阴市":[120.26,31.91],
    "蓬莱市":[120.75,37.8],
    "韶关市":[113.62,24.84],
    "嘉峪关市":[98.289152,39.77313],
    "广州市":[113.23,23.16],
    "延安市":[109.47,36.6],
    "太原市":[112.53,37.87],
    "清远市":[113.01,23.7],
    "中山市":[113.38,22.52],
    "昆明市":[102.73,25.04],
    "寿光市":[118.73,36.86],
    "盘锦市":[122.070714,41.119997],
    "长治市":[113.08,36.18],
    "深圳市":[114.07,22.62],
    "珠海市":[113.52,22.3],
    "宿迁市":[118.3,33.96],
    "咸阳市":[108.72,34.36],
    "铜川市":[109.11,35.09],
    "平度市":[119.97,36.77],
    "佛山市":[113.11,23.05],
    "海口市":[110.35,20.02],
    "江门市":[113.06,22.61],
    "章丘市":[117.53,36.72],
    "肇庆市":[112.44,23.05],
    "大连市":[121.62,38.92],
    "临汾市":[111.5,36.08],
    "吴江市":[120.63,31.16],
    "石嘴山市":[106.39,39.04],
    "沈阳市":[123.38,41.8],
    "苏州市":[120.62,31.32],
    "茂名市":[110.88,21.68],
    "嘉兴市":[120.76,30.77],
    "长春市":[125.35,43.88],
    "胶州市":[120.03336,36.264622],
    "银川市":[106.27,38.47],
    "张家港市":[120.555821,31.875428],
    "三门峡市":[111.19,34.76],
    "锦州市":[121.15,41.13],
    "南昌市":[115.89,28.68],
    "柳州市":[109.4,24.33],
    "三亚市":[109.511909,18.252847],
    "自贡市":[104.778442,29.33903],
    "吉林市":[126.57,43.87],
    "阳江市":[111.95,21.85],
    "泸州市":[105.39,28.91],
    "西宁市":[101.74,36.56],
    "宜宾市":[104.56,29.77],
    "呼和浩特市":[111.65,40.82],
    "成都市":[104.06,30.67],
    "大同市":[113.3,40.12],
    "镇江市":[119.44,32.2],
    "桂林市":[110.28,25.29],
    "张家界市":[110.479191,29.117096],
    "宜兴市":[119.82,31.36],
    "北海市":[109.12,21.49],
    "西安市":[108.95,34.27],
    "金坛市":[119.56,31.74],
    "东营市":[118.49,37.46],
    "牡丹江市":[129.58,44.6],
    "遵义市":[106.9,27.7],
    "绍兴市":[120.58,30.01],
    "扬州市":[119.42,32.39],
    "常州市":[119.95,31.79],
    "潍坊市":[119.1,36.62],
    "重庆市":[106.54,29.59],
    "台州市":[121.420757,28.656386],
    "南京市":[118.78,32.04],
    "滨州市":[118.03,37.36],
    "贵阳市":[106.71,26.57],
    "无锡市":[120.29,31.59],
    "本溪市":[123.73,41.3],
    "克拉玛依市":[84.77,45.59],
    "渭南市":[109.5,34.52],
    "马鞍山市":[118.48,31.56],
    "宝鸡市":[107.15,34.38],
    "焦作市":[113.21,35.24],
    "句容市":[119.16,31.95],
    "北京市":[116.46,39.92],
    "徐州市":[117.2,34.26],
    "衡水市":[115.72,37.72],
    "包头市":[110,40.58],
    "绵阳市":[104.73,31.48],
    "乌鲁木齐市":[87.68,43.77],
    "枣庄市":[117.57,34.86],
    "杭州市":[120.19,30.26],
    "淄博市":[118.05,36.78],
    "鞍山市":[122.85,41.12],
    "溧阳市":[119.48,31.43],
    "库尔勒市":[86.06,41.68],
    "安阳市":[114.35,36.1],
    "开封市":[114.35,34.79],
    "济南市":[117,36.65],
    "德阳市":[104.37,31.13],
    "温州市":[120.65,28.01],
    "九江市":[115.97,29.71],
    "邯郸市":[114.47,36.6],
    "临安市":[119.72,30.23],
    "兰州市":[103.73,36.03],
    "沧州市":[116.83,38.33],
    "临沂市":[118.35,35.05],
    "南充市":[106.110698,30.837793],
    "天津市":[117.2,39.13],
    "富阳市":[119.95,30.07],
    "泰安市":[117.13,36.18],
    "诸暨市":[120.23,29.71],
    "郑州市":[113.65,34.76],
    "哈尔滨市":[126.63,45.75],
    "聊城市":[115.97,36.45],
    "芜湖市":[118.38,31.33],
    "唐山市":[118.02,39.63],
    "平顶山市":[113.29,33.75],
    "邢台市":[114.48,37.05],
    "德州市":[116.29,37.45],
    "济宁市":[116.59,35.38],
    "荆州市":[112.239741,30.335165],
    "宜昌市":[111.3,30.7],
    "义乌市":[120.06,29.32],
    "丽水市":[119.92,28.45],
    "洛阳市":[112.44,34.7],
    "秦皇岛市":[119.57,39.95],
    "株洲市":[113.16,27.83],
    "石家庄市":[114.48,38.03],
    "莱芜市":[117.67,36.19],
    "常德市":[111.69,29.05],
    "保定市":[115.48,38.85],
    "湘潭市":[112.91,27.87],
    "金华市":[119.64,29.12],
    "岳阳市":[113.09,29.37],
    "长沙市":[113,28.21],
    "衢州市":[118.88,28.97],
    "廊坊市":[116.7,39.53],
    "菏泽市":[115.480656,35.23375],
    "合肥市":[117.27,31.86],
    "武汉市":[114.31,30.52],
    "大庆市":[125.03,46.58],
    "香港特别行政区":[114.187821,22.289056]
};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};

var convertedData = [
    convertData(data),
    convertData(data.sort(function (a, b) {
        return b.value - a.value;
    }).slice(0, 6))
];

function get_size(num){
	if(num<2000)
		return 4;
	
	if(num<4000)
		return 5;

	if(num<6000)
		return 6;

	if(num<7000)
		return 7;
	
	if(num<8000)
		return 8;
	if(num<9000)
		return 9;
	if(num<10000)
		return 10;

	if(num<12000)
		return 11;
	if(num<13000)
		return 12;

	if(num<15000)
		return 13;
	if(num<18000)
		return 14;

	if(num<20000)
		return 15;
	if(num<23000)
		return 16;
	if(num<25000)
		return 17;

	if(num<28000)
		return 18;
	if(num<30000)
		return 19;
	if(num<33000)
		return 20;
	if(num<35000)
		return 21;
	if(num<37000)
		return 22;
	if(num<40000)
		return 23;
	if(num<42000)
		return 24;
	if(num<44000)
		return 25;
	if(num<47000)
		return 26;
	if(num<50000)
		return 27;
	if(num<55000)
		return 28;
	if(num<60000)
		return 29;
	if(num<70000)
		return 30;
	if(num<80000)
		return 31;
	else
		return 32;

}

option = {
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    title: [
        {
            text: '全国主要城市 热点分布',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        {
            id: 'statistic',
            right: 120,
            top: 40,
            width: 100,
            textStyle: {
                color: '#fff',
                fontSize: 16
            }
        }
    ],
    toolbox: {
        show:false
    },
    brush: {
        outOfBrush: {
            color: '#abc'
        },
        brushStyle: {
            borderWidth: 2,
            color: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.5)',
        },
        seriesIndex: [0, 1],
        throttleType: 'debounce',
        throttleDelay: 300,
        geoIndex: 0
    },
    geo: {
        map: 'china',
        left: '10',
      //  right: '35%',
        center: [104.98561551896913, 34.205000490896193],
        zoom: 1.0,
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    tooltip : {
        trigger: 'item'
    },
    grid: {
        right: 40,
        top: 100,
        bottom: 40,
        width: '30%'
    },
    xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: false,
        splitLine: {show: false},
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
    },
    yAxis: {
        type: 'category',
        name: 'TOP 20',
        nameGap: 16,
        axisLine: {show: false, lineStyle: {color: '#ddd'}},
        axisTick: {show: false, lineStyle: {color: '#ddd'}},
        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
        data: []
    },
    series : [
        {
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertedData[0],
            symbolSize: function (val) {
                return get_size(val[2]);
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            }
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertedData[1],
            symbolSize: function (val) {
                return get_size(val[2]);
            },
            showEffectOn: 'emphasis',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        },
        {
            id: 'bar',
            zlevel: 2,
            type: 'bar',
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            },
            data: []
        }
    ]
};

function renderBrushed() {
    
    var selectedItems = [];
    var categoryData = [];
    var barData = [];
    var maxBar = 30;
    var sum = 0;
    var count = 0;

    for (var i=0;i<data.length;i++) {
	var c=data[i];
	var value=c.value;
	var name=c.name;
	var zone=geoCoordMap[name]
	if (zone=='' || zone==null || zone=='undefined') {
	    alert(name);
	}
	else{
	    zone.push(value);
	    selectedItems.push({name:name,value:zone});
	}
	count++;
    }

    selectedItems.sort(function (a, b) {
        return b.value[2] - a.value[2];
    });

    for (var i = Math.min(selectedItems.length, maxBar)-1; i >=0; i--) {
        categoryData.push(selectedItems[i].name);
        barData.push(selectedItems[i].value[2]);
    }

    myChart.setOption({
        yAxis: {
            data: categoryData
        },
        xAxis: {
            axisLabel: {show: !!count}
        },
	title: {
            id: 'statistic',
            text: '热点搜集排名前20城市'
        },
        series: {
            id: 'bar',
            data: barData
        }
    });
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

renderBrushed();

