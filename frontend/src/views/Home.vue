<template>
  <div class="home">
    <Header />
    
    <HomeBanner />
    
    <PlatformFeatures />
    
    <PopularTasks />
    
    <PlatformProcess />
    
    <PlatformStats />
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HomeBanner from './home/components/HomeBanner.vue'
import PlatformFeatures from './home/components/PlatformFeatures.vue'
import PopularTasks from './home/components/PopularTasks.vue'
import PlatformProcess from './home/components/PlatformProcess.vue'
import PlatformStats from './home/components/PlatformStats.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    HomeBanner,
    PlatformFeatures,
    PopularTasks,
    PlatformProcess,
    PlatformStats
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  
  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
  }
  
  .section-desc {
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
}

.how-it-works {
  padding: 80px 0;
  background-color: #fff;
  
  .steps-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
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
      background-color: #f8f8f8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: #ff2c55;
      font-size: 3rem;
      
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
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }
    
    .step-desc {
      font-size: 0.95rem;
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

.data-section {
  padding: 60px 0;
  background-color: #ff2c55;
  
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
      font-size: 3rem;
      margin-bottom: 15px;
    }
    
    .data-number {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .data-title {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 992px) {
  .data-grid {
    justify-content: center;
  }
  
  .data-item {
    flex: 0 0 45%;
  }
}

@media (max-width: 576px) {
  .data-item {
    flex: 0 0 100%;
  }
}
</style> 