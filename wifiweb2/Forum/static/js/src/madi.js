import {global,SERVER_BAIDU_KEY,geotableId,CLIENT_BAIDU_KEY,b_notify} from '../common.js'

$(function () {
    // 百度地图API功能
    var map = new BMap.Map("map-container"); // 创建地图实例
    var point = new BMap.Point(116.403694, 39.927552); // 创建点坐标
    map.centerAndZoom("深圳", 12); // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
    var customLayer;

    function addCustomLayer(keyword) {
        if (customLayer) {
            map.removeTileLayer(customLayer);
        }
        customLayer = new BMap.CustomLayer({
            geotableId: 184953,
            q: '', //检索关键字
            tags: '', //空格分隔的多字符串
            filter: '' //过滤条件,参考http://lbsyun.baidu.com/lbs-geosearch.htm#.search.nearby
        });
        map.addTileLayer(customLayer);
        // 点击热点获取详情信息
        customLayer.addEventListener('hotspotclick', callback);
    }

    function callback(e) //单击热点图层
    {
        var customPoi = e.customPoi; //poi的默认字段
        var contentPoi = e.content; //poi的自定义字段
        // 获取该热点的id
        let pid = contentPoi.my_id
        $.ajax({
            url:'/hotspot/detail?pid='+pid,
            success(data){
                if(data.code==1){
                    let ssid = data.ssid;
                    let mac = data.mac;
                    let encrypt = data.encrypt;
                    let location = data.location;
                    let password = data.password;
                    var content = `<p style="line-height:20px;">SSID：${ssid}<br/>密码：${password}<br/>加密方式：${encrypt}<br/>物理位置：${location}<br/></p>`;
                    var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                        title: mac, //标题
                        width: 290, //宽度
                        height: 40, //高度
                        panel: "panel", //检索结果面板
                        enableAutoPan: true, //自动平移
                        enableSendToPhone: false, //是否显示发送到手机按钮
                        searchTypes: []
                    });
                    var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
                    searchInfoWindow.open(point);
                }else{
                    b_notify({
                        message:data.msg,
                        type:'danger'
                    })
                }
            }
        })
    }
    addCustomLayer();
    global.wifi.maditu = {
        init(){
            this.common()
            this.updateData()
            this.getUpdateTime()
        },
        task_timer:null,
        // 更新地图数据
        updateData(){
            const that = this;
            $("#update-data-btn").on("click",()=>{
                $.get('/hotspot/upgradelbs').done((data)=>{
                    let jdata = JSON.parse(data)
                    console.log(jdata)
                    if(jdata.status==0){
                        // 根据job_id和百度的接口查询，任务上传进度
                        let job_id = jdata.job_id;
                        that.getUpdateTime();
                        b_notify({
                            message:jdata.message 
                        })
                        that.task_timer = setInterval(()=>{
                            that.getTaskProgress(job_id)
                        },2000)
                    }else{
                        b_notify({
                            message:jdata.message,
                            type: 'danger', 
                            
                        });
                    }
                }).fail(()=>{
                    b_notify({
                        message:'失败',
                        type: 'danger', 
                    });                        
                })
            });

        },
        // 获取更新数据任务上传进度
        getTaskProgress(job_id){
            const that = this;
            let params = {
                geotable_id:geotableId,
                ak:SERVER_BAIDU_KEY,
                job_id:job_id
            }
            $.ajax({
                url:'http://api.map.baidu.com/geodata/v3/job/listimportdata',
                type:'GET',
                data:params,
                dataType:'JSONP',//jsonp请求
                // jsonpCallback:'handle',
                // jsonp:'callback'
            }).done((data)=>{
                if(data.status==0){
                    console.log(data)
                    // 清除进度任务查询
                    clearInterval(that.task_timer)
                    // 重载地图
                    addCustomLayer()
                    b_notify({
                        message:data.message+"上传最新数据",
                    }); 
                }else{
                    b_notify({
                        message:data.message,
                        type: 'danger', 
                    }); 
                }
            }).fail(()=>{
                b_notify({
                    message:'失败',
                    type: 'danger', 
                }); 
            })
        },
        // 获取更新时间
        getUpdateTime(){
            $.get('/hotspot/getupdatetime',(data)=>{
                if(data.time){
                    $("#update-data-time").text(data.time);
                }
            })
        },
        common(){
            
        }
    }
    global.wifi.maditu.init();
});