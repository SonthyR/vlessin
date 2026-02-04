#!/bin/bash
# VLESS Server 快速部署脚本
# 适用于 Ubuntu/Debian/CentOS

set -e

echo "=========================================="
echo "  VLESS Server 快速部署脚本"
echo "=========================================="
echo ""

# 检测系统
detect_system() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        OS=$DISTRIB_ID
        VER=$DISTRIB_RELEASE
    elif [ -f /etc/debian_version ]; then
        OS=Debian
        VER=$(cat /etc/debian_version)
    elif [ -f /etc/redhat-release ]; then
        OS=CentOS
        VER=$(cat /etc/redhat-release | sed 's/.*release \([0-9.]*\).*/\1/')
    else
        OS=$(uname -s)
        VER=$(uname -r)
    fi
    echo "检测到系统: $OS $VER"
}

# 安装基础依赖
install_dependencies() {
    echo ""
    echo "正在安装基础依赖..."
    
    if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
        apt update
        apt install -y curl wget git python3 python3-pip
    elif [[ "$OS" == "centos" ]] || [[ "$OS" == "rhel" ]]; then
        yum install -y curl wget git python3 python3-pip
    else
        echo "不支持的系统: $OS"
        exit 1
    fi
    
    echo "✓ 基础依赖安装完成"
}

# 安装 Python 依赖
install_python_deps() {
    echo ""
    echo "正在安装 Python 依赖..."
    
    if [ -f requirements.txt ]; then
        pip3 install -r requirements.txt
    else
        pip3 install flask flask-cors
    fi
    
    echo "✓ Python 依赖安装完成"
}

# 设置文件权限
set_permissions() {
    echo ""
    echo "正在设置文件权限..."
    
    if [ -f vless-server.sh ]; then
        chmod +x vless-server.sh
    fi
    
    if [ -f start_panel.sh ]; then
        chmod +x start_panel.sh
    fi
    
    if [ -f panel_server.py ]; then
        chmod +x panel_server.py
    fi
    
    echo "✓ 文件权限设置完成"
}

# 配置防火墙
setup_firewall() {
    echo ""
    read -p "是否配置防火墙？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v ufw &> /dev/null; then
            echo "使用 UFW 配置防火墙..."
            ufw allow 22/tcp
            ufw allow 443/tcp
            ufw allow 8080/tcp
            echo "✓ 防火墙规则已添加（需要手动启用: ufw enable）"
        elif command -v firewall-cmd &> /dev/null; then
            echo "使用 Firewalld 配置防火墙..."
            firewall-cmd --permanent --add-port=22/tcp
            firewall-cmd --permanent --add-port=443/tcp
            firewall-cmd --permanent --add-port=8080/tcp
            firewall-cmd --reload
            echo "✓ 防火墙规则已添加"
        else
            echo "未检测到防火墙工具，请手动配置"
        fi
    fi
}

# 主函数
main() {
    detect_system
    install_dependencies
    install_python_deps
    set_permissions
    setup_firewall
    
    echo ""
    echo "=========================================="
    echo "  部署完成！"
    echo "=========================================="
    echo ""
    echo "下一步操作："
    echo "1. 运行脚本: ./vless-server.sh"
    echo "2. 选择 '1. 安装/更新核心' 进行首次安装"
    echo "3. 选择 '14. Web 管理面板' 启动 Web 界面"
    echo ""
    echo "Web 面板访问地址: http://$(curl -s ifconfig.me):8080"
    echo ""
}

# 执行主函数
main

