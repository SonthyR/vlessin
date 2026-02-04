# VLESS Server Web 管理面板

现代化的 Web 管理界面，用于管理 VLESS Server。

## 功能特性

- 📊 **仪表盘**: 实时查看系统状态、协议数量、用户数量等
- 🔌 **协议管理**: 添加、删除、查看协议配置
- 👥 **用户管理**: 管理用户、查看流量使用情况
- 📈 **流量统计**: 实时查看流量使用情况
- ⚙️ **服务管理**: 启动、停止、重启服务
- 📝 **日志查看**: 实时查看系统日志
- ⚙️ **系统设置**: 配置面板参数

## 安装要求

- Python 3.6+
- Flask
- Flask-CORS

## 快速开始

### 1. 安装依赖

```bash
pip3 install flask flask-cors
```

### 2. 启动面板

#### 方式一：通过脚本菜单启动

```bash
./vless-server.sh
# 选择菜单项 14: Web 管理面板
# 然后选择 1: 启动面板
```

#### 方式二：命令行启动

```bash
./vless-server.sh --panel-start
```

#### 方式三：直接运行 Python 服务器

```bash
python3 panel_server.py
```

### 3. 访问面板

打开浏览器访问: `http://服务器IP:8080`

默认端口为 8080，可以通过环境变量修改：

```bash
export PANEL_PORT=8080
export PANEL_HOST=0.0.0.0
python3 panel_server.py
```

## 管理命令

```bash
# 启动面板
./vless-server.sh --panel-start

# 停止面板
./vless-server.sh --panel-stop

# 查看状态
./vless-server.sh --panel-status

# 重启面板
./vless-server.sh --panel-restart
```

## 文件结构

```
panel/
├── index.html      # 前端页面
├── style.css       # 样式文件
├── app.js          # 前端 JavaScript
└── README.md       # 说明文档

panel_server.py     # 后端 API 服务器
```

## API 接口

### 获取系统状态
```
GET /api/status
```

### 获取协议列表
```
GET /api/protocols
```

### 添加协议
```
POST /api/protocols/{core}/{protocol}
Content-Type: application/json

{
  "port": 443,
  "uuid": "...",
  ...
}
```

### 删除协议
```
DELETE /api/protocols/{core}/{protocol}
```

### 获取用户列表
```
GET /api/users
```

### 添加用户
```
POST /api/users
Content-Type: application/json

{
  "core": "xray",
  "protocol": "vless",
  "user": "user1",
  "config": {...}
}
```

### 删除用户
```
DELETE /api/users/{core}/{protocol}/{user}
```

### 获取流量统计
```
GET /api/traffic
```

### 获取服务状态
```
GET /api/services
```

### 控制服务
```
POST /api/services/{service}/{action}
# action: start, stop, restart, reload
```

### 获取日志
```
GET /api/logs?lines=100
```

## 安全建议

1. **更改默认端口**: 在生产环境中使用非标准端口
2. **添加认证**: 在 `panel_server.py` 中实现认证机制
3. **使用 HTTPS**: 配置反向代理（如 Nginx）并启用 SSL
4. **防火墙**: 限制面板端口的访问来源

## 故障排除

### 面板无法启动

1. 检查 Python 版本: `python3 --version`
2. 检查依赖: `pip3 list | grep -i flask`
3. 查看日志: `cat /etc/vless-reality/panel.log`

### 无法访问面板

1. 检查防火墙: `firewall-cmd --list-ports` 或 `ufw status`
2. 检查服务状态: `./vless-server.sh --panel-status`
3. 检查端口占用: `netstat -tlnp | grep 8080`

### API 请求失败

1. 检查后端服务是否运行
2. 查看浏览器控制台的错误信息
3. 检查 CORS 配置

## 开发

### 修改端口

编辑 `panel_server.py` 或设置环境变量：

```bash
export PANEL_PORT=9090
python3 panel_server.py
```

### 添加新功能

1. 在 `panel_server.py` 中添加 API 路由
2. 在 `app.js` 中添加前端逻辑
3. 在 `index.html` 中添加 UI 元素

## 许可证

与主脚本相同。

