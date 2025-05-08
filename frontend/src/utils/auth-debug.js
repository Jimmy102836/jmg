/**
 * 调试辅助工具 - 认证相关
 * 
 * 这个文件提供了在开发环境中跳过后端API，
 * 直接设置认证信息的方法
 */

// 模拟管理员用户
const adminUser = {
  id: 1,
  username: 'admin',
  nickname: '平台管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  avatar: null,
  status: 1,
  user_type: 3, // 3=管理员
  role: 'admin',
  created_at: '2023-01-01 00:00:00',
  updated_at: '2023-01-01 00:00:00'
};

// 模拟商家用户
const merchantUser = {
  id: 2,
  username: 'merchant',
  nickname: '测试商家',
  phone: '13900139000',
  email: 'merchant@example.com',
  avatar: null,
  status: 1,
  user_type: 1, // 1=商家
  role: 'merchant',
  created_at: '2023-01-01 00:00:00',
  updated_at: '2023-01-01 00:00:00'
};

/**
 * 设置模拟的管理员身份
 */
export function setAdminAuth() {
  const token = 'mock_admin_token_' + Date.now();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(adminUser));
  console.log('已模拟管理员登录状态');
  return { token, user: adminUser };
}

/**
 * 设置模拟的商家身份
 */
export function setMerchantAuth() {
  const token = 'mock_merchant_token_' + Date.now();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(merchantUser));
  console.log('已模拟商家登录状态');
  return { token, user: merchantUser };
}

/**
 * 清除认证状态
 */
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('已清除登录状态');
  return true;
} 