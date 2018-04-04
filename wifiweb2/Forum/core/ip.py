# -*- coding: utf-8 -*-
class IPMod:
    def __init__(self):
        pass

    def get_client_ip(self, request):
        try:
            real_ip = request.META['HTTP_X_FORWARDED_FOR']
            regip = real_ip.split(",")[0]
        except:
            try:
                regip = request.META['REMOTE_ADDR']
            except:
                regip = ""
        return regip