import cv2, os
import numpy as np
from PIL import Image

recognizer = cv2.createLBPHFaceRecognizer()
path='dataSet'
def getImagesWithId(path):
    imagePaths = [os.path.join(path,f) for f in os.listdir(path)] 
    faces=[]
    ids = []
    for imagePath in imagePaths:
        faceImg= Image.open(imagePath).convert('L')
        faceNp = np.array(faceImg,'uint8')
        id = int(os.path.split(imagePath)[-1].split(".")[1])
        faces.append(faceNp)
        ids.append(id)
        cv2.imshow("training",faceNp)
        cv2.waitKey(10)
    return ids,faces
ids, faces = getImagesWithId(path)
recognizer.train(faces, np.array(ids))
recognizer.save('recognizer/trainningData.yml')
cv2.destroyAllWindows()
