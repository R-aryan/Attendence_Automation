import cv2
import numpy as np

faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
cam = cv2.VideoCapture(0)
id= input("enter your id..! \n")
sn=0
while(True):
    ret, img = cam.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:
        sn+=1
        cv2.imwrite("dataSet/user."+str(id)+"."+str(sn)+".jpg",gray[y:y+h,x:x+w])
        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)  
    cv2.imshow('Face', img)
    cv2.waitKey(1)
    #if cv2.waitKey(100) & 0xFF == ord('q'):
        #break
    if sn>20:
        break
cam.release()
cv2.destroyAllWindows()

