<?php

namespace App\Http\Controllers;

use App\Models\MembershipLevel;
use App\Models\MembershipBenefit;
use App\Models\UserMembership;
use App\Services\MembershipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MembershipController extends Controller
{
    protected $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
        $this->middleware('auth:sanctum');
    }

    /**
     * 获取所有会员等级及权益
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllLevels()
    {
        $levels = MembershipLevel::with('benefits')
            ->where('status', true)
            ->orderBy('level', 'asc')
            ->get();
            
        return response()->json([
            'code' => 200,
            'message' => '获取成功',
            'data' => $levels
        ]);
    }

    /**
     * 获取用户当前会员信息
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserMembership()
    {
        $userId = Auth::id();
        
        try {
            $userMembership = $this->membershipService->getUserMembership($userId);
            
            if (!$userMembership) {
                // 如果不存在，初始化用户会员信息
                $userMembership = $this->membershipService->initUserMembership($userId);
            }
            
            return response()->json([
                'code' => 200,
                'message' => '获取成功',
                'data' => $userMembership
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => '获取失败: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 升级会员等级
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function upgradeMembership(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_level_id' => 'required|integer|exists:membership_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => '参数错误',
                'errors' => $validator->errors()
            ], 400);
        }

        $userId = Auth::id();
        $targetLevelId = $request->input('target_level_id');
        
        try {
            $userMembership = $this->membershipService->upgradeUserMembership(
                $userId, 
                $targetLevelId, 
                '手动升级'
            );
            
            return response()->json([
                'code' => 200,
                'message' => '升级成功',
                'data' => $userMembership
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 400,
                'message' => '升级失败: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * 增加用户积分
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addPoints(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'points' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => '参数错误',
                'errors' => $validator->errors()
            ], 400);
        }

        $userId = Auth::id();
        $points = $request->input('points');
        $reason = $request->input('reason', '积分奖励');
        
        try {
            $userMembership = $this->membershipService->addUserPoints($userId, $points, $reason);
            
            return response()->json([
                'code' => 200,
                'message' => "成功增加{$points}积分",
                'data' => $userMembership
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => '增加积分失败: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 检查特定权益
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkBenefit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'benefit_type' => 'required|integer|min:1|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => '参数错误',
                'errors' => $validator->errors()
            ], 400);
        }

        $userId = Auth::id();
        $benefitType = $request->input('benefit_type');
        
        try {
            $benefitValue = $this->membershipService->checkUserBenefit($userId, $benefitType);
            
            return response()->json([
                'code' => 200,
                'message' => '获取成功',
                'data' => [
                    'benefit_type' => $benefitType,
                    'benefit_value' => $benefitValue
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => '获取权益失败: ' . $e->getMessage()
            ], 500);
        }
    }
} 