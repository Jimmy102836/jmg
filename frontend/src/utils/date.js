/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期
 * @param {Date|string} date 日期对象或日期字符串
 * @param {string} format 日期格式，默认为 YYYY-MM-DD
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取相对时间描述
 * @param {Date|string} date 日期对象或日期字符串
 * @returns {string} 相对时间描述，如"刚刚"、"5分钟前"、"3小时前"、"2天前"等
 */
export function getRelativeTime(date) {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  // 转换为秒
  const diffSeconds = Math.floor(diff / 1000);
  
  if (diffSeconds < 60) {
    return '刚刚';
  }
  
  // 分钟
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  
  // 小时
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  // 天
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}天前`;
  }
  
  // 月
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  }
  
  // 年
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}年前`;
}

/**
 * 获取当天开始时间
 * @returns {Date} 当天 00:00:00 的 Date 对象
 */
export function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * 获取当天结束时间
 * @returns {Date} 当天 23:59:59 的 Date 对象
 */
export function getTodayEnd() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

/**
 * 获取指定天数前的日期
 * @param {number} days 天数
 * @returns {Date} 指定天数前的 Date 对象
 */
export function getDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * 格式化日期范围
 * @param {Array} dateRange 日期范围数组，包含开始日期和结束日期
 * @param {string} format 日期格式
 * @returns {string} 格式化后的日期范围字符串，如 "2023-01-01 至 2023-01-31"
 */
export function formatDateRange(dateRange, format = 'YYYY-MM-DD') {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) {
    return '';
  }
  
  const [startDate, endDate] = dateRange;
  return `${formatDate(startDate, format)} 至 ${formatDate(endDate, format)}`;
}

/**
 * 获取日期范围
 * @param {String} type 类型：today, week, month, year, custom
 * @param {Date} [customStartDate] 自定义开始日期（仅当type为custom时有效）
 * @param {Date} [customEndDate] 自定义结束日期（仅当type为custom时有效）
 * @returns {Object} 日期范围对象，包含startDate和endDate属性
 */
export function getDateRange(type, customStartDate, customEndDate) {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let day;
  
  switch (type) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'week':
      // 周一作为一周的开始
      day = now.getDay() || 7; // 0表示周日，转为7
      startDate.setDate(now.getDate() - day + 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(now.getMonth() + 1, 0); // 下个月的第0天，即当月最后一天
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'year':
      startDate.setMonth(0, 1); // 1月1日
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31); // 12月31日
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'custom':
      if (customStartDate) startDate = new Date(customStartDate);
      if (customEndDate) endDate = new Date(customEndDate);
      break;
      
    default:
      break;
  }
  
  return {
    startDate,
    endDate
  };
}

/**
 * 计算两个日期之间的天数
 * @param {Date|String|Number} startDate 开始日期
 * @param {Date|String|Number} endDate 结束日期
 * @returns {Number} 天数
 */
export function getDaysBetween(startDate, endDate) {
  // 转换为Date对象
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  
  // 计算差值（毫秒）
  const diff = endDate.getTime() - startDate.getTime();
  
  // 转换为天数（向上取整）
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * 判断是否是同一天
 * @param {Date|String|Number} date1 日期1
 * @param {Date|String|Number} date2 日期2
 * @returns {Boolean} 是否是同一天
 */
export function isSameDay(date1, date2) {
  // 转换为Date对象
  date1 = new Date(date1);
  date2 = new Date(date2);
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default {
  formatDate,
  getRelativeTime,
  getDateRange,
  getDaysBetween,
  isSameDay
}; 