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
  const debugDetails = getDebugDetails();
  
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
    max-width: 900px;
    max-height: 90%;
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
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${extractedInfo.title || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>试验药物:</h4>
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${extractedInfo.drug || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>适应症:</h4>
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${extractedInfo.indication || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>入选标准:</h4>
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${extractedInfo.criteria || '未找到'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>研究中心:</h4>
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${extractedInfo.center || '未找到'}</p>
    </div>
    
    <hr style="margin: 30px 0;">
    
    <h3>调试详情</h3>
    <div style="margin-bottom: 20px;">
      <h4>页面信息:</h4>
      <p><strong>页面标题:</strong> ${document.title}</p>
      <p><strong>页面URL:</strong> ${window.location.href}</p>
      <p><strong>表格数量:</strong> ${document.querySelectorAll('table').length}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>选择器执行详情:</h4>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px;">
        ${debugDetails}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>页面结构分析:</h4>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px;">
        ${analyzePageStructure()}
      </div>
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

// 获取调试详情
function getDebugDetails() {
  let details = '';
  
  // 标题提取调试
  details += '<strong>标题提取:</strong>\n';
  details += `  策略1 (试验专业题目): ${findTableRowByHeader('试验专业题目') ? findTableRowByHeader('试验专业题目').textContent.trim() : '失败'}\n`;
  details += `  策略2 (试验通俗题目): ${findTableRowByHeader('试验通俗题目') ? findTableRowByHeader('试验通俗题目').textContent.trim() : '失败'}\n`;
  details += `  策略3 (页面标题): ${document.title.replace(/.*?-/, '').trim() || '失败'}\n\n`;
  
  // 药物提取调试
  details += '<strong>药物提取:</strong>\n';
  details += `  策略1 (试验药表格): ${extractDrug() || '失败'}\n`;
  details += `  策略2 (试验药物行): ${findTableRowByHeader('试验药物') ? findTableRowByHeader('试验药物').textContent.trim() : '失败'}\n\n`;
  
  // 适应症提取调试
  details += '<strong>适应症提取:</strong>\n';
  details += `  策略1 (适应症行): ${extractIndication() || '失败'}\n\n`;
  
  // 入选标准提取调试
  details += '<strong>入选标准提取:</strong>\n';
  details += `  策略1 (入选标准表格): ${extractCriteria() || '失败'}\n\n`;
  
  // 研究中心提取调试
  details += '<strong>研究中心提取:</strong>\n';
  details += `  策略1 (机构名称表格): ${extractAllCenters() || '失败'}\n`;
  
  // 详细分析研究中心提取
  details += '\n<strong>研究中心详细分析:</strong>\n';
  details += analyzeCenterExtraction();
  
  // 添加页面结构分析
  details += '\n<strong>页面结构分析:</strong>\n';
  details += analyzePageStructure();
  
  return details;
}

// 分析研究中心提取
function analyzeCenterExtraction() {
  let analysis = '';
  
  // 测试精确选择器
  analysis += '<strong>精确选择器测试:</strong>\n';
  const centerTable = document.querySelector('#collapseTwo > div > table:nth-child(22)');
  if (centerTable) {
    analysis += '✓ 找到研究中心表格 (table:nth-child(22))\n';
    const rows = centerTable.querySelectorAll('tbody > tr');
    analysis += `  表格行数: ${rows.length}\n`;
    
    for (let i = 1; i < Math.min(rows.length, 5); i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length >= 2) {
        const centerName = cells[1].textContent.trim();
        analysis += `  行${i}: ${centerName}\n`;
      }
    }
  } else {
    analysis += '✗ 未找到研究中心表格 (table:nth-child(22))\n';
  }
  
  // 测试XPath
  analysis += '\n<strong>XPath测试:</strong>\n';
  try {
    const xpathResult = document.evaluate(
      '//*[@id="collapseTwo"]/div/table[9]/tbody/tr[position()>1]/td[2]',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    
    if (xpathResult.snapshotLength > 0) {
      analysis += `✓ XPath找到 ${xpathResult.snapshotLength} 个机构\n`;
      for (let i = 0; i < Math.min(xpathResult.snapshotLength, 3); i++) {
        const centerName = xpathResult.snapshotItem(i).textContent.trim();
        analysis += `  机构${i+1}: ${centerName}\n`;
      }
    } else {
      analysis += '✗ XPath未找到机构信息\n';
    }
  } catch (error) {
    analysis += `✗ XPath执行错误: ${error.message}\n`;
  }
  
  // 查找所有包含"机构"或"中心"的表格
  const tables = document.querySelectorAll('table');
  let foundCenterTables = [];
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const rows = table.querySelectorAll('tr');
    
    for (const row of rows) {
      const cells = row.querySelectorAll('td, th');
      for (const cell of cells) {
        const text = cell.textContent.trim();
        if (text.includes('机构') || text.includes('中心') || text.includes('医院')) {
          foundCenterTables.push({
            tableIndex: i,
            text: text,
            rowCount: rows.length
          });
        }
      }
    }
  }
  
  analysis += `\n<strong>页面分析:</strong>\n`;
  analysis += `找到 ${foundCenterTables.length} 个可能包含机构信息的表格\n`;
  
  for (const centerTable of foundCenterTables.slice(0, 5)) {
    analysis += `表格${centerTable.tableIndex}: "${centerTable.text}" (${centerTable.rowCount}行)\n`;
  }
  
  // 测试机构名称验证
  const testNames = ['首都医科大学附属北京同仁医院', '北京大学第三医院', '序号', '男', '18岁'];
  analysis += '\n<strong>机构名称验证测试:</strong>\n';
  for (const name of testNames) {
    analysis += `"${name}": ${isValidCenterName(name) ? '有效' : '无效'}\n`;
  }
  
  return analysis;
}

// 分析页面结构
function analyzePageStructure() {
  const tables = document.querySelectorAll('table');
  let analysis = `找到 ${tables.length} 个表格\n\n`;
  
  // 查找包含关键信息的表格
  const keyHeaders = ['试验专业题目', '试验通俗题目', '试验药', '适应症', '入选标准', '机构名称'];
  const foundHeaders = [];
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    
    for (const row of rows) {
      const headerCell = row.querySelector('th');
      if (headerCell) {
        const headerText = headerCell.textContent.trim();
        for (const keyHeader of keyHeaders) {
          if (headerText.includes(keyHeader) && !foundHeaders.includes(keyHeader)) {
            foundHeaders.push(keyHeader);
            analysis += `✓ 找到表头: "${keyHeader}"\n`;
          }
        }
      }
    }
  }
  
  analysis += `\n找到 ${foundHeaders.length}/${keyHeaders.length} 个关键表头\n`;
  
  // 分析机构名称表格
  const centerTable = findTableByHeader('机构名称');
  if (centerTable) {
    const rows = centerTable.querySelectorAll('tr');
    analysis += `\n机构名称表格分析:\n`;
    analysis += `  总行数: ${rows.length}\n`;
    
    for (let i = 1; i < Math.min(rows.length, 5); i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length >= 2) {
        const centerName = cells[1].textContent.trim();
        analysis += `  行${i}: ${centerName}\n`;
      }
    }
  } else {
    analysis += `\n未找到机构名称表格\n`;
  }
  
  return analysis;
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
  
  // 提取标题 - 使用精确选择器
  info.title = extractTitle();
  
  // 提取试验药物 - 使用精确选择器
  info.drug = extractDrug();
  
  // 提取适应症 - 使用精确选择器
  info.indication = extractIndication();
  
  // 提取入选标准 - 使用精确选择器
  info.criteria = extractCriteria();
  
  // 提取研究中心 - 使用精确选择器
  info.center = extractAllCenters();
  
  return info;
}

// 智能提取标题
function extractTitle() {
  // 策略1: 试验专业题目（最准确）
  let title = findTableRowByHeader('试验专业题目');
  if (title) return title.textContent.trim();
  
  // 策略2: 试验通俗题目
  title = findTableRowByHeader('试验通俗题目');
  if (title) return title.textContent.trim();
  
  // 策略3: 页面标题
  title = document.title.replace(/.*?-/, '').trim();
  if (title && title.length > 5) return title;
  
  return '';
}

// 智能提取试验药物
function extractDrug() {
  // 策略1: 从试验药表格中提取
  const drugTable = findTableByHeader('试验药');
  if (drugTable) {
    const drugRow = drugTable.querySelector('tr:nth-child(2)');
    if (drugRow) {
      const drugCell = drugRow.querySelector('td:nth-child(2)');
      if (drugCell) {
        const text = drugCell.textContent.trim();
        // 提取中文通用名
        const match = text.match(/中文通用名:([^\n]+)/);
        if (match) return match[1].trim();
        return text;
      }
    }
  }
  
  // 策略2: 查找包含"试验药物"的行
  const drugRow = findTableRowByHeader('试验药物');
  if (drugRow) return drugRow.textContent.trim();
  
  return '';
}

// 智能提取适应症
function extractIndication() {
  // 策略1: 直接查找适应症行
  const indicationRow = findTableRowByHeader('适应症');
  if (indicationRow) return indicationRow.textContent.trim();
  
  return '';
}

// 智能提取入选标准
function extractCriteria() {
  // 策略1: 查找入选标准表格
  const criteriaTable = findTableByHeader('入选标准');
  if (criteriaTable) {
    const rows = criteriaTable.querySelectorAll('tr');
    const criteria = [];
    
    for (let i = 1; i < rows.length; i++) { // 跳过表头
      const cells = rows[i].querySelectorAll('td');
      if (cells.length >= 2) {
        const criteriaText = cells[1].textContent.trim();
        if (criteriaText && criteriaText.length > 5) {
          // 清理文本，移除序号
          const cleanText = criteriaText.replace(/^\d+\.\s*/, '').trim();
          if (cleanText) {
            criteria.push(cleanText);
          }
        }
      }
    }
    
    if (criteria.length > 0) {
      // 只返回前3条标准，避免过长
      return criteria.slice(0, 3).join('；\n') + '；';
    }
  }
  
  return '';
}

// 智能提取所有研究中心
function extractAllCenters() {
  // 策略1: 使用配置的选择器
  const selectors = [
    '#collapseTwo > div > table:nth-child(22)',
    '#collapseTwo > div > table:nth-child(21)',
    '#collapseTwo > div > table:nth-child(20)',
    '#collapseTwo > div > table:nth-child(19)',
    '#collapseTwo > div > table:nth-child(18)'
  ];
  
  for (const selector of selectors) {
    const centerTable = document.querySelector(selector);
    if (centerTable) {
      const centers = extractCentersFromTable(centerTable);
      if (centers.length > 0) {
        return centers.join('、');
      }
    }
  }
  
  // 策略2: 使用XPath查找
  const xpaths = [
    '//*[@id="collapseTwo"]/div/table[9]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[8]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[7]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[6]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[5]/tbody/tr[position()>1]/td[2]'
  ];
  
  for (const xpath of xpaths) {
    try {
      const xpathResult = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      
      if (xpathResult.snapshotLength > 0) {
        const centers = [];
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
          const centerName = xpathResult.snapshotItem(i).textContent.trim();
          if (centerName && isValidCenterName(centerName)) {
            centers.push(centerName);
          }
        }
        
        if (centers.length > 0) {
          return centers.join('、');
        }
      }
    } catch (error) {
      // 忽略XPath错误，继续尝试下一个
      continue;
    }
  }
  
  // 策略3: 查找各参加机构信息表格
  const centerTable2 = findTableByHeader('机构名称');
  if (centerTable2) {
    const centers = extractCentersFromTable(centerTable2);
    if (centers.length > 0) {
      return centers.join('、');
    }
  }
  
  // 策略4: 直接查找包含"各参加机构信息"的表格
  const tables = document.querySelectorAll('table');
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    for (const row of rows) {
      const cells = row.querySelectorAll('td, th');
      for (const cell of cells) {
        if (cell.textContent.includes('各参加机构信息')) {
          const centers = extractCentersFromTable(table);
          if (centers.length > 0) {
            return centers.join('、');
          }
        }
      }
    }
  }
  
  return '';
}

// 从表格中提取研究中心
function extractCentersFromTable(table) {
  const rows = table.querySelectorAll('tbody > tr, tr');
  const centers = [];
  
  for (let i = 1; i < rows.length; i++) { // 跳过表头
    const cells = rows[i].querySelectorAll('td');
    if (cells.length >= 2) {
      const centerName = cells[1].textContent.trim();
      if (centerName && isValidCenterName(centerName)) {
        centers.push(centerName);
      }
    }
  }
  
  return centers;
}

// 查找包含特定文本的表头行
function findTableRowByHeader(headerText) {
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    
    for (const row of rows) {
      const headerCell = row.querySelector('th');
      if (headerCell && headerCell.textContent.includes(headerText)) {
        const dataCell = row.querySelector('td');
        if (dataCell) {
          return dataCell;
        }
      }
    }
  }
  
  return null;
}

// 查找包含特定文本表头的表格
function findTableByHeader(headerText) {
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    
    for (const row of rows) {
      const headerCell = row.querySelector('th');
      if (headerCell && headerCell.textContent.includes(headerText)) {
        const dataCell = row.querySelector('td');
        if (dataCell) {
          // 查找数据单元格中的表格
          const subTable = dataCell.querySelector('table');
          if (subTable) {
            return subTable;
          }
          // 如果没有子表格，返回父表格
          return table;
        }
      }
    }
  }
  
  return null;
}

// 验证是否为有效的机构名称
function isValidCenterName(name) {
  if (!name || name.length < 3 || name.length > 100) return false;
  
  // 排除一些明显不是机构名称的文本
  const invalidPatterns = [
    /^\d+$/, // 纯数字
    /^[A-Za-z]+$/, // 纯英文
    /^(是|否|有|无|其他)$/, // 简单选项
    /^(男|女)$/, // 性别选项
    /^(年龄|体重|身高|BMI)$/, // 指标名称
    /^(试验|研究|药物|适应症|入选|排除)$/, // 试验相关词汇
    /^(同意|不同意|愿意|不愿意)$/, // 同意选项
    /^(正常|异常|阳性|阴性)$/, // 检查结果
    /^(序号|机构名称|主要研究者|国家|省|城市)$/ // 表头
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(name)) return false;
  }
  
  // 必须包含机构相关关键词
  const validPatterns = [
    /医院/, /中心/, /大学/, /医学院/, /附属/, /研究所/, /研究院/, /诊所/, /医疗/, /保健/
  ];
  
  return validPatterns.some(pattern => pattern.test(name));
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