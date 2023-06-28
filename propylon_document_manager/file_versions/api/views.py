from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import authentication, permissions, viewsets
from django.http import FileResponse
from hashlib import sha256
from datetime import datetime
import os
from propylon_document_manager.file_versions.models import FileVersion
from .serializers import FileVersionSerializer

class FileUploadView(viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser)
    Versionserializer_class = FileVersionSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        file = request.FILES['file']

        # Calculate the file hash using SHA256
        file_hash = self.calculate_file_hash(file)

        # Check if a file with the same hash already exists
        if FileVersion.objects.filter(file_hash=file_hash).exists():
            return Response({'error': 'File already exists'}, status=status.HTTP_409_CONFLICT)

        version_count = FileVersion.objects.filter(file_name=request.data['file_name']).count()
        version_count = max(version_count, 0)
        version_file_serializer = self.Versionserializer_class(data={
            'file_name': request.data['file_name'],
            'file': request.FILES['file'],
            'url': request.data['url'],
            'user': request.user.id,
            'version_number': version_count,
            'file_hash': file_hash
        })

        if version_file_serializer.is_valid():
            # Generate new file name with a timestamp
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            original_file_name = request.FILES['file'].name
            file_extension = original_file_name.split('.')[-1]
            org_file_name = original_file_name.split('.')[0]
            new_file_name = f"{request.data['file_name']}_{timestamp}.{file_extension}"

            # Rename the uploaded file
            version_file_serializer.validated_data['file'].name = new_file_name

            # Save the file version
            version_file_serializer.save()

            return Response(version_file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(version_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def calculate_file_hash(self, file):
        # Calculate the SHA256 hash of the file
        sha = sha256()
        for chunk in file.chunks():
            sha.update(chunk)
        return sha.hexdigest()

class FileRetrieveView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file_name, version_number, format=None):
        try:
            file_version = FileVersion.objects.get(file_name=file_name, version_number=version_number)
            file_path = file_version.file.path
            file_name = file_version.file_name

            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)
            return response
        except FileVersion.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)



class RetrieveFileByHash(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file_hash, format=None):
        try:
            file_version = FileVersion.objects.get(file_hash=file_hash)
            file_path = file_version.file.path
            file_name = os.path.basename(str(file_version.file))
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

            response["Access-Control-Expose-Headers"] = "Content-Disposition"

            return response
        except FileVersion.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)


# class FileVersionViewSet(viewsets.ModelViewSet):
#     authentication_classes = [authentication.TokenAuthentication]
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = FileVersionSerializer

#     def get_queryset(self):
#         return FileVersion.objects.all()

class FileVersionAPIView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileVersionSerializer

    def get(self, request, format=None):
        file_versions = FileVersion.objects.filter(user=request.user_id)
        serializer = self.serializer_class(file_versions, many=True)
        return Response(serializer.data)
