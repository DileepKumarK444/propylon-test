import pytest
from rest_framework import status
from rest_framework.test import APIClient
from propylon_document_manager.file_versions.models import FileVersion
from propylon_document_manager.users.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.authtoken.models import Token
from django.urls import reverse

client = APIClient()

@pytest.fixture
def test_user(db):
    return User.objects.create(email='system@gmail.com', password='system123')

@pytest.fixture
def test_auth(test_user):
    token = Token.objects.create(user=test_user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    return True

@pytest.fixture
def file_data(test_user):
    return {
        'file_name': 'test_file',
        'file': SimpleUploadedFile('test_file.txt', b'Test file content'),
        'url': 'http://example.com/test_file',
        'user': test_user,
        'version_number': 1,
        'file_hash': 'test_hash'
    }

def test_file_upload_view_create(test_auth, file_data):
    response = client.post('/api/file_upload/', data=file_data, format='multipart')

    assert response.status_code == status.HTTP_201_CREATED

    version_count = FileVersion.objects.filter(file_name=file_data['file_name']).count()
    assert version_count == 1

def test_file_retrieve_view_get(test_auth, file_data):
    FileVersion.objects.create(**file_data)
    url = reverse('api:file_retrieve', kwargs={'file_name': 'test_file', 'version_number': 1})
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response['Content-Disposition'] == 'attachment; filename="test_file"'

def test_retrieve_file_by_hash(test_auth, file_data):
    # Create a file version with a specific file hash
    file_version = FileVersion.objects.create(**file_data)
    # Set up the request URL for retrieving the file by hash
    url = reverse('api:file-retrieve-hash', kwargs={'file_hash': 'test_hash'})

    # Send a GET request to the URL
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response['Content-Disposition'] == 'attachment; filename="{}"'.format(file_version.file_name)
