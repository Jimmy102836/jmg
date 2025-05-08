<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'user_profiles';

    /**
     * 可批量赋值的属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'real_name',
        'gender',
        'birthday',
        'bio',
        'province',
        'city',
        'district',
        'address',
        'id_card',
        'id_card_front',
        'id_card_back',
    ];

    /**
     * 自动类型转换的属性
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birthday' => 'date',
        'gender' => 'integer',
    ];

    /**
     * 性别常量
     */
    const GENDER_UNKNOWN = 0; // 未知
    const GENDER_MALE = 1;    // 男
    const GENDER_FEMALE = 2;  // 女

    /**
     * 获取关联的用户
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 