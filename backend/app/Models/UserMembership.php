<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMembership extends Model
{
    use HasFactory;

    /**
     * 可以批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'user_id',                // 用户ID
        'membership_level_id',    // 会员等级ID
        'points',                 // 用户积分
        'expire_at',              // 会员到期时间
        'upgrade_history',        // 升级历史记录（JSON格式）
        'is_auto_renew',          // 是否自动续费
    ];

    /**
     * 需要进行类型转换的属性
     *
     * @var array
     */
    protected $casts = [
        'expire_at' => 'datetime',
        'upgrade_history' => 'array',
        'is_auto_renew' => 'boolean',
    ];

    /**
     * 该会员关系所属的用户
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 该会员关系对应的会员等级
     */
    public function membershipLevel()
    {
        return $this->belongsTo(MembershipLevel::class);
    }

    /**
     * 判断会员是否已过期
     *
     * @return bool
     */
    public function isExpired()
    {
        return $this->expire_at !== null && now()->greaterThan($this->expire_at);
    }

    /**
     * 判断用户是否可以升级到下一等级
     *
     * @return bool
     */
    public function canUpgrade()
    {
        $nextLevel = MembershipLevel::where('level', '>', $this->membershipLevel->level)
            ->orderBy('level', 'asc')
            ->first();
            
        return $nextLevel && $this->points >= $nextLevel->required_points;
    }
} 