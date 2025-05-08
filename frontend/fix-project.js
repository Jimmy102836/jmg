const fs = require('fs');
const path = require('path');

console.log('开始修复项目...');

// 1. 确保package.json中有所有必要的依赖
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// 2. 确保babel.config.js存在
const babelConfigPath = path.join(__dirname, 'babel.config.js');
if (!fs.existsSync(babelConfigPath)) {
  console.log('创建babel.config.js...');
  fs.writeFileSync(
    babelConfigPath,
    `module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}`
  );
}

// 3. 确保.eslintrc.js存在
const eslintConfigPath = path.join(__dirname, '.eslintrc.js');
if (!fs.existsSync(eslintConfigPath)) {
  console.log('创建.eslintrc.js...');
  fs.writeFileSync(
    eslintConfigPath,
    `module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'warn',
    'no-unused-vars': 'warn'
  }
}`
  );
}

// 4. 修复Login.vue中的localStorage键名
const loginVuePath = path.join(__dirname, 'src/views/login/Login.vue');
if (fs.existsSync(loginVuePath)) {
  console.log('修复Login.vue...');
  let loginVueContent = fs.readFileSync(loginVuePath, 'utf8');
  loginVueContent = loginVueContent.replace(
    /localStorage\.setItem\('userInfo'/g,
    "localStorage.setItem('user'"
  );
  loginVueContent = loginVueContent.replace(
    /this\.\$router\.push\({ path: this\.redirect \|\| '\/admin\/dashboard' }\)/g,
    "this.$router.push({ path: this.redirect || '/admin' })"
  );
  fs.writeFileSync(loginVuePath, loginVueContent);
}

// 5. 修复auth.js中的userRole getter
const authJsPath = path.join(__dirname, 'src/store/modules/auth.js');
if (fs.existsSync(authJsPath)) {
  console.log('修复auth.js...');
  let authJsContent = fs.readFileSync(authJsPath, 'utf8');
  authJsContent = authJsContent.replace(
    /userRole: state => state\.user \? state\.user\.roles\[0\] : null/g,
    'userRole: state => state.user ? state.user.role : null'
  );
  fs.writeFileSync(authJsPath, authJsContent);
}

// 6. 确保主页组件Home.vue中引用的组件存在
const homeComponentsDir = path.join(__dirname, 'src/views/home/components');
const requiredHomeComponents = [
  'HomeBanner.vue', 
  'PlatformFeatures.vue', 
  'PopularTasks.vue', 
  'PlatformProcess.vue', 
  'PlatformStats.vue'
];

if (!fs.existsSync(homeComponentsDir)) {
  console.log('创建home/components目录...');
  fs.mkdirSync(homeComponentsDir, { recursive: true });
}

// 7. 确保TaskDetail.vue存在
const taskDetailPath = path.join(__dirname, 'src/views/TaskDetail.vue');
if (!fs.existsSync(taskDetailPath)) {
  console.log('TaskDetail.vue不存在，这会导致路由错误');
}

console.log('修复完成！请运行npm run serve尝试启动项目。'); 