<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'tasks';

    /**
     * 可批量赋值的属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'merchant_id',
        'title',
        'description',
        'category_id',
        'task_type',
        'budget',
        'unit_price',
        'total_count',
        'apply_count',
        'complete_count',
        'start_time',
        'end_time',
        'status',
        'priority',
    ];

    /**
     * 自动类型转换的属性
     *
     * @var array<string, string>
     */
    protected $casts = [
        'merchant_id' => 'integer',
        'category_id' => 'integer',
        'task_type' => 'integer',
        'budget' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_count' => 'integer',
        'apply_count' => 'integer',
        'complete_count' => 'integer',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'status' => 'integer',
        'priority' => 'integer',
    ];

    /**
     * 任务类型常量
     */
    const TASK_TYPE_SHORT_VIDEO = 1; // 短视频
    const TASK_TYPE_LIVE = 2;        // 直播
    const TASK_TYPE_ARTICLE = 3;     // 图文

    /**
     * 任务状态常量
     */
    const STATUS_DRAFT = 0;      // 草稿
    const STATUS_REVIEWING = 1;  // 审核中
    const STATUS_ONGOING = 2;    // 进行中
    const STATUS_COMPLETED = 3;  // 已完成
    const STATUS_CANCELLED = 4;  // 已取消

    /**
     * 获取任务所属商家
     */
    public function merchant()
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }

    /**
     * 获取任务分类
     */
    public function category()
    {
        return $this->belongsTo(TaskCategory::class);
    }

    /**
     * 获取任务要求
     */
    public function requirements()
    {
        return $this->hasOne(TaskRequirement::class);
    }

    /**
     * 获取任务申请
     */
    public function applications()
    {
        return $this->hasMany(TaskApplication::class);
    }

    /**
     * 获取任务状态记录
     */
    public function statusLogs()
    {
        return $this->hasMany(TaskStatus::class);
    }

    /**
     * 获取任务关联的素材
     */
    public function materials()
    {
        return $this->belongsToMany(Material::class, 'material_task_relation', 'task_id', 'material_id')
            ->withTimestamps();
    }

    /**
     * 获取任务统计数据
     */
    public function statistics()
    {
        return $this->hasOne(TaskStatistic::class);
    }

    /**
     * 获取任务推广记录
     */
    public function promotionRecords()
    {
        return $this->hasMany(PromotionRecord::class);
    }

    /**
     * 获取任务结算记录
     */
    public function settlements()
    {
        return $this->hasMany(Settlement::class);
    }
} 