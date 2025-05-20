// 这是一个直接生成favicon的函数
// 使用base64编码的黑色方形图标，中间是红色"吉"字
// 这个图标将作为临时favicon使用，您可以稍后替换为更精美的设计

// 等待文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 一个简单的黑底红字的favicon - 清晰可辨识的"吉"字
  const faviconData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACQ1BMVEUAAADdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxfdFxcAAAA4qzVpAAAAv3RSTlMAAAZLm9v3+eC0agsdcNX8szcHZfqOGCaQ+XoDZu2PEA+Y/pUKgjwCR+jIf2lKzbRCFF/Cnz4lIj94r1UIXveFEQE0uuNWA2P0kBEQkPRjAxW/VgJVxBm7TgFs7aEhLZP+nCoJgelfGfr///8ZX+kJCYJeGRmCCQle6YIJCQmCGRmCGYIJ6YJe6V/pCV/pCQmCgl8ZXxleGRlfXxlfXxmC6enp6ekZgumCXxmC6QLp6YJfGYLpXxmC6QKCgukCgukZGQICAhkZAhnpAlJHy7kAAAABYktHRACIBR1IAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH5wUXAwQSBfRsJQAAAe1JREFUOMtjYBgW4O6RwwcMz12kjVcFn1AJ1dnsITwX6xbl5m4EqVDWVYYoYGB3au8JsjXhhSlgZGAJCLU10GZiADJ4nHojI5kYgIpY3FlgCvgig/3dnQTBbJhNTmyMDHJXrwWp2kRHmShJCoIVcEVzQRTwCbNc4PWTkJCQZQcrkLzBw8DIwAN0nKS3oDRIAS9YgZiIEgeHvNxNYSEuLm5pXrAY93V+CXYGDkYePilpqQApKakACQYI4IlO9mYQYBHk5uYTFBQSAwIRCDATYOKOMxWHKGDlE8jJy8srKMwvLKqu4kRSwMXAZSoF9AIrTF0+QFpaWlqaAFgBDwOPcjQOBdnJzg4OYAXscbwMvOLF2BTwZSXq6lpVdHZm2cTEV9QAdTAwCHmxsEAVMAtyNLc2NdTX17c0NNjYiYFiw8nCGyzGwMzRkp+Wk52Tk5+blpYdJgx0AQNDUJo4LxODyI0FB/LC3WBxPykGGJC+oKfKwCwiofzUVl2N20UcqoBZPM9QkFncA6KA10ldXf22h7w4zAeykRJABRya0poQBfHaILe42EIUsDNwxklDEyhQwUBulroCPzMDAwsw1otKsUCT6TUzC05jIS4GBobbi5iZia+VfgCmVebrfCduSmEU9gEA/V/VC77XazQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDUtMjNUMDM6MDQ6MTgrMDA6MDCX8WdMAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA1LTIzVDAzOjA0OjE4KzAwOjAw5qzf8AAAAABJRU5ErkJggg==";
  
  // 创建一个link元素，设置为favicon
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconData;
  
  // 移除任何现有的favicon
  const oldLinks = document.querySelectorAll('link[rel*="icon"]');
  oldLinks.forEach(e => e.parentNode.removeChild(e));
  
  // 添加新的favicon
  document.getElementsByTagName('head')[0].appendChild(link);
  
  // 强制浏览器更新favicon
  const favicon = document.querySelector('link[rel="shortcut icon"]');
  if (favicon) {
    // 通过修改href属性的方式强制刷新
    favicon.href = favicon.href + '?' + new Date().getTime();
  }
  
  console.log("Favicon has been added to the page.");

  // 监听页面加载完成事件，确保favicon保持设置
  window.addEventListener('load', function() {
    setTimeout(function() {
      // 再次检查并确保favicon存在
      if (!document.querySelector('link[rel*="icon"]')) {
        document.getElementsByTagName('head')[0].appendChild(link.cloneNode(true));
        console.log("Favicon re-added after page load");
      }
    }, 500);
  });
}); 