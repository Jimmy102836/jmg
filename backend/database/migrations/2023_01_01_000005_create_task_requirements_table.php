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
        Schema::create('task_requirements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('task_id')->comment('任务ID');
            $table->integer('fans_min')->default(0)->comment('最低粉丝数');
            $table->string('platform', 50)->nullable()->comment('平台(如抖音、快手)');
            $table->string('region', 255)->nullable()->comment('地区要求');
            $table->tinyInteger('gender')->default(0)->comment('性别要求(0:不限,1:男,2:女)');
            $table->integer('age_min')->nullable()->comment('最小年龄');
            $table->integer('age_max')->nullable()->comment('最大年龄');
            $table->text('other_requirements')->nullable()->comment('其他要求');
            $table->timestamps();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('task_requirements');
    }
}; 