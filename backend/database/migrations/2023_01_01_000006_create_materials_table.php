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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->comment('上传用户ID');
            $table->tinyInteger('material_type')->comment('素材类型(1:图片,2:视频,3:文本)');
            $table->string('title', 255)->comment('素材标题');
            $table->string('file_path', 255)->nullable()->comment('文件路径');
            $table->integer('file_size')->nullable()->comment('文件大小(KB)');
            $table->string('file_ext', 20)->nullable()->comment('文件扩展名');
            $table->text('content')->nullable()->comment('文本内容(当类型为文本时)');
            $table->integer('duration')->nullable()->comment('时长(秒)(当类型为视频时)');
            $table->integer('width')->nullable()->comment('宽度(像素)');
            $table->integer('height')->nullable()->comment('高度(像素)');
            $table->tinyInteger('status')->default(1)->comment('状态(0:待审核,1:正常,2:已驳回)');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users');
        });

        // 创建素材与任务关联表
        Schema::create('material_task_relation', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('task_id')->comment('任务ID');
            $table->unsignedBigInteger('material_id')->comment('素材ID');
            $table->timestamps();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('material_task_relation');
        Schema::dropIfExists('materials');
    }
}; 