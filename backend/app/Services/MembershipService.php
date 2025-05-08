<?php

namespace App\Services;

use App\Models\User;
use App\Models\MembershipLevel;
use App\Models\UserMembership;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MembershipService
{
    /**
     * 获取用户当前会员信息
     *
     * @param int $userId
     * @return UserMembership|null
     */
    public function getUserMembership(int $userId)
    {
        return UserMembership::with('membershipLevel', 'membershipLevel.benefits')
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * 初始化用户会员等级
     *
     * @param int $userId
     * @return UserMembership
     */
    public function initUserMembership(int $userId)
    {
        // 获取默认等级（最低等级）
        $defaultLevel = MembershipLevel::orderBy('level', 'asc')->first();
        
        if (!$defaultLevel) {
            throw new \Exception('会员等级数据不存在');
        }

        // 创建用户会员关系
        return UserMembership::create([
            'user_id' => $userId,
            'membership_level_id' => $defaultLevel->id,
            'points' => 0,
            'expire_at' => null, // 默认不设置过期时间
            'upgrade_history' => json_encode([
                [
                    'level_id' => $defaultLevel->id,
                    'level_name' => $defaultLevel->name,
                    'upgrade_time' => now()->toDateTimeString(),
                    'reason' => '新用户初始化'
                ]
            ]),
            'is_auto_renew' => false
        ]);
    }

    /**
     * 升级用户会员等级
     *
     * @param int $userId
     * @param int $targetLevelId
     * @param string $reason
     * @return UserMembership
     */
    public function upgradeUserMembership(int $userId, int $targetLevelId, string $reason = '积分升级')
    {
        $userMembership = $this->getUserMembership($userId);
        
        if (!$userMembership) {
            throw new \Exception('用户会员信息不存在');
        }
        
        $targetLevel = MembershipLevel::findOrFail($targetLevelId);
        
        // 确保是升级而不是降级
        if ($targetLevel->level <= $userMembership->membershipLevel->level) {
            throw new \Exception('无法升级到较低或相同等级');
        }
        
        // 确保用户积分足够
        if ($userMembership->points < $targetLevel->required_points) {
            throw new \Exception('用户积分不足以升级到该等级');
        }

        // 升级历史
        $upgradeHistory = $userMembership->upgrade_history ?? [];
        $upgradeHistory[] = [
            'level_id' => $targetLevel->id,
            'level_name' => $targetLevel->name,
            'upgrade_time' => now()->toDateTimeString(),
            'reason' => $reason
        ];

        // 更新用户会员等级
        $userMembership->membership_level_id = $targetLevel->id;
        $userMembership->upgrade_history = $upgradeHistory;
        $userMembership->save();
        
        return $userMembership->fresh(['membershipLevel', 'membershipLevel.benefits']);
    }

    /**
     * 增加用户积分
     *
     * @param int $userId
     * @param int $points
     * @param string $reason
     * @return UserMembership
     */
    public function addUserPoints(int $userId, int $points, string $reason = '任务完成')
    {
        $userMembership = $this->getUserMembership($userId);
        
        if (!$userMembership) {
            throw new \Exception('用户会员信息不存在');
        }
        
        DB::beginTransaction();
        try {
            // 增加积分
            $userMembership->points += $points;
            $userMembership->save();
            
            // TODO: 记录积分变动历史（可以另外建表）
            
            // 检查是否可以自动升级
            $this->checkAndAutoUpgrade($userMembership);
            
            DB::commit();
            return $userMembership->fresh(['membershipLevel', 'membershipLevel.benefits']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * 检查并自动升级
     *
     * @param UserMembership $userMembership
     * @return void
     */
    protected function checkAndAutoUpgrade(UserMembership $userMembership)
    {
        // 获取下一级别
        $nextLevel = MembershipLevel::where('level', '>', $userMembership->membershipLevel->level)
            ->orderBy('level', 'asc')
            ->first();
            
        // 如果有下一级别且积分足够
        if ($nextLevel && $userMembership->points >= $nextLevel->required_points) {
            // 升级用户
            $userMembership->membership_level_id = $nextLevel->id;
            
            // 更新升级历史
            $upgradeHistory = $userMembership->upgrade_history ?? [];
            $upgradeHistory[] = [
                'level_id' => $nextLevel->id,
                'level_name' => $nextLevel->name,
                'upgrade_time' => now()->toDateTimeString(),
                'reason' => '积分自动升级'
            ];
            
            $userMembership->upgrade_history = $upgradeHistory;
            $userMembership->save();
        }
    }

    /**
     * 设置会员到期时间
     *
     * @param int $userId
     * @param \DateTime $expireDate
     * @return UserMembership
     */
    public function setMembershipExpireDate(int $userId, \DateTime $expireDate)
    {
        $userMembership = $this->getUserMembership($userId);
        
        if (!$userMembership) {
            throw new \Exception('用户会员信息不存在');
        }
        
        $userMembership->expire_at = $expireDate;
        $userMembership->save();
        
        return $userMembership;
    }

    /**
     * 检查会员权益
     *
     * @param int $userId
     * @param int $benefitType
     * @return mixed 返回对应权益的值
     */
    public function checkUserBenefit(int $userId, int $benefitType)
    {
        $userMembership = $this->getUserMembership($userId);
        
        if (!$userMembership) {
            throw new \Exception('用户会员信息不存在');
        }
        
        // 检查会员是否已过期
        if ($userMembership->isExpired()) {
            // 如果过期，降级到默认等级
            $defaultLevel = MembershipLevel::orderBy('level', 'asc')->first();
            $userMembership->membership_level_id = $defaultLevel->id;
            $userMembership->save();
            
            // 重新加载关系
            $userMembership->load(['membershipLevel', 'membershipLevel.benefits']);
        }
        
        // 获取对应类型的权益
        $benefit = $userMembership->membershipLevel->benefits()
            ->where('type', $benefitType)
            ->where('status', true)
            ->first();
            
        return $benefit ? $benefit->value : null;
    }
} 