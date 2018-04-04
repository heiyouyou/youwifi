# -*- coding: utf-8 -*-
from django.db import models

class CheckPoint(models.Model):
    #监控点mac
    mac = models.CharField(max_length=32, db_column='mac', unique=True)
    
    #监控点名称
    name = models.CharField(max_length=100, db_column='name')
    
    #更新时间
    time=models.DateTimeField(db_column='create_time',auto_now=True)
    
    #最新坐标-x
    x = models.CharField(max_length=100, db_column='x',null=True,blank=True)
    
    #最新坐标-y
    y = models.CharField(max_length=100, db_column='y',null=True,blank=True)
    
    #累计收集
    count = models.IntegerField(db_column='count',default=0)
    
    #版本号
    ver = models.CharField(max_length=100, db_column='ver',null=True,blank=True)
    
    #类型 0：路由器  1：手机
    type = models.SmallIntegerField(db_column='type',default=0)

    #IP地址
    ip = models.CharField(max_length=100, db_column='ip',null=True,blank=True)
    
    #remark
    remark = models.CharField(max_length=100, db_column='remark',null=True,blank=True)
    
    def __unicode__(self):
        return self.mac

    class Meta:
        db_table = 't_monitor'
