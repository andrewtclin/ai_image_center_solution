from flask import request
from flask import send_file,send_from_directory
import os
import zipfile
import io
import shutil
import time
import sys
import json
from shutil import copyfile



from controllers import file_manager_controller as controller
from models import user as user_model
from models import file_manager as file_manager_model
from models import  label as label_model

import env as app_env
from utils import result as app_result
from utils import decorator as app_decorator
from utils import mongodb as app_mongodb
import re
# --------------------------------------------------------------------------------------
@controller.route('/hierarchy_folder',methods=['POST'])
@app_decorator.auth()
def create_folder_hierarchy():
	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))
	hierarchical_data = request.json
	
	if hierarchical_data == None:
		return app_result.result(400)
	else:
		hierarchical_ids = file_manager_model.create_hierarchical_folder(uid, hierarchical_data)
		return app_result.result(200, hierarchical_ids)

@controller.route('/hierarchy_folder', methods=['GET'])
@app_decorator.auth()
def get_hierarchical_folders():
	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))
	
	if not token_id:
		return app_result.result(400, 'Invalid User Token')
	else:
		hierarchical_folders = file_manager_model.retrieve_hierarchical_folders(uid)
		return app_result.result(200, hierarchical_folders) 

@controller.route('/home_folder_id', methods=['GET'])
@app_decorator.auth()
def get_home_folder():
	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))
	folder = file_manager_model.get_folder_from_root(uid)

	if folder == None:
		folder_id = file_manager_model.create_new_folder(
			folder_name=uid,
			parent_id=app_env.ROOT_FOLDER_ID,
			owner_id=uid,
			creator_id=uid
		)
	else:
		folder_id = str(folder.get('_id'))
	return app_result.result(200, {'id': folder_id})

# --------------------------------------------------------------------------------------

@controller.route('/folder/<folder_id>', methods=['GET'])
@app_decorator.auth()
def get_folder_info(folder_id):
	folder = file_manager_model.get_folder(folder_id)
	if folder is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	user = user_model.get_user_by_token(token_id)
	uid = str(user.get('_id'))
	if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
		return app_result.result(403)

	breadcrumbs = []
	ancestor_folderids = folder.get('ancestorIds')

	for each_id in ancestor_folderids:
		each_folder = file_manager_model.get_folder(each_id)


		if each_folder.get('_id') == None:
			if each_id == app_env.ROOT_FOLDER_ID and user_model.is_super_role(role=user.get('role'), action='read'):

				breadcrumbs.append({
					'folderId': app_env.ROOT_FOLDER_ID,
					'name': app_env.ROOT_FOLDER_NAME,
					'ownerId': app_env.ROOT_FOLDER_OWNERID
				})
		else:
			name = each_folder.get('name')
	
			if name == uid:
				name = 'home'
			else:
				if user_model.is_super_role(role=user.get('role'), action='read'):
					if name == each_folder.get('ownerId'):
						asked_user = user_model.get_user_by_uid(name)
				
						name = 'USER: ' + asked_user.get('username')
			breadcrumbs.append({
				'folderId': str(each_folder.get('_id')),
				'name': name,
				'ownerId': each_folder.get('ownerId')
			})

	folder_info = {
		'id': folder_id,
		'ownerId': folder.get('ownerId'),
		'name': folder.get('name'),
		'isLeafNode': folder.get('isLeafNode'),
		'breadcrumbs': breadcrumbs,
		'isHomeFolder': True if folder.get('name') == uid else False,
		'isRootFolder': True if folder_id == app_env.ROOT_FOLDER_ID else False,
		'isUserFolder': False if folder.get('isUserFolder') == None else folder.get('isUserFolder'),
		'isOwner': True if uid == folder.get('ownerId') else False,
		'endCustomer': folder.get('endCustomer'),
		'productType': folder.get('productType'),
		'tags': folder.get('tags'),
		'uploader': folder.get('uploader'),
		'comments': folder.get('comments'),
	}

	if user_model.is_super_role(role=user.get('role'), action='read'):
		if not folder_id == app_env.ROOT_FOLDER_ID:
			if folder.get('name') == folder.get('ownerId'):
				
				asked_user = user_model.get_user_by_uid(folder.get('name'))
				folder_info['name'] = 'USER: ' + asked_user.get('username')

	return app_result.result(200, folder_info)

# --------------------------------------------------------------------------------------

@controller.route('/folder/<folder_id>/content_folders', methods=['GET'])
@app_decorator.auth()
def get_content_folders(folder_id):
	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	user = user_model.get_user_by_token(token_id)
	if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
		return app_result.result(403)

	content = {
		'id': folder_id,
		'folders': []
	}

	folders = file_manager_model.get_folders_from_parent(parent_id=folder_id);

	for each_folder in folders:
		name = each_folder.get('name')
		if user_model.is_super_role(role=user.get('role'), action='read'):
			if folder_id == app_env.ROOT_FOLDER_ID:
				asked_uid = name
				try:
					user_get = user_model.get_user_by_uid(asked_uid)
				except AttributeError:
					user_get = None
				if user_get != None:
					name = user_get.get('username')
				else:
					name = 'NoN'

		if name != 'NoN':
			content['folders'].append({
				'folderId': str(each_folder.get('_id')),
				'name': name,
				'ctime': each_folder.get('ctime'),
				'utime': None if each_folder.get('utime') == None else each_folder.get('utime'),
				'endCustomer': each_folder.get('endCustomer'),
				'productType': each_folder.get('productType'),
				'tags': each_folder.get('tags'),
				'uploader': each_folder.get('uploader'),
				'comments': each_folder.get('comments'),
			})

	return app_result.result(200, content)

# --------------------------------------------------------------------------------------
@controller.route('/hierarchy_folder/<folder_id>/content_files', methods=['GET'])
@app_decorator.auth()
def get_hierarchy_content_files(folder_id):
	folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	# if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
	# 	return app_result.result(403)

	page = 1 if request.args.get('page') == None else int(request.args.get('page'))
	size = 50 if request.args.get('size') == None else int(request.args.get('size'))

	content = {
		'id': folder_id,
		'files': []
	}

	files = file_manager_model.get_files_from_folder(folder_id=folder_id, page=page, size=size)
	for each_file in files:
		content['files'].append({
			'fileId': str(each_file.get('_id')),
			'folderId': each_file.get('folderId'),
			'name': each_file.get('name'),
			'size': each_file.get('size'),
			'ctime': each_file.get('ctime'),
			'utime': None if each_file.get('utime') == None else each_file.get('utime')
		})
	return app_result.result(200, content)

@controller.route('/folder/<folder_id>/content_files', methods=['GET'])
@app_decorator.auth()
def get_content_files(folder_id):
	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
		return app_result.result(403)

	page = 1 if request.args.get('page') == None else int(request.args.get('page'))
	size = 50 if request.args.get('size') == None else int(request.args.get('size'))

	content = {
		'id': folder_id,
		'files': []
	}

	files = file_manager_model.get_files_from_folder(folder_id=folder_id, page=page, size=size);
	for each_file in files:
		content['files'].append({
			'fileId': str(each_file.get('_id')),
			'folderId': each_file.get('folderId'),
			'name': each_file.get('name'),
			'size': each_file.get('size'),
			'ctime': each_file.get('ctime'),
			'utime': None if each_file.get('utime') == None else each_file.get('utime')
		})
	return app_result.result(200, content)

# --------------------------------------------------------------------------------------

@controller.route('/hierarchy_folder/<folder_id>/content_uri_path', methods=['GET'])
@app_decorator.auth()
def get_hierarchy_content_uri_path(folder_id):
	folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	# if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
	# 	return app_result.result(403)

	content = {
		'id': folder_id,
		'uriPath': ''
	}

	content['uriPath'] = file_manager_model.get_hierarchy_folder_path(folder_id)
	return app_result.result(200, content)

@controller.route('/folder/<folder_id>/content_uri_path', methods=['GET'])
@app_decorator.auth()
def get_content_uri_path(folder_id):
	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
		return app_result.result(403)

	content = {
		'id': folder_id,
		'uriPath': ''
	}

	content['uriPath'] = file_manager_model.get_folder_uri(folder_id)
	return app_result.result(200, content)

# --------------------------------------------------------------------------------------

@controller.route('/folder', methods=['POST'])
@app_decorator.auth()
def create_new_folder():
	body = request.json
	folder_name = body.get('name')
	parent_id = body.get('parentId')

	parent_folder = file_manager_model.get_folder(parent_id)
	if parent_folder is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))
	if not file_manager_model.get_folder_permission(folder_id=parent_id, token_id=token_id, action='write'):
		return app_result.result(403)

	# from user folder
	if file_manager_model.get_folder(parent_id).get('isUserFolder'):
		end_customer = body.get('endCustomer')
		product_type = body.get('productType')
		tags = body.get('tags')
		uploader = body.get('uploader')
		comments = body.get('comments')

		folder_id = file_manager_model.create_new_folder(
		folder_name=folder_name,
		parent_id=parent_id,
		owner_id=parent_folder.get('ownerId'),
		creator_id=uid,
		end_customer=end_customer,
		product_type=product_type,
		tags=tags,
		uploader=uploader,
		comments=comments
	)
	else:
		folder_id = file_manager_model.create_new_folder(
			folder_name=folder_name,
			parent_id=parent_id,
			owner_id=parent_folder.get('ownerId'),
			creator_id=uid
		)

	if folder_id == -1:
		return app_result.result(400, description='Parent folder not found')
	if folder_id == -2:
		return app_result.result(400, description='Folder already exists')
	if folder_id == -3:
		return app_result.result(400, description='Folder name cannot be Chinese characters')
	return app_result.result(200, {'folderId': folder_id})

# --------------------------------------------------------------------------------------
@controller.route('/folder_hierarchy/<pid>/files', methods=['POST'])
@app_decorator.auth()
def upload_files_hierarchy(pid):
	try:
		repattern = re.compile(u'[\u4e00-\u9fa5]+')
		
		start_time = time.time()
		uploaded_files = request.files.getlist('files')
		token_id = request.headers.get('Authorization')
		uid = str(user_model.get_user_by_token(token_id).get('_id'))
		# record_set_name = request.form['record_set_name']
		# al_type = request.form['al_type']
		# classification_label = request.form['classification_label']
		try:
			record_set_name = request.form['record_set_name']
			al_type = request.form['al_type']
			classification_label = request.form['classification_label']
		except:
			record_set_name=None
			al_type=None
			classification_label=None
		# if not file_manager_model.get_folder_permission(folder_id=pid, token_id=token_id, action='write'):
		# 	return app_result.result(403)

		folder_path = file_manager_model.get_hierarchy_folder_path(pid)
		if folder_path is None:
			return app_result.result(400)
		for file in uploaded_files:
			filename = file.filename
			ext_name = filename.split('.')[-1].lower()
			if repattern.search(filename)!=None or ext_name in ['tif','tiff']:
				continue
			elif ext_name not in ['bmp','png','jpg','jpeg']:
				continue
			else:
				file.flush()
				size = os.fstat(file.fileno()).st_size
				file_doc = file_manager_model.get_file_by_name(file_name=filename, folder_id=pid)
				if file_doc == None:
					file_manager_model.create_new_file(
						file_name=filename,
						folder_id=pid,
						creator_id=uid,
						size=size,
						record_set_name=record_set_name,
						al_type=al_type,
						classification_label=classification_label
					)
				else:
					file_manager_model.update_file(file_id=str(file_doc.get('_id')), new_document={'creatorId': uid, 'size': size})
				file.save(os.path.join(folder_path, filename))
	except UnicodeEncodeError:
		return app_result.result(400, description='Filename cannot be Chinese characters')

	file_manager_model.update_folder_utime(pid)
	end_time = time.time()
	print('----'*20)
	print('The backend time:', end_time-start_time)
	print('----'*20)
	return app_result.result(200)
	

@controller.route('/folder/<folder_id>/files', methods=['POST'])
@app_decorator.auth()
def upload_files(folder_id):
	try:
		start_time = time.time()
		uploaded_files = request.files.getlist('files')
		token_id = request.headers.get('Authorization')
		uid = str(user_model.get_user_by_token(token_id).get('_id'))
		if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='write'):
			return app_result.result(403)

		folder_path = file_manager_model.get_folder_path(folder_id)
		if folder_path is None:
			return app_result.result(400)
		for file in uploaded_files:
			file.flush()
			size = os.fstat(file.fileno()).st_size
			file_doc = file_manager_model.get_file_by_name(file_name=file.filename, folder_id=folder_id)
			if file_doc == None:
				file_manager_model.create_new_file(
					file_name=file.filename,
					folder_id=folder_id,
					creator_id=uid,
					size=size
				)
			else:
				file_manager_model.update_file(file_id=str(file_doc.get('_id')), new_document={'creatorId': uid, 'size': size})
			
			file.save(os.path.join(folder_path, file.filename))
	except UnicodeEncodeError:
		return app_result.result(400, description='Filename cannot be Chinese characters')

	file_manager_model.update_folder_utime(folder_id)
	end_time = time.time()
	print('----'*20)
	print('The backend time:', end_time-start_time)
	print('----'*20)
	return app_result.result(200)

# --------------------------------------------------------------------------------------

@controller.route('/folder/<folder_id>/download_files_zip', methods=['POST'])
@app_decorator.auth()
def request_files_zip(folder_id):
	body = request.json
	downloaded_file_ids = body.get('fileIds')
	record_set_name = body.get('record_set_name')
	print("record_set_name:",record_set_name)
	is_export = False
	if(body.get('is_export')):
		is_export = True
	folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	# if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
	# 	return app_result.result(403)

	owd = os.getcwd()
	memory_data = io.BytesIO()
	
	try:
		os.chdir(folder_path)

		if downloaded_file_ids == None:
			# download all files in the folder
			files = file_manager_model.get_files_from_folder(folder_id=folder_id)
			with zipfile.ZipFile(memory_data, mode='w') as z:
				for each_file in files:
					filename = each_file.get('name')
					z.write(filename)
		else:
			# download files in the folder by fileIds
			with zipfile.ZipFile(memory_data, mode='w') as z:
				for each_file_id in downloaded_file_ids:
					query = {'file_id': each_file_id, 'folder_id': folder_id,'record_set_name':record_set_name}
					db_label_data = app_mongodb.connect_collection('label').find_one(query)
					filename = file_manager_model.get_file_by_id(each_file_id).get('name')
					file_ext = filename.split('.')[-1]
					
					
					if(db_label_data is None):
						if(is_export):
							db_label_data = "Cannot find corresponding label data"
							continue
						else:
							db_label_data = "Cannot find corresponding label data"
							new_file_name = filename.split('.')[0] + '_' + each_file_id + '.' + file_ext
							target_path = 'imgfa-sampling'
							shutil.rmtree(target_path, ignore_errors = True)
							if not os.path.exists(target_path):
								os.makedirs(target_path)
							copyfile(filename,os.path.join(target_path, new_file_name))
							z.write(os.path.join(target_path, new_file_name))
					else:
						if(is_export):
							target_path = 'imgfa-sampling'
							shutil.rmtree(target_path, ignore_errors = True)
							if not os.path.exists(target_path):
								os.makedirs(target_path)
							new_file_name = filename.split('.')[0] + '_' + each_file_id + '.' + file_ext
							copyfile(filename,os.path.join(target_path, new_file_name))
							z.write(os.path.join(target_path, new_file_name))
							db_label_data['_id'] = str(db_label_data['_id'])
							# db_label_data['file_name'] = filename.split('.')[0] + '_' + db_label_data['file_id'] + '.' + file_ext
							db_label_data['image_name'] = filename.split('.')[0] + '_' + db_label_data['file_id'] + '.' + file_ext
							file_name_json = filename.split('.')[0] + '_' + each_file_id + '.json'
							json_path = os.path.join(target_path,file_name_json)
							with open(json_path,'w') as fp:
								json.dump(db_label_data, fp,indent=4)
							z.write(json_path)
						else:
							target_path = 'imgfa-sampling'
							shutil.rmtree(target_path, ignore_errors = True)
							if not os.path.exists(target_path):
								os.makedirs(target_path)
							new_file_name = filename.split('.')[0] + '_' + each_file_id + '.' + file_ext
							copyfile(filename,os.path.join(target_path, new_file_name))
							z.write(os.path.join(target_path, new_file_name))
							# db_label_data['_id'] = str(db_label_data['_id'])
							# db_label_data['file_name'] = db_label_data['file_id'] + '.' + file_ext

		memory_data.seek(0)
	finally:
		os.chdir(owd)

	return send_file(
		memory_data,
		mimetype='application/zip',
		as_attachment=True,
		attachment_filename=folder_id + '.zip'
	)

# --------------------------------------------------------------------------------------

@controller.route('/folder/<folder_id>/download_folders_zip', methods=['POST'])
@app_decorator.auth()
def request_folders_zip(folder_id):
	body = request.json
	downloaded_folder_ids = body.get('folderIds')
	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
		return app_result.result(403)

	owd = os.getcwd()
	memory_data = io.BytesIO()
	try:
		os.chdir(folder_path)

		if downloaded_folder_ids != None:
			with zipfile.ZipFile(memory_data, mode='w') as z:
				for each_folder_id in downloaded_folder_ids:
					dirName = file_manager_model.get_folder(each_folder_id).get('name')

					for folderName, childfolders, filenames in os.walk(dirName):
						for filename in filenames:
							filePath = os.path.join(folderName, filename)
							z.write(filePath)
		
		memory_data.seek(0)
	finally:
		os.chdir(owd)


	return send_file(
		memory_data,
		mimetype='application/zip',
		as_attachment=True,
		attachment_filename=folder_id + '.zip'
	)

# --------------------------------------------------------------------------------------
@controller.route('/hierarchy_folder/<pid>/delete_files', methods=['DELETE'])
@app_decorator.auth()
def request_hierarchy_files_delete(pid):
	body = request.json
	requested_file_ids = body.get('fileIds')

	folder_path = file_manager_model.get_hierarchy_folder_path(pid)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	owd = os.getcwd()

	if requested_file_ids == None:
		#delete all the files
		files = file_manager_model.get_files_from_folder(folder_id=pid)
		for each_file in files:
			fileid = each_file.get('_id')
			filename = each_file.get('name')
			filePath = os.path.join(owd ,folder_path, filename)
			file_manager_model.delete_file_by_id(fileid)
			try: 
				os.remove(filePath)
			except FileNotFoundError:
				print('FileNotFound')
			# is_label_data_existed = app_mongodb.connect_collection('label').find_one({'file_id': fileid,'folder_id': pid})
			is_label_data_existed_cursor = app_mongodb.connect_collection('label').find({'file_id': fileid,'folder_id': pid})
			if(bool(is_label_data_existed_cursor)):
				for each_label_data in is_label_data_existed_cursor:
					app_mongodb.connect_collection('label').delete_one(each_label_data)
	else:
		#delete the file which you choose
		for each_file_id in requested_file_ids:
			filename = file_manager_model.get_file_by_id(each_file_id).get('name')
			filePath = os.path.join(owd ,folder_path, filename)
			file_manager_model.delete_file_by_id(each_file_id)
			try:
				os.remove(filePath)
			except FileNotFoundError:
				print('FileNotFound')
			is_label_data_existed_cursor = app_mongodb.connect_collection('label').find({'file_id': each_file_id,'folder_id': pid})
			if(bool(is_label_data_existed_cursor)):
				for each_label_data in is_label_data_existed_cursor:
					app_mongodb.connect_collection('label').delete_one(each_label_data)
	
	return app_result.result(200)

@controller.route('/folder/<folder_id>/delete_files', methods=['DELETE'])
@app_decorator.auth()
def request_files_delete(folder_id):
	body = request.json
	deleted_file_ids = body.get('fileIds')

	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	owd = os.getcwd()

	if deleted_file_ids == None:
		#delete all the files
		files = file_manager_model.get_files_from_folder(folder_id=folder_id)
		for each_file in files:
			fileid = each_file.get('_id')
			filename = each_file.get('name')
			filePath = os.path.join(owd ,folder_path, filename)
			file_manager_model.delete_file_by_id(fileid)
			try: 
				os.remove(filePath)
			except FileNotFoundError:
				print('FileNotFound')
			is_label_data_existed = app_mongodb.connect_collection('label').find_one({'file_id': fileid,'folder_id': folder_id})
			if(bool(is_label_data_existed)):
				app_mongodb.connect_collection('label').delete_one(is_label_data_existed)
	else:
		#delete the file which you choose
		for each_file_id in deleted_file_ids:
			filename = file_manager_model.get_file_by_id(each_file_id).get('name')
			filePath = os.path.join(owd ,folder_path, filename)
			file_manager_model.delete_file_by_id(each_file_id)
			try:
				os.remove(filePath)
			except FileNotFoundError:
				print('FileNotFound')
			is_label_data_existed = app_mongodb.connect_collection('label').find_one({'file_id': each_file_id,'folder_id': folder_id})
			if(bool(is_label_data_existed)):
				app_mongodb.connect_collection('label').delete_one(is_label_data_existed)
	
	return app_result.result(200)


# --------------------------------------------------------------------------------------------------
@controller.route('/folder/<folder_id>/delete_folders', methods=['DELETE'])
@app_decorator.auth()
def request_folder_delete(folder_id):
	body = request.json
	deleted_folder_ids = body.get('folderIds')

	folder_path = file_manager_model.get_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400, description='delete folder_path not found')



	# owd = os.getcwd()
	
	if deleted_folder_ids == None:
		return app_result.result(400, description='delete folder_ids not found')

	else:
		for each_folder_id in deleted_folder_ids:
			folder_name = file_manager_model.get_folder(each_folder_id).get('name')
			# delete all files in db  (if success) -> delete  the folders in db (if success) -> delete all the folders and files in local
			isfinished = file_manager_model.delete_file_by_folderid(each_folder_id)
			if isfinished :
				isDelAllFolder = file_manager_model.delete_folder_by_ancestorIds(each_folder_id)
				if isDelAllFolder:
					try:
						rm_folder_path = os.path.join(folder_path, folder_name)
						shutil.rmtree(rm_folder_path)
					except OSError as e:
						print(e)
			is_label_data_existed_cursor = app_mongodb.connect_collection('label').find({'folder_id': each_folder_id})
			for each_label_data in is_label_data_existed_cursor:
				if(bool(each_label_data)):
					app_mongodb.connect_collection('label').delete_one(each_label_data)
	return app_result.result(200)
# --------------------------------------------------------------------------------------------------
@controller.route('/api/image_upload',methods=['GET'])
@app_decorator.auth()
def api_image_uploader():
	user_token = request.headers.get('Authorization')
	file_array = request.files.getlist('file_array')
	folder_id = ""
	level1_folder = request.form['level1']
	level2_folder = request.form['level2']
	level3_folder = request.form['level3']
	level4_folder = request.form['level4']
	level5_folder = request.form['level5']
	if(level1_folder is None or level2_folder is None or level3_folder is None or level4_folder is None or level5_folder is None):
		return app_result.result(400, description='Please specify folder location for all levels!')

	folder_name_hierarchy = {'level1':level1_folder,'level2':level2_folder,'level3':level3_folder,'level4':level4_folder,'level5':level5_folder}

	uid = str(user_model.get_user_by_token(user_token).get('_id'))
	
	hierarchical_folders = file_manager_model.retrieve_hierarchical_folders(uid)
	folder_existence_status = file_manager_model.check_hierarchical_existence(folder_name_hierarchy,hierarchical_folders)

	if folder_existence_status['level5'] == False:
		print("Folder not found...\n Creating folder...")


		hierarchical_data = {
			'level1': {
				'name': level1_folder
			},
			'level2': {
				'name': level2_folder
			},
			'level3': {
				'name': level3_folder
			},
			'level4': {
				'name': level4_folder
			},
			'level5': {
				'name': level5_folder
			}
		}
		hierarchical_ids = file_manager_model.create_hierarchical_folder(uid, hierarchical_data)
		folder_id = hierarchical_ids['level5_id']
		print('Folder successfully created.')
	else:
		folder_id = folder_existence_status['level5_id']

	try:
		uploaded_files = file_array

		folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
		if folder_path is None:
			return app_result.result(400)
		for file in uploaded_files:
			file.flush()
			size = os.fstat(file.fileno()).st_size
			file_doc = file_manager_model.get_file_by_name(file_name=file.filename, folder_id=folder_id)
			if file_doc == None:
				file_manager_model.create_new_file(
					file_name=file.filename,
					folder_id=folder_id,
					creator_id=uid,
					size=size
				)
			else:
				file_manager_model.update_file(file_id=str(file_doc.get('_id')), new_document={'creatorId': uid, 'size': size})
			file.save(os.path.join(folder_path, file.filename))
	except UnicodeEncodeError:
		return app_result.result(400, description='Filename cannot be Chinese characters')

	file_manager_model.update_folder_utime(folder_id)

	return app_result.result(200, description='File successfully created.') 
# --------------------------------------------------------------------------------------------------
@controller.route('/memory',methods=['GET'])
def get_file_memory():
	total_file_memory = file_manager_model.get_total_file_memory()

	return app_result.result(200, total_file_memory) 



# V1
@controller.route('/hierarchy_folder/<folder_id>/content_files/v1', methods=['GET'])
@app_decorator.auth()
def get_hierarchy_content_files_v1(folder_id):
	folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
	if folder_path is None:
		return app_result.result(400)

	token_id = request.headers.get('Authorization')
	# if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
	# 	return app_result.result(403)

	page = 1 if request.args.get('page') == None else int(request.args.get('page'))
	size = 50 if request.args.get('size') == None else int(request.args.get('size'))

	content = {
		'id': folder_id,
		'files': [],
		'record_set_names':set()
	}

	files = file_manager_model.get_files_from_folder(folder_id=folder_id, page=page, size=size)
	for each_file in files:
		file_id = str(each_file.get('_id'))
		folder_id = each_file.get('folderId')
		#get label sets
		label_sets = label_model.get_image_label_sets(file_id,folder_id)
		content['record_set_names'].update(set(label_sets))
		# url_path=''
		content['files'].append({
			'fileId': file_id,
			'folderId': folder_id,
			'name': each_file.get('name'),
			'size': each_file.get('size'),
			'ctime': each_file.get('ctime'),
			'utime': None if each_file.get('utime') == None else each_file.get('utime'),
			# 'uriPath':url_path,
			'label_sets':label_sets
			
		})
	content['record_set_names'] = list(content['record_set_names'])
	return app_result.result(200, content)

@controller.route('/hierarchy_folder/<folder_id>',methods=['DELETE'])
@app_decorator.auth()
def delete_folder_hierarchy(folder_id):
	token_id = request.headers.get('Authorization')
	uid = str(user_model.get_user_by_token(token_id).get('_id'))
	
	#get all files in folder
	files = file_manager_model.get_files_from_folder(folder_id=folder_id)
	for file in files:
		file_id = str(file.get('_id'))
		#delete label from DB 'label' collection
		label_model.delete_label_by_file_id(file_id,record_set_names=[])
	
	#get delete folder ids 
	delete_folder_ids = []
	for i in range(5):
		if file_manager_model.check_folder_has_child(folder_id)==False:
			delete_folder_ids.append(folder_id)
			folder_id = file_manager_model.get_hierarchy_folder(folder_id)['pid']
		else:
			break
	#delete actual files
	for delete_folder_id in delete_folder_ids:
		folder_path = file_manager_model.get_hierarchy_folder_path(delete_folder_id)
		shutil.rmtree(folder_path,ignore_errors=True)	
		file_manager_model.delete_folder_by_id(delete_folder_id)
	return app_result.result(200, 'Success!')

