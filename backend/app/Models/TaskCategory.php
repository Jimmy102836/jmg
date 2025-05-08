<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCategory extends Model
{
    use HasFactory;

    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'task_categories';

    /**
     * 可批量赋值的属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'icon',
        'sort',
    ];

    /**
     * 自动类型转换的属性
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sort' => 'integer',
    ];

    /**
     * 获取属于该分类的任务
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'category_id');
    }
} 