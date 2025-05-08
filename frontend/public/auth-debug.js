// 手动设置管理员权限脚本
(function() {
  localStorage.setItem('token', 'admin-token');
  localStorage.setItem('user', JSON.stringify({
    id: 1,
    username: 'admin',
    avatar: '',
    role: 'admin'
  }));
  
  console.log('管理员权限已设置，请刷新页面并尝试访问管理后台：/admin');
})(); 