from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# class File(models.Model):
#     file_name = models.CharField(max_length=255)
#     file = models.FileField(upload_to='files/',null=True,blank=True)
#     url = models.CharField(max_length=255)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class FileVersion(models.Model):
    # file = models.ForeignKey(File, related_name='versions', on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='files/',null=True,blank=True)
    url = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    version_number = models.PositiveIntegerField()
    file_hash = models.CharField(max_length=100)

