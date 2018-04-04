#!/usr/bin/env python
#-*-coding:utf-8-*-
# 项目首次启动将热点对应的mac的品牌公司数据存入mongodb，只需执行一次该文件
from Forum.settings import DB_MONGODB

if __name__ == '__main__':
    f = open('oui.properties')
    data = []
    for line in f:
        tag = line.index('=')
        start = line[0:tag]
        end = ''
        company = line[tag+1:].strip()
        address = ''
        data.append(dict(start=start,company=company,end=end,address=address))
    f.close()
    try:
        # 捕获去重插入数据异常中断的问题
        DB_MONGODB.MacCompany.insert_many(data,{'ordered':False})
    except:
        pass