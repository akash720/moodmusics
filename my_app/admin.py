from django.contrib import admin

# Register your models here.
from .models import Song

admin.site.register(Song)
