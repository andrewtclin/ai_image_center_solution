import os
import shutil
import json
import zipfile
import io
from flask import send_file
from functools import reduce

from utils import mongodb as app_mongodb

from models import file_manager as file_manager_model
# import models.file_manager as file_manager_model

def save_label_data(label_data):
    for each_label_data in label_data:
        file_name = each_label_data['file_name']
        file_id = each_label_data['file_id']
        folder_id = each_label_data['folder_id']
        # image_url = each_label_data['src']
        record_set_name = each_label_data['record_set_name']
        pixel_size = ""
        try:
            pixel_size = each_label_data['pixelSize']
        except KeyError:
            continue
        label_regions = ""
        try:
            label_regions = each_label_data['regions']
        except KeyError:
            continue
        label_settings = each_label_data['label_settings']
        al_type = each_label_data['al_type']

        if al_type == 'classification' and len(label_regions) == 0:
            is_data_existed = app_mongodb.connect_collection('label').find_one({'file_id': file_id, 'folder_id': folder_id, 'record_set_name':record_set_name})
            if(bool(is_data_existed)):
                app_mongodb.connect_collection('label').delete_one(is_data_existed)
            continue

        # ------ Check if data exists Start ------ #
        document = {
            'file_name': file_name,
            'file_id': file_id,
            'folder_id': folder_id,
            # 'image_url': image_url,
            'pixel_size': pixel_size,
            'label_regions': label_regions,
            'label_settings': label_settings,
            'al_type': al_type,
            'record_set_name': record_set_name,
            'is_human': False,
            'confirmed_by': []
        }

        is_data_existed = app_mongodb.connect_collection('label').find_one({'file_id': file_id, 'folder_id': folder_id, 'record_set_name':record_set_name})
        
        if(bool(is_data_existed)):
            if(len(label_regions) == 0):
                app_mongodb.connect_collection('label').delete_one(is_data_existed)
            else:
                app_mongodb.connect_collection('label').delete_one(is_data_existed)
                app_mongodb.connect_collection('label').insert_one(document)
        else:
            app_mongodb.connect_collection('label').insert_one(document)
        # ------ Check if data exists End ------ #


def get_label_data(request_data):
    file_id = request_data['file_id']
    folder_id = request_data['folder_id']
    record_set_name = request_data['record_set_name']
    db_label_data = []
    for each_file_id in file_id:
        query = {'file_id': each_file_id, 'folder_id': folder_id, 'record_set_name':record_set_name}
        db_label_data.append(app_mongodb.connect_collection('label').find_one(query))
    return db_label_data
    
def export_label_data(file_id_array,folder_id,record_set_name):
    cwd = os.getcwd()
    folder_path = file_manager_model.get_hierarchy_folder_path(folder_id)
    os.chdir(folder_path)

    home_directory = '/'
    target_directory = os.path.join(home_directory, 'ss', 'imgfa-sampling')

    shutil.rmtree(target_directory, ignore_errors=True)
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)

    for each_file_id in file_id_array:
        query = {'file_id': each_file_id, 'folder_id': folder_id, 'record_set_name':record_set_name}
        db_label_data = app_mongodb.connect_collection('label').find_one(query)
        if(db_label_data is None):
            continue
        else:
            # for each_label_region in db_label_data['label_regions']:
            #     xmin = each_label_region['x'] * db_label_data['pixel_size']['w']
            #     ymin = each_label_region['y'] * db_label_data['pixel_size']['h']
            #     wpx = each_label_region['w'] * db_label_data['pixel_size']['w']
            #     hpx = each_label_region['h'] * db_label_data['pixel_size']['h']
            #     each_label_region['box'] = {"xmin": int(xmin), 'ymin': int(ymin), 'xmax': int(xmin + wpx), 'ymax': int(ymin+hpx)}
            db_label_data['_id'] = str(db_label_data['_id'])
            original_filename = file_manager_model.get_file_by_id(each_file_id).get('name')
            label_file_name = original_filename.split('.')[0] + '_' + each_file_id + '.json'
            file_ext = original_filename.split('.')[-1]
            new_filename =  original_filename.split('.')[0] + '_' + each_file_id + '.' + file_ext
            # db_label_data['file_name'] = original_filename.split('.')[0] + '_' + db_label_data['file_id'] + '.' + file_ext
            # db_label_data['file_name'] = filename.split('.')[0] + '_' + db_label_data['file_id'] + '.' + file_ext
            db_label_data['image_name'] = original_filename.split('.')[0] + '_' + db_label_data['file_id'] + '.' + file_ext
            target_file = os.path.join(home_directory, 'ss', 'imgfa-sampling', label_file_name)

            
            shutil.copyfile(original_filename, os.path.join(target_directory,new_filename))
            with open(target_file, 'w') as fp:
                json.dump(db_label_data,fp,indent=4)
    return "OK"

def get_is_image_labelled(requested_image_array):
    result_image_array = []
    for each_image_detail in requested_image_array:
        file_id = each_image_detail['fileId']
        folder_id = each_image_detail['folderId']
        al_type = []
        record_set_name = []
        is_data_existed = app_mongodb.connect_collection('label').find({'file_id': file_id, 'folder_id': folder_id})
        if(bool(is_data_existed)):
            for data in is_data_existed:
                al_type.append(data['al_type'])
                record_set_name.append(data['record_set_name'])
            result_image_array.append({'file_id':file_id, 'folder_id':folder_id, 'al_type':al_type, 'record_set_name': record_set_name})
        else:
            continue
        
    return result_image_array

def get_image_label_sets(file_id,folder_id):
    label_sets = {}
    labels = app_mongodb.connect_collection('label').find({'file_id': file_id, 'folder_id': folder_id})
    
    if bool(labels):
        for label in labels:

            record_set_name = label['record_set_name']
            record_detail = app_mongodb.connect_collection('label_record').find_one({'record_name':record_set_name})
            al_type = label['al_type']
            label_regions = label['label_regions']
            label_sets[record_set_name]= {
                "al_type":al_type,
                "types":record_detail['types'],
                "label_regions":label_regions
            }
    return label_sets


def save_record_data(record_data, is_cls_batch_upload=False):
    record_name = record_data['record_name']
    al_type = record_data['al_type']
    types = record_data['types']

    document = {
            'record_name': record_name,
            'al_type': al_type,
            'types': types,
        }

    is_record_existed = app_mongodb.connect_collection('label_record').find_one({'record_name': record_name})

    
    if(bool(is_record_existed)):
        if(is_cls_batch_upload):
            classification_types = is_record_existed['types'].copy()
            is_type_duplicated = False
            for classification_type in classification_types:
                if classification_type == types[0]:
                    is_type_duplicated = True
            if is_type_duplicated:
                document['types'] = classification_types
                app_mongodb.connect_collection('label_record').delete_one(is_record_existed)
                app_mongodb.connect_collection('label_record').insert_one(document)
            else:
                classification_types.append(types[0])
                document['types'] = classification_types
                app_mongodb.connect_collection('label_record').delete_one(is_record_existed)
                app_mongodb.connect_collection('label_record').insert_one(document)

        else:
            app_mongodb.connect_collection('label_record').delete_one(is_record_existed)
            app_mongodb.connect_collection('label_record').insert_one(document)
    else:
        x = app_mongodb.connect_collection('label_record').insert_one(document)

def get_record_data():
    record_data_cursor = app_mongodb.connect_collection('label_record').find({})

    record_data = []
    for each_record_data in record_data_cursor:
        
        if(bool(each_record_data)):
            each_record_data['_id'] = str(each_record_data['_id'])
            record_data.append(each_record_data)
    if len(record_data) == 0:
        record_data = 'No Record'
    return record_data

def delete_record_data(record_data):
    record_name = record_data['record_name']

    document = {
            'record_name': record_name,
        }

    is_record_existed = app_mongodb.connect_collection('label_record').find_one({'record_name': record_name})

    app_mongodb.connect_collection('label_record').delete_one(is_record_existed)

def duplicate_label(record_set_name,new_record_name):
    query = {'record_set_name':record_set_name}
    db_label_data_cursor = app_mongodb.connect_collection('label').find(query)

    for db_label_data in db_label_data_cursor:
        if(db_label_data['record_set_name'] == new_record_name):
            continue
        else:
            db_label_data['record_set_name'] = new_record_name
            del db_label_data['_id']
            app_mongodb.connect_collection('label').insert_one(db_label_data)

def delete_label_by_file_id(file_id,record_set_names=[]):
    labels = app_mongodb.connect_collection('label').find({'file_id':file_id})
    delete_ids = []
    for label in labels:
        label_id = label.get('_id')
        label_record_set_name = label['record_set_name']
        if len(record_set_names)==0:
            delete_ids.append(label_id)
        elif label_record_set_name in record_set_names:
            delete_ids.append(label_id)
    for label_id in delete_ids:
        app_mongodb.connect_collection('label').delete_one({'_id':label_id})
def delete_label_by_record_set_name(record_set_name):
    query = {'record_set_name':record_set_name}
    app_mongodb.connect_collection('label').delete_many(query)
def delete_record_set_name(record_set_name):
    query = {'record_name':record_set_name}
    app_mongodb.connect_collection('label_record').delete_many(query)