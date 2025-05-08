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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->comment('用户ID');
            $table->string('real_name', 50)->nullable()->comment('真实姓名');
            $table->tinyInteger('gender')->default(0)->comment('性别(0:未知,1:男,2:女)');
            $table->date('birthday')->nullable()->comment('生日');
            $table->text('bio')->nullable()->comment('个人简介');
            $table->string('province', 50)->nullable()->comment('省');
            $table->string('city', 50)->nullable()->comment('市');
            $table->string('district', 50)->nullable()->comment('区');
            $table->string('address', 255)->nullable()->comment('详细地址');
            $table->string('id_card', 50)->nullable()->comment('身份证号');
            $table->string('id_card_front', 255)->nullable()->comment('身份证正面照');
            $table->string('id_card_back', 255)->nullable()->comment('身份证背面照');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_profiles');
    }
}; 