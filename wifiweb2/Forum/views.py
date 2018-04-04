# -*- coding: utf-8 -*-
from django.conf import settings
from django.shortcuts import render_to_response,render
from django.http import HttpResponse
from django.views.decorators.http import require_GET,require_POST
from core.error import errorCore
from Forum.settings import DB_MONGODB
#from django.contrib.sessions.backends.db import Session

def initCore(request, mode, method,**kwargs):
    mode=mode.capitalize()
    
    if mode=='Checkpoint':
        mode='CheckPoint'

    if mode not in settings.INSTALLED_APPS:
        return errorCore().out('404');
    
    exec 'from ' + mode + '.views import init';
    return init(request, mode, method, **kwargs);


def login(request):
    return HttpResponse('1')
    exit()
    #request.session.flush()
    return render_to_response('login.zy')

def index(request):
    # sql='select count(1) as num, location_2 from t_route where location_2!=\'\' group by location_2'
    # from django.db import connection
    # cursor = connection.cursor()
    # cursor.execute(sql)
    # hotspots = cursor.fetchall()

    # $match必须放在$group前面
    hotspots = DB_MONGODB.hotspot.aggregate([{'$match':{'location_2':{'$ne':'','$exists':True}}},{'$group':{'_id': "$location_2", 'num':{'$sum': 1}}}])
    print list(hotspots)
    data = []
    for line in hotspots:
        hotspot = dict()
        hotspot['value']=line.num
        hotspot['name']=line._id
        data.append(hotspot)

    return render_to_response('index.html',{'data':data})
    
def taishi(request):
    return render_to_response('taishi.html')

def map(request):
    return render_to_response('map.html')