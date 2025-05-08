<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'materials';

    /**
     * 可批量赋值的属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'material_type',
        'title',
        'file_path',
        'file_size',
        'file_ext',
        'content',
        'duration',
        'width',
        'height',
        'status',
    ];

    /**
     * 自动类型转换的属性
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'material_type' => 'integer',
        'file_size' => 'integer',
        'duration' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'status' => 'integer',
    ];

    /**
     * 素材类型常量
     */
    const TYPE_IMAGE = 1;  // 图片
    const TYPE_VIDEO = 2;  // 视频
    const TYPE_TEXT = 3;   // 文本

    /**
     * 素材状态常量
     */
    const STATUS_PENDING = 0;   // 待审核
    const STATUS_NORMAL = 1;    // 正常
    const STATUS_REJECTED = 2;  // 已驳回

    /**
     * 获取上传该素材的用户
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 获取关联的任务
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'material_task_relation', 'material_id', 'task_id')
            ->withTimestamps();
    }
} 