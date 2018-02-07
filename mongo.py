from pymongo import MongoClient

client = MongoClient()
db= client["Attendance"]
collection=db["Students"]


user={}
user["sapid"]=4
user["attendenceCount"]=0
collection.insert(user)