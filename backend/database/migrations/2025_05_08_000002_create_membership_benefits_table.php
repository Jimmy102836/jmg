<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMembershipBenefitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('membership_benefits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membership_level_id')->constrained()->onDelete('cascade');
            $table->string('name')->comment('权益名称');
            $table->tinyInteger('type')->comment('权益类型：1-任务接单数量，2-佣金比例，3-提现速度，4-其他');
            $table->string('value')->comment('权益值');
            $table->text('description')->nullable()->comment('权益描述');
            $table->boolean('status')->default(true)->comment('状态：0-禁用，1-启用');
            $table->string('icon')->nullable()->comment('权益图标');
            $table->timestamps();
        });

        // 插入默认权益数据
        $this->insertDefaultBenefits();
    }

    /**
     * 插入默认权益数据
     */
    private function insertDefaultBenefits()
    {
        // 普通会员权益（等级ID=1）
        DB::table('membership_benefits')->insert([
            [
                'membership_level_id' => 1,
                'name' => '任务接单数量',
                'type' => 1,
                'value' => '5',
                'description' => '每日最多可接5个任务',
                'status' => true,
                'icon' => 'task-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 1,
                'name' => '佣金比例',
                'type' => 2,
                'value' => '90%',
                'description' => '获得任务佣金的90%',
                'status' => true,
                'icon' => 'money-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 1,
                'name' => '提现速度',
                'type' => 3,
                'value' => '72小时',
                'description' => '提现到账时间为72小时内',
                'status' => true,
                'icon' => 'withdraw-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 银牌会员权益（等级ID=2）
        DB::table('membership_benefits')->insert([
            [
                'membership_level_id' => 2,
                'name' => '任务接单数量',
                'type' => 1,
                'value' => '10',
                'description' => '每日最多可接10个任务',
                'status' => true,
                'icon' => 'task-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 2,
                'name' => '佣金比例',
                'type' => 2,
                'value' => '92%',
                'description' => '获得任务佣金的92%',
                'status' => true,
                'icon' => 'money-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 2,
                'name' => '提现速度',
                'type' => 3,
                'value' => '48小时',
                'description' => '提现到账时间为48小时内',
                'status' => true,
                'icon' => 'withdraw-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 金牌会员权益（等级ID=3）
        DB::table('membership_benefits')->insert([
            [
                'membership_level_id' => 3,
                'name' => '任务接单数量',
                'type' => 1,
                'value' => '20',
                'description' => '每日最多可接20个任务',
                'status' => true,
                'icon' => 'task-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 3,
                'name' => '佣金比例',
                'type' => 2,
                'value' => '95%',
                'description' => '获得任务佣金的95%',
                'status' => true,
                'icon' => 'money-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 3,
                'name' => '提现速度',
                'type' => 3,
                'value' => '24小时',
                'description' => '提现到账时间为24小时内',
                'status' => true,
                'icon' => 'withdraw-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 3,
                'name' => '专属客服',
                'type' => 4,
                'value' => '优先响应',
                'description' => '专属客服优先响应',
                'status' => true,
                'icon' => 'support-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 钻石会员权益（等级ID=4）
        DB::table('membership_benefits')->insert([
            [
                'membership_level_id' => 4,
                'name' => '任务接单数量',
                'type' => 1,
                'value' => '无限制',
                'description' => '每日接单数量无限制',
                'status' => true,
                'icon' => 'task-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 4,
                'name' => '佣金比例',
                'type' => 2,
                'value' => '98%',
                'description' => '获得任务佣金的98%',
                'status' => true,
                'icon' => 'money-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 4,
                'name' => '提现速度',
                'type' => 3,
                'value' => '实时',
                'description' => '提现实时到账',
                'status' => true,
                'icon' => 'withdraw-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 4,
                'name' => '专属客服',
                'type' => 4,
                'value' => '7x24小时',
                'description' => '7x24小时专属客服服务',
                'status' => true,
                'icon' => 'support-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'membership_level_id' => 4,
                'name' => '任务优先推荐',
                'type' => 4,
                'value' => '最高权重',
                'description' => '系统优先推荐高价值任务',
                'status' => true,
                'icon' => 'vip-icon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('membership_benefits');
    }
} 