# -*- coding: utf-8 -*-
from django.db import models

class Hotspot(models.Model):
    #热点mac
    mac = models.CharField(max_length=32, db_column='mac', unique=True)
    
    #热点ip地址
    ip = models.CharField(max_length=64, db_column='ip',null=True,blank=True)
    
    #热点ssid
    ssid = models.CharField(max_length=100, db_column='ssid',null=True,blank=True)
    
    #热点型号
    model = models.CharField(max_length=100, db_column='model',null=True,blank=True)
    
    #热点详细地址
    location = models.CharField(max_length=1000, db_column='location',null=True,blank=True)
    
    #省级
    location1 = models.CharField(max_length=100, db_column='location_1',null=True,blank=True)
    
    #市
    location2 = models.CharField(max_length=100, db_column='location_2',null=True,blank=True)
    
    #区、县城
    location3 = models.CharField(max_length=100, db_column='location_3',null=True,blank=True)
    
    #捕捉时间
    time=models.DateTimeField(db_column='time',auto_now=True)
    
    #最新坐标-x
    longitudes = models.CharField(max_length=100, db_column='longitudes',null=True,blank=True)
    
    #最新坐标-y
    latitudes = models.CharField(max_length=100, db_column='latitudes',null=True,blank=True)
    
    #备注信息
    remark = models.CharField(max_length=1000, db_column='remark',null=True,blank=True)
    
    #无线密码
    wifi_password = models.CharField(max_length=100, db_column='wifi_password',null=True,blank=True)
    
    #后台账号
    login_name = models.CharField(max_length=100, db_column='login_name',null=True,blank=True)
    
    #后台密码
    login_password = models.CharField(max_length=100, db_column='login_password',null=True,blank=True)
    
    #后台地址
    login_url = models.CharField(max_length=100, db_column='login_url',null=True,blank=True)
    
    #"0:默认状态    1:正在查询密码    2：查询失败  3：查询密码成功    4：正在破解  5：破解失败  6：破解成功"
    status = models.SmallIntegerField(db_column='status',default=0)
    
    #版本
    ver = models.CharField(max_length=100, db_column='version',null=True,blank=True)
    
    #加密方式
    encrypt = models.CharField(max_length=100, db_column='encrypt',null=True,blank=True)
    
    #SSID URL编码
    source_ssid = models.CharField(max_length=100, db_column='source_ssid',null=True,blank=True)
    
    def __unicode__(self):
        return self.mac

    class Meta:
        db_table = 't_route'
        
class Relate(models.Model):
    #热点
    hotspot = models.ForeignKey(Hotspot,db_column='route_id')
    
    #监控点
    monitor_id = models.IntegerField(db_column='monitor_id')
    
    #信号强度
    strength = models.SmallIntegerField(db_column='strength',null=True,blank=True)

    #捕捉时间
    time=models.DateTimeField(db_column='time',auto_now=True)

    class Meta:
        db_table = 't_hotspot'   

