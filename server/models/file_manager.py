import os
import time

import env as app_env
from utils import mongodb as app_mongodb

from models import user as user_model
from models import label as label_model

# --------------------------------------------------------------------------------------
def create_hierarchical_folder(user_id, hierarchical_data):
	# ------ Data Collection ------ #
	level1 = hierarchical_data['level1']
	level2 = hierarchical_data['level2']
	level3 = hierarchical_data['level3']
	level4 = hierarchical_data['level4']
	level5 = hierarchical_data['level5']
	
	# ------ Level 1 ------ #
	level1_data = {
		'level': 1,
		'pid': user_id,
		'name': level1['name']
	}
	db_level1_existence = app_mongodb.connect_collection('folder').find_one(level1_data)
	if not db_level1_existence:
		app_mongodb.connect_collection('folder').insert_one(level1_data)
		db_level1_existence = app_mongodb.connect_collection('folder').find_one(level1_data)
	level1_id = str(db_level1_existence['_id'])

	# ------ Level 2 ------ #
	level2_data = {
		'level': 2,
		'pid': level1_id,
		'name': level2['name']
	}
	db_level2_existence = app_mongodb.connect_collection('folder').find_one(level2_data)
	if not db_level2_existence:
		app_mongodb.connect_collection('folder').insert_one(level2_data)
		db_level2_existence = app_mongodb.connect_collection('folder').find_one(level2_data)
	level2_id = str(db_level2_existence['_id'])

	# ------ Level 3 ------ #
	level3_data = {
		'level': 3,
		'pid': level2_id,
		'name': level3['name']
	}
	db_level3_existence = app_mongodb.connect_collection('folder').find_one(level3_data)
	if not db_level3_existence:
		app_mongodb.connect_collection('folder').insert_one(level3_data)
		db_level3_existence = app_mongodb.connect_collection('folder').find_one(level3_data)
	level3_id = str(db_level3_existence['_id'])

	# ------ Level 4 ------ #
	level4_data = {
		'level': 4,
		'pid': level3_id,
		'name': level4['name']
	}
	db_level4_existence = app_mongodb.connect_collection('folder').find_one(level4_data)
	if not db_level4_existence:
		app_mongodb.connect_collection('folder').insert_one(level4_data)
		db_level4_existence = app_mongodb.connect_collection('folder').find_one(level4_data)
	level4_id = str(db_level4_existence['_id'])

	# ------ Level 5 ------ #
	level5_data = {
		'level': 5,
		'pid': level4_id,
		'name': level5['name']
	}
	db_level5_existence = app_mongodb.connect_collection('folder').find_one(level5_data)
	if not db_level5_existence:
		app_mongodb.connect_collection('folder').insert_one(level5_data)
		db_level5_existence = app_mongodb.connect_collection('folder').find_one(level5_data)
	level5_id = str(db_level5_existence['_id'])


	return {
		'level1_id': level1_id,
		'level2_id': level2_id,
		'level3_id': level3_id,
		'level4_id': level4_id,
		'level5_id': level5_id
	}

def retrieve_hierarchical_folders(user_id):
	# ------ Level 1 ------ #
	level1_query = {
		'pid': user_id,
		'level': 1
	}
	db_level1_cursor = app_mongodb.connect_collection('folder').find(level1_query)
	db_level1_data = []
	for each_db_level1_data in db_level1_cursor:
		if each_db_level1_data:
			each_db_level1_data['_id'] = str(each_db_level1_data['_id'])
			db_level1_data.append(each_db_level1_data)

	# ------ Level 2 ------ #
	level2_query = []
	for each_level1_data in db_level1_data:
		level2_query.append({'pid':each_level1_data['_id'], 'level': 2})
	db_level2_data = []
	for each_level2_query in level2_query:
		db_level2_cursor = app_mongodb.connect_collection('folder').find(each_level2_query)
		for each_db_level2_data in db_level2_cursor:
			each_db_level2_data['_id'] = str(each_db_level2_data['_id'])
			db_level2_data.append(each_db_level2_data)

	# ------ Level 3 ------ #
	level3_query = []
	for each_level2_data in db_level2_data:
		level3_query.append({'pid': each_level2_data['_id'], 'level':3})
	db_level3_data = []
	for each_level3_query in level3_query:
		db_level3_cursor = app_mongodb.connect_collection('folder').find(each_level3_query)
		for each_db_level3_data in db_level3_cursor:
			each_db_level3_data['_id'] = str(each_db_level3_data['_id'])
			db_level3_data.append(each_db_level3_data)

	# ------ Level 4 ------ #
	level4_query = []
	for each_level3_data in db_level3_data:
		level4_query.append({'pid': each_level3_data['_id'], 'level':4})
	db_level4_data = []
	for each_level4_query in level4_query:
		db_level4_cursor = app_mongodb.connect_collection('folder').find(each_level4_query)
		for each_db_level4_data in db_level4_cursor:
			each_db_level4_data['_id'] = str(each_db_level4_data['_id'])
			db_level4_data.append(each_db_level4_data)

	# ------ Level 5 ------ #
	level5_query = []
	for each_level4_data in db_level4_data:
		level5_query.append({'pid': each_level4_data['_id'], 'level':5})
	db_level5_data = []
	for each_level5_query in level5_query:
		db_level5_cursor = app_mongodb.connect_collection('folder').find(each_level5_query)
		for each_db_level5_data in db_level5_cursor:
			each_db_level5_data['_id'] = str(each_db_level5_data['_id'])
			db_level5_data.append(each_db_level5_data)

	# ------ Hierarchy Level ------ #
	level_data = {
		"level1": db_level1_data,
		"level2": db_level2_data,
		"level3": db_level3_data,
		"level4": db_level4_data,
		"level5": db_level5_data
	}
	
	hierarchical_data = []
	for each_level1_data in level_data['level1']:
		level2_subdata = []

		for each_level2_data in level_data['level2']:
			level3_subdata = []

			for each_level3_data in level_data['level3']:
				level4_subdata = []

				for each_level4_data in level_data['level4']:
					level5_subdata = []

					for each_level5_data in level_data['level5']:
						if each_level5_data['pid'] == each_level4_data['_id']:
							level5_subdata.append(each_level5_data)

					if each_level4_data['pid'] == each_level3_data['_id']:
						each_level4_data['child'] = level5_subdata
						level4_subdata.append(each_level4_data)

				if each_level3_data['pid'] == each_level2_data['_id']:
						each_level3_data['child'] = level4_subdata
						level3_subdata.append(each_level3_data)

			if each_level2_data['pid'] == each_level1_data['_id']:
				each_level2_data['child'] = level3_subdata
				level2_subdata.append(each_level2_data)

		each_level1_data['child'] = level2_subdata
		hierarchical_data.append(each_level1_data)

	return hierarchical_data


def delete_hierarchical_folder(folder_id):
	return delete_folder_by_id(folder_id)

def get_folder(folder_id):
	if folder_id == app_env.ROOT_FOLDER_ID:
		data = {
			'ownerId': app_env.ROOT_FOLDER_OWNERID,
			'name': app_env.ROOT_FOLDER_NAME,
			'ancestorIds': [],
			'isLeafNode': False
		}
		return data

	if not app_mongodb.is_objectid_valid(folder_id):
		return None

	query = {'_id': app_mongodb.objectid(folder_id)}
	folder = app_mongodb.connect_collection('folder').find_one(query)
	return folder

def get_folder_from_root(folder_name):
	return get_folder_from_parent(folder_name=folder_name, parent_id=app_env.ROOT_FOLDER_ID)

def get_folder_from_parent(folder_name, parent_id):
	query = {'name': folder_name, 'parentId': parent_id}
	folder = app_mongodb.connect_collection('folder').find_one(query)
	return folder

def get_folders_from_parent(parent_id):
	query = {'parentId': str(parent_id)}
	folders = app_mongodb.connect_collection('folder').find(query).sort([('name', 1)])
	return folders

def create_new_folder(
		folder_name,
		parent_id,
		owner_id,
		creator_id,
		end_customer = None,
		product_type = None,
		tags = None,
		uploader = None,
		comments = None
	):
	parent_folder = get_folder(parent_id)
	if parent_folder is None:
		return -1

	ancestor_folderids = parent_folder.get('ancestorIds') + [parent_id]
	path = ''
	for each_id in ancestor_folderids:
		each_folder = get_folder(each_id)
		name = '' if each_folder.get('name') == app_env.ROOT_FOLDER_NAME else each_folder.get('name')
		path = '' if name == '' else os.path.join(path, name)

	try:
		# create the folder
		save_path = os.path.join(app_env.FILE_MANAGER_PATH, path, folder_name)
		os.makedirs(save_path)
	except FileExistsError:
		return -2
	except UnicodeEncodeError:
		return -3


	collection = 'folder'
	if not parent_id == app_env.ROOT_FOLDER_ID:
		if parent_folder.get('isLeafNode') == True:
			query = {'_id': app_mongodb.objectid(parent_id)}
			newvalues = {'$set': {'isLeafNode': False, 'utime': int(time.time())}}
			app_mongodb.connect_collection(collection).update_one(query, newvalues)

	document = {
		'name': folder_name,
		'ownerId': owner_id,
		'creatorId': creator_id,
		'parentId': parent_id,
		'ancestorIds': ancestor_folderids,
		'isLeafNode': True,
		'ctime': int(time.time())
	}
	if not end_customer == None:
		document['endCustomer'] = end_customer
	if not end_customer == None:
		document['productType'] = product_type
	if not tags == None:
		document['tags'] = tags
	if not uploader == None:
		document['uploader'] = uploader
	if not comments == None:
		document['comments'] = comments

	if folder_name == owner_id:
		document['isUserFolder'] = True

	x = app_mongodb.connect_collection(collection).insert_one(document)
	folder_id = str(x.inserted_id)
	return folder_id

def create_new_file(file_name, folder_id, creator_id, size, record_set_name, al_type, classification_label):
	document = {
		'name': file_name,
		'folderId': folder_id,
		'creatorId': creator_id,
		'size': size,
		'ctime': int(time.time())
	}
	x = app_mongodb.connect_collection('file').insert_one(document)
	file_id = str(x.inserted_id)
	if(record_set_name and al_type and classification_label):
		label_data = {
			'file_name': file_name,
			'file_id': file_id,
			'folder_id': folder_id,
			'record_set_name': record_set_name,
			'pixelSize': {'w':0, 'h':0},
			'regions': [{'cls': classification_label}],
			'label_settings': {},
			'al_type': al_type
		}
		label_model.save_label_data([label_data])
		label_record_data = {
			'record_name': record_set_name,
			'al_type': al_type,
			'types': [classification_label],
			
		}
		label_model.save_record_data(label_record_data,is_cls_batch_upload=True)

	return file_id

def get_file_by_id(file_id):
	query = {'_id': app_mongodb.objectid(file_id)}
	file = app_mongodb.connect_collection('file').find_one(query)
	return file

def get_file_by_name(file_name, folder_id):
	query = {'name': file_name, 'folderId': folder_id}
	file = app_mongodb.connect_collection('file').find_one(query)
	return file

def get_files_from_folder(folder_id, page = 1, size = -1):
	if size == -1:
		query = {'folderId': folder_id}
		files = app_mongodb.connect_collection('file').find(query)
		return files

	page = 1 if page < 1 else page
	skips = (page - 1) * size
	query = {'folderId': folder_id}
	files = app_mongodb.connect_collection('file').find(query).skip(skips).limit(size).sort([('name', 1)])
	return files

def update_file(file_id, new_document):
	query = {'_id': app_mongodb.objectid(file_id)}
	new_document['utime'] = int(time.time())
	newvalues = {'$set': new_document}
	file = app_mongodb.connect_collection('file').find_one_and_update(query, newvalues, new=True)
	return file

def update_folder_utime(folder_id):
	query = {'_id': app_mongodb.objectid(folder_id)}
	newvalues = {'$set': {'utime': int(time.time())}}
	app_mongodb.connect_collection('folder').update_one(query, newvalues)

def get_hierarchy_folder(pid):
	if not app_mongodb.is_objectid_valid(pid):
		return None

	query = {'_id': app_mongodb.objectid(pid)}
	folder = app_mongodb.connect_collection('folder').find_one(query)
	return folder

def get_hierarchy_folder_path(pid):
	path = app_env.FILE_MANAGER_PATH
	folder = get_hierarchy_folder(pid)
	if folder is None:
		return None
	folder_level = folder.get('level')
	folder_pid = folder.get('pid')
	folder_id = str(folder.get('_id'))
	folder_name = folder.get('name')
	parent_hierarchy = []
	parent_hierarchy.append({'pid':folder_pid, '_id':folder_id, 'level':folder_level, 'name': folder_name})
	if folder_level > 1:
		temp_pid = folder_pid
		for level_count in range(folder_level-1, 0, -1):
			current_folder = get_hierarchy_folder(temp_pid)
			current_folder_pid = current_folder.get('pid')
			current_folder_level = current_folder.get('level')
			current_folder_id = str(current_folder.get('_id'))
			current_folder_name = current_folder.get('name')
			parent_hierarchy.append({'pid':current_folder_pid, 'level': current_folder_level, '_id':current_folder_id,'name':current_folder_name})
			temp_pid = current_folder_pid

	for each_hierarchy_folder in parent_hierarchy[::-1]:
		path = os.path.join(path, each_hierarchy_folder['_id'])
	os.makedirs(path, exist_ok=True) 
	return path

def get_folder_path(folder_id):
	path = app_env.FILE_MANAGER_PATH
	if folder_id == app_env.ROOT_FOLDER_ID:
		return path
	folder = get_folder(folder_id)
	if folder is None:
		return None
	ancestor_folderids = folder.get('ancestorIds')

	for each_id in ancestor_folderids:
		each_folder = get_folder(each_id)
		if not each_folder.get('_id') == None:
			path = os.path.join(path, each_folder.get('name'))

	path = os.path.join(path, folder.get('name'))
	return path


def get_folder_uri(folder_id):
	path = app_env.FILE_MANAGER_PATH
	if folder_id == app_env.ROOT_FOLDER_ID:
		return path
	folder = get_folder(folder_id)
	if folder is None:
		return None
	ancestor_folderids = folder.get('ancestorIds')

	for each_id in ancestor_folderids:
		each_folder = get_folder(each_id)
		if not each_folder.get('_id') == None:
			path += '/' + each_folder.get('name')

	path += '/' + folder.get('name')
	return path

def get_folder_permission(folder_id, token_id, action = 'read'):
	user = user_model.get_user_by_token(token_id)
	uid = str(user.get('_id'))

	if action == 'read':
		if user_model.is_super_role(role=user.get('role'), action='read'):
			return True
	if action == 'write':
		if user_model.is_super_role(role=user.get('role'), action='write'):
			return True

	if folder_id == app_env.ROOT_FOLDER_ID:
		return False

	query = {'_id': app_mongodb.objectid(folder_id), 'ownerId': uid}
	folder = app_mongodb.connect_collection('folder').find_one(query)
	if folder == None:
		return False
	else:
		return True


def update_folder_isleaf(folder_id):
	query = {'_id': app_mongodb.objectid(folder_id)}
	newvalues = {'$set': {'isLeafNode': True, 'utime': int(time.time())}}
	app_mongodb.connect_collection('folder').update_one(query, newvalues)

def update_parent_folder_isleaf(parent_id):
	child_folders = get_folders_from_parent(parent_id)
	if child_folders.count() == 0:
		update_folder_isleaf(parent_id)

def delete_file_by_id(file_id):
	query = {'_id': app_mongodb.objectid(file_id)}
	app_mongodb.connect_collection('file').delete_one(query)


def delete_folder_by_id(folder_id):
	# parentId = get_folder(folder_id).get('parentId')
	query = {'_id': app_mongodb.objectid(folder_id)}
	resultFolder = app_mongodb.connect_collection('folder').delete_one(query)
	if resultFolder.deleted_count > 0:
		# update_parent_folder_isleaf(parentId)
		return True
	else:
		return False


def delete_folder_by_ancestorIds(folder_id):
	query = {'ancestorIds': {'$in':[str(folder_id)]}}
	resultFolder = app_mongodb.connect_collection('folder').delete_many(query)
	isDel = delete_folder_by_id(folder_id)
	return isDel



def delete_file_by_folderid(folder_id):
	isleaf = get_folder(folder_id).get('isLeafNode')
	query = {'folderId': str(folder_id)}

	if isleaf:
		result_file = app_mongodb.connect_collection('file').delete_many(query)
		return True
	else:
		resultFile = app_mongodb.connect_collection('file').delete_many(query)
		child_folders = get_folders_from_parent(folder_id)
		if child_folders.count() == 0:
			update_folder_isleaf(folder_id)
			return delete_file_by_folderid(folder_id)
		else:
			for child_folder in child_folders:
				child_id = child_folder.get('_id')
				return delete_file_by_folderid(child_id)	

def check_hierarchical_level(folder_id, hierarchical_folders):
	folder_level = 0
	for level1_folder in hierarchical_folders:
		level2_folder_array = level1_folder['child']
		if folder_id == level1_folder['_id']:
			folder_level = level1_folder['level']
			break
		
		for level2_folder in level2_folder_array:
			level3_folder_array = level2_folder['child']
			if folder_id == level2_folder['_id']:
				folder_level = level2_folder['level']
				break
		
			for level3_folder in level3_folder_array:
				level4_folder_array = level3_folder['child']
				if folder_id == level3_folder['_id']:
					folder_level = level3_folder['level']
					break
				
				for level4_folder in level4_folder_array:
					level5_folder_array = level4_folder['child']
					if folder_id == level4_folder['_id']:
						folder_level = level4_folder['level']
						break

					for level5_folder in level5_folder_array:
						if folder_id == level5_folder['_id']:
							folder_level = level5_folder['level']
							break

	return folder_level

def check_hierarchical_existence(folder_name_hierarchy, hierarchical_folders):
	folder_existence = {
		'level1': False,
		'level2': False,
		'level3': False,
		'level4': False,
		'level5': False,
		'level5_id': ""
	}

	for level1_folder in hierarchical_folders:
		if folder_name_hierarchy['level1'] == level1_folder['name']:
			folder_existence['level1'] = True
			level2_folder_array = level1_folder['child']
		else:
			continue
		
		for level2_folder in level2_folder_array:
			if folder_name_hierarchy['level2'] == level2_folder['name']:
				folder_existence['level2'] = True
				level3_folder_array = level2_folder['child']
			else:
				continue

			for level3_folder in level3_folder_array:
				if folder_name_hierarchy['level3'] == level3_folder['name']:
					folder_existence['level3'] = True
					level4_folder_array = level3_folder['child']
				else:
					continue

				for level4_folder in level4_folder_array:
					if folder_name_hierarchy['level4'] == level4_folder['name']:
						folder_existence['level4'] = True
						level5_folder_array = level4_folder['child']
					else:
						continue

					for level5_folder in level5_folder_array:
						if folder_name_hierarchy['level5'] == level5_folder['name']:
							folder_existence['level5'] = True
							folder_existence['level5_id'] = level5_folder['_id']
						else:
							continue

	return folder_existence

def get_total_file_memory():
	file_cursor = app_mongodb.connect_collection('file').find({})
	total_memory = 0
	
	for file in file_cursor:
		total_memory += file['size']

	return total_memory

def check_folder_has_child(folder_id):
	query = {'pid': folder_id}
	result = app_mongodb.connect_collection('folder').find(query)
	print(result.count())
	return result.count()>1