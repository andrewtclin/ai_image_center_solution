from flask import Blueprint

user_controller = Blueprint('user', __name__)
file_manager_controller = Blueprint('file_manager', __name__)
label_controller = Blueprint('label', __name__)
db_controller = Blueprint('db', __name__)

from . import user
from . import file_manager
from . import label
from . import db