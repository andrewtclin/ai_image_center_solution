# SmaAI Data Center BE project

> flask api

# 如何開始專案

### Step 1

#### clone 專案

```bash
$ git clone $FROM_YOUR_REPO
```

### Step 2

#### 複製設定檔案

```bash
# 進入專案目錄
$ cd $YOUR_PROJ_DIR

# 複製 env.example.py 命名為 env.py
$ cp env.example.py env.py
```

### Step 3

#### 編輯設定檔案

```
env.py 相關參數: 其中以 '<xxx>' 表示者為必要替換的設定資料

# public 為對外公開的目錄，靜態圖檔會生成在這個路徑
# file manager info
FILE_MANAGER_PATH = 'public/file_manager'

# 產生 log 紀錄
# logger info
LOG_FILENAME = 'logger-api'

# 啟動 server 的相關設定
# server info
SERVER_HOST = 'localhost'
SERVER_PORT = 16147
SERVER_DEBUG = True

# mongoDB 相關設定
# mongoDB info
MONGO_HOST = '<YOUR_MONGO_HOST>'
MONGO_PORT = '<YOUR_MONGO_PORT>'
MONGO_USERNAME = '<YOUR_MONGO_USERNAME>'
MONGO_PASSWORD = '<YOUR_MONGO_PASSWORD>'

MONGO_DB_ACCOUNT = '<YOUR_MONGO_DB_NAME>'

# 使用者權限字串，在伺服器有新的使用者被建立時會將對應字串寫入DB
# user role info
ROLE_ADMIN = 'admin'
ROLE_SUPERREAD = 'super_read'
ROLE_SUPERWRITE = 'super_write'
ROLE_USER = 'user'

# 檔案管理根目錄字串，在伺服器有新的資料夾被建立時會將對應字串寫入DB
# root folder info
ROOT_FOLDER_ID = 'root'
ROOT_FOLDER_OWNERID = 'root'
ROOT_FOLDER_NAME = 'root' // 會在前端顯示的名稱
```

### Step 4

#### 建立虛擬環境

```bash
# create Ptyhon 3 env as name: flask
$ conda create --name flask python=3

# load flask env
$ conda activate flask

# back to base env (When needed)
$ conda deactivate
```

### Step 5

#### 安裝套件

```bash
$ conda install flask pymongo flask-cors
```

### Step 6

#### 啟動伺服器

```bash
# start api server at localhost:16147
$ python app.py
```

### 其它

#### 備註

```
針對後端存取 mongodb 的 DB account, 新增 user (連線的帳號 + 密碼)
此 user 包含的 roles 為 readWrite, dbAdmin 這兩個權限
```

---

[API_doc 連結](https://documenter.getpostman.com/view/2120144/SWLe7Ty1?version=latest)  
API 原檔: api_list.json
