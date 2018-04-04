#!/usr/bin/env python
#-*-coding:utf-8-*-

import Queue
import threading

from Forum.core.core import renderer_mac
from Forum.core.datatype import AttribDict
from Forum.settings import DB_MONGODB
from Forum.core.ApiUtil import *

# 热点上传子线程首次启动标记
is_run = False
# 待上传的热点数据队列
queue = Queue.Queue()

class WorkThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        # 死循环获取队列中的热点数据和历史采集记录的保存
        while True:
            hotspot = queue.get()
            self.save_hotspot(hotspot)
            self.save_history(hotspot)

    def save_hotspot(self,hotspot):
        """
        进行采集热点数据的保存
        :param hotspot:
        :return:
        """
        if not hotspot.mac or hotspot.mac == '000000000000':
            return
        attr = dict()
        attr['$set'] = dict()
        attr['$setOnInsert'] = dict()
        # 向百度查询上传热点的物理位置
        location = request_location(hotspot.longitudes,hotspot.latitudes)
        # 查询热点的厂商
        mac_company = DB_MONGODB.MacCompany.find_one({'mac':hotspot.mac[0:6]})

        if mac_company:
            attr['$setOnInsert']['company'] = mac_company['company']

        for k,v in hotspot.items():
            if k in ('mac', 'ssid','channel','encrypt','strength','longitude','latitude','time'):
                attr['$set'][k] = v
            # 密码查询状态
            if k == 'status':
                attr['$set']['search_status'] = v

        if location:
            attr['$set']['location_1'] = location.location_1
            attr['$set']['location_2'] = location.location_2
            attr['$set']['location_3'] = location.location_3
            attr['$set']['location'] = location.location
        attr['$setOnInsert']['first_time'] = hotspot.time
        # 默认为0，未上传到百度地图
        # attr['$setOnInsert']['tag'] = 0
        DB_MONGODB.hotspot.update({'mac':hotspot.mac},attr,True)

    def save_history(self,hotspot):
        """
        保存热点采集历史记录(同一个采集设备，同一个热点，只进行首次被采集记录的保存）
        :param hotspot:
        :return:
        """
        # 向百度查询上传热点的物理位置
        location = request_location(hotspot.longitudes, hotspot.latitudes)
        attr = dict()
        attr['$setOnInsert'] = dict()
        attr['$setOnInsert']['longitude'] = hotspot.longitudes
        attr['$setOnInsert']['latitude'] = hotspot.latitudes
        attr['$setOnInsert']['time'] = hotspot.time
        if location:
            attr['$setOnInsert']['location_1'] = location.location_1
            attr['$setOnInsert']['location_2'] = location.location_2
            attr['$setOnInsert']['location_3'] = location.location_3
            attr['$setOnInsert']['location'] = location.location
        DB_MONGODB.history.update({
            'client_mac':hotspot.client_mac,
            'hotspot_mac':hotspot.mac
        },attr,True)

def run(client_mac,hotspots):
    """
    主线程执行密码查询并开启子线程进行热点数据保存
    :param client_mac:
    :param hotspots:
    :return:
    """
    global is_run
    data = list()
    # 格式化处理热点mac并查询密码
    for hotspot in hotspots:
        hotspot['mac'] = hotspot['mac'].replace(':','').replace('-','')
        d = dict(mac=renderer_mac(hotspot['mac']),ssid=hotspot['ssid'])
        data.append(d)
    result = request_wifi_password(data)

    # 将每个查询出来的热点放入到队列中供子线程读取
    for hotspot in hotspots:
        hotspot = AttribDict(indict=hotspot)
        hotspot['client_mac'] = client_mac
        hotspot['status'] = result[hotspot['mac']]['status'] if hotspot['mac'] in result else 0
        hotspot['password'] = result[hotspot['mac']]['password'] if hotspot['mac'] in result else ''
        queue.put(hotspot)

    if not is_run:
        is_run = True
        for i in range(5):
            t = WorkThread()
            # 主线程已结束，其他5个子线程一并结束
            t.setDaemon(True)
            t.start()
