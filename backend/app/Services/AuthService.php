<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserAccount;
use App\Models\UserMembership;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * 创建新用户
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    public function createUser(array $data)
    {
        DB::beginTransaction();
        
        try {
            // 创建用户
            $user = User::create([
                'username' => $data['username'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'password' => Hash::make($data['password']),
                'status' => User::STATUS_NORMAL,
                'user_type' => $data['user_type'],
                'reg_ip' => request()->ip(),
                'last_login_time' => Carbon::now(),
                'last_login_ip' => request()->ip(),
            ]);
            
            // 创建用户资料
            if (isset($data['profile'])) {
                $profileData = $data['profile'];
                $profileData['user_id'] = $user->id;
                UserProfile::create($profileData);
            } else {
                UserProfile::create([
                    'user_id' => $user->id,
                    'gender' => UserProfile::GENDER_UNKNOWN,
                ]);
            }
            
            // 创建用户账户
            UserAccount::create([
                'user_id' => $user->id,
                'balance' => 0,
                'total_income' => 0,
                'total_withdraw' => 0,
                'frozen_amount' => 0,
            ]);
            
            // 创建用户会员信息（默认为初级会员）
            UserMembership::create([
                'user_id' => $user->id,
                'level_id' => 1,
                'points' => 0,
            ]);
            
            // 分配初始角色
            switch ($data['user_type']) {
                case User::USER_TYPE_MERCHANT:
                    $user->assignRole('merchant');
                    break;
                case User::USER_TYPE_TALENT:
                    $user->assignRole('talent');
                    break;
                case User::USER_TYPE_NORMAL:
                    $user->assignRole('user');
                    break;
            }
            
            DB::commit();
            
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * 通过凭证查找用户
     *
     * @param  string  $credential
     * @return \App\Models\User|null
     */
    public function findUserByCredentials($credential)
    {
        return User::where('username', $credential)
            ->orWhere('phone', $credential)
            ->orWhere('email', $credential)
            ->first();
    }
    
    /**
     * 更新用户登录信息
     *
     * @param  \App\Models\User  $user
     * @param  string  $ip
     * @return void
     */
    public function updateLoginInfo(User $user, $ip)
    {
        $user->update([
            'last_login_time' => Carbon::now(),
            'last_login_ip' => $ip,
        ]);
    }
    
    /**
     * 重置用户密码
     *
     * @param  string  $phone
     * @param  string  $password
     * @return void
     */
    public function resetPassword($phone, $password)
    {
        $user = User::where('phone', $phone)->firstOrFail();
        $user->update([
            'password' => Hash::make($password),
        ]);
    }
} 