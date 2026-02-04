# GitHub 上传指南

本指南说明如何将项目上传到 GitHub，以便在 VPS 上通过 `git clone` 拉取。

## 📁 需要上传的文件

### ✅ 核心文件（必须上传）

```
vless-server.sh          # 主脚本文件
panel_server.py          # Web 面板后端
start_panel.sh           # 面板启动脚本
requirements.txt         # Python 依赖列表
快速部署.sh              # 快速部署脚本（可选但推荐）
```

### ✅ Web 面板文件（必须上传）

```
panel/
├── index.html          # 前端页面
├── style.css           # 样式文件
├── app.js              # JavaScript 逻辑
└── README.md           # 面板说明（可选）
```

### ✅ 文档文件（推荐上传）

```
README.md               # 项目主说明文档
VPS部署指南.md          # 部署指南
```

### ❌ 不需要上传的文件

以下文件已通过 `.gitignore` 自动排除：

- 配置文件（运行时生成）
- 日志文件
- Python 缓存文件
- 临时文件
- 敏感信息文件

## 🚀 上传步骤

### 方法一：使用 Git 命令行（推荐）

#### 1. 初始化 Git 仓库

```bash
# 在项目目录下执行
git init
```

#### 2. 添加远程仓库

```bash
# 替换为您的 GitHub 仓库地址
git remote add origin https://github.com/您的用户名/仓库名.git

# 或使用 SSH
git remote add origin git@github.com:您的用户名/仓库名.git
```

#### 3. 添加文件

```bash
# 添加所有文件（.gitignore 会自动排除不需要的文件）
git add .

# 或手动添加特定文件
git add vless-server.sh
git add panel_server.py
git add start_panel.sh
git add requirements.txt
git add panel/
git add .gitignore
git add README.md
git add VPS部署指南.md
git add 快速部署.sh
```

#### 4. 提交更改

```bash
git commit -m "Initial commit: VLESS Server with Web Panel"
```

#### 5. 推送到 GitHub

```bash
# 首次推送
git push -u origin main

# 或如果默认分支是 master
git push -u origin master
```

### 方法二：使用 GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录您的 GitHub 账号
3. 点击 "File" → "Add Local Repository"
4. 选择项目目录
5. 填写提交信息
6. 点击 "Publish repository"

### 方法三：使用网页上传

1. 在 GitHub 创建新仓库
2. 点击 "uploading an existing file"
3. 拖拽或选择以下文件：
   - `vless-server.sh`
   - `panel_server.py`
   - `start_panel.sh`
   - `requirements.txt`
   - `快速部署.sh`
   - `panel/` 目录（所有文件）
   - `.gitignore`
   - `README.md`
   - `VPS部署指南.md`

## 📝 创建 README.md（如果还没有）

如果您的仓库还没有 README.md，可以创建一个：

```markdown
# VLESS Server

多协议代理服务器一键部署脚本，支持 VLESS/VMess/Trojan 等多种协议。

## 功能特性

- 支持 14 种协议
- Web 管理面板
- 一键部署
- 自动更新

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/您的用户名/仓库名.git
cd 仓库名

# 运行快速部署
chmod +x 快速部署.sh
./快速部署.sh

# 运行主脚本
./vless-server.sh
```

## 详细文档

查看 [VPS部署指南.md](VPS部署指南.md) 了解详细部署步骤。

## 许可证

[您的许可证]
```

## 🔄 在 VPS 上拉取项目

上传完成后，在 VPS 上执行：

```bash
# 克隆仓库
git clone https://github.com/您的用户名/仓库名.git

# 进入目录
cd 仓库名

# 设置权限
chmod +x vless-server.sh
chmod +x start_panel.sh
chmod +x 快速部署.sh

# 安装依赖
pip3 install -r requirements.txt

# 运行脚本
./vless-server.sh
```

## 📋 文件清单检查

上传前确认以下文件存在：

- [x] `vless-server.sh`
- [x] `panel_server.py`
- [x] `start_panel.sh`
- [x] `requirements.txt`
- [x] `快速部署.sh`
- [x] `panel/index.html`
- [x] `panel/style.css`
- [x] `panel/app.js`
- [x] `.gitignore`
- [x] `README.md`（可选）
- [x] `VPS部署指南.md`（可选）

## 🔒 安全注意事项

1. **不要上传敏感信息**
   - 配置文件（包含密钥）
   - 日志文件（可能包含 IP 地址）
   - 证书文件

2. **检查 .gitignore**
   - 确保 `.gitignore` 文件已正确配置
   - 敏感文件不会被意外上传

3. **使用私有仓库**（可选）
   - 如果包含敏感信息，考虑使用私有仓库
   - 或使用 GitHub Secrets 存储敏感配置

## 🎯 推荐的项目结构

```
仓库名/
├── .gitignore              # Git 忽略文件
├── README.md               # 项目说明
├── requirements.txt        # Python 依赖
├── vless-server.sh         # 主脚本
├── panel_server.py         # Web 面板后端
├── start_panel.sh          # 启动脚本
├── 快速部署.sh             # 快速部署
├── VPS部署指南.md          # 部署文档
└── panel/                  # Web 面板前端
    ├── index.html
    ├── style.css
    ├── app.js
    └── README.md
```

## ✅ 完成！

上传完成后，您就可以在任何 VPS 上通过 `git clone` 快速部署项目了！

---

**提示**：如果后续有更新，使用以下命令同步：

```bash
git add .
git commit -m "更新说明"
git push
```

在 VPS 上更新：

```bash
cd 仓库名
git pull
```

