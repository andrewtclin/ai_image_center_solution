import hashlib
import random
import time

import env as app_env
from utils import mongodb as app_mongodb
import app as ap

from flask_mail import Mail
from flask_mail import Message

# --------------------------------------------------------------------------------------

def get_random_salt():
	return ''.join(random.sample('abcdefghijklmnopqrstuvwxyz!@#$%^&*', 5))

def get_md5_hash(password, salt):
	salt_password = password + salt
	return hashlib.md5(salt_password.encode()).hexdigest()

def verify_md5_hash(password, salt, md5Hash):
	h = get_md5_hash(password, salt)
	if h == md5Hash:
		return True
	return False

def create_new_user(username, password, email):
	salt = get_random_salt()
	document = {
		'username': username,
		'password': get_md5_hash(password, salt),
		'email': email,
		'name': username,
		'salt': salt,
		'role': app_env.ROLE_USER,
		'ctime': int(time.time())
	}
	x = app_mongodb.connect_collection('user').insert_one(document)
	uid = str(x.inserted_id)
	return uid

def get_user_by_uid(uid):
	query = {'_id': app_mongodb.objectid(uid)}
	user = app_mongodb.connect_collection('user').find_one(query)
	return user

def get_user_by_account(username):
	query = {'username': username}
	user = app_mongodb.connect_collection('user').find_one(query)
	return user

def get_user_by_token(token_id):
	token = get_token(token_id)
	if token is None:
		return None
	uid = token.get('uid')
	user = get_user_by_uid(uid)
	return user

def get_new_token(uid):
	delete_expired_tokens(uid)
	document = {
		'uid': uid,
		'ctime': int(time.time()),
		'expiredAt': int(time.time()) + 86400
	}
	x = app_mongodb.connect_collection('token').insert_one(document)
	token_id = str(x.inserted_id)
	return token_id

def get_token(token_id):
	query = {'_id': app_mongodb.objectid(token_id)}
	token = app_mongodb.connect_collection('token').find_one(query)
	if token.get('expiredAt') == None or token.get('expiredAt') < int(time.time()):
		delete_token_by_id(token_id)
		return None
	return token

def delete_token_by_id(token_id):
	query = {'_id': app_mongodb.objectid(token_id)}
	app_mongodb.connect_collection('token').delete_one(query)

def delete_expired_tokens(uid):
	query = {'uid': uid, 'expiredAt': { '$lt': int(time.time()) }}
	app_mongodb.connect_collection('token').delete_many(query)

def get_super_roles(action = 'read'):
	if action == 'read':
		return [
			app_env.ROLE_ADMIN,
			app_env.ROLE_SUPERWRITE,
			app_env.ROLE_SUPERREAD
		]
	if action == 'write':
		return [
			app_env.ROLE_ADMIN,
			app_env.ROLE_SUPERWRITE
		]

def is_super_role(role = '', action = 'read'):
	# action: read / write
	isSuper = False
	superRoles = get_super_roles(action)
	# print('role:', role)
	# print('superRoles:', superRoles)
  
	for r in superRoles:
		if role == r:
			isSuper = True
			break
	return isSuper


def get_env_by_account(username):
	query = {'username': username}
	env = app_mongodb.connect_collection('env').find_one(query)
	return env

def set_email_config(username):
	ap.app.config.update(
		#  office365的設置
		MAIL_SERVER = app_env.MAIL_SERVER,
		MAIL_PROT = app_env.MAIL_PROT,
		MAIL_USE_TLS = app_env.MAIL_USE_TLS,
		MAIL_USERNAME= get_env_by_account(username).get('email') ,
		MAIL_PASSWORD= get_env_by_account(username).get('password')
	)
	
	mail = Mail(ap.app)

	return mail

def update_user_password(username, password):
	query = {'username': str(username)}
	salt = get_random_salt()

	new_document = {}
	new_document['password'] = get_md5_hash(password, salt)
	new_document['salt'] = salt
	newvalues = {'$set': new_document}

	user = app_mongodb.connect_collection('user').find_one_and_update(query, newvalues, new=True)
	return user
	


