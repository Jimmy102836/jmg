<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\SettlementController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\MembershipController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 公共接口
Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verification-code', [AuthController::class, 'getVerificationCode']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// 需要授权的接口
Route::middleware('auth:sanctum')->group(function () {
    // 认证相关
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // 用户相关
    Route::get('user/info', [UserController::class, 'info']);
    Route::put('user/profile', [UserController::class, 'updateProfile']);
    Route::post('user/change-password', [UserController::class, 'changePassword']);
    Route::post('user/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('user/verify-identity', [UserController::class, 'verifyIdentity']);
    Route::get('user/account', [UserController::class, 'getAccount']);
    
    // 任务相关
    Route::get('tasks/categories', [TaskController::class, 'getCategories']);
    Route::get('tasks', [TaskController::class, 'index']);
    Route::get('tasks/{id}', [TaskController::class, 'show']);
    
    // 商家任务管理
    Route::group(['middleware' => 'role:merchant'], function () {
        Route::post('tasks', [TaskController::class, 'store']);
        Route::put('tasks/{id}', [TaskController::class, 'update']);
        Route::post('tasks/{id}/submit-review', [TaskController::class, 'submitReview']);
        Route::post('tasks/{id}/cancel', [TaskController::class, 'cancel']);
        Route::get('tasks/merchant', [TaskController::class, 'merchantTasks']);
        Route::post('tasks/applications/{id}/review', [TaskController::class, 'reviewApplication']);
        Route::post('tasks/applications/{id}/review-submission', [TaskController::class, 'reviewSubmission']);
    });
    
    // 达人任务管理
    Route::group(['middleware' => 'role:talent'], function () {
        Route::post('tasks/{id}/apply', [TaskController::class, 'apply']);
        Route::get('tasks/applications', [TaskController::class, 'applications']);
        Route::post('tasks/applications/{id}/submit', [TaskController::class, 'submitTaskResult']);
    });
    
    // 素材管理
    Route::get('materials', [MaterialController::class, 'index']);
    Route::post('materials', [MaterialController::class, 'store']);
    Route::get('materials/{id}', [MaterialController::class, 'show']);
    Route::put('materials/{id}', [MaterialController::class, 'update']);
    Route::delete('materials/{id}', [MaterialController::class, 'destroy']);
    
    // 结算管理
    Route::get('settlements', [SettlementController::class, 'index']);
    Route::post('withdrawals', [SettlementController::class, 'applyWithdrawal']);
    Route::get('withdrawals', [SettlementController::class, 'withdrawals']);
    
    // 数据统计
    Route::get('statistics/income', [StatisticsController::class, 'income']);
    Route::get('statistics/promotion', [StatisticsController::class, 'promotion']);
    
    // 会员等级相关
    Route::get('membership/levels', [MembershipController::class, 'getAllLevels']);
    Route::get('membership/user', [MembershipController::class, 'getUserMembership']);
    Route::post('membership/upgrade', [MembershipController::class, 'upgradeMembership']);
    Route::post('membership/points/add', [MembershipController::class, 'addPoints']);
    Route::get('membership/benefit/check', [MembershipController::class, 'checkBenefit']);
}); 