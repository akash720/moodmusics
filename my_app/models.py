from django.db import models


# Create your models here.
class Song(models.Model):
    id = models.AutoField(primary_key=True)
    song_url = models.CharField(max_length=120)
    cover = models.CharField(max_length=120)
    movie = models.CharField(max_length=120)
    label = models.CharField(max_length=120)
    mood = models.CharField(max_length=10, default='Neutral')

    def __str__(self):
        return self.label
