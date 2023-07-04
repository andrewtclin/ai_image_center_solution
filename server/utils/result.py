from flask import jsonify
import logging
import env as app_env

# --------------------------------------------------------------------------------------

# logger info
log_format = '%(asctime)s - %(levelname)s - %(message)s'
log_filename = app_env.LOG_FILENAME + '.log'


logging.basicConfig(level=logging.INFO, format=log_format)
logger = logging.getLogger(__name__)

handler = logging.FileHandler(log_filename)
handler.setLevel(logging.INFO)

formatter = logging.Formatter(log_format)
handler.setFormatter(formatter)
logger.addHandler(handler)

def write_log(level, msg):
	if level == 'info':
		logger.info(msg)
	elif level == 'warning':
		logger.warning(msg)
	elif level == 'critical':
		logger.critical(msg)

# --------------------------------------------------------------------------------------

# http code status
status = {
	200: 'OK',
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	500: 'Internal Server Error'
}

# http code description (default)
default_description = {
	200: 'Successful response',
	400: 'Please check paras or query valid.',
	401: 'Please read the document to check API.',
	403: 'Please read the document to check API.',
	404: 'Please read the document to check API.',
	405: 'Please read the document to check API.',
	500: 'Please contact api server manager.'
}

def result(code, data = {}, description = ''):
	description = default_description.get(code) if description == '' else description
	response = jsonify({
		"code": code,
		"status": status.get(code),
		"result": data,
		"description": description
	})
	return response, code, {'Content-Type': 'application/json'}