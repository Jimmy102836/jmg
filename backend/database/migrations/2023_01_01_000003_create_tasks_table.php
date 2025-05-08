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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('merchant_id')->comment('商家ID');
            $table->string('title', 255)->comment('任务标题');
            $table->text('description')->comment('任务描述');
            $table->unsignedInteger('category_id')->comment('任务分类ID');
            $table->tinyInteger('task_type')->comment('任务类型(1:短视频,2:直播,3:图文)');
            $table->decimal('budget', 10, 2)->default(0)->comment('任务预算');
            $table->decimal('unit_price', 10, 2)->default(0)->comment('单价');
            $table->integer('total_count')->default(1)->comment('总数量');
            $table->integer('apply_count')->default(0)->comment('已申请数量');
            $table->integer('complete_count')->default(0)->comment('已完成数量');
            $table->dateTime('start_time')->comment('开始时间');
            $table->dateTime('end_time')->comment('结束时间');
            $table->tinyInteger('status')->default(0)->comment('状态(0:草稿,1:审核中,2:进行中,3:已完成,4:已取消)');
            $table->integer('priority')->default(0)->comment('优先级');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('merchant_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}; 