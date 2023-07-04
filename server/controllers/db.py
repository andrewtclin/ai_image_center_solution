from flask import request

from controllers import db_controller as controller
from models import db as db_model

from utils import result as app_result
from utils import decorator as app_decorator

@controller.route('/check_db', methods=['GET'])
def check_database():
    db_model.check_database_collection()
    return app_result.result(200,"Database check completed")

