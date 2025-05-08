<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50)->unique()->comment('用户名');
            $table->string('phone', 20)->unique()->comment('手机号');
            $table->string('email', 100)->nullable()->unique()->comment('邮箱');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->comment('密码');
            $table->string('avatar', 255)->nullable()->comment('头像URL');
            $table->tinyInteger('status')->default(1)->comment('状态(0:禁用,1:正常,2:冻结)');
            $table->tinyInteger('user_type')->default(3)->comment('用户类型(1:商家,2:达人,3:普通用户)');
            $table->string('reg_ip', 50)->nullable()->comment('注册IP');
            $table->dateTime('last_login_time')->nullable()->comment('最后登录时间');
            $table->string('last_login_ip', 50)->nullable()->comment('最后登录IP');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}; 