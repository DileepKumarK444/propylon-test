from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from propylon_document_manager.users.api.views import UserViewSet
from propylon_document_manager.file_versions.api.views import FileVersionViewSet, FileUploadView, FileRetrieveView, RetrieveFileByHash
from django.urls import include, path

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register(r'file_versions', FileVersionViewSet, basename='file-version')
router.register(r'file_upload', FileUploadView, basename='file-upload')

app_name = "api"
urlpatterns = router.urls
urlpatterns += [
    path('file/<str:file_name>/version/<int:version_number>/', FileRetrieveView.as_view(), name='file-retrieve'),
    path('file/<str:file_hash>/', RetrieveFileByHash.as_view(), name='file-retrieve-hash'),
]
