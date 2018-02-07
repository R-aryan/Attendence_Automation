from pymongo import MongoClient
import cv2
import numpy as np

client = MongoClient()
db= client["csihackathon"]
collection=db["users"]

users = collection.find({})
# for document in users:
#     print(document)
avail = {}
faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

cam = cv2.VideoCapture(0)
rec = cv2.createLBPHFaceRecognizer()
rec.load("recognizer/trainningData.yml")
id=0
na=""
font=cv2.cv.InitFont(cv2.cv.CV_FONT_HERSHEY_COMPLEX_SMALL,3,1,0,4)
while(True):
    ret, img = cam.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
        id,conf=rec.predict(gray[y:y+h,x:x+h])
        for document in users:
            print(document)
            if id==document["sapid"]:
                na=document["name"]
                avail[document["sapid"]] = True
            else :
                print "hola"
        
        cv2.cv.PutText(cv2.cv.fromarray(img),str(na),(x,y+h),font,255)
         

    cv2.imshow('Face', img)
    if cv2.waitKey(100) & 0xFF == ord('q'):
        for x in avail:
            if avail[x]:
                # user = collection.find_one({"sapid": x})
                # print user["att"]
                collection.update({"sapid": x},{"$inc":{"att": 1}})
                # user={}
                # user["sapid"]="Mongodb Guide"
                # user["attendenceCount"]=0
                # collection.insert(user)
        break
cam.release()
cv2.destroyAllWindows()


#client = MongoClient('localhost', 27017)

# class Students(Document):
#     sapid = StringField(required=True, max_length=200)
#     attendenceCount = NumberField(default=0)


# user={}
# user["sapid"]="Mongodb Guide"
# user["attendenceCount"]=0
# collection.insert(user)

