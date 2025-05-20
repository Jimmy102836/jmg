# 抖音电商平台图片资源

此目录包含网站所需的所有图片资源。

## 目录结构

- **banners/** - 促销横幅和广告图片
- **logo/** - 网站和平台logo
- **icons/** - 功能图标和UI元素
- **products/** - 产品示例图
- **categories/** - 商品分类图标

## 使用说明

1. 所有图片都应放在适当的子目录中
2. SVG格式优先，便于缩放和适应不同屏幕尺寸
3. 图片命名应使用小写字母和连字符(-)，如：`product-image.svg`

## 引用方式

在Vue组件中引用图片资源的方式：

```vue
<img src="@/assets/images/logo/chanfei-logo.svg" alt="蝉妃">
```

或者在JavaScript中：

```javascript
const logoPath = require('@/assets/images/logo/chanfei-logo.svg');
``` 