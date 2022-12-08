import pymongo as mongo

MONGO_DB_CONN = "mongo1:27017,mongo2:27017,mongo3:27017"
db_conn = mongo.MongoClient(MONGO_DB_CONN)

db = db_conn["main"]
collection = db["breweries"]
breweries = []
for b in collection.find():
    breweries.append(b)
print(breweries)
