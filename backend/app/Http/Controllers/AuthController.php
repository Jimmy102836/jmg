<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authService;
    protected $smsService;

    /**
     * 构造函数
     */
    public function __construct(AuthService $authService, SmsService $smsService)
    {
        $this->authService = $authService;
        $this->smsService = $smsService;
    }

    /**
     * 用户注册
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // 验证请求
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:20|unique:users',
            'phone' => 'required|string|size:11|unique:users',
            'email' => 'nullable|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'user_type' => 'required|integer|in:1,2,3',
            'verification_code' => 'required|string|size:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => $validator->errors()->first(),
                'data' => null
            ], 422);
        }

        // 校验短信验证码
        $verifyResult = $this->smsService->verifyCode($request->phone, $request->verification_code, 'register');
        if (!$verifyResult) {
            return response()->json([
                'code' => 400,
                'message' => '验证码错误或已过期',
                'data' => null
            ], 400);
        }

        // 创建用户
        $user = $this->authService->createUser($request->all());

        // 生成token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'code' => 200,
            'message' => '注册成功',
            'data' => [
                'token' => $token,
                'user' => $user
            ]
        ]);
    }

    /**
     * 用户登录
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // 验证请求
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => $validator->errors()->first(),
                'data' => null
            ], 422);
        }

        // 查找用户
        $user = $this->authService->findUserByCredentials($request->username);
        
        // 验证用户是否存在以及密码是否正确
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'code' => 401,
                'message' => '用户名或密码错误',
                'data' => null
            ], 401);
        }

        // 检查用户状态
        if ($user->status !== User::STATUS_NORMAL) {
            return response()->json([
                'code' => 403,
                'message' => '账号异常，请联系管理员',
                'data' => null
            ], 403);
        }

        // 更新登录信息
        $this->authService->updateLoginInfo($user, $request->ip());

        // 生成token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 获取用户权限
        $roles = $user->roles->pluck('name');

        return response()->json([
            'code' => 200,
            'message' => '登录成功',
            'data' => [
                'token' => $token,
                'user' => array_merge($user->toArray(), ['roles' => $roles])
            ]
        ]);
    }

    /**
     * 获取短信验证码
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVerificationCode(Request $request)
    {
        // 验证请求
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|size:11',
            'type' => 'required|string|in:register,reset_password,login',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => $validator->errors()->first(),
                'data' => null
            ], 422);
        }

        // 注册验证码需要检查手机号是否已存在
        if ($request->type === 'register') {
            $exists = User::where('phone', $request->phone)->exists();
            if ($exists) {
                return response()->json([
                    'code' => 400,
                    'message' => '该手机号已注册',
                    'data' => null
                ], 400);
            }
        }

        // 发送验证码
        $result = $this->smsService->sendVerificationCode($request->phone, $request->type);
        if (!$result) {
            return response()->json([
                'code' => 500,
                'message' => '验证码发送失败，请稍后重试',
                'data' => null
            ], 500);
        }

        return response()->json([
            'code' => 200,
            'message' => '验证码发送成功',
            'data' => [
                'expires_in' => 300 // 验证码有效期5分钟
            ]
        ]);
    }

    /**
     * 重置密码
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        // 验证请求
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|size:11|exists:users,phone',
            'verification_code' => 'required|string|size:4',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => $validator->errors()->first(),
                'data' => null
            ], 422);
        }

        // 校验短信验证码
        $verifyResult = $this->smsService->verifyCode($request->phone, $request->verification_code, 'reset_password');
        if (!$verifyResult) {
            return response()->json([
                'code' => 400,
                'message' => '验证码错误或已过期',
                'data' => null
            ], 400);
        }

        // 重置密码
        $this->authService->resetPassword($request->phone, $request->password);

        return response()->json([
            'code' => 200,
            'message' => '密码重置成功',
            'data' => null
        ]);
    }

    /**
     * 退出登录
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // 删除当前访问令牌
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'code' => 200,
            'message' => '退出成功',
            'data' => null
        ]);
    }
} 