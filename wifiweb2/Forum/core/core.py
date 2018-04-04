# -*- coding:utf8 -*-
def addslashes(str):
    return str.replace('\\','\\\\').replace('\'','\\\'').replace('"','\\"');

def getJson(result,msg):
    jsonData = dict()
    jsonData['result'] = 1 if result else 0
    jsonData['msg'] = msg
    
    return jsonData

def getClientIP(request):
    try:
        ip=request.META['HTTP_X_FOWARDED_FOR']
        ip=ip.split(',')[0]
    except:
        try:
            ip=request.META['REMOTE_ADDR']
        except:
            ip=''
    return ip

def renderer_mac(mac, prefix=':'):
    """
    MAC 12位格式化
    :param mac:
    :param prefix:
    :return:
    """
    m = list()
    for i in range(6):
        m.append(mac[i*2:(i+1)*2])
    return prefix.join(m)