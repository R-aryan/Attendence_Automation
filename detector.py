import cv2
import numpy as np

faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

cam = cv2.VideoCapture(0)
rec = cv2.createLBPHFaceRecognizer()
rec.load("recognizer/trainningData.yml")
id=0
font=cv2.cv.InitFont(cv2.cv.CV_FONT_HERSHEY_COMPLEX_SMALL,3,1,0,4)
while(True):
    ret, img = cam.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
        id,conf=rec.predict(gray[y:y+h,x:x+h])
        if id==1:
            id='Jasjyot'
        if id==2:
            id='Ritesh'
        if id==3:
            id='Sayan'
        if id==4:
            id='Utkarsh'
        
        cv2.cv.PutText(cv2.cv.fromarray(img),str(id),(x,y+h),font,255)
         

    cv2.imshow('Face', img)
    if cv2.waitKey(100) & 0xFF == ord('q'):
        break
cam.release()
cv2.destroyAllWindows()
