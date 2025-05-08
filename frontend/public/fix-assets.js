// 添加一些修复代码，使用Base64图片替代缺失的资源
(function() {
  // 当DOM内容加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('正在修复缺失的图片资源...');

    // 为所有损坏的图片添加错误处理
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        // 检查图片URL
        if (this.src.includes('logo.png')) {
          // 替换为一个简单的红色抖音风格logo的Base64
          this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmMmM1NSIgZD0iTTIyLjU0NyA3LjEwNWE1LjQzIDUuNDMgMCAwIDEtLjkyNC4wNzdjLTEuOTk3IDAtMy44LS45Mi00Ljk5Mi0yLjM2MXY4LjEwM2MwIDQuMTIyLTMuMzQzIDcuNDY1LTcuNDY1IDcuNDY1YTcuNDY2IDcuNDY2IDAgMCAxLTQuNTAzLTEuNUE3LjQ2NiA3LjQ2NiAwIDAgMSA5LjE2NyA3LjQxdjQuMDQyYTMuNDIzIDMuNDIzIDAgMCAwLTEtLjE1MWMtMS44OSAwLTMuNDI0IDEuNTM0LTMuNDI0IDMuNDI0czEuNTM0IDMuNDI0IDMuNDI0IDMuNDI0YzEuODkgMCAzLjQyNC0xLjUzNCAzLjQyNC0zLjQyNFY0LjA2NWMxLjg2NyAxLjE5MiA0LjA3OCAxLjg5IDYuNDUzIDEuODl2LTIuNzJhNC43NzEgNC43NzEgMCAwIDEtMS41OTEtMy41N2gtMi43OEExMC4wNSAxMC4wNSAwIDAgMCA5LjE2NyAzLjk5djMuNDJhNy40NjggNy40NjggMCAwIDAtMy41LS44NjVDMi41NDYgNi41NDUgMCA5LjA5IDAgMTIuMjExYzAgMy4xMjIgMi41NDYgNS42NjYgNS42NjcgNS42NjYuOTA0IDAgMS43Ni0uMjE0IDIuNTItLjU5M2E3LjQ2NiA3LjQ2NiAwIDAgMCA0Ljk0NSAxLjg3MWM0LjEyMSAwIDcuNDY1LTMuMzQzIDcuNDY1LTcuNDY1VjMuNTg3YTEwLjY4NiAxMC42ODYgMCAwIDAgMS45NSAzLjUxOHoiLz48L3N2Zz4=';
        } else if (this.src.includes('default-avatar.png')) {
          // 替换为一个简单的头像图标的Base64
          this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2RkZGRkZCIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgNCAxLjMzIDQgNHMtMS4zMyA0LTQgNC00LTEuMzMtNC00IDEuMzMtNCA0LTR6bTAgMTVjLTIuNSAwLTQuNzEtMS4yOC02LTMuMjIuMDMtMS45OSA0LTMuMDggNi0zLjA4IDEuOTkgMCA1Ljk3IDEuMDkgNiAzLjA4LTEuMjkgMS45NC0zLjUgMy4yMi02IDMuMjJ6Ii8+PC9zdmc+';
        } else if (this.src.includes('banner')) {
          // 替换为一个彩色渐变背景的Base64
          this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmMmM1NSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3OTI4ZmYiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cxKSIgLz48L3N2Zz4=';
        }
      });
    });

    console.log('资源修复完成！');
  });
})(); 