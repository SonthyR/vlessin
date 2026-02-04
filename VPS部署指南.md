# VPS 部署指南

本指南将帮助您在 VPS 上部署和运行 VLESS Server 项目。

## 📋 前置要求

- VPS 服务器（推荐 Ubuntu 20.04+ / Debian 11+ / CentOS 7+）
- Root 权限或 sudo 权限
- 至少 512MB 内存
- 网络连接正常

## 🚀 快速部署步骤

### 方法一：直接下载脚本（推荐）

如果您已经有脚本文件，可以跳过此步骤。

```bash
# 下载脚本
wget https://raw.githubusercontent.com/Chil30/vless-all-in-one/main/vless-server.sh
chmod +x vless-server.sh
```

### 方法二：上传本地文件到 VPS

#### 使用 SCP 上传（Windows/Mac/Linux）

```bash
# 在本地电脑执行（Windows 使用 PowerShell 或 Git Bash）
scp -r * root@您的VPS_IP:/root/vless-server/

# 例如：
scp -r * root@192.168.1.100:/root/vless-server/
```

#### 使用 SFTP 工具（推荐 Windows 用户）

1. 下载 WinSCP 或 FileZilla
2. 连接到您的 VPS
3. 上传以下文件到 `/root/vless-server/` 目录：
   - `vless-server.sh`
   - `panel_server.py`
   - `start_panel.sh`
   - `requirements.txt`
   - `panel/` 目录（包含所有文件）

#### 使用 Git（如果项目在 GitHub）

```bash
# 在 VPS 上执行
cd /root
git clone https://github.com/您的用户名/项目名.git vless-server
cd vless-server
```

## 📦 安装依赖

### 1. 更新系统

```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS
yum update -y
```

### 2. 安装基础工具

```bash
# Ubuntu/Debian
apt install -y curl wget git

# CentOS
yum install -y curl wget git
```

### 3. 安装 Python 和依赖（用于 Web 面板）

```bash
# Ubuntu/Debian
apt install -y python3 python3-pip

# CentOS
yum install -y python3 python3-pip

# 安装 Python 依赖
pip3 install flask flask-cors
# 或者使用 requirements.txt
pip3 install -r requirements.txt
```

### 4. 设置脚本权限

```bash
cd /root/vless-server  # 或您上传的目录
chmod +x vless-server.sh
chmod +x start_panel.sh
chmod +x panel_server.py
```

## 🎯 运行脚本

### 首次运行

```bash
cd /root/vless-server
./vless-server.sh
```

脚本会自动：
- 检测系统环境
- 安装必要的依赖（Xray、Sing-box 等）
- 显示主菜单

### 主菜单选项

```
1. 安装/更新核心
2. 添加协议
3. 删除协议
4. 查看配置
5. 管理用户
6. 服务管理
7. 查看日志
8. 路由管理
9. Cloudflare Tunnel
10. BBR 网络优化
11. 查看运行日志
14. Web 管理面板  ← 新增功能
12. 检查脚本更新
13. 完全卸载
```

## 🌐 启动 Web 管理面板

### 方式一：通过脚本菜单

```bash
./vless-server.sh
# 选择 14: Web 管理面板
# 然后选择 1: 启动面板
```

### 方式二：命令行启动

```bash
# 启动面板
./vless-server.sh --panel-start

# 查看状态
./vless-server.sh --panel-status

# 停止面板
./vless-server.sh --panel-stop

# 重启面板
./vless-server.sh --panel-restart
```

### 方式三：直接运行 Python 服务器

```bash
# 设置环境变量（可选）
export PANEL_PORT=8080
export PANEL_HOST=0.0.0.0

# 启动服务器
python3 panel_server.py

# 或使用快速启动脚本
./start_panel.sh
```

### 访问面板

启动后，在浏览器中访问：
```
http://您的VPS_IP:8080
```

例如：`http://192.168.1.100:8080`

## 🔥 防火墙配置

### Ubuntu/Debian (UFW)

```bash
# 安装 UFW（如果未安装）
apt install -y ufw

# 开放必要端口
ufw allow 22/tcp      # SSH
ufw allow 443/tcp     # HTTPS/VLESS
ufw allow 8080/tcp    # Web 面板

# 启用防火墙
ufw enable
```

### CentOS (Firewalld)

```bash
# 开放端口
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=8080/tcp

# 重载防火墙
firewall-cmd --reload
```

### iptables（通用）

```bash
# 开放端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -j ACCEPT

# 保存规则（根据系统不同）
# Debian/Ubuntu
iptables-save > /etc/iptables/rules.v4

# CentOS
service iptables save
```

## 📝 基本使用流程

### 1. 首次安装

```bash
# 运行脚本
./vless-server.sh

# 选择 1: 安装/更新核心
# 等待安装完成
```

### 2. 添加协议

```bash
# 选择 2: 添加协议
# 根据提示选择协议类型（如 VLESS+Reality）
# 配置端口、UUID 等参数
```

### 3. 查看配置

```bash
# 选择 4: 查看配置
# 复制配置信息用于客户端连接
```

### 4. 启动服务

```bash
# 选择 6: 服务管理
# 选择启动 Xray 或 Sing-box 服务
```

### 5. 使用 Web 面板

```bash
# 选择 14: Web 管理面板
# 启动面板后通过浏览器访问
```

## 🔧 常见问题

### 1. 脚本无法执行

```bash
# 检查权限
ls -l vless-server.sh

# 添加执行权限
chmod +x vless-server.sh
```

### 2. Python 模块未找到

```bash
# 重新安装依赖
pip3 install --upgrade flask flask-cors

# 或使用 requirements.txt
pip3 install -r requirements.txt
```

### 3. 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep 8080
# 或
ss -tlnp | grep 8080

# 修改面板端口
export PANEL_PORT=9090
python3 panel_server.py
```

### 4. 无法访问 Web 面板

```bash
# 检查防火墙
ufw status
# 或
firewall-cmd --list-ports

# 检查服务是否运行
./vless-server.sh --panel-status

# 查看日志
tail -f /etc/vless-reality/panel.log
```

### 5. 服务无法启动

```bash
# 查看服务状态
systemctl status xray
systemctl status sing-box

# 查看日志
journalctl -u xray -f
journalctl -u sing-box -f
```

## 🔐 安全建议

### 1. 更改 SSH 端口

```bash
# 编辑 SSH 配置
nano /etc/ssh/sshd_config

# 修改 Port 22 为其他端口
Port 2222

# 重启 SSH
systemctl restart sshd
```

### 2. 使用密钥登录

```bash
# 禁用密码登录（推荐）
# 在 /etc/ssh/sshd_config 中设置
PasswordAuthentication no
```

### 3. 限制面板访问

```bash
# 只允许特定 IP 访问面板
iptables -A INPUT -p tcp --dport 8080 -s 您的IP -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -j DROP
```

### 4. 使用 Nginx 反向代理（推荐生产环境）

```bash
# 安装 Nginx
apt install -y nginx

# 配置反向代理（示例）
cat > /etc/nginx/sites-available/panel <<EOF
server {
    listen 80;
    server_name 您的域名;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/panel /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 📊 监控和维护

### 查看系统资源

```bash
# CPU 和内存
htop
# 或
top

# 磁盘空间
df -h

# 网络流量
iftop
```

### 查看服务日志

```bash
# Xray 日志
tail -f /var/log/xray/access.log

# Sing-box 日志
journalctl -u sing-box -f

# 面板日志
tail -f /etc/vless-reality/panel.log
```

### 定期更新

```bash
# 更新系统
apt update && apt upgrade -y

# 更新脚本
./vless-server.sh
# 选择 12: 检查脚本更新
```

## 🎉 完成！

现在您已经成功在 VPS 上部署了 VLESS Server！

### 下一步

1. ✅ 添加协议配置
2. ✅ 启动服务
3. ✅ 配置客户端连接
4. ✅ 使用 Web 面板管理

### 获取帮助

- 查看脚本帮助：`./vless-server.sh --help`
- 查看面板说明：`cat panel/README.md`
- 查看优化说明：`cat 优化完成说明.md`

---

**祝您使用愉快！** 🚀

