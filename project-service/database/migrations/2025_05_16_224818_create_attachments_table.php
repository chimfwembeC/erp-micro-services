<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('attachments')) {
            Schema::create('attachments', function (Blueprint $table) {
                $table->id();
                $table->string('filename');
                $table->string('original_filename');
                $table->string('file_path');
                $table->string('mime_type');
                $table->integer('file_size');
                $table->morphs('attachable'); // This creates attachable_id and attachable_type for polymorphic relationships
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->text('description')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
