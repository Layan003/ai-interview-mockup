# Generated by Django 5.1.6 on 2025-03-26 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interview', '0005_alter_question_feedback_alter_question_interview_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interview',
            name='json_response',
            field=models.TextField(blank=True, max_length=30000, null=True),
        ),
    ]
