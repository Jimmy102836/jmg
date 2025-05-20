<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-logo">
          <img src="../assets/images/logo/logo.jpg" alt="吉米哥达人任务平台" class="logo-img">
          <div class="logo-text">
            <div class="logo-name">吉米哥达人任务平台</div>
            <div class="logo-desc">连接商家与创作者的桥梁</div>
          </div>
        </div>
        
        <div class="footer-contact">
          <div class="contact-item">
            <i class="el-icon-phone"></i>
            <div class="contact-info">
              <div class="contact-label">客服热线</div>
              <div class="contact-value">400-123-4567</div>
            </div>
          </div>
          <div class="contact-item">
            <i class="el-icon-message"></i>
            <div class="contact-info">
              <div class="contact-label">商务合作</div>
              <div class="contact-value">business@jmgdaren.com</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4 class="group-title">平台服务</h4>
          <ul class="group-list">
            <li><router-link to="/about">关于我们</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
            <li><router-link to="/join">加入我们</router-link></li>
            <li><router-link to="/help">帮助中心</router-link></li>
          </ul>
        </div>
        
        <div class="link-group">
          <h4 class="group-title">商家服务</h4>
          <ul class="group-list">
            <li><router-link to="/merchant/register">商家入驻</router-link></li>
            <li><router-link to="/merchant/help">商家帮助</router-link></li>
            <li><router-link to="/merchant/rules">规则中心</router-link></li>
            <li><router-link to="/merchant/fee">收费标准</router-link></li>
          </ul>
        </div>
        
        <div class="link-group">
          <h4 class="group-title">达人服务</h4>
          <ul class="group-list">
            <li><router-link to="/talent/register">达人入驻</router-link></li>
            <li><router-link to="/talent/help">达人帮助</router-link></li>
            <li><router-link to="/talent/rules">规则中心</router-link></li>
            <li><router-link to="/talent/settlement">结算说明</router-link></li>
          </ul>
        </div>
        
        <div class="link-group">
          <h4 class="group-title">热门频道</h4>
          <ul class="group-list">
            <li><router-link to="/channel/beauty">美妆个护</router-link></li>
            <li><router-link to="/channel/fashion">服装鞋包</router-link></li>
            <li><router-link to="/channel/food">食品零食</router-link></li>
            <li><router-link to="/channel/digital">数码家电</router-link></li>
          </ul>
        </div>
        
        <div class="link-group qrcode-group">
          <h4 class="group-title">关注我们</h4>
          <div class="qrcode-items">
            <div class="qrcode-item">
              <img src="../assets/images/qrcode/qrcode-placeholder.svg" alt="公众号二维码">
              <p>关注公众号</p>
            </div>
            <div class="qrcode-item">
              <img src="../assets/images/qrcode/qrcode-placeholder.svg" alt="小程序二维码">
              <p>打开小程序</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="bottom-left">
          <div class="copyright">
            &copy; {{ currentYear }} 吉米哥达人任务平台 版权所有 | 苏ICP备12345678号-1
          </div>
        </div>
        <div class="bottom-right">
          <div class="bottom-links">
            <router-link to="/privacy">隐私政策</router-link>
            <router-link to="/terms">用户协议</router-link>
            <router-link to="/copyright">版权声明</router-link>
            <router-link to="/safety">平台安全</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    return {
      currentYear
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: #fff;
  padding: 40px 0 20px;
  color: #666;
  border-top: 1px solid #f0f0f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  .footer-logo {
    display: flex;
    align-items: center;
    
    .logo-img {
      height: 40px;
      width: auto;
      margin-right: 15px;
    }
    
    .logo-text {
      .logo-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        line-height: 1.4;
      }
      
      .logo-desc {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .footer-contact {
    display: flex;
    gap: 30px;
    
    .contact-item {
      display: flex;
      align-items: center;
      
      i {
        font-size: 24px;
        color: #ff2c55;
        margin-right: 10px;
      }
      
      .contact-info {
        .contact-label {
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
        }
        
        .contact-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
  
  .link-group {
    width: 20%;
    padding-right: 20px;
    margin-bottom: 20px;
    
    &.qrcode-group {
      .qrcode-items {
        display: flex;
        gap: 20px;
        
        .qrcode-item {
          text-align: center;
          
          img {
            width: 80px;
            height: 80px;
            margin-bottom: 8px;
          }
          
          p {
            font-size: 12px;
            color: #999;
            margin: 0;
          }
        }
      }
    }
    
    .group-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
    }
    
    .group-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 10px;
        
        a {
          font-size: 12px;
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
          
          &:hover {
            color: #ff2c55;
          }
        }
      }
    }
  }
}

.footer-bottom {
  border-top: 1px solid #f5f5f5;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  
  .copyright {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }
  
  .bottom-links {
    display: flex;
    flex-wrap: wrap;
    
    a {
      font-size: 12px;
      color: #666;
      text-decoration: none;
      margin-left: 15px;
      transition: color 0.3s;
      
      &:hover {
        color: #ff2c55;
      }
    }
  }
}

@media (max-width: 992px) {
  .footer-links {
    .link-group {
      width: 33.33%;
      
      &.qrcode-group {
        width: 100%;
        margin-top: 20px;
        
        .qrcode-items {
          justify-content: center;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
    
    .footer-logo {
      margin-bottom: 20px;
    }
    
    .footer-contact {
      width: 100%;
      flex-direction: column;
      gap: 15px;
    }
  }
  
  .footer-links {
    .link-group {
      width: 50%;
    }
  }
  
  .footer-bottom {
    flex-direction: column;
    
    .bottom-links {
      margin-top: 10px;
      
      a {
        margin-left: 0;
        margin-right: 15px;
        margin-bottom: 5px;
      }
    }
  }
}

@media (max-width: 576px) {
  .footer-links {
    .link-group {
      width: 100%;
    }
  }
}
</style> 