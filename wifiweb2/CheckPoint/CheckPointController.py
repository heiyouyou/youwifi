# -*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.shortcuts import render_to_response
from Forum.core.validate import validate
from Forum.core.core import *
from models import CheckPoint
from Forum.settings import DB_MONGODB

class CheckPointController():
    request = {}
    login_name = ''
    login_id = 0
    current = {}

    def __init__(self, request):
        self.request = request

    def Ip_Fuc(self):
        if 'ip' in self.request.GET:
            ip=self.request.GET['ip']
        else:
            ip=''

        f = open("./forum/upload/ip.txt", "w")
        f.write(ip)
        f.close()
        return HttpResponse(json.dumps(getJson(True,'更新成功')))

    def Index_Fuc(self):
        total = CheckPoint.objects.count()
        return render_to_response('system/checkpoint/index.html',{'total':total})

    # 编辑备注接口地址：/checkpoint/remark
    def Remark_Fuc(self):
        data = json.loads(self.request.body)
        id = int(data["id"]) if 'id' in data else 0
        remark = data["remark"] if 'remark' in data else ''
        if id>0:
            try:
                cp = CheckPoint.objects.get(id=id)
                cp.remark = remark
                cp.save();
            except CheckPoint.DoesNotExist:
                return HttpResponse(json.dumps(getJson(False,'数据不存在或者已经被删除')))
        else:
            return HttpResponse(json.dumps(getJson(False,'输入的数据异常')))
        return HttpResponse(json.dumps(getJson(True,'更新成功')))

    # 监控点累计采集热点数据排行
    # 接口地址：/checkpoint/countbycp
    def Countbycp_Fuc(self):
        import datetime
        today = datetime.datetime.today()
        data = dict()
        data['name'] = []
        data['value'] = []
        get = self.request.GET
        t = ''
        if 't' in get and get['t']!='':
            t = get['t']
        else:
            t='today'
            
        # sql = ''
        project = {
            'dateTime': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$time'}}
        }
        lists = None
        group = {'_id': '$client_mac', 'count': {'$sum': 1}}
        sort = {'count': -1}
        limit = 10
        if t == 'all':
            # sql="select count(1) as count,name from t_hotspot inner join  t_monitor on t_hotspot.monitor_id=t_monitor.id group by monitor_id  order by count desc limit 0,10"
            lists = DB_MONGODB.history.aggregate([{'$group':group},{'$sort':sort},{'$limit':limit}])
        if t == 'weak':
            # sql="select count(1) as count,name from t_hotspot inner join  t_monitor on t_hotspot.monitor_id=t_monitor.id where time>date_sub(curdate(),interval 6 day) group by monitor_id  order by count desc limit 0,10"
            interval = today - datetime.timedelta(days=6)
            lists = DB_MONGODB.history.aggregate([{'$match': {'time': {'$gte': interval, '$lte': today}}}, {'$group': group},{'$sort': sort},{'$limit':limit}])
        if t == 'month':
            # sql="select count(1) as count,name from t_hotspot inner join  t_monitor on t_hotspot.monitor_id=t_monitor.id where time>date_sub(curdate(),interval 29 day) group by monitor_id  order by count desc limit 0,10"
            interval = today - datetime.timedelta(days=29)
            lists = DB_MONGODB.history.aggregate([{'$match': {'time': {'$gte': interval, '$lte': today}}}, {'$group': group}, {'$sort': sort},{'$limit': limit}])
        if t == 'year':
            # sql="select count(1) as count,name from t_hotspot inner join  t_monitor on t_hotspot.monitor_id=t_monitor.id where time>date_sub(curdate(),interval 28 day) group by monitor_id  order by count desc limit 0,10"
            interval = today - datetime.timedelta(days=364)
            lists = DB_MONGODB.history.aggregate([{'$match': {'time': {'$gte': interval, '$lte': today}}}, {'$group': group}, {'$sort': sort},{'$limit': limit}])
        if t == 'today':
            # sql="select count(1) as count,name from t_hotspot inner join  t_monitor on t_hotspot.monitor_id=t_monitor.id where date(time) = curdate() group by monitor_id  order by count desc limit 0,10"
            lists = DB_MONGODB.history.aggregate([{'$project':project},{'$match': {'dateTime':today.strftime('%Y-%m-%d')}}, {'$group': group}, {'$sort': sort},{'$limit': limit}])

        # from django.db import connection
        # cursor = connection.cursor()
        # cursor.execute(sql)
        # row = cursor.fetchall()

        print list(lists)
        for line in lists:
            cp = CheckPoint.objects.get(mac=line._id)
            name = (cp.mac if cp.name is None or cp.name=='' else cp.name) if cp.remark is None or cp.remark == '' else cp.remark
            data['name'].append(name)
            data['value'].append(line.count)
            
        return HttpResponse(json.dumps(data))
    
    #加载表格数据
    def List_Fuc(self):
        Qfilter=[]
        get = self.request.POST
        validation = validate()
        if 'name' in get and get['name']!='':
            from django.db.models import Q
            
            name=addslashes(get['name']).upper()
            s=Q(mac__icontains=name) | Q(name__icontains=name)
            Qfilter.append(s)

        sortJson = {'id': 'id', 'mac': 'mac','ip':'ip','time':'time','x':'x','y':'y','count':'count','ver':'ver','name':'name','remark':'remark'}

        start = int(get['iDisplayStart']) if 'iDisplayStart' in get and validation.int(get['iDisplayStart']) and int(get['iDisplayStart']) > 0 else 0
        pageSize = int(get['iDisplayLength']) if 'iDisplayLength' in get and validation.int(get['iDisplayLength']) and int(get['iDisplayLength']) > 1 else 10
        direction = '' if 'sSortDir_0' in get and get['sSortDir_0'].lower() == 'asc' else '-'
        
        sort = 'time'
        if 'iSortCol_0' in get:
            iSortCol_0 = "mDataProp_" + get['iSortCol_0']
            if iSortCol_0 in get:
                sort = sortJson[get[iSortCol_0]] if get[iSortCol_0] in sortJson else 'id'

        checkpoints = CheckPoint.objects.filter(*tuple(Qfilter)).order_by(direction + sort)[start:(start + pageSize)]
        iTotalRecords = CheckPoint.objects.filter(*tuple(Qfilter)).count()
        
        data = []
        import datetime
        import cgi
        for checkpoint in checkpoints:
            row = dict()
            for k in sortJson:
                if k=='time':
                    row[k]= datetime.datetime.strftime(checkpoint.time,'%Y-%m-%d %H:%M:%S') if checkpoint.time else ''
                    continue
                row[k] = getattr(checkpoint, sortJson[k])
            if row['remark'] is not None:
                row['remark']=cgi.escape(row['remark'])

            data.append(row)

        jsonData = dict()
        jsonData['iTotalRecords'] = iTotalRecords
        jsonData['sEcho'] = int(get['sEcho']) if 'sEcho' in get and validation.int(get['sEcho']) else 1
        jsonData['iTotalDisplayRecords'] = iTotalRecords
        jsonData['aaData'] = data
        return HttpResponse(json.dumps(jsonData))
