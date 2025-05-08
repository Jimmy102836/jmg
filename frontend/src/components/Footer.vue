<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-section">
          <h3 class="footer-title">关于我们</h3>
          <ul class="footer-links">
            <li><router-link to="/about">公司简介</router-link></li>
            <li><router-link to="/team">团队介绍</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
            <li><router-link to="/join">加入我们</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">商家服务</h3>
          <ul class="footer-links">
            <li><router-link to="/merchant/register">商家入驻</router-link></li>
            <li><router-link to="/merchant/help">商家帮助</router-link></li>
            <li><router-link to="/merchant/rules">规则中心</router-link></li>
            <li><router-link to="/merchant/fee">收费标准</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">达人服务</h3>
          <ul class="footer-links">
            <li><router-link to="/talent/register">达人入驻</router-link></li>
            <li><router-link to="/talent/help">达人帮助</router-link></li>
            <li><router-link to="/talent/rules">规则中心</router-link></li>
            <li><router-link to="/talent/settlement">结算说明</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">客户服务</h3>
          <ul class="footer-links">
            <li><a href="tel:400-123-4567">客服电话：400-123-4567</a></li>
            <li><a href="mailto:support@douyintz.com">客服邮箱：support@douyintz.com</a></li>
            <li>客服时间：9:00-22:00</li>
          </ul>
          <div class="social-media">
            <a href="#" class="social-link" title="微信">
              <i class="el-icon-wechat"></i>
            </a>
            <a href="#" class="social-link" title="微博">
              <i class="el-icon-s-promotion"></i>
            </a>
            <a href="#" class="social-link" title="抖音">
              <i class="el-icon-video-camera"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} 抖音团长平台 版权所有 | 苏ICP备12345678号-1
        </div>
        <div class="policy-links">
          <router-link to="/privacy">隐私政策</router-link>
          <router-link to="/terms">用户协议</router-link>
          <router-link to="/copyright">版权声明</router-link>
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
  background-color: #f8f8f8;
  padding: 50px 0 20px;
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
  
  .footer-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 10px;
      
      a {
        color: #666;
        text-decoration: none;
        transition: color 0.3s;
        font-size: 14px;
        
        &:hover {
          color: #ff2c55;
        }
      }
    }
  }
}

.social-media {
  display: flex;
  margin-top: 15px;
  
  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #e0e0e0;
    border-radius: 50%;
    margin-right: 10px;
    color: #666;
    transition: all 0.3s;
    
    &:hover {
      background-color: #ff2c55;
      color: #fff;
    }
  }
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #999;
  
  .policy-links {
    a {
      color: #999;
      text-decoration: none;
      margin-left: 15px;
      transition: color 0.3s;
      
      &:hover {
        color: #ff2c55;
      }
    }
  }
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
  }
  
  .footer-section {
    margin-bottom: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    
    .copyright {
      margin-bottom: 10px;
    }
    
    .policy-links {
      a {
        margin: 0 8px;
      }
    }
  }
}
</style> 