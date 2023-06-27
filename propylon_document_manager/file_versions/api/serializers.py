# from rest_framework import serializers

from propylon_document_manager.file_versions.models import FileVersion
from rest_framework import serializers
class FileVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileVersion
        fields = '__all__'


# class FileSerializer(serializers.ModelSerializer):
#     versions = FileVersionSerializer(many=True, read_only=True)

#     class Meta:
#         model = File
#         exclude = ['user']
