"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    # path("admin/", admin.site.urls),
    path("search/", views.display_scraped_data, name="search"),
    path("search/stream/", views.stream_scraped_data, name="search_stream"),
    path("api/csrf/", views.csrf, name="csrf"),
    path("api/post/", views.secure_post, name="secure_post"),
    path("api/auth/verify/", views.varify_access_tocken, name="verify_token"),
    path("api/search/save/", views.save_search, name="save_search"),
    path(
        "api/search/recent/",
        views.get_recent_searches,
        name="get_recent_searches",
    ),
    path(
        "api/search/recent/delete/",
        views.delete_search,
        name="delete_search",
    ),
    path("api/auth/status/", views.get_auth_status, name="auth_status"),
    path("api/cache-check/", views.check_cache_status, name="cache_check"),
    path("test/", views.scrape_test, name="scrape_test"),
]
