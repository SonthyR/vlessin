# VLESS Server

多协议代理服务器一键部署脚本，支持 VLESS/VMess/Trojan 等多种协议，配备现代化 Web 管理面板。

## ✨ 功能特性

- 🚀 **14 种协议支持**：VLESS、VMess、Trojan、Shadowsocks 等
- 🎨 **Web 管理面板**：现代化的图形界面，方便管理
- 📦 **一键部署**：自动化安装和配置
- 🔄 **自动更新**：支持脚本和内核自动更新
- 🛡️ **安全可靠**：支持 Reality、XTLS 等高级特性
- 📊 **流量统计**：实时查看连接和流量信息

## 📋 系统要求

- **操作系统**：Ubuntu 20.04+ / Debian 11+ / CentOS 7+
- **权限**：Root 权限或 sudo 权限
- **内存**：至少 512MB（推荐 1GB+）
- **网络**：正常网络连接

## 🚀 快速开始

### 方法一：从 GitHub 克隆（推荐）

```bash
# 克隆仓库
git clone https://github.com/您的用户名/仓库名.git
cd 仓库名

# 设置执行权限
chmod +x vless-server.sh start_panel.sh 快速部署.sh

# 安装 Python 依赖
pip3 install -r requirements.txt

# 运行主脚本
./vless-server.sh
```

### 方法二：使用快速部署脚本

```bash
# 克隆仓库
git clone https://github.com/您的用户名/仓库名.git
cd 仓库名

# 运行快速部署
chmod +x 快速部署.sh
./快速部署.sh
```

### 方法三：直接下载脚本

```bash
# 下载主脚本
wget https://raw.githubusercontent.com/您的用户名/仓库名/main/vless-server.sh
chmod +x vless-server.sh
./vless-server.sh
```

## 📖 使用说明

### 启动 Web 管理面板

```bash
# 启动面板服务器
chmod +x start_panel.sh
./start_panel.sh

# 或直接运行 Python 脚本
python3 panel_server.py
```

面板默认运行在 `http://localhost:5000`，您可以在浏览器中访问。

### 主要功能

1. **协议管理**：添加、删除、修改各种协议配置
2. **流量监控**：实时查看连接数和流量使用情况
3. **配置导出**：一键导出客户端配置
4. **系统状态**：查看服务器运行状态

## 📁 项目结构

```
.
├── vless-server.sh          # 主脚本文件
├── panel_server.py          # Web 面板后端服务器
├── start_panel.sh           # 面板启动脚本
├── requirements.txt         # Python 依赖列表
├── 快速部署.sh              # 快速部署脚本
├── VPS部署指南.md           # 详细部署指南
├── GitHub上传指南.md        # GitHub 上传说明
├── .gitignore               # Git 忽略规则
└── panel/                   # Web 面板前端
    ├── index.html           # 前端页面
    ├── style.css            # 样式文件
    ├── app.js               # JavaScript 逻辑
    └── README.md            # 面板说明
```

## 🔧 配置说明

脚本会自动检测系统环境并安装必要的依赖。主要配置文件位于：

- `/etc/vless-reality/` - 协议配置文件目录
- `/usr/local/bin/vless-server` - 主程序位置

## 📚 详细文档

- [VPS部署指南.md](VPS部署指南.md) - 完整的部署和使用指南
- [GitHub上传指南.md](GitHub上传指南.md) - 如何将项目上传到 GitHub
- [panel/README.md](panel/README.md) - Web 面板详细说明

## 🛠️ 支持的协议

- VLESS (TCP/WS/gRPC)
- VMess (TCP/WS/gRPC)
- Trojan (TCP/WS)
- Shadowsocks
- 以及更多...

## ⚙️ 依赖要求

### Python 依赖
- Flask >= 2.0.0
- Flask-CORS >= 3.0.0

安装命令：
```bash
pip3 install -r requirements.txt
```

### 系统依赖
脚本会自动安装以下依赖：
- Xray-core
- 其他必要的系统工具

## 🔒 安全建议

1. **定期更新**：保持脚本和内核为最新版本
2. **强密码**：使用强密码保护您的配置
3. **防火墙**：配置适当的防火墙规则
4. **日志管理**：定期清理日志文件

## 📝 更新日志

查看脚本运行日志了解最新更新。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[您的许可证]

## ⚠️ 免责声明

本项目仅供学习和研究使用。使用者需遵守当地法律法规，不得用于非法用途。

---

**提示**：首次使用建议查看 [VPS部署指南.md](VPS部署指南.md) 了解详细步骤。

