// 当弹窗加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取当前标签页信息
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // 检查是否在目标网站
    if (currentTab.url.includes('drugtrials.org.cn')) {
      document.getElementById('status').textContent = '✅ 已检测到临床试验网站';
      document.getElementById('generate-btn').disabled = false;
    } else {
      document.getElementById('status').textContent = '❌ 请在临床试验网站页面使用此插件';
      document.getElementById('generate-btn').disabled = true;
    }
  });
  
  // 生成按钮点击事件
  document.getElementById('generate-btn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'generate'}, function(response) {
        if (response && response.success) {
          document.getElementById('status').textContent = '✅ 招募广告已生成并复制到剪贴板！';
        } else {
          document.getElementById('status').textContent = '❌ 生成失败，请检查页面内容';
        }
      });
    });
  });
  
  // 调试按钮点击事件
  document.getElementById('debug-btn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'debug'}, function(response) {
        if (response && response.success) {
          document.getElementById('status').textContent = '🔍 调试信息已显示';
        } else {
          document.getElementById('status').textContent = '❌ 调试失败';
        }
      });
    });
  });
});

// 显示状态信息
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
} 