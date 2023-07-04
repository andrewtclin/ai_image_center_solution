import os, uuid
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
import time

blob = 'smasoft'

connect_str = "DefaultEndpointsProtocol=https;AccountName=smasoft;AccountKey=XJ3k9AkXnK0dH2Ss3G1RdvJ3Fm8b6ewNK66VcHoK5AR7Aq14HozbnlMg7qlJwFOSeOh8tKUg56yidQ0KFP1jpQ==;EndpointSuffix=core.windows.net"

def read(blob_service_client,container_name,file_name):
    print('read',file_name)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=file_name)
    content = blob_client.download_blob().readall()
    return content


blob_service_client = BlobServiceClient.from_connection_string(connect_str)

container_name  = 'pypackage'
package_stamps_path = 'Package.stamps'

pacakge_stamps_content = read(blob_service_client,container_name,package_stamps_path).decode()
print('current package_stamps',pacakge_stamps_content)


#create pacakge stamps line
env = 'cp36-win_amd64'
package_name = os.path.split(os.getcwd())[1]
print('current pacakge name',package_name)
with open(f'auto_build/module_dist/{package_name}/version.txt','r') as f:
    version = f.read().strip()
pack_name = f"{package_name}__{version}__{env}.zip"
upload_time = str(time.time()).split('.')[0]
package_stamps_line = f"{upload_time} {pack_name}\n"


#upload zip package
print('start upload',pack_name)
blob_client = blob_service_client.get_blob_client(container=container_name,blob=pack_name)
with open(pack_name,'rb') as f:
    blob_client.upload_blob(f.read(),overwrite=True)

#upload package stamps
blob_client = blob_service_client.get_blob_client(container=container_name,blob=package_stamps_path)
if pack_name in pacakge_stamps_content:
    p_content = pacakge_stamps_content.split('\n')
    for idx,i in enumerate(p_content):
        if pack_name in  i.split(' ')[1]:
            p_content.pop(idx)
            break
    pacakge_stamps_content = '\n'.join(p_content)
pacakge_stamps_content+=package_stamps_line

blob_client.upload_blob(pacakge_stamps_content,overwrite=True)