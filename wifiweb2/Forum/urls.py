"""Forum URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
# from django.contrib import admin
# from django.conf import settings
# from django.conf.urls.static import static

from . import views

urlpatterns = [
    # url(r'^admin/', admin.site.urls)
    url(r'^login$', views.login,name='login'),
    url(r'^index/?$', views.index,name='index'),
    url(r'^taishi/?$', views.taishi,name='taishi'),
    url(r'^map/?$', views.map,name='map'),
    url(r'^(?P<mode>[a-zA-Z]+|)/(?P<method>[a-zA-Z]+|)$', views.initCore),
    url(r'^(?P<mode>[a-zA-Z]+|)/(?P<package>[a-zA-z]+|)/(?P<method>[a-zA-Z]+|)$', views.initCore)
]

# urlpatterns = [
#     # url(r'^admin/', admin.site.urls)
#     url(r'^login$', views.login,name='login'),
#     url(r'^index/?$', views.index,name='index'),
#     url(r'^taishi/?$', views.taishi,name='taishi'),
#     url(r'^map/?$', views.map,name='map'),
#     url(r'^(?P<mode>[a-zA-Z]+|)/(?P<method>[a-zA-Z]+|)$', views.initCore),
#     url(r'^(?P<mode>[a-zA-Z]+|)/(?P<package>[a-zA-z]+|)/(?P<method>[a-zA-Z]+|)$', views.initCore)
# ]+static(settings.STATIC_URL)
