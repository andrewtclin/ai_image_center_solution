from flask import request
from flask import abort
from functools import wraps

from models import user as user_model

# --------------------------------------------------------------------------------------

def auth():
	def _auth_decorator(f):
		@wraps(f)
		def __auth_decorator(*args, **kwargs):
			token_id = request.headers.get('Authorization')
			if token_id == None:
				abort(401)
			else:
				try:
					token = user_model.get_token(token_id)
					if token == None:
						abort(401)
				except:
					abort(401)

			return f(*args, **kwargs)
		return __auth_decorator
	return _auth_decorator