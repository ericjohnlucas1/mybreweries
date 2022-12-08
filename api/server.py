#!/usr/bin/env python3.6
import atexit
import os
import string
import sys
import traceback
import uuid
import base64
from waitress import serve

from datetime import timedelta
from functools import reduce
from functools import update_wrapper
from itertools import groupby
from bson.objectid import ObjectId
import pymongo as mongo
from flask import Flask, request, jsonify, current_app, make_response, send_file, render_template
from bson import json_util
import json
from flask import Flask
from flask_cors import CORS,cross_origin

MONGO_DB_CONN = "mongo1:27017,mongo2:27017,mongo3:27017"

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

#CORS(app)
CORS(app, headers='Content-Type')

@app.route('/breweries/<_id>', methods=['DELETE', 'OPTIONS'])
def delete_brewery(_id):
    try:
        db_conn = mongo.MongoClient(MONGO_DB_CONN)
        db = db_conn["main"]
        collection = db["breweries"]
        collection.delete_one({"_id": ObjectId(_id)})
        return '', 204, {'Content-Type': 'application/json'}
    except Exception as ex:
        traceback.print_exc()
        return 'Unhandled error', 500, {'Content-Type':'text/plain'}


@app.route('/breweries/', methods=['OPTIONS','POST'])
@cross_origin()
def create_brewery():
    try:
        db_conn = mongo.MongoClient(MONGO_DB_CONN)
        db = db_conn["main"]
        collection = db["breweries"]
        data = request.json
        resp = collection.insert_one(data)
        return jsonify(json.loads(json_util.dumps({"_id": resp.inserted_id}))), 200, {'ContentType':'application/json'}
    except Exception as ex:
        traceback.print_exc()
        return 'Unhandled error', 500, {'Content-Type':'text/plain'}

@app.route('/breweries/', methods=['GET', 'OPTIONS'])
def list_breweries():
    try:
        db_conn = mongo.MongoClient(MONGO_DB_CONN)
        db = db_conn["main"]
        collection = db["breweries"]
        breweries = []
        for b in collection.find():
            breweries.append(json.loads(json_util.dumps(b)))
        return jsonify(breweries), 200, {'ContentType':'application/json'}
    except Exception as ex:
        traceback.print_exc()
        return 'Unhandled error', 500, {'Content-Type':'text/plain'}


@app.route('/breweries/<_id>', methods=['PUT', 'OPTIONS'])
def update_brewery(_id):
    try:
        #TODO
        db_conn = mongo.MongoClient(constants.MONGO_DB_CONN)
        return '', 204, {'Content-Type': 'application/json'}
    except Exception as ex:
        traceback.print_exc()
        return 'Unhandled error', 500, {'Content-Type':'text/plain'}



if __name__ == '__main__':
    #app.run(debug=False,host='0.0.0.0',threaded=True)
    serve(app, host='0.0.0.0', port=5000)
