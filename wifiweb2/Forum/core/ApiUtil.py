#!/usr/bin/env python
#-*-coding:utf-8-*-
# API接口文件

import time
import json
import requests
import base64
from Forum.core.core import renderer_mac
from Forum.core.datatype import AttribDict
from Forum.settings import API_WIFI_SEARCH, API_BAIDU_LOCATION, BAIDU_KEY, API_WIFI_CRACK_STATUS, WIFI_CRACK_KEY

# 破解密码格式化
def renderer_password_crack(password):
    if not password:
        return password
    else:
        repassword = base64.b64decode(password)
        return repassword[1:password.rfind(']')]

def request_location(lng,lat):
    """
    向百度地图API请求详细的物理地址信息
    :param lng:
    :param lat:
    :return: 返回经纬度对应的物理位置 省份/城市/区/街道
    """
    data = dict()
    url = API_BAIDU_LOCATION % (lat,lng,BAIDU_KEY)

    for i in range(3):
        try:
            rep = requests.get(url)
            repjson = json.loads(rep.text)
            result = repjson['result']['addressComponent']
            data['location_1'] = result['province']
            data['location_2'] = result['city']
            data['location_3'] = result['district']
            data['location'] = result['street']+result['street_number']
        except:
            pass

    return AttribDict(indict=data)

def request_wifi_password(data):
    """
    向hs破解平台查询wifi密码
    :param data: 数组格式 [{'mac':'','ssid':''}]
    :return: 返回以mac为key的字典数据，{"112233445566":{"status":0,"password":""}}
    """
    url = API_WIFI_SEARCH
    data = dict(priority=10,ver=1,data=data)
    result = dict()
    is_continue = False
    for i in range(3):
        try:
            rep = requests.post(url,data=json.dumps(data),verify=False)
            rep = json.loads(rep.text)
            for line in rep:
                status = line['status']
                pwd = renderer_password(line['pwd'])
                mac = line['mac'].replace(':','').replace('-','').upper()
                result[mac] = {'status':status,'password':pwd}
                # 只要存在一个热点没有查询完，则再次进行查询，但不超过3次
                is_continue = status<2
            if not is_continue:
                break
            time.sleep(1)
        except:
            pass
    return result

def renderer_password(password):
    if not password:
        return password
    else:
        password = json.loads(base64.b16decode(password))
        password = [base64.b16decode(line)[1:base64.b16decode(line).rfind(']')] for line in password if line!='']
        return password