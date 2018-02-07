from pymongo import MongoClient
import cv2
import numpy as np
import logging

logging.basicConfig(filename= 'mylogs.txt',filemode='w',level=logging.DEBUG, format='%(asctime)s-%(levelname)s-%(message)s')
client = MongoClient()
db= client["csihackathon"]
collection=db["users"]

users = collection.find({})
logging.debug('database connection established \n')
# for document in users:
#     print(document)
avail = {}
faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
logging.debug('face detection module begins \n')
cam = cv2.VideoCapture(0)
rec = cv2.createLBPHFaceRecognizer()
rec.load("recognizer/trainningData.yml")
id=0
na=""
i=0
font=cv2.cv.InitFont(cv2.cv.CV_FONT_HERSHEY_COMPLEX_SMALL,3,1,0,4)
while(True):
    ret, img = cam.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:

        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
        id,conf=rec.predict(gray[y:y+h,x:x+h])
        
        for document in users:
                
            if id==document["sapid"]:
                cv2.cv.PutText(cv2.cv.fromarray(img),str(na),(x,y+h),font,255)
                logging.info('Face Id  '+str(id)+' matched \n ')
                na=document["name"]
                avail[document["sapid"]] = True
                logging.info('Setting flag of matched Id  '+str(id)+' true \n ')
                
        
            else:
                # print "Face Id not matched"
                logging.info('Face Id not matched \n ')

        #cv2.cv.PutText(cv2.cv.fromarray(img),str(na),(x,y+h),font,255)
           
         

    cv2.imshow('Face', img)
    logging.info('Opening Webcam window \n ')
    if cv2.waitKey(100) & 0xFF == ord('q'):
        for x in avail:
            if avail[x]:
                # user = collection.find_one({"sapid": x})
                # print user["att"]
                collection.update({"sapid": x},{"$inc":{"att": 1}})
                logging.info('Increamenting attendence of Id '+str(id)+' by 1 \n ')
                # user={}
                # user["sapid"]="Mongodb Guide"
                # user["attendenceCount"]=0
                # collection.insert(user)
        break
cam.release()
cv2.destroyAllWindows()
logging.info('Face Detection module ends \n ')


#client = MongoClient('localhost', 27017)

# class Students(Document):
#     sapid = StringField(required=True, max_length=200)
#     attendenceCount = NumberField(default=0)


# user={}
# user["sapid"]="Mongodb Guide"
# user["attendenceCount"]=0
# collection.insert(user)

