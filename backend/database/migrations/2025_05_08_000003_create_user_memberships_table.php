<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserMembershipsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('membership_level_id')->constrained();
            $table->integer('points')->default(0)->comment('用户积分');
            $table->timestamp('expire_at')->nullable()->comment('会员到期时间');
            $table->json('upgrade_history')->nullable()->comment('升级历史记录');
            $table->boolean('is_auto_renew')->default(false)->comment('是否自动续费');
            $table->timestamps();

            // 用户ID唯一索引
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_memberships');
    }
} 