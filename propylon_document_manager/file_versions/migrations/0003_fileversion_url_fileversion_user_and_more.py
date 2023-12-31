# Generated by Django 4.1.9 on 2023-06-27 00:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("file_versions", "0002_alter_fileversion_file_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="fileversion",
            name="url",
            field=models.CharField(default="", max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="fileversion",
            name="user",
            field=models.ForeignKey(
                default="", on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="fileversion",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="files/"),
        ),
        migrations.DeleteModel(
            name="File",
        ),
    ]
