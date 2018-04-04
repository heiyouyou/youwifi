from Forum.core.error import errorCore
from django.http import HttpResponse
from CheckPointController import CheckPointController

def init(request, mode, method, **kwargs):
    controller =CheckPointController(request)
    if not method:
        return controller.Index_Fuc()
    else:
        method = method.capitalize()+'_Fuc'
        if not method in dir(CheckPointController):
            return errorCore().out('404')
        else:
            return getattr(controller, method)()
