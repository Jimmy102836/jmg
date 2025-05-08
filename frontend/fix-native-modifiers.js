const fs = require('fs');
const path = require('path');

console.log('开始修复.native修饰符问题...');

// 要修复的文件列表
const filesToFix = [
  'src/views/TaskList.vue',
  'src/views/admin/materials/MaterialList.vue',
  'src/views/admin/tasks/TaskList.vue',
  'src/views/admin/users/MerchantList.vue',
  'src/views/login/Login.vue'
];

// 遍历文件并修复
filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`修复文件: ${filePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 替换@keyup.enter.native为@keyup.enter
    content = content.replace(/@keyup\.enter\.native/g, '@keyup.enter');
    
    // 替换@click.native为@click
    content = content.replace(/@click\.native/g, '@click');
    
    fs.writeFileSync(fullPath, content);
  } else {
    console.log(`文件不存在: ${filePath}`);
  }
});

console.log('修复完成！'); 