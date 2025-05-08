<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipBenefit extends Model
{
    use HasFactory;

    /**
     * 可以批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'membership_level_id',  // 所属会员等级ID
        'name',                 // 权益名称
        'type',                 // 权益类型：1-任务接单数量，2-佣金比例，3-提现速度，4-其他
        'value',                // 权益值
        'description',          // 权益描述
        'status',               // 状态：0-禁用，1-启用
        'icon',                 // 权益图标
    ];

    /**
     * 该权益所属的会员等级
     */
    public function membershipLevel()
    {
        return $this->belongsTo(MembershipLevel::class);
    }
} 