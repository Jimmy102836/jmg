<template>
  <div class="platform-process">
    <div class="section-title">
      <h2>平台运作流程</h2>
      <p>简单三步，开启抖音电商带货之旅</p>
    </div>
    
    <div class="steps-container">
      <div class="step-item">
        <div class="step-icon">
          <i class="el-icon-edit"></i>
          <div class="step-number">1</div>
        </div>
        <h3 class="step-title">发布任务</h3>
        <p class="step-desc">商家发布带货任务，设置预算、要求和素材</p>
      </div>
      
      <div class="step-arrow">
        <i class="el-icon-arrow-right"></i>
      </div>
      
      <div class="step-item">
        <div class="step-icon">
          <i class="el-icon-user"></i>
          <div class="step-number">2</div>
        </div>
        <h3 class="step-title">达人申请</h3>
        <p class="step-desc">优质达人申请任务，双方确认合作关系</p>
      </div>
      
      <div class="step-arrow">
        <i class="el-icon-arrow-right"></i>
      </div>
      
      <div class="step-item">
        <div class="step-icon">
          <i class="el-icon-video-camera"></i>
          <div class="step-number">3</div>
        </div>
        <h3 class="step-title">任务执行</h3>
        <p class="step-desc">达人制作内容，发布推广，完成带货任务</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformProcess'
}
</script>

<style lang="scss" scoped>
.platform-process {
  padding: 60px 0;
  background-color: #f9f9f9;
  
  .section-title {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 32px;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
  .steps-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 240px;
    margin: 0 15px;
    
    .step-icon {
      position: relative;
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: #ff2c55;
      font-size: 3rem;
      box-shadow: 0 5px 15px rgba(255, 44, 85, 0.1);
      
      .step-number {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        background-color: #ff2c55;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 700;
      }
    }
    
    .step-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }
    
    .step-desc {
      font-size: 14px;
      color: #666;
      text-align: center;
      line-height: 1.5;
    }
  }
  
  .step-arrow {
    color: #ddd;
    font-size: 2rem;
    margin: 0 10px;
    
    @media (max-width: 768px) {
      transform: rotate(90deg);
      margin: 20px 0;
    }
  }
  
  @media (max-width: 768px) {
    .steps-container {
      flex-direction: column;
    }
    
    .step-item {
      margin-bottom: 30px;
    }
  }
}
</style> 