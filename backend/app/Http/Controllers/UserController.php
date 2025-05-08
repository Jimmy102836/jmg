<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $userService;

    /**
     * 构造函数
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * 获取用户信息
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function info(Request $request)
    {
        $user = $request->user();
        $roles = $user->roles->pluck('name');
        
        return $this->success(array_merge(
            $user->toArray(),
            ['roles' => $roles]
        ));
    }

    /**
     * 更新用户资料
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nickname' => 'nullable|string|max:30',
            'avatar' => 'nullable|string|max:255',
            'gender' => 'nullable|integer|in:0,1,2',
            'birthday' => 'nullable|date',
            'bio' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $user = $this->userService->updateProfile($request->user(), $request->all());
        
        return $this->success($user);
    }

    /**
     * 修改密码
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $result = $this->userService->changePassword(
            $request->user(),
            $request->old_password,
            $request->password
        );

        if (!$result) {
            return $this->error('原密码错误');
        }

        return $this->success(null, '密码修改成功');
    }

    /**
     * 上传头像
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|file|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $path = $this->userService->uploadAvatar($request->user(), $request->file('avatar'));

        return $this->success(['avatar' => $path]);
    }

    /**
     * 获取账户信息
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAccount(Request $request)
    {
        $account = $this->userService->getUserAccount($request->user());
        
        return $this->success($account);
    }

    /**
     * 实名认证
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyIdentity(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'real_name' => 'required|string|max:20',
            'id_card' => 'required|string|size:18',
            'id_card_front' => 'required|string',
            'id_card_back' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $result = $this->userService->verifyIdentity($request->user(), $request->all());
        
        return $this->success(null, '实名认证提交成功，请等待审核');
    }
} 