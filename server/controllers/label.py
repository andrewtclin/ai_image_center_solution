from flask import request
import os
import io
import json
import zipfile
import time
from flask import send_file

from controllers import label_controller as controller
from models import label as label_model
from models import file_manager as file_manager_model

from utils import result as app_result
from utils import mongodb as app_mongodb
from utils import decorator as app_decorator

@controller.route('/save_data', methods=['POST'])
@app_decorator.auth()
def save_data():
    label_data = request.json
    
    label_model.save_label_data(label_data)
    return app_result.result(200,"Data saved successfully")

@controller.route('/retrieve_data', methods=['POST'])
@app_decorator.auth()
def get_data():
    request_data = request.json
    
    db_label_data = label_model.get_label_data(request_data)
    for each_label_data in db_label_data:
        if(each_label_data is None):
            each_label_data = "Cannot find corresponding label data"
        else:
            each_label_data['_id'] = str(each_label_data['_id'])

    return app_result.result(200,db_label_data)

@controller.route('/download_data', methods=['POST'])
@app_decorator.auth()
def export_data():
    file_info_array = request.json

    file_ids = []
    for file_info in file_info_array:
        file_ids.append(file_info['file_id'])

    folder_id = file_info_array[0]['folder_id']

    folder_path = file_manager_model.get_folder_path(folder_id)
    if folder_path is None:
        return app_result.result(400)
    
    token_id = request.headers.get('Authorization')
    if not file_manager_model.get_folder_permission(folder_id=folder_id, token_id=token_id, action='read'):
        return app_result.result(403)
    
    owd = os.getcwd()
    memory_data = io.BytesIO()

    # db_label_data = label_model.export_label_data(file_info_array,file_ids,folder_id,folder_path,owd)
    

    # return db_label_data

    try:
        os.chdir(folder_path)
        
        if file_ids == None:
            # download all files in the folder
            files = file_manager_model.get_files_from_folder(folder_id=folder_id)
            with zipfile.ZipFile(memory_data, mode='w') as z:
                for each_file in files:
                    filename = each_file.get('name')
                    z.write(filename)
        else:
            # download files in the folder by fileIds
            with zipfile.ZipFile(memory_data, mode='w') as z:
                # for each_file_id in file_ids:
                each_file_id = file_ids[0]
                
                filename = file_manager_model.get_file_by_id(each_file_id).get('name')
                z.write(os.path.join(folder_path, filename))
                    # query = {'file_id': each_file_id, 'folder_id': folder_id}
                    # db_label_data = app_mongodb.connect_collection('label').find_one(query)
                    # if(db_label_data is None):
                    #     db_label_data = "Cannot find corresponding label data"
                    # else:
                    #     db_label_data['_id'] = str(db_label_data['_id'])
                    #     file_name_json = each_file_id + '.json'
                    #     target_path = os.path.join(owd, 'exported_label_data', each_file_id)
                    #     destination_path = os.path.join(owd, 'exported_label_data', each_file_id, file_name_json)
                    #     shutil.rmtree(target_path, ignore_errors = True)
                    #     if not os.path.exists(target_path):
                    #         os.makedirs(target_path)
                    #     with open(destination_path,'w') as fp:
                    #         json.dump(db_label_data, fp)
                    #     z.write(destination_path)
                    
        memory_data.seek(0)
    finally:
        os.chdir(owd)
        
    return send_file(
		memory_data,
		mimetype='application/zip',
		as_attachment=True,
		attachment_filename=folder_id + '.zip'
	)


@controller.route('/check_if_labelled', methods=['POST'])
@app_decorator.auth()
def check_label_status():
    requested_image_array = request.json
    result_image_array = label_model.get_is_image_labelled(requested_image_array)
    

    return app_result.result(200,result_image_array)

@controller.route('/save_label_record', methods=['POST'])
@app_decorator.auth()
def save_record_data():
    token_id = request.headers.get('Authorization')
    record_data = request.json
    
    label_model.save_record_data(record_data)
    return app_result.result(200,"Data saved successfully")

@controller.route('/get_label_record', methods=['GET'])
@app_decorator.auth()
def get_record_data():
    token_id = request.headers.get('Authorization')
    
    record_data = label_model.get_record_data()
    return app_result.result(200,record_data)

@controller.route('/delete_label_record', methods=['DELETE'])
@app_decorator.auth() 
def delete_record_data():
    token_id = request.headers.get('Authorization')
    record_name = request.json
    
    label_model.delete_record_data(record_name)
    return app_result.result(200,"Data deleted successfully")

@controller.route('/export_trainer', methods=['POST'])
@app_decorator.auth()
def export_to_trainer():
    file_id_array = request.json['fileIds']
    folder_id = request.json['folderId']
    record_set_name = request.json['record_set_name']
    
    export_msg = label_model.export_label_data(file_id_array,folder_id,record_set_name)
    return app_result.result(200, export_msg)

@controller.route('/duplicate', methods=['POST'])
def duplicate_label():
    record_name = request.json['record_name']
    new_record_name = request.json['new_record_name']
    
    label_model.duplicate_label(record_name,new_record_name)
    return app_result.result(200, 'Success')


# V1
@controller.route('/record_name/<record_set_name>', methods=['DELETE'])
def delete_record_set_name(record_set_name):
    label_model.delete_label_by_record_set_name(record_set_name)
    label_model.delete_record_set_name(record_set_name)
    return app_result.result(200, 'Success')