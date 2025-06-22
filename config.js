// 研究中心提取配置
const CENTER_CONFIG = {
  // 精确选择器
  selectors: [
    '#collapseTwo > div > table:nth-child(22)',
    '#collapseTwo > div > table:nth-child(21)',
    '#collapseTwo > div > table:nth-child(20)',
    '#collapseTwo > div > table:nth-child(19)',
    '#collapseTwo > div > table:nth-child(18)'
  ],
  // XPath表达式
  xpaths: [
    '//*[@id="collapseTwo"]/div/table[9]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[8]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[7]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[6]/tbody/tr[position()>1]/td[2]',
    '//*[@id="collapseTwo"]/div/table[5]/tbody/tr[position()>1]/td[2]'
  ],
  // 表头文本匹配
  headers: ['机构名称'],
  // 列索引
  columnIndex: 1
};

// 机构名称验证配置
const VALIDATION_CONFIG = {
  // 验证模式
  validPatterns: [
    /医院/, /中心/, /大学/, /医学院/, /附属/, /研究所/, /研究院/, /诊所/, /医疗/, /保健/
  ],
  invalidPatterns: [
    /^\d+$/, // 纯数字
    /^[A-Za-z]+$/, // 纯英文
    /^(是|否|有|无|其他)$/, // 简单选项
    /^(男|女)$/, // 性别选项
    /^(年龄|体重|身高|BMI)$/, // 指标名称
    /^(试验|研究|药物|适应症|入选|排除)$/, // 试验相关词汇
    /^(同意|不同意|愿意|不愿意)$/, // 同意选项
    /^(正常|异常|阳性|阴性)$/, // 检查结果
    /^(序号|机构名称|主要研究者|国家|省|城市)$/ // 表头
  ]
};

// 输出配置
const OUTPUT_CONFIG = {
  maxTitleLength: 200,
  maxDrugLength: 100,
  maxIndicationLength: 150,
  maxCriteriaLength: 500,
  maxCentersLength: 1000,
  separator: '、',
  criteriaSeparator: '；\n'
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CENTER_CONFIG, VALIDATION_CONFIG, OUTPUT_CONFIG };
} 