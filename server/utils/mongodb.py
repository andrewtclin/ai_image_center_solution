from pymongo import MongoClient
from bson.objectid import ObjectId
import env as app_env
from utils import result as app_result

# --------------------------------------------------------------------------------------

# connect to mongoDB's collection, set connection timeout = 3s -> use Singleton design-pattern
class Connection(object):
	conn = None
	def __new__(cls, *args):
		db_name = app_env.MONGO_DB_ACCOUNT
		if cls.conn is None:
			cls.conn = MongoClient(
				app_env.MONGO_HOST,
				username=app_env.MONGO_USERNAME,
				password=app_env.MONGO_PASSWORD,
				port=app_env.MONGO_PORT,
				authSource=db_name,
				authMechanism='SCRAM-SHA-1',
				serverSelectionTimeoutMS=10000,
				connect=False
			)
		return cls.conn[db_name]


def connect_collection(collection):
	app_result.write_log('info', 'Connect to mongoDB, host: {0}, port: {1}, db: {2}, collection: {3}'.format(app_env.MONGO_HOST, app_env.MONGO_PORT, app_env.MONGO_DB_ACCOUNT, collection))

	return Connection()[collection]

def objectid(id):
	return ObjectId(id)

def is_objectid_valid(id):
	return ObjectId.is_valid(id)