// API 基础 URL
const API_BASE = window.location.origin + '/api';

// 当前页面
let currentPage = 'dashboard';

// 自动刷新间隔（毫秒）
let autoRefreshInterval = 30000;
let refreshTimer = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    showPage('dashboard');
    await refreshAll();
    startAutoRefresh();
}

// 页面切换
function showPage(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // 显示目标页面
    const pageEl = document.getElementById(`page-${page}`);
    const navItem = document.querySelector(`[data-page="${page}"]`);
    
    if (pageEl) pageEl.classList.add('active');
    if (navItem) navItem.classList.add('active');
    
    currentPage = page;
    
    // 加载页面数据
    loadPageData(page);
}

// 加载页面数据
async function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'protocols':
            await loadProtocols();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'traffic':
            await loadTraffic();
            break;
        case 'services':
            await loadServices();
            break;
        case 'logs':
            await loadLogs();
            break;
    }
}

// API 请求封装
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        showToast('请求失败: ' + error.message, 'error');
        throw error;
    }
}

// 刷新所有数据
async function refreshAll() {
    try {
        updateStatusIndicator('connecting');
        await Promise.all([
            loadDashboard(),
            loadProtocols(),
            loadUsers(),
            loadServices()
        ]);
        updateStatusIndicator('connected');
    } catch (error) {
        updateStatusIndicator('error');
    }
}

// 更新状态指示器
function updateStatusIndicator(status) {
    const indicator = document.getElementById('statusIndicator');
    switch(status) {
        case 'connected':
            indicator.style.backgroundColor = '#10b981';
            break;
        case 'connecting':
            indicator.style.backgroundColor = '#f59e0b';
            break;
        case 'error':
            indicator.style.backgroundColor = '#ef4444';
            break;
    }
}

// 加载仪表盘
async function loadDashboard() {
    try {
        const status = await apiRequest('/status');
        
        // 更新统计
        const protocols = status.database?.xray ? Object.keys(status.database.xray).length : 0;
        const singboxProtocols = status.database?.singbox ? Object.keys(status.database.singbox).length : 0;
        document.getElementById('stat-protocols').textContent = protocols + singboxProtocols;
        
        // 更新服务状态
        const activeServices = Object.values(status.services).filter(s => s).length;
        document.getElementById('stat-services').textContent = activeServices;
        
        // 显示服务列表
        const servicesHtml = Object.entries(status.services).map(([name, active]) => `
            <div class="service-item">
                <div>
                    <div class="service-name">${name}</div>
                </div>
                <div class="service-status ${active ? 'active' : 'inactive'}">
                    ${active ? '运行中' : '已停止'}
                </div>
            </div>
        `).join('');
        document.getElementById('services-status').innerHTML = servicesHtml;
        
    } catch (error) {
        console.error('加载仪表盘失败:', error);
    }
}

// 加载协议列表
async function loadProtocols() {
    try {
        const result = await apiRequest('/protocols');
        const tbody = document.getElementById('protocols-tbody');
        
        if (!result.success || !result.protocols || result.protocols.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">暂无协议</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.protocols.map(proto => {
            const port = proto.config?.port || proto.config?.[0]?.port || 'N/A';
            return `
                <tr>
                    <td>${proto.core}</td>
                    <td>${proto.protocol}</td>
                    <td>${port}</td>
                    <td><span class="service-status active">已配置</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="viewProtocol('${proto.core}', '${proto.protocol}')">查看</button>
                        <button class="btn btn-danger" onclick="deleteProtocol('${proto.core}', '${proto.protocol}')">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('加载协议列表失败:', error);
    }
}

// 加载用户列表
async function loadUsers() {
    try {
        const result = await apiRequest('/users');
        const tbody = document.getElementById('users-tbody');
        
        if (!result.success || !result.users || result.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">暂无用户</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.users.map(user => {
            const used = formatBytes(user.data?.used || 0);
            const quota = user.data?.quota ? formatBytes(user.data.quota) : '无限制';
            return `
                <tr>
                    <td>${user.core}</td>
                    <td>${user.protocol}</td>
                    <td>${user.user}</td>
                    <td>${used}</td>
                    <td>${quota}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="viewUser('${user.core}', '${user.protocol}', '${user.user}')">查看</button>
                        <button class="btn btn-danger" onclick="deleteUser('${user.core}', '${user.protocol}', '${user.user}')">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // 更新用户数量统计
        document.getElementById('stat-users').textContent = result.users.length;
        
    } catch (error) {
        console.error('加载用户列表失败:', error);
    }
}

// 加载流量统计
async function loadTraffic() {
    try {
        const result = await apiRequest('/traffic');
        const container = document.getElementById('traffic-stats');
        
        if (!result.success) {
            container.innerHTML = '<p>加载流量统计失败</p>';
            return;
        }
        
        // 这里可以根据实际返回的数据格式进行展示
        container.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
        
    } catch (error) {
        console.error('加载流量统计失败:', error);
    }
}

// 加载服务管理
async function loadServices() {
    try {
        const result = await apiRequest('/services');
        const container = document.getElementById('services-management');
        
        if (!result.success || !result.services) {
            container.innerHTML = '<p>加载服务列表失败</p>';
            return;
        }
        
        container.innerHTML = Object.entries(result.services).map(([name, info]) => `
            <div class="service-item">
                <div>
                    <div class="service-name">${name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">${info.status}</div>
                </div>
                <div>
                    <span class="service-status ${info.active ? 'active' : 'inactive'}">
                        ${info.active ? '运行中' : '已停止'}
                    </span>
                    <button class="btn btn-primary" onclick="controlService('${name}', '${info.active ? 'stop' : 'start'}')" style="margin-left: 0.5rem;">
                        ${info.active ? '停止' : '启动'}
                    </button>
                    <button class="btn btn-secondary" onclick="controlService('${name}', 'restart')" style="margin-left: 0.5rem;">
                        重启
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('加载服务列表失败:', error);
    }
}

// 加载日志
async function loadLogs() {
    try {
        const lines = document.getElementById('log-lines')?.value || 100;
        const result = await apiRequest(`/logs?lines=${lines}`);
        const container = document.getElementById('logs-content');
        
        if (!result.success || !result.logs) {
            container.innerHTML = '<p>暂无日志</p>';
            return;
        }
        
        container.innerHTML = result.logs.map(line => `
            <div class="log-line">${escapeHtml(line)}</div>
        `).join('');
        
        // 滚动到底部
        container.scrollTop = container.scrollHeight;
        
    } catch (error) {
        console.error('加载日志失败:', error);
    }
}

// 控制服务
async function controlService(service, action) {
    if (!confirm(`确定要${action === 'start' ? '启动' : action === 'stop' ? '停止' : '重启'}服务 ${service} 吗？`)) {
        return;
    }
    
    try {
        const result = await apiRequest(`/services/${service}/${action}`, {
            method: 'POST'
        });
        
        if (result.success) {
            showToast(`服务 ${action} 操作成功`, 'success');
            await loadServices();
        } else {
            showToast(`操作失败: ${result.error || result.stderr}`, 'error');
        }
    } catch (error) {
        showToast('操作失败', 'error');
    }
}

// 删除协议
async function deleteProtocol(core, protocol) {
    if (!confirm(`确定要删除协议 ${core}/${protocol} 吗？`)) {
        return;
    }
    
    try {
        const result = await apiRequest(`/protocols/${core}/${protocol}`, {
            method: 'DELETE'
        });
        
        if (result.success) {
            showToast('协议删除成功', 'success');
            await loadProtocols();
        } else {
            showToast('删除失败', 'error');
        }
    } catch (error) {
        showToast('删除失败', 'error');
    }
}

// 删除用户
async function deleteUser(core, protocol, user) {
    if (!confirm(`确定要删除用户 ${user} 吗？`)) {
        return;
    }
    
    try {
        const result = await apiRequest(`/users/${core}/${protocol}/${user}`, {
            method: 'DELETE'
        });
        
        if (result.success) {
            showToast('用户删除成功', 'success');
            await loadUsers();
        } else {
            showToast('删除失败', 'error');
        }
    } catch (error) {
        showToast('删除失败', 'error');
    }
}

// 显示添加协议模态框
function showAddProtocolModal() {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <h2>添加协议</h2>
        <form id="add-protocol-form" style="margin-top: 1rem;">
            <div style="margin-bottom: 1rem;">
                <label>核心类型</label>
                <select id="protocol-core" class="input" style="width: 100%; margin-top: 0.5rem;">
                    <option value="xray">Xray</option>
                    <option value="singbox">Sing-box</option>
                </select>
            </div>
            <div style="margin-bottom: 1rem;">
                <label>协议名称</label>
                <input type="text" id="protocol-name" class="input" style="width: 100%; margin-top: 0.5rem;" placeholder="vless">
            </div>
            <div style="margin-bottom: 1rem;">
                <label>配置 JSON</label>
                <textarea id="protocol-config" class="input" style="width: 100%; margin-top: 0.5rem; min-height: 200px;" placeholder='{"port": 443, "uuid": "..."}'></textarea>
            </div>
            <button type="submit" class="btn btn-primary">添加</button>
        </form>
    `;
    
    modal.classList.add('active');
    
    document.getElementById('add-protocol-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        // 实现添加协议逻辑
        closeModal();
    });
}

// 显示添加用户模态框
function showAddUserModal() {
    showToast('功能开发中', 'info');
}

// 关闭模态框
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// 显示通知
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 格式化字节
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 启动自动刷新
function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
        loadPageData(currentPage);
    }, autoRefreshInterval);
}

// 停止自动刷新
function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

