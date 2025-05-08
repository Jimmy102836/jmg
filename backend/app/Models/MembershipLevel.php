<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipLevel extends Model
{
    use HasFactory;

    /**
     * 可以批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'name',           // 等级名称
        'level',          // 等级数值 
        'icon',           // 等级图标
        'required_points', // 所需积分
        'description',    // 等级描述
        'status',         // 状态：0-禁用，1-启用
    ];

    /**
     * 该等级拥有的权益
     */
    public function benefits()
    {
        return $this->hasMany(MembershipBenefit::class);
    }

    /**
     * 拥有该等级的用户
     */
    public function users()
    {
        return $this->hasMany(UserMembership::class);
    }
} 