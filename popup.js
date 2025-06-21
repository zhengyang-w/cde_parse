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

// 复制到剪贴板的函数
function copyToClipboard(text) {
  // 方法1：使用现代Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showStatus('已复制到剪贴板！', 'success');
    }).catch(function(err) {
      console.log('Clipboard API失败，尝试备用方案：', err);
      // 如果Clipboard API失败，使用备用方案
      fallbackCopyToClipboard(text);
    });
  } else {
    // 如果不支持Clipboard API，直接使用备用方案
    fallbackCopyToClipboard(text);
  }
}

// 备用复制方案
function fallbackCopyToClipboard(text) {
  try {
    // 创建临时textarea元素
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // 选择文本并复制
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textArea);
    
    if (successful) {
      showStatus('已复制到剪贴板！', 'success');
    } else {
      showStatus('复制失败，请手动复制', 'error');
    }
  } catch (err) {
    console.error('备用复制方案也失败了：', err);
    showStatus('复制失败：' + err.message, 'error');
  }
}

// 显示状态信息
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}

// 智能提取临床试验信息的函数
function extractTrialInfo() {
  console.log('开始提取页面信息...');
  
  const info = extractAllInfo();
  console.log('提取的信息:', info);
  
  // 提取标题
  const title = info.title || '临床试验招募';
  console.log('提取的标题:', title);
  
  // 提取试验药物
  const drug = info.drug || '试验药物';
  console.log('提取的药物:', drug);
  
  // 提取适应症
  const indication = info.indication || '相关适应症';
  console.log('提取的适应症:', indication);
  
  // 提取入选标准（简化处理）
  const criteria = simplifyCriteria(info.criteria);
  console.log('提取的标准:', criteria);
  
  // 提取研究中心（处理多个中心）
  const center = simplifyCenter(info.center);
  console.log('提取的中心:', center);
  
  // 生成招募广告
  const recruitmentAd = `【${title}】

试验药物：${drug}
适应症：${indication}

入选标准：
${criteria}

研究中心：${center}

访视周期：根据试验方案安排
患者补贴：根据试验方案提供相应补贴

有意参加者请联系我们进行详细咨询。`;

  return recruitmentAd;
}

// 提取所有信息
function extractAllInfo() {
  const info = {};
  
  // 提取标题
  const titleSelector = '#collapseTwo > div > table:nth-child(2) > tbody > tr:nth-child(7) > td';
  const titleElement = document.querySelector(titleSelector);
  info.title = titleElement ? titleElement.textContent.trim() : '';
  
  // 提取试验药物
  const drugSelector = '#collapseTwo > div > table:nth-child(2) > tbody > tr:nth-child(3) > td';
  const drugElement = document.querySelector(drugSelector);
  info.drug = drugElement ? drugElement.textContent.trim() : '';
  
  // 提取适应症
  const indicationSelector = '#collapseTwo > div > table:nth-child(2) > tbody > tr:nth-child(6) > td';
  const indicationElement = document.querySelector(indicationSelector);
  info.indication = indicationElement ? indicationElement.textContent.trim() : '';
  
  // 提取入选标准
  const criteriaSelector = '#collapseTwo > div > table:nth-child(10) > tbody > tr:nth-child(4) > td';
  const criteriaElement = document.querySelector(criteriaSelector);
  info.criteria = criteriaElement ? criteriaElement.textContent.trim() : '';
  
  // 提取研究中心（提取所有行的机构名称）
  info.center = extractAllCenters();
  
  return info;
}

// 提取所有研究中心
function extractAllCenters() {
  // 查找包含研究中心的表格
  const centerTableSelector = '#collapseTwo > div > table:nth-child(21)';
  const centerTable = document.querySelector(centerTableSelector);
  
  if (!centerTable) {
    console.log('未找到研究中心表格');
    return '';
  }
  
  // 查找所有数据行（跳过表头）
  const rows = centerTable.querySelectorAll('tbody > tr');
  const centers = [];
  
  // 从第2行开始（跳过表头），提取第2列的机构名称
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length >= 2) {
      const centerName = cells[1].textContent.trim();
      if (centerName && centerName.length > 0) {
        centers.push(centerName);
      }
    }
  }
  
  console.log(`找到 ${centers.length} 个研究中心:`, centers);
  return centers.join('、');
}

// 简化入选标准
function simplifyCriteria(criteriaText) {
  if (!criteriaText) {
    return '符合相关医学标准；\n年龄18-75岁；\n签署知情同意书；';
  }
  
  // 清理文本：移除多余的空格、换行符、制表符等
  let cleanedText = criteriaText
    .replace(/\s+/g, ' ')  // 将多个空白字符替换为单个空格
    .replace(/\t/g, '')    // 移除制表符
    .trim();               // 移除首尾空格
  
  // 按句号、分号分割
  const lines = cleanedText.split(/[。；]/).filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 5 && !trimmed.match(/^\s*$/); // 过滤空行和太短的行
  });
  
  if (lines.length === 0) {
    return '符合相关医学标准；\n年龄18-75岁；\n签署知情同意书；';
  }
  
  // 取前3条标准，如果不足3条则全部使用，用换行符连接
  const selectedLines = lines.slice(0, 3).map(line => line.trim());
  return selectedLines.join('；\n') + '；';
}

// 简化研究中心
function simplifyCenter(centerText) {
  if (!centerText) {
    return '全国多家三甲医院';
  }
  
  // 显示全部研究中心，用换行符分割
  const centers = centerText.split('、');
  
  if (centers.length === 0) {
    return '全国多家三甲医院';
  }
  
  // 返回所有研究中心，用换行符连接
  return centers.join('\n');
} 