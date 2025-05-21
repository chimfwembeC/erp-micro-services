<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeLog extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'task_id',
        'user_id',
        'start_time',
        'end_time',
        'duration_minutes',
        'description',
        'is_billable',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration_minutes' => 'integer',
        'is_billable' => 'boolean',
    ];

    /**
     * Get the task that owns the time log.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Get the user that owns the time log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate duration when ending a time log.
     */
    public function calculateDuration(): void
    {
        if ($this->start_time && $this->end_time) {
            $startTime = new \DateTime($this->start_time);
            $endTime = new \DateTime($this->end_time);
            $interval = $startTime->diff($endTime);

            // Convert to minutes
            $this->duration_minutes = ($interval->days * 24 * 60) +
                                     ($interval->h * 60) +
                                     $interval->i;

            $this->save();
        }
    }
}
