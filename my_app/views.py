from django.shortcuts import render,redirect
from binascii import a2b_base64
from io import BytesIO
from PIL import Image
import cv2
import numpy as np
from keras.models import load_model
from keras import backend as K
import numpy as np

def openCamera(request):
	return render(request, 'camera.html')

my_mood = '';
#Defining labels 

def get_label(argument):
    labels = {0:'Angry', 1:'Disgust', 2:'Fear', 3:'Happy', 4:'Sad' , 5:'Surprise', 6:'Neutral'}
    return(labels.get(argument, "Invalid emotion"))


def detect(request):
	#Using another pre-trained model because of it's better accuracy
	my_model = load_model("my_app/my_model.hdf5", compile = False)
	face_cascade = cv2.CascadeClassifier('my_app/haarcascade_frontalface_default.xml')

	#Getting image
	try:
		data = request.POST['image_data']
	except:
		K.clear_session()
		#No data, redirect to openCamera
		return redirect(openCamera)

	#Decoding image URI
	binary_data = a2b_base64(data)
	image_data = BytesIO(binary_data)

	img = np.array(Image.open(image_data))

	#Converting to grayscale
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

	#Detecting faces
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)
	if len(faces)==0:
		K.clear_session()
		#No face, redirect to openCamera
		return redirect(openCamera)
	x_axis = 10
	y_axis = 10
	for (x, y, w, h) in faces:
		crop_img = img[y:y+h, x:x+w]
		x_axis,y_axis = x,y

	#Resizing image to required size and processing
	test_image = cv2.resize(crop_img, (64,64))
	test_image = np.array(test_image)
	gray = cv2.cvtColor(test_image, cv2.COLOR_BGR2GRAY)

	#scale pixels values to lie between 0 and 1 because we did same to our train and test set
	gray = gray/255

	#reshaping image (-1 is used to automatically fit an integer at it's place to match dimension of original image)
	gray = gray.reshape(-1, 64,64, 1)

	res = my_model.predict(gray)

	#argmax returns index of max value
	result_num = np.argmax(res)

	mood = get_label(result_num);

	K.clear_session()

	return render(request, 'main2.html' , {'my_mood': mood} )
	