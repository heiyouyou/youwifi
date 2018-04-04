# -*- coding: utf-8 -*-
from django.http import HttpResponse,JsonResponse

class errorCore():
    # 错误代码
    def out(self, code):
        return HttpResponse(code)
    # 错误文本
    def errorText(self,code,text):
        return JsonResponse({'status':code,'message':text})