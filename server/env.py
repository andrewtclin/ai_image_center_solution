import os

# file manager info
#FILE_MANAGER_PATH = 'public/file_manager'
FILE_MANAGER_PATH = '/ss/file_manager'


# logger info
LOG_FILENAME = 'logger-api'

# server info
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 16147
# SERVER_HOST = os.environ['SERVER_HOST']
# SERVER_PORT = int(os.environ['SERVER_PORT'])
SERVER_DEBUG = True


# MONGO_HOST = 'mongo'
MONGO_HOST = os.environ['MONGO_HOST']
# MONGO_PORT = 27017
MONGO_PORT = int(os.environ['MONGO_PORT'])
# MONGO_USERNAME = 'admin'
MONGO_USERNAME = os.environ['MONGO_USERNAME']
# MONGO_PASSWORD = 'sma4282'
MONGO_PASSWORD = os.environ['MONGO_PASSWORD']
try:
    MONGO_DB_ACCOUNT = os.environ['MONGO_DB_ACCOUNT']
except KeyError:
    MONGO_DB_ACCOUNT = 'file_manager'


# user role info
ROLE_ADMIN = 'admin'
ROLE_SUPERREAD = 'super_read'
ROLE_SUPERWRITE = 'super_write'
ROLE_USER = 'user'

# root folder info
ROOT_FOLDER_ID = 'root'
ROOT_FOLDER_OWNERID = 'root'
ROOT_FOLDER_NAME = 'root'


# email info
MAIL_SERVER='smtp.office365.com'
MAIL_PROT=587
MAIL_USE_TLS=True

#Now, the setting below store in the MongoDB env collection 
# MAIL_USERNAME= '<your-smasoft-account>'
# MAIL_PASSWORD= '<your-password>' 

