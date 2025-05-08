/**
 * 素材管理模拟数据
 */
export const mockMaterials = [
  {
    id: 1,
    title: '夏季新品展示图1',
    materialType: '1', // 1: 图片, 2: 视频, 3: 文本
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://via.placeholder.com/800x600',
    fileSize: 1024 * 512, // 512KB
    userName: '优衣库旗舰店',
    status: 'approved',
    createTime: '2023-06-01 10:30:15'
  },
  {
    id: 2,
    title: '夏季新品宣传视频',
    materialType: '2', // 视频
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://www.w3schools.com/html/mov_bbb.mp4',
    fileSize: 1024 * 1024 * 5, // 5MB
    userName: '优衣库旗舰店',
    status: 'approved',
    createTime: '2023-06-02 15:22:10'
  },
  {
    id: 3,
    title: '新品文案',
    materialType: '3', // 文本
    content: '这款夏季新品采用透气面料，舒适透气，适合各种夏季户外活动。多种颜色可选，时尚百搭。',
    userName: '优衣库旗舰店',
    status: 'approved',
    createTime: '2023-06-03 09:15:20'
  },
  {
    id: 4,
    title: '美妆产品展示图',
    materialType: '1', // 图片
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://via.placeholder.com/800x600',
    fileSize: 1024 * 320, // 320KB
    userName: '花西子官方',
    status: 'approved',
    createTime: '2023-06-05 11:30:45'
  },
  {
    id: 5,
    title: '美妆产品使用教程',
    materialType: '2', // 视频
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://www.w3schools.com/html/mov_bbb.mp4',
    fileSize: 1024 * 1024 * 10, // 10MB
    userName: '花西子官方',
    status: 'pending',
    createTime: '2023-06-06 14:08:30'
  },
  {
    id: 6,
    title: '数码产品细节图',
    materialType: '1', // 图片
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://via.placeholder.com/800x600',
    fileSize: 1024 * 480, // 480KB
    userName: '科技数码专营店',
    status: 'rejected',
    createTime: '2023-06-07 16:40:12'
  },
  {
    id: 7,
    title: '数码产品开箱视频',
    materialType: '2', // 视频
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://www.w3schools.com/html/mov_bbb.mp4',
    fileSize: 1024 * 1024 * 8, // 8MB
    userName: '科技数码专营店',
    status: 'approved',
    createTime: '2023-06-08 10:22:33'
  },
  {
    id: 8,
    title: '零食产品详情',
    materialType: '1', // 图片
    thumbnail: 'https://via.placeholder.com/300x200',
    filePath: 'https://via.placeholder.com/800x600',
    fileSize: 1024 * 350, // 350KB
    userName: '三只松鼠旗舰店',
    status: 'approved',
    createTime: '2023-06-09 09:05:18'
  }
]; 