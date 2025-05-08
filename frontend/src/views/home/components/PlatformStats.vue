<template>
  <div class="platform-stats">
    <div class="container">
      <div class="data-grid">
        <div class="data-item">
          <div class="data-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="data-number">500,000+</div>
          <div class="data-title">注册达人</div>
        </div>
        
        <div class="data-item">
          <div class="data-icon">
            <i class="el-icon-suitcase"></i>
          </div>
          <div class="data-number">10,000+</div>
          <div class="data-title">入驻商家</div>
        </div>
        
        <div class="data-item">
          <div class="data-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="data-number">50,000+</div>
          <div class="data-title">成功任务</div>
        </div>
        
        <div class="data-item">
          <div class="data-icon">
            <i class="el-icon-money"></i>
          </div>
          <div class="data-number">1亿+</div>
          <div class="data-title">带货销售额</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformStats'
}
</script>

<style lang="scss" scoped>
.platform-stats {
  padding: 60px 0;
  background-color: #ff2c55;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .data-grid {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .data-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    min-width: 200px;
    margin: 0 15px;
    margin-bottom: 30px;
    
    .data-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      font-size: 28px;
    }
    
    .data-number {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .data-title {
      font-size: 16px;
      opacity: 0.9;
    }
  }
  
  @media (max-width: 768px) {
    .data-grid {
      flex-direction: column;
      align-items: center;
    }
    
    .data-item {
      width: 100%;
      max-width: 300px;
      margin-bottom: 40px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style> 