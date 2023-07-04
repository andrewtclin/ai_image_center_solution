from flask import Flask
from flask_cors import CORS
from utils import result as app_result
import env as app_env

from controllers import user_controller
from controllers import file_manager_controller
from controllers import label_controller
from controllers import db_controller


app = Flask(__name__, static_url_path='/ss/file_manager', static_folder='/ss/file_manager')
CORS(app)
# --------------------------------------------------------------------------------------

@app.errorhandler(401)
def method_401(e):
	return app_result.result(401)

def method_403(e):
	return app_result.result(403)

@app.errorhandler(404)
def method_404(e):
	return app_result.result(404, description='requested URL was not found on the server')

@app.errorhandler(405)
def method_405(e):
	return app_result.result(405, description='http method is not allowed for the requested URL')

# --------------------------------------------------------------------------------------

# registering blueprints
app.register_blueprint(user_controller, url_prefix='/user')
app.register_blueprint(file_manager_controller, url_prefix='/file_manager')
app.register_blueprint(label_controller, url_prefix='/label')
app.register_blueprint(db_controller, url_prefix='/db')

# --------------------------------------------------------------------------------------

if __name__ == '__main__':
	app.run(host=app_env.SERVER_HOST, port=app_env.SERVER_PORT, debug=app_env.SERVER_DEBUG)
