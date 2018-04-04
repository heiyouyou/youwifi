from Forum.core.error import errorCore
from HotspotController import HotspotController

def init(request, mode, method, **kwargs):
    controller = HotspotController(request)
    if not method:
        return controller.Index_Fuc()
    else:
        method = method.capitalize()+'_Fuc'
        print method
        if not method in dir(HotspotController):
            return errorCore().out('404')
        else:
            return getattr(controller,method)()
