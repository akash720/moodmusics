from fer import FER
from django.shortcuts import render, redirect
from binascii import a2b_base64
from io import BytesIO
from PIL import Image
from keras import backend as K
import numpy as np

from .models import Song


def open_camera(request):
    return render(request, 'camera.html')


# get all songs of the mood passed
def get_songs(mood):
    all_songs = Song.objects.all()
    mood_songs = []
    for song in all_songs:
        if song.mood == mood:
            mood_songs.append(song)
    return mood_songs


def detect(request):
    # Getting image
    try:
        data = request.POST['image_data']
    except:
        K.clear_session()
        # No data, redirect to open_camera
        return redirect(open_camera)

    # Decoding image URI
    binary_data = a2b_base64(data)
    image_data = BytesIO(binary_data)
    img = np.array(Image.open(image_data).convert('RGB'))

    detector = FER(mtcnn=True)
    mood_tuple = detector.top_emotion(img)
    if not mood_tuple:
        K.clear_session()
        print('No mood detected. Try again...')
        # No face, redirect to open_camera
        return redirect(open_camera)

    mood = mood_tuple[0].capitalize()
    K.clear_session()

    context = {'my_mood': mood, 'mood_songs': get_songs(mood)}
    return render(request, 'main2.html', context)
