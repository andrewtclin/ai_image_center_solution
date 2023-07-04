

import os
import glob
import shutil
import subprocess
import argparse
import platform
def get_setup_content(path):
    with open(path,'r') as f:
        setup_content = f.read()
    return setup_content
def gen_setup_files(source_folder,target_folder,setup_content):
    # source_folder: Gitlab\imgfa-be
    # target_folder: Gitlab\imgfa-be\auto_build\temp\imgfa-be
    excluded_files = ['__init__.py','app.py','env.example.py']
    file_list = glob.glob(source_folder+'/**/*.py',recursive=True)
    # file_list = glob.glob(source_folder+'/*.py',recursive=True)
    print('start generate setup files')
    for idx,file_path in enumerate(file_list):
        folder_name,py_name = os.path.split(file_path)
        relative_p = folder_name.split(source_folder)[-1][1:]
        print(relative_p)
        module_folder = os.path.join(target_folder,relative_p)
        os.makedirs(module_folder,exist_ok=True)
        if py_name not in excluded_files:
            shutil.copyfile(file_path,os.path.join(module_folder,py_name)+'x')
            with open(os.path.join(module_folder,'setup_'+py_name),'w') as f:
                f.write(setup_content.replace('py_name',py_name+'x'))
        else :
            shutil.copyfile(file_path,os.path.join(module_folder,py_name))
        print('module_folder:', module_folder, 'py_name:', py_name)

def build_pyd(setup_folder,error_logs):
    file_list = glob.glob(setup_folder+'/**/setup_*.py',recursive=True)

    cwd = os.getcwd()
    os.chdir(cwd)
    for idx,i in enumerate(file_list):
        py_name = i
        folder_name,py_name = os.path.split(i)
        os.chdir(folder_name)
        cmd = []
        if check_system() == 'Windows':
            cmd+=['python',py_name,'build_ext','--inplace']
        elif check_system() == 'Linux':
            cmd+=['python3',py_name,'build_ext','--inplace']
        print('start build',py_name,':',round(idx/len(file_list)*100,2),'%')
        subprocess.check_output(cmd)
        os.chdir(cwd)
    return error_logs

def gen_deploy_module(source_folder,target_folder,module_name):
    #source_folder: Gitlab\imgfa-be\auto_build\temp\imgfa-be
    #target_folder: Gitlab\imgfa-be\auto_build\module_dist\imgfa-be
    shutil.rmtree(target_folder,ignore_errors=True)
    os.makedirs(target_folder,exist_ok=True)
    if check_system() == 'Windows':
        p = glob.glob(source_folder+'/**/*.pyd',recursive=True)
    elif check_system() == 'Linux':
        p = glob.glob(source_folder+'/**/*.so',recursive=True)
    for i in p:
        folder_name,py_name = os.path.split(i)
        
        relative_pyd_path = i.split(source_folder)[-1][1:]
        print('r_pyd:', relative_pyd_path)
        source_pyd_path = os.path.split(relative_pyd_path)[0]
        if check_system() == 'Windows':
            relative_pyd_folder=source_pyd_path.split('\\')[-1]
        elif check_system() == 'Linux':
            relative_pyd_folder=source_pyd_path.split('/')[-1]
        relative_pyd_path = os.path.join(relative_pyd_folder,py_name)
        if relative_pyd_path[0]=='/' or relative_pyd_path[0]=='\\':
            relative_pyd_path=relative_pyd_path[1:]

        # #gen folder in target folder
        target_path = os.path.join(target_folder,relative_pyd_path)
        
        os.makedirs(os.path.split(target_path)[0],exist_ok=True)
        # #move pyd into target folder
        shutil.copyfile(i,target_path)
    p = glob.glob(source_folder+'/**/__init__.py',recursive=True)
    print('----'*15)
    print('serve-path:', os.path.join(source_folder,'app.py'))
    p.append(os.path.join(source_folder,'app.py'))

    for i in p:
        folder_name,py_name = os.path.split(i)
        relative_pyd_path = i.split(source_folder)[-1][1:]
        relative_pyd_folder=os.path.split(relative_pyd_path)[0]
        #gen folder in target folder
        os.makedirs(os.path.join(target_folder,relative_pyd_folder),exist_ok=True)
        #move pyd into target folder
        shutil.copyfile(os.path.join(source_folder,relative_pyd_path),os.path.join(target_folder,relative_pyd_path))
def zip_module(target,source):
    shutil.make_archive(target,'zip',source)
def gen_file_path(source_folder, file_name_list):
    file_path_list = []
    for f in file_name_list:
        file_path_list.append(os.path.join(source_folder, f))
    return file_path_list
def cp_file(source_file_list, target_folder):
    for f in source_file_list:
        shutil.copy2(f,os.path.join(target_folder))
def check_system():
    return platform.system()

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-T','--tag', help='set version tag', default="dev", type=str, required=False)
    config = parser.parse_args()
    version = config.tag

    current_dir = os.path.abspath(os.path.split(__file__)[0]) # Gitlab\imgfa-be\auto_build
    source_root = os.path.abspath(os.path.join(current_dir,'../')) # Gitlab\imgfa-be
    root = os.path.abspath(os.path.join(current_dir,'./')) # Gitlab\imgfa-be\auto_build
    
    setup_content = get_setup_content(os.path.join(current_dir,'./setup_temp'))
    module_name = os.path.split(os.getcwd())[1] # imgfa-be
    # source_folder = os.path.join(source_root,module_name) # Gitlab\imgfa-be\imgfa-be
    source_folder = source_root
    setup_folder = os.path.join(*[root,'temp',module_name]) # Gitlab\imgfa-be\auto_build\temp\imgfa-be
    os.makedirs(setup_folder,exist_ok=True)
    print('start generate setup files')
    gen_setup_files(source_folder,setup_folder,setup_content)
    print('start build_cython')
    error_log_path = os.path.join(current_dir,'./logs')
    error_logs= ''
    error_logs=build_pyd(setup_folder,error_logs)
    with open(os.path.join(*[root,'temp','error.log']),'w') as f:
        f.write(error_logs)
    print('start genrate modules')
    source_folder = os.path.join(*[root,'temp',module_name])
    build_folder = os.path.join(root,'module_dist',module_name)
    
    gen_deploy_module(setup_folder,build_folder,module_name)
    
    # other_cp_file = ['Dockerfile', 'pip_requirements.txt']
    # file_path_list = gen_file_path(source_root, other_cp_file)
    # cp_file(file_path_list,build_folder)

    with open(os.path.join(build_folder,'version.txt'),'w') as f:
        f.write(version)
    if check_system() == 'Windows':
        env = 'cp36-win_amd64'
    elif check_system() == 'Linux':
        env = 'cp36-linux_amd64'
    zip_name = f"{module_name}__{version}__{env}"
    zip_module(zip_name,os.path.join(root,'module_dist'))