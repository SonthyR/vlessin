#!/bin/bash
# Web 面板快速启动脚本

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PANEL_SERVER="$SCRIPT_DIR/panel_server.py"

# 检查 Python
if ! command -v python3 &>/dev/null; then
    echo "错误: 未找到 python3，请先安装 Python 3"
    exit 1
fi

# 检查依赖
if ! python3 -c "import flask" 2>/dev/null; then
    echo "安装 Flask 依赖..."
    pip3 install flask flask-cors --quiet || {
        echo "错误: 安装依赖失败，请手动运行: pip3 install flask flask-cors"
        exit 1
    }
fi

# 启动服务器
echo "启动 Web 面板服务器..."
cd "$SCRIPT_DIR"
python3 "$PANEL_SERVER"

