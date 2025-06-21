// 创建悬浮按钮
function createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'recruitment-generator-btn';
  button.innerHTML = '生成招募广告';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: all 0.3s ease;
  `;
  
  // 悬停效果
  button.addEventListener('mouseenter', function() {
    this.style.backgroundColor = '#45a049';
    this.style.transform = 'scale(1.05)';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.backgroundColor = '#4CAF50';
    this.style.transform = 'scale(1)';
  });
  
  // 点击事件
  button.addEventListener('click', function() {
    generateRecruitmentAd();
  });
  
  document.body.appendChild(button);
  
  // 创建调试按钮
  const debugButton = document.createElement('div');
  debugButton.id = 'debug-btn';
  debugButton.innerHTML = '调试分析';
  debugButton.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background-color: #2196F3;
    color: white;
    padding: 8px 15px;
    border-radius: 15px;
    cursor: pointer;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: all 0.3s ease;
  `;
  
  debugButton.addEventListener('mouseenter', function() {
    this.style.backgroundColor = '#1976D2';
    this.style.transform = 'scale(1.05)';
  });
  
  debugButton.addEventListener('mouseleave', function() {
    this.style.backgroundColor = '#2196F3';
    this.style.transform = 'scale(1)';
  });
  
  debugButton.addEventListener('click', function() {
    showDebugInfo();
  });
  
  document.body.appendChild(debugButton);
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'generate') {
    try {
      const trialInfo = extractTrialInfo();
      if (trialInfo) {
        copyToClipboard(trialInfo);
        sendResponse({success: true});
      } else {
        sendResponse({success: false});
      }
    } catch (error) {
      sendResponse({success: false});
    }
  } else if (request.action === 'debug') {
    try {
      showDebugInfo();
      sendResponse({success: true});
    } catch (error) {
      sendResponse({success: false});
    }
  }
  return true; // 保持消息通道开放
});

// 显示调试信息
function showDebugInfo() {
  const extractedInfo = extractAllInfo();
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 10003;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 800px;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  `;
  
  const content = document.createElement('div');
  content.innerHTML = `
    <h3>提取结果</h3>
    <div style="margin-bottom: 20px;">
      <h4>试验标题:</h4>
      <p>${extractedInfo.title || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>试验药物:</h4>
      <p>${extractedInfo.drug || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>适应症:</h4>
      <p>${extractedInfo.indication || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>入选标准:</h4>
      <p>${extractedInfo.criteria || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>研究中心:</h4>
      <p>${extractedInfo.center || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>页面标题:</h4>
      <p>${document.title}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>页面URL:</h4>
      <p>${window.location.href}</p>
    </div>
  `;
  
  closeBtn.addEventListener('click', function() {
    modal.remove();
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(content);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// 生成招募广告
function generateRecruitmentAd() {
  try {
    const trialInfo = extractTrialInfo();
    
    if (trialInfo) {
      copyToClipboard(trialInfo);
    } else {
      showNotification('无法提取页面信息', 'error');
    }
  } catch (error) {
    showNotification('生成失败，请检查页面内容', 'error');
  }
}

// 复制到剪贴板的函数
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showNotification('招募广告已生成并复制到剪贴板！', 'success');
    }).catch(function(err) {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

// 备用复制方案
function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    
    document.body.removeChild(textArea);
    
    if (successful) {
      showNotification('招募广告已生成并复制到剪贴板！', 'success');
    } else {
      showNotification('复制失败，请手动复制', 'error');
      showGeneratedContent(text);
    }
  } catch (err) {
    showNotification('复制失败，请手动复制', 'error');
    showGeneratedContent(text);
  }
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
  
  // 提取研究中心
  info.center = extractAllCenters();
  
  return info;
}

// 提取所有研究中心
function extractAllCenters() {
  const centerTableSelector = '#collapseTwo > div > table:nth-child(21)';
  const centerTable = document.querySelector(centerTableSelector);
  
  if (!centerTable) {
    return '';
  }
  
  const rows = centerTable.querySelectorAll('tbody > tr');
  const centers = [];
  
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length >= 2) {
      const centerName = cells[1].textContent.trim();
      if (centerName && centerName.length > 0) {
        centers.push(centerName);
      }
    }
  }
  
  return centers.join('、');
}

// 智能提取临床试验信息
function extractTrialInfo() {
  const info = extractAllInfo();
  
  const title = info.title || '临床试验招募';
  const drug = info.drug || '试验药物';
  const indication = info.indication || '相关适应症';
  const criteria = simplifyCriteria(info.criteria);
  const center = simplifyCenter(info.center);
  
  const recruitmentAd = `【${title}】

💊 试验药物
${drug}

💉 适应症
${indication}

📆 访视周期
根据试验方案安排

💰 患者补贴
根据试验方案提供相应补贴

📝 入选标准
${criteria}

🏥 研究中心
${center}`;

  return recruitmentAd;
}

// 简化入选标准
function simplifyCriteria(criteriaText) {
  if (!criteriaText) {
    return '符合相关医学标准；\n年龄18-75岁；\n签署知情同意书；';
  }
  
  let cleanedText = criteriaText
    .replace(/\s+/g, ' ')
    .replace(/\t/g, '')
    .trim();
  
  const lines = cleanedText.split(/[。；]/).filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 5 && !trimmed.match(/^\s*$/);
  });
  
  if (lines.length === 0) {
    return '符合相关医学标准；\n年龄18-75岁；\n签署知情同意书；';
  }
  
  const selectedLines = lines.slice(0, 3).map(line => line.trim());
  return selectedLines.join('；\n') + '；';
}

// 简化研究中心
function simplifyCenter(centerText) {
  if (!centerText) {
    return '全国多家三甲医院';
  }
  
  const centers = centerText.split('、');
  
  if (centers.length === 0) {
    return '全国多家三甲医院';
  }
  
  return centers.join('\n');
}

// 显示通知
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    z-index: 10001;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease;
  `;
  
  if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
  } else {
    notification.style.backgroundColor = '#f44336';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// 显示生成的内容
function showGeneratedContent(content) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 10002;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 500px;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  `;
  
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.style.cssText = `
    width: 100%;
    height: 300px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    resize: vertical;
  `;
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '复制内容';
  copyBtn.style.cssText = `
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  
  copyBtn.addEventListener('click', function() {
    textarea.select();
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('内容已复制！', 'success');
    } else {
      showNotification('复制失败，请手动选择文本复制', 'error');
    }
  });
  
  closeBtn.addEventListener('click', function() {
    modal.remove();
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(document.createElement('h3')).textContent = '生成的招募广告';
  modalContent.appendChild(textarea);
  modalContent.appendChild(copyBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// 页面加载完成后创建悬浮按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
  createFloatingButton();
} 