<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMembershipLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('membership_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('等级名称');
            $table->integer('level')->unique()->comment('等级数值');
            $table->string('icon')->nullable()->comment('等级图标');
            $table->integer('required_points')->default(0)->comment('所需积分');
            $table->text('description')->nullable()->comment('等级描述');
            $table->boolean('status')->default(true)->comment('状态：0-禁用，1-启用');
            $table->timestamps();
        });

        // 插入默认会员等级数据
        DB::table('membership_levels')->insert([
            [
                'name' => '普通会员',
                'level' => 1,
                'icon' => 'regular',
                'required_points' => 0,
                'description' => '基础会员等级，享受平台基本服务',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '银牌会员',
                'level' => 2,
                'icon' => 'silver',
                'required_points' => 1000,
                'description' => '银牌会员，接单数量增加，享受更多权益',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '金牌会员',
                'level' => 3,
                'icon' => 'gold',
                'required_points' => 5000,
                'description' => '金牌会员，佣金比例提升，享受VIP服务',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '钻石会员',
                'level' => 4,
                'icon' => 'diamond',
                'required_points' => 20000,
                'description' => '钻石会员，最高等级会员，享受最优质的平台服务',
                'status' => true,
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
        Schema::dropIfExists('membership_levels');
    }
} 