# -*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.shortcuts import render_to_response
from Forum.core.validate import validate
from Forum.core.core import *
from Forum.core.error import *
from Forum.settings import DB_MONGODB,BAIDU_KEY,API_BAIDU_UPLOAD
from models import Hotspot ,Relate
from bson.objectid import ObjectId
from django.views.decorators.http import require_GET,require_POST
import sys ,HotspotUtil ,time ,os ,codecs ,csv ,base64
import requests ,re

reload(sys)
sys.setdefaultencoding('utf8') 

class HotspotController():
    request = {}
    login_name = ''
    login_id = 0
    current = {}

    def __init__(self, request):
        self.request = request
        #self.login_name=request.session['has_commented'].split('|')[1]
        #self.login_id=int(request.session['has_commented'].split('|')[0])

    def Index_Fuc(self):
        total = DB_MONGODB.hotspot.count()
        return render_to_response('system/hotspot/index.html',{'total':total})

    def Map_Fuc(self):
        jsonData=dict();

        sql='select count(1) as num, format(latitudes,2) as b,format(longitudes,2)as a  from t_route group by a,b'

        from django.db import connection
        cursor = connection.cursor()
        cursor.execute(sql)
        hotspots = cursor.fetchall()
        data=[]
        for line in hotspots:
            hotspot=dict()
            hotspot['num']=line[0]
            hotspot['lnglats']=[line[2],line[1]]
            data.append(hotspot)

        jsonData['mapData']=data
        return HttpResponse(json.dumps(jsonData))

    # 热点详细信息
    # 接口地址：/hotspot/detail
    def Detail_Fuc(self):
        '''
        热点详细信息
        :return:
        '''
        data = self.request.GET
        pid=int(data["pid"]) if 'pid' in data else 0
        if id<0:
            return HttpResponse(json.dumps(getJson(False,'输入的数据异常')))

        try:
            jsonData=dict()
            # 注意id转换成mongodb认识的数据类型
            hotspot = DB_MONGODB.hotspot.find_one({'_id':ObjectId(pid)})
            jsonData['location']=hotspot.location1+hotspot.location2+hotspot.location3+hotspot.location
            jsonData['ssid']=hotspot.ssid
            jsonData['mac']=hotspot.mac
            jsonData['password']=hotspot.password
            jsonData['encrypt']=hotspot.encrypt
            jsonData['code'] = 1
            return HttpResponse(json.dumps(jsonData),content_type='application/json')
        except :
            return HttpResponse(json.dumps(getJson(False,'数据不存在或者已经被删除')),content_type='application/json')

    # 热点某段时间内的统计
    # 接口地址：/hotspot/countbyday
    def Countbyday_Fuc(self):
        import datetime
        today = datetime.datetime.today()
        data = []
        get = self.request.GET
        t = ''
        if 't' in get and get['t']!='':
            t = get['t']
        else:
            t = 'week'
        # sql = ''
        lists = None
        # 格式化处理日期
        project = {
            'dateTime':{'$dateToString':{'format':'%Y-%m-%d','date':'$time'}}
        }
        group = {'_id': '$dateTime', 'count': {'$sum': 1}}
        sort = {'time':1}
        if t=='all':
            # sql="select DATE_FORMAT(time,'%Y-%m-%d') as days,count(id) as count from t_route group by days order by days"
            lists = DB_MONGODB.hotspot.aggregate([{'$project':project},{'$group':group},{'$sort':sort}])
        if t=='weak':
            # sql="select DATE_FORMAT(time,'%Y-%m-%d') as days,count(id) as count from t_route where time>date_sub(curdate(),interval 6 day) group by days  order by days"
            interval = today -datetime.timedelta(days=6)
            lists = DB_MONGODB.hotspot.aggregate([{'$project': project},{'$match':{'time':{'$gte':interval,'$lte':today}}},{'$group': group},{'$sort':sort}])
        if t=='month':
            # sql="select DATE_FORMAT(time,'%Y-%m-%d') as days,count(id) as count from t_route where time>date_sub(curdate(),interval 29 day) group by days  order by days"
            interval = today -datetime.timedelta(days=29)
            lists = DB_MONGODB.hotspot.aggregate([{'$project': project},{'$match':{'time':{'$gte':interval,'$lte':today}}},{'$group': group},{'$sort':sort}])
        if t=='year':
            # sql="select DATE_FORMAT(time,'%Y-%m-%d') as days,count(id) as count from t_route where time>date_sub(curdate(),interval 364 day) group by days  order by days"
            interval = today - datetime.timedelta(days=364)
            lists = DB_MONGODB.hotspot.aggregate([{'$project':project}, {'$match': {'time': {'$gte': interval, '$lte': today}}},{'$group': group},{'$sort':sort}])

        # from django.db import connection
        # cursor = connection.cursor()
        # cursor.execute(sql)
        # # fetchall()返回一个二元元组
        # row = cursor.fetchall()

        print list(lists)
        for line in lists:
            d = []
            d.append(line._id)
            d.append(line.count)
            data.append(d)
        return HttpResponse(json.dumps(data))

    # 热点数据
    # 接口地址：/hotspot/list
    def List_Fuc(self):
        # Qfilter=[]
        condition = {}
        get = self.request.POST
        validation = validate()
        # 获取关键字查询参数，支持mac、ssid、remark模糊查询
        if 'search' in get and get['search']!='':
            # from django.db.models import Q
            name = addslashes(get['search']).upper()
            condition['$or'] = [{'ssid':{'$regex':name,'$options':'ig'}},{'mac':{'$regex':name,'$options':'ig'}},{'remark':{'$regex':name,'$options':'ig'}}]
            # 或者
            # condition['$or'] = [{'ssid':re.compile(name,'ig')},{'mac':re.compile(name,'ig')},{'remark':re.compile(name,'ig')}]
            # MYSQL查询
            # s=Q(mac__icontains=name) | Q(ssid__icontains=name) | Q(model__icontains=name)
            # Qfilter.append(s)

        # 获取起始页码
        start = int(get['iDisplayStart']) if 'iDisplayStart' in get and validation.int(get['iDisplayStart']) and int(get['iDisplayStart']) > 0 else 0
        # 获取分页长度
        pageSize = int(get['iDisplayLength']) if 'iDisplayLength' in get and validation.int(get['iDisplayLength']) and int(get['iDisplayLength']) > 1 else 50
        # 获取升降序
        direction = 1 if 'sSortDir_0' in get and get['sSortDir_0'].lower() == 'asc' else -1
        # 默认按时间降序
        sort = 'time'
        # 获取排序的字段
        if 'iSortCol_0' in get:
            iSortCol_0 = "mDataProp_" + get['iSortCol_0']
            if iSortCol_0 in get:
                sort = get[iSortCol_0]

        hotspots = DB_MONGODB.hotspot.find(condition).sort(sort,direction).limit(pageSize).skip(start)
        iTotalRecords = DB_MONGODB.hotspot.find(condition).count()
        # hotspots = Hotspot.objects.filter(*tuple(Qfilter)).order_by(direction + sort)[start:(start + pageSize)]
        # iTotalRecords = Hotspot.objects.filter(*tuple(Qfilter)).count()
        data = []
        import datetime
        for hotspot in hotspots:
            row = dict()
            for k in hotspot:
                if k == 'time':
                    row[k]= datetime.datetime.strftime(hotspot.time,'%Y-%m-%d %H:%M:%S') if hotspot.time else ''
                    continue
                if k == 'password':
                    password = hotspot.password
                    if len(password)>4:
                        password = password[0:4]+'****'
                    elif len(password)==0 or password is None:
                        password = ''
                    else:
                        password = password+'****'
                    row[k] = password
                    continue
                row[k] = getattr(hotspot,k)
            row['location'] = hotspot.location1 + hotspot.location2 + hotspot.location3 + hotspot.location
            data.append(row)
        jsonData = dict()
        jsonData['iTotalRecords'] = iTotalRecords
        jsonData['sEcho'] = int(get['sEcho']) if 'sEcho' in get and validation.int(get['sEcho']) else 1
        jsonData['iTotalDisplayRecords'] = iTotalRecords
        jsonData['aaData'] = data
        return HttpResponse(json.dumps(jsonData))

    # 监控点采集到的热点数据
    # 接口地址：/hotspot/ap
    def Ap_Fuc(self):
        get = self.request.POST
        validation = validate()
        condition = {}
        client_mac = ''
        if 'search' in get and get['search']!='':
            name = addslashes(get['search']).upper()
            condition['$or'] = [{'ssid': {'$regex': name, '$options': 'ig'}},{'mac': {'$regex': name, '$options': 'ig'}}]

        if 'mac' in get and get['mac'] != '':
            client_mac = get['mac']

        start = int(get['iDisplayStart']) if 'iDisplayStart' in get and validation.int(get['iDisplayStart']) and int(get['iDisplayStart']) > 0 else 0
        pageSize = int(get['iDisplayLength']) if 'iDisplayLength' in get and validation.int(get['iDisplayLength']) and int(get['iDisplayLength']) > 1 else 50
        direction = 1 if 'sSortDir_0' in get and get['sSortDir_0'].lower() == 'asc' else -1

        # 默认按时间降序排序
        sort = 'time'
        sortDict = {}
        if 'iSortCol_0' in get:
            iSortCol_0 = "mDataProp_" + get['iSortCol_0']
            if iSortCol_0 in get:
                sort = get[iSortCol_0]
        sortDict[sort] = direction
        print sortDict
        condition['client_mac'] = client_mac
        print condition

        # mongodb使用aggregate进行两张表关联查询，注意：$skip和$limit先后顺序不同也会导致不同结果
        relates = DB_MONGODB.history.aggregate([{'$match':condition},{'$lookup':{'from':'hotspot','localField':'hotspot_mac','foreignField':'mac','as':'lists'}},{'$sort':sortDict},{'$skip':start},{'$limit':pageSize}])
        count = DB_MONGODB.history.aggregate([{'$match':condition},{'$count':'num'}])
        count = list(count)
        iTotalRecords = count[0]['num'] if count else 0
        # 或者
        # iTotalRecords = DB_MONGODB.history.find(condition).count()

        print relates,list(relates),iTotalRecords
        data = []
        for relate in relates:
            d = dict()
            d['mac'] = relate.hotspot_mac
            d['ssid'] = relate.lists[0]['ssid']
            d['encrypt'] = relate.lists[0]['encrypt']
            d['time'] = relate.lists[0]['time']
            data.append(d)
        jsonData = dict()
        jsonData['iTotalRecords'] = iTotalRecords
        jsonData['sEcho'] = int(get['sEcho']) if 'sEcho' in get and validation.int(get['sEcho']) else 1
        jsonData['iTotalDisplayRecords'] = iTotalRecords
        jsonData['aaData'] = data
        return HttpResponse(json.dumps(jsonData))

    # 分类统计
    # 接口地址：/hotspot/count
    def Count_Fuc(self):
        from CheckPoint.models import CheckPoint

        #监控点总数
        cp_count = CheckPoint.objects.count()

        #热点总数
        ap_count = DB_MONGODB.hotspot.count()

        #含有密码的热点总数
        ap_password_count = DB_MONGODB.hotspot.find({'password':{'$ne':''}}).count()

        import datetime
        today = datetime.datetime.today()
        yesterday = today-datetime.timedelta(days=1)

        #今天热点总数
        day_count = DB_MONGODB.hotspot.find({'time':{'$gte':today}}).count()

        # 昨日热点总数
        yesterday_count = DB_MONGODB.hotspot.find({'time':{'$gte':yesterday,'$lt':today}}).count()

        # day_count = Hotspot.objects.filter(time__gte=today).count()
        # from django.db import connection
        # cursor = connection.cursor()
        # cursor.execute("select monitor_id,count(1) as count from t_hotspot where date(time) = curdate() group by monitor_id order by count desc")
        # row = cursor.fetchone()
        # #今日之星
        # cp = None
        # if row is not None:
        #     cp_id = row[0]
        #     cp = CheckPoint.objects.get(id=cp_id)

        # 查询出今天首次被采集到的热点数最多的监控点
        groups = DB_MONGODB.history.aggregate([{'$match':{'time':{'$gte':today}}},{'$group': {'_id': "$client_mac", 'num': {'$sum': 1}}},{'$sort':{'num':-1}}])
        print groups,list(groups)
        groups = list(groups)
        cp = None
        if groups:
            cp_id = groups[0]._id
            cp = CheckPoint.objects.get(mac = cp_id)

        data = dict()
        if cp is not None:
            data['star'] = (cp.mac if cp.name is None or cp.name=='' else cp.name) if cp.remark is None or cp.remark == '' else cp.remark
        else:
            data['star'] = ''

        data['ap_password_count'] = ap_password_count
        data['cp_count'] = cp_count
        data['ap_count'] = ap_count
        data['day_count'] = day_count
        data['trend'] = 'up' if day_count-yesterday_count>0 else 'down'

        return HttpResponse(json.dumps(data))

    # 监控点对应采集热点数导出
    # 接口地址：/hotspot/export
    def Export_Fuc(self):
        import datetime
        filter = {}
        get = self.request.GET
        if 'pid' in get and get['pid']!='':
            filter['client_mac'] = get['pid']

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment;filename=wifi.csv'
        writer = csv.writer(response)
        writer.writerow(['MAC','SSID','longitude','latitude','encrypt','location','time'])
        # relates = Relate.objects.filter(**filter)
        lookup = {'from':'hotspot','localField':'hotspot_mac','foreignField':'mac','as':'lists'}
        relates = DB_MONGODB.history.aggregate([{'$match':filter},{'$lookup':lookup},{'$unwind':'$lists'},{'$sort':{'lists.time':-1}}])
        # 循环写入csv中
        for relate in relates:
            data = []
            data.append(relate['hotspot_mac'])
            data.append(base64.b64decode(relate['lists']['ssid']))
            data.append(relate['lists']['longitudes'])
            data.append(relate['lists']['latitudes'])
            data.append(relate['lists']['encrypt'])
            data.append(str(relate['lists']['location2']+relate['lists']['location3']+relate['lists']['location']))
            data.append(datetime.datetime.strftime(relate['lists']['time'],'%Y-%m-%d %H:%M:%S') if relate['lists']['time'] else '')
            writer.writerow(data)
        return response

    # 周边wifi上传接口
    # 接口地址：/hotspot/upload
    def Upload_Fuc(self):
        try:
            datas = json.loads(self.request.POST)
        except:
            return errorCore().errorText('error',u'请求数据异常')

        client_mac = datas['client_mac'] if 'client_mac' in datas else ''
        hotspots = datas['hotspots'] if 'hotspots' in datas else []
        if not client_mac or not hotspots:
            return errorCore().errorText('error',u'缺少必要参数')

        HotspotUtil.run(client_mac,hotspots)

        return HttpResponse(json.dumps({'status':'success','message':u'上传成功'}))

    # 同步更新热点数据到百度云数据管理平台
    # 接口地址：/hotspot/upgradelbs
    # @require_GET #不能够使用装饰器包装函数，否则接口地址无法找到对应的接口函数，由于不属于该实例的函数了
    def Upgradelbs_Fuc(self):
        # 查询没有上传到百度云数据管理平台的热点
        datas = DB_MONGODB.hotspot.find({'$or':[{'tag':{'$exists':False}},{'tag':0}]})

        # 更新时间保存
        update_time = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
        path = os.path.dirname(__file__)+"/../data/"
        if not os.path.exists(path):
            os.makedirs(path)
        with open('data/updateTime.txt','wb') as t:
            t.write(update_time)

        # 未上传数据的保存，覆盖式写入
        with open('data/upgradeData.csv','wb') as c:
            c.write(codecs.BOM_UTF8)
            # 创建一个csv写入对象
            cwriter = csv.writer(c)
            # 写表头字段
            cwriter.writerow(["title","longitude","latitude","coord_type","my_id"])
            # 循环写入数据
            for item in datas:
                row = []
                try:
                    item['ssid'] = base64.b64decode(item['ssid'])
                except:
                    item['ssid'] = item['ssid']
                row.append(item['ssid'])
                row.append(item['longitude'])
                row.append(item['latitude'])
                row.append(item['3'])
                row.append(item['_id'])
                cwriter.writerow(row)

        # 发送给百度数据管理平台的必要参数，参考：http://lbsyun.baidu.com/index.php?title=lbscloud/api/geodata
        send_data = {
            'geotable_id':184953,
            'ak':BAIDU_KEY,
            'timestamp':time.time()
        }
        file = {'poi_list':open('data/upgradeData.csv','rb')}
        r = requests.post(API_BAIDU_UPLOAD,data=send_data,files=file)
        res = json.loads(r.text)
        # 批量上传成功，则进行热点数据更新
        if res['status'] == 0:
            DB_MONGODB.hotspot.update_many({'$or':[{'tag':{'$exists':False}},{'tag':0}]},{'$set':{'tag':1}})
        return HttpResponse(r.text)

    # 麻点图同步更新时间获取
    # 接口地址：/hotspot/getupdatetime
    def Getupdatetime_Fuc(self):
        try:
            with open('data/updateTime.txt','rb') as t:
                time = t.read()
                return JsonResponse({'time':time})
        except:
            return errorCore().errorText('error',u'服务器异常')


