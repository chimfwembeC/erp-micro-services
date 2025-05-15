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
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('type', ['email', 'call', 'meeting', 'note', 'other']);
            $table->string('subject');
            $table->text('content');
            $table->dateTime('date');
            $table->foreignId('created_by_id')->constrained('users');
            $table->timestamps();

            // Ensure that a communication is linked to either a client or a lead, but not both
            $table->index(['client_id', 'lead_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communications');
    }
};
