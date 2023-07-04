from flask import request

from controllers import user_controller as controller
from models import user as user_model

from utils import result as app_result
from utils import decorator as app_decorator

from flask_mail import Mail
from flask_mail import Message

import os

# --------------------------------------------------------------------------------------

@controller.route('/register', methods=['POST'])
def register():
	body = request.json
	username = body.get('username')
	user = user_model.get_user_by_account(username)

	if not user is None:
		return app_result.result(400, description='Invalid duplicate username')

	email = body.get('email')
	password = body.get('password')
	mword = body.get('mword')

	if mword in ['polin', 'matt', 'tom', 'oz']:
		uid = user_model.create_new_user(username, password, email)
		return app_result.result(200, {'uid': uid})
	else :
		return app_result.result(401, description='Invalid register')

# --------------------------------------------------------------------------------------

@controller.route('/login', methods=['POST'])
def login():

	body = request.json
	username = body.get('username')
	password = body.get('password')
	user = user_model.get_user_by_account(username)
	if user is None:
		return app_result.result(400, description='Username not found')

	verified = user_model.verify_md5_hash(password, user.get('salt'), user.get('password'))
	if not verified:
		return app_result.result(400, description='Verify password failed')

	uid = str(user.get('_id'))
	token_id = user_model.get_new_token(uid)
	return app_result.result(200, {'token': token_id})

# --------------------------------------------------------------------------------------

@controller.route('/detail', methods=['GET'])
@app_decorator.auth()
def get_user_detail():
	token_id = request.headers.get('Authorization')
	user = user_model.get_user_by_token(token_id)
	user_detail = {
		'username': user.get('username'),
		'name': user.get('name'),
		'email': user.get('email'),
		'role': user.get('role'),
		'isSuperRead': user_model.is_super_role(role = user.get('role'), action = 'read'),
		'isSuperWrite': user_model.is_super_role(role = user.get('role'), action = 'write')
	}

	return app_result.result(200, {'user': user_detail})

# --------------------------------------------------------------------------------------

@controller.route('/logout', methods=['DELETE'])
@app_decorator.auth()
def logout():
	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))

	user_model.delete_token_by_id(token_id)
	user_model.delete_expired_tokens(uid)
	return app_result.result(200)

# --------------------------------------------------------------------------------------

@controller.route('/forget', methods=['POST'])
def passwordforget():
	body = request.json

	username = body.get('username')
	email = body.get('email')
	user = user_model.get_user_by_account(username)
	emailCheck = user.get('email')
	if user is None:
		return app_result.result(400, description='Username not found')

	if email != emailCheck:
		return app_result.result(400, description='Email is wrong')

	uid = str(user.get('_id'))
	token_id = user_model.get_new_token(uid)



	return app_result.result(200, {'token': token_id})


# --------------------------------------------------------------------------------------

@controller.route('/message', methods=['POST'])
def sendmessage():
	body = request.json
	username = body.get('username')
	email = body.get('email')
	token = body.get('token')

	if username is None:
		return app_result.result(400, description='Username not found')


	mail = user_model.set_email_config('oz')
	msg_title = "Smasoft - Reset Password for Image Explorer"
	msg_sender = "oz.hsu@smasoft.com.tw"
	msg_recipients = [str(email)]
	# msg_body = "Hey, This is testing mail from DataCenter"

    # Add selector to seperate product and test environment
	try:
		reset_url = os.environ['DS_SERVER_URL'] 
	except KeyError:
		reset_url =  'http://127.0.0.1:3000'
		
	msg_html = '''<p> Hi {username},</p>
				<br/>
				<p> You have recently requested to reset your password for your Image Explorer account.</p>
				<p> Please click <a href="'''.format(**body)+ reset_url + '''/reset?token={token}&username={username}" >here<a/> to reset it. </p>
				<br />
				<p> If you did not request a password reset, please contact us for further assistant.</p>
				<br />
				<p> Best Wishes,</p> 
				<p> Smasoft Technology - Image Factory Team<p>'''.format(**body)

	msg = Message(msg_title,
					sender=msg_sender,
					recipients=msg_recipients)
	# msg.body = msg_body
	msg.html = msg_html
	#mail.send:send the email
	#print('msg:', msg)
	mail.send(msg)

	return app_result.result(200)


# --------------------------------------------------------------------------------------

@controller.route('/reset', methods=['POST'])
@app_decorator.auth()
def resetPassword():
	body = request.json
	password = body.get('password')
	username = body.get('username')
	if (username and password):
		user = user_model.update_user_password(username, password)
		return app_result.result(200)
	else:
		return app_result.result(400, description='Username or password not found')



