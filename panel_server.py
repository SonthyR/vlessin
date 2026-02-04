#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VLESS Server Web Panel - Backend API Server
提供 RESTful API 接口供前端调用
"""

import os
import sys
import json
import subprocess
import signal
import time
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app)  # 允许跨域

# 配置路径
SCRIPT_DIR = Path(__file__).parent.absolute()
SCRIPT_PATH = SCRIPT_DIR / "vless-server.sh"
CFG_DIR = "/etc/vless-reality"
DB_FILE = f"{CFG_DIR}/db.json"
PANEL_DIR = f"{CFG_DIR}/panel"

# 确保脚本可执行
if not os.access(SCRIPT_PATH, os.X_OK):
    os.chmod(SCRIPT_PATH, 0o755)

def require_auth(f):
    """简单的认证装饰器（可扩展）"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # TODO: 实现认证机制
        return f(*args, **kwargs)
    return decorated_function

def run_script_command(cmd_args):
    """安全执行脚本命令"""
    try:
        result = subprocess.run(
            [str(SCRIPT_PATH)] + cmd_args,
            capture_output=True,
            text=True,
            timeout=300,
            check=False
        )
        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "命令执行超时"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def read_json_file(filepath):
    """安全读取 JSON 文件"""
    try:
        if not os.path.exists(filepath):
            return None
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return {"error": str(e)}

def write_json_file(filepath, data):
    """安全写入 JSON 文件"""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        return False

# ==================== API 路由 ====================

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取系统状态"""
    try:
        # 读取数据库
        db_data = read_json_file(DB_FILE)
        
        # 检查服务状态
        services = {}
        for service in ['xray', 'sing-box', 'snell-server']:
            try:
                result = subprocess.run(
                    ['pgrep', '-x', service],
                    capture_output=True,
                    check=False
                )
                services[service] = result.returncode == 0
            except:
                services[service] = False
        
        return jsonify({
            "success": True,
            "database": db_data,
            "services": services,
            "timestamp": time.time()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/protocols', methods=['GET'])
def get_protocols():
    """获取所有协议列表"""
    try:
        db_data = read_json_file(DB_FILE)
        if not db_data:
            return jsonify({"success": True, "protocols": []})
        
        protocols = []
        for core in ['xray', 'singbox']:
            if core in db_data:
                for proto, config in db_data[core].items():
                    protocols.append({
                        "core": core,
                        "protocol": proto,
                        "config": config
                    })
        
        return jsonify({"success": True, "protocols": protocols})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/protocols/<core>/<protocol>', methods=['GET'])
def get_protocol(core, protocol):
    """获取指定协议配置"""
    try:
        db_data = read_json_file(DB_FILE)
        if not db_data or core not in db_data or protocol not in db_data[core]:
            return jsonify({"success": False, "error": "协议不存在"}), 404
        
        return jsonify({
            "success": True,
            "core": core,
            "protocol": protocol,
            "config": db_data[core][protocol]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/protocols/<core>/<protocol>', methods=['POST'])
@require_auth
def add_protocol(core, protocol):
    """添加协议"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "无效的请求数据"}), 400
        
        # 调用脚本添加协议
        cmd_args = ['--api-add-protocol', core, protocol, json.dumps(data)]
        result = run_script_command(cmd_args)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/protocols/<core>/<protocol>', methods=['DELETE'])
@require_auth
def delete_protocol(core, protocol):
    """删除协议"""
    try:
        cmd_args = ['--api-remove-protocol', core, protocol]
        result = run_script_command(cmd_args)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """获取所有用户"""
    try:
        db_data = read_json_file(DB_FILE)
        if not db_data:
            return jsonify({"success": True, "users": []})
        
        users = []
        for core in ['xray', 'singbox']:
            if core in db_data:
                for proto, config in db_data[core].items():
                    # 提取用户信息
                    if isinstance(config, dict) and 'users' in config:
                        for user, user_data in config['users'].items():
                            users.append({
                                "core": core,
                                "protocol": proto,
                                "user": user,
                                "data": user_data
                            })
        
        return jsonify({"success": True, "users": users})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users', methods=['POST'])
@require_auth
def add_user():
    """添加用户"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "无效的请求数据"}), 400
        
        cmd_args = ['--api-add-user', 
                    data.get('core'), 
                    data.get('protocol'),
                    data.get('user'),
                    json.dumps(data.get('config', {}))]
        result = run_script_command(cmd_args)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<core>/<protocol>/<user>', methods=['DELETE'])
@require_auth
def delete_user(core, protocol, user):
    """删除用户"""
    try:
        cmd_args = ['--api-remove-user', core, protocol, user]
        result = run_script_command(cmd_args)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/traffic', methods=['GET'])
def get_traffic():
    """获取流量统计"""
    try:
        result = run_script_command(['--show-traffic'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/services', methods=['GET'])
def get_services():
    """获取服务状态"""
    try:
        services = {}
        service_names = ['xray', 'sing-box', 'snell-server', 'vless-reality', 'vless-singbox']
        
        for service in service_names:
            try:
                result = subprocess.run(
                    ['systemctl', 'is-active', service],
                    capture_output=True,
                    check=False
                )
                services[service] = {
                    "active": result.returncode == 0,
                    "status": result.stdout.decode().strip()
                }
            except:
                services[service] = {"active": False, "status": "unknown"}
        
        return jsonify({"success": True, "services": services})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/services/<service>/<action>', methods=['POST'])
@require_auth
def control_service(service, action):
    """控制服务（start/stop/restart/reload）"""
    try:
        if action not in ['start', 'stop', 'restart', 'reload']:
            return jsonify({"success": False, "error": "无效的操作"}), 400
        
        result = subprocess.run(
            ['systemctl', action, service],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        return jsonify({
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """获取日志"""
    try:
        lines = request.args.get('lines', 100, type=int)
        log_file = request.args.get('file', f"{CFG_DIR}/logs/vless.log")
        
        if not os.path.exists(log_file):
            return jsonify({"success": True, "logs": []})
        
        with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
            log_lines = f.readlines()
            # 返回最后 N 行
            logs = [line.strip() for line in log_lines[-lines:]]
        
        return jsonify({"success": True, "logs": logs})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_config():
    """获取系统配置"""
    try:
        config = {
            "version": "3.4.6",
            "cfg_dir": CFG_DIR,
            "db_file": DB_FILE,
            "panel_dir": PANEL_DIR
        }
        return jsonify({"success": True, "config": config})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# 静态文件服务
@app.route('/')
def index():
    """返回前端页面"""
    return send_from_directory(PANEL_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """提供静态文件"""
    return send_from_directory(PANEL_DIR, path)

if __name__ == '__main__':
    # 确保面板目录存在
    os.makedirs(PANEL_DIR, exist_ok=True)
    
    # 从环境变量读取配置
    host = os.getenv('PANEL_HOST', '0.0.0.0')
    port = int(os.getenv('PANEL_PORT', 8080))
    
    print(f"启动 Web 面板服务器: http://{host}:{port}")
    print(f"面板目录: {PANEL_DIR}")
    
    app.run(host=host, port=port, debug=False)

