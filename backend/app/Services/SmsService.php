<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * 发送验证码
     *
     * @param  string  $phone
     * @param  string  $type
     * @return bool
     */
    public function sendVerificationCode($phone, $type)
    {
        try {
            // 检查发送频率限制
            if ($this->isLimited($phone, $type)) {
                return false;
            }
            
            // 生成验证码
            $code = $this->generateCode();
            
            // 存储验证码到Redis
            $this->storeCode($phone, $code, $type);
            
            // 发送验证码短信
            $result = $this->sendSms($phone, $code, $type);
            
            // 记录发送次数
            $this->recordSendCount($phone, $type);
            
            return $result;
        } catch (\Exception $e) {
            Log::error('发送验证码失败：' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * 验证验证码
     *
     * @param  string  $phone
     * @param  string  $code
     * @param  string  $type
     * @return bool
     */
    public function verifyCode($phone, $code, $type)
    {
        $key = "sms:{$type}:code:{$phone}";
        $storedCode = Redis::get($key);
        
        if (!$storedCode || $storedCode !== $code) {
            return false;
        }
        
        // 验证通过后删除验证码
        Redis::del($key);
        
        return true;
    }
    
    /**
     * 生成随机验证码
     *
     * @return string
     */
    protected function generateCode()
    {
        return mt_rand(1000, 9999);
    }
    
    /**
     * 存储验证码到Redis
     *
     * @param  string  $phone
     * @param  string  $code
     * @param  string  $type
     * @return void
     */
    protected function storeCode($phone, $code, $type)
    {
        $key = "sms:{$type}:code:{$phone}";
        Redis::setex($key, 300, $code); // 验证码有效期5分钟
    }
    
    /**
     * 检查发送频率限制
     *
     * @param  string  $phone
     * @param  string  $type
     * @return bool
     */
    protected function isLimited($phone, $type)
    {
        // 每分钟限制
        $minuteKey = "sms:{$type}:limit:minute:{$phone}";
        $minuteCount = Redis::get($minuteKey);
        if ($minuteCount && $minuteCount >= 1) {
            return true;
        }
        
        // 每小时限制
        $hourKey = "sms:{$type}:limit:hour:{$phone}";
        $hourCount = Redis::get($hourKey);
        if ($hourCount && $hourCount >= 5) {
            return true;
        }
        
        // 每天限制
        $dayKey = "sms:{$type}:limit:day:{$phone}";
        $dayCount = Redis::get($dayKey);
        if ($dayCount && $dayCount >= 10) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 记录发送次数
     *
     * @param  string  $phone
     * @param  string  $type
     * @return void
     */
    protected function recordSendCount($phone, $type)
    {
        // 每分钟限制
        $minuteKey = "sms:{$type}:limit:minute:{$phone}";
        Redis::incr($minuteKey);
        Redis::expire($minuteKey, 60);
        
        // 每小时限制
        $hourKey = "sms:{$type}:limit:hour:{$phone}";
        Redis::incr($hourKey);
        Redis::expire($hourKey, 3600);
        
        // 每天限制
        $dayKey = "sms:{$type}:limit:day:{$phone}";
        Redis::incr($dayKey);
        Redis::expire($dayKey, 86400);
    }
    
    /**
     * 发送短信
     *
     * @param  string  $phone
     * @param  string  $code
     * @param  string  $type
     * @return bool
     */
    protected function sendSms($phone, $code, $type)
    {
        // 根据不同类型使用不同模板
        $templateCode = '';
        switch ($type) {
            case 'register':
                $templateCode = config('sms.templates.register');
                break;
            case 'login':
                $templateCode = config('sms.templates.login');
                break;
            case 'reset_password':
                $templateCode = config('sms.templates.reset_password');
                break;
        }
        
        // TODO: 对接实际短信服务商SDK
        // 这里使用日志模拟发送短信
        Log::info("向{$phone}发送验证码：{$code}，类型：{$type}，模板：{$templateCode}");
        
        // 开发环境直接返回成功
        if (app()->environment('local', 'development')) {
            return true;
        }
        
        // 生产环境调用真实短信接口
        try {
            // 调用实际短信服务商SDK
            // 以阿里云为例
            $smsDriver = config('sms.driver');
            
            if ($smsDriver === 'aliyun') {
                return $this->sendAliyunSms($phone, $code, $templateCode);
            } else if ($smsDriver === 'tencent') {
                return $this->sendTencentSms($phone, $code, $templateCode);
            }
            
            return false;
        } catch (\Exception $e) {
            Log::error('短信发送失败：' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * 发送阿里云短信
     *
     * @param  string  $phone
     * @param  string  $code
     * @param  string  $templateCode
     * @return bool
     */
    protected function sendAliyunSms($phone, $code, $templateCode)
    {
        // TODO: 实现阿里云短信发送
        return true;
    }
    
    /**
     * 发送腾讯云短信
     *
     * @param  string  $phone
     * @param  string  $code
     * @param  string  $templateCode
     * @return bool
     */
    protected function sendTencentSms($phone, $code, $templateCode)
    {
        // TODO: 实现腾讯云短信发送
        return true;
    }
} 