<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * 与模型关联的表名
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * 可批量赋值的属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'phone',
        'email',
        'password',
        'avatar',
        'status',
        'user_type',
        'reg_ip',
        'last_login_time',
        'last_login_ip',
    ];

    /**
     * 隐藏的属性
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * 自动类型转换的属性
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_time' => 'datetime',
        'status' => 'integer',
        'user_type' => 'integer',
    ];

    /**
     * 用户类型常量
     */
    const USER_TYPE_MERCHANT = 1; // 商家
    const USER_TYPE_TALENT = 2;   // 达人
    const USER_TYPE_NORMAL = 3;   // 普通用户

    /**
     * 用户状态常量
     */
    const STATUS_DISABLED = 0;    // 禁用
    const STATUS_NORMAL = 1;      // 正常
    const STATUS_FROZEN = 2;      // 冻结

    /**
     * 获取用户资料关联
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * 获取用户账户关联
     */
    public function account()
    {
        return $this->hasOne(UserAccount::class);
    }

    /**
     * 获取用户会员关联
     */
    public function membership()
    {
        return $this->hasOne(UserMembership::class);
    }

    /**
     * 获取用户发布的任务
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'merchant_id');
    }

    /**
     * 获取用户申请的任务
     */
    public function taskApplications()
    {
        return $this->hasMany(TaskApplication::class);
    }

    /**
     * 获取用户上传的素材
     */
    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    /**
     * 获取用户结算记录
     */
    public function settlements()
    {
        return $this->hasMany(Settlement::class);
    }

    /**
     * 获取用户提现记录
     */
    public function withdrawals()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }
} 