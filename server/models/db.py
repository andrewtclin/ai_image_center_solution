import os
import shutil
import json

import pymongo
from pymongo import MongoClient
import env as app_env

from models import user as user_model

def check_database_collection():
    client = MongoClient(str(app_env.MONGO_HOST) + ':' + str(app_env.MONGO_PORT))
    
    client.admin.authenticate(app_env.MONGO_USERNAME,app_env.MONGO_PASSWORD)
    client.file_manager.add_user('admin','sma4282',roles=[{'role':'readWrite','db':'file_manager'}])
    if(user_model.get_user_by_account('username')):
        return 
    else:
        user_model.create_new_user('username', 'password', 'username@email.com')