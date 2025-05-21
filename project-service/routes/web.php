<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Welcome.new', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');



// Guest pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/team', function () {
    return Inertia::render('Team');
})->name('team');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('TermsOfService');
})->name('terms');







Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {


        return Inertia::render('Dashboard');
    })->name('dashboard');



    // Project Management Routes
    Route::prefix('projects')->group(function () {
        // Projects
        Route::get('/', [ProjectController::class, 'index'])->name('projects.index');
        Route::get('/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

        // Project attachments
        Route::post('/{project}/attachments', [AttachmentController::class, 'storeProjectAttachment'])->name('projects.attachments.store');

        // Tasks within a project
        Route::get('/{project}/tasks', [TaskController::class, 'index'])->name('projects.tasks.index');
        Route::get('/{project}/tasks/create', [TaskController::class, 'create'])->name('projects.tasks.create');
        Route::post('/{project}/tasks', [TaskController::class, 'store'])->name('projects.tasks.store');
        Route::get('/{project}/tasks/{task}', [TaskController::class, 'show'])->name('projects.tasks.show');
        Route::get('/{project}/tasks/{task}/edit', [TaskController::class, 'edit'])->name('projects.tasks.edit');
        Route::put('/{project}/tasks/{task}', [TaskController::class, 'update'])->name('projects.tasks.update');
        Route::delete('/{project}/tasks/{task}', [TaskController::class, 'destroy'])->name('projects.tasks.destroy');

        // Task attachments
        Route::post('/{project}/tasks/{task}/attachments', [AttachmentController::class, 'storeTaskAttachment'])->name('tasks.attachments.store');

        // Kanban board for project tasks
        Route::get('/{project}/kanban', [TaskController::class, 'kanban'])->name('projects.kanban');
    });

    // Task Routes (outside of projects context)
    Route::prefix('tasks')->group(function () {
        Route::get('/', [TaskController::class, 'allTasks'])->name('tasks.index');
        Route::get('/my-tasks', [TaskController::class, 'myTasks'])->name('tasks.my-tasks');
        Route::get('/{task}/time-logs', [TimeLogController::class, 'index'])->name('tasks.time-logs.index');
        Route::post('/{task}/time-logs', [TimeLogController::class, 'store'])->name('tasks.time-logs.store');
        Route::put('/{task}/time-logs/{timeLog}', [TimeLogController::class, 'update'])->name('tasks.time-logs.update');
        Route::delete('/{task}/time-logs/{timeLog}', [TimeLogController::class, 'destroy'])->name('tasks.time-logs.destroy');

        // Start and stop time tracking
        Route::post('/{task}/start-timer', [TimeLogController::class, 'startTimer'])->name('tasks.start-timer');
        Route::post('/{task}/stop-timer', [TimeLogController::class, 'stopTimer'])->name('tasks.stop-timer');
    });

    // Time Logs Routes (global)
    Route::prefix('time-logs')->group(function () {
        Route::get('/', [TimeLogController::class, 'allLogs'])->name('time-logs.index');
        Route::get('/my-logs', [TimeLogController::class, 'myLogs'])->name('time-logs.my-logs');
        Route::get('/reports', [TimeLogController::class, 'reports'])->name('time-logs.reports');
    });

    // Attachment Routes
    Route::prefix('attachments')->group(function () {
        Route::get('/{attachment}', [AttachmentController::class, 'show'])->name('attachments.show');
        Route::delete('/{attachment}', [AttachmentController::class, 'destroy'])->name('attachments.destroy');
    });

    // Comment Routes
    Route::prefix('tasks')->group(function () {
        Route::post('/{task}/comments', [CommentController::class, 'store'])->name('tasks.comments.store');
        Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    });

    // Report Routes
    Route::prefix('reports')->group(function () {
        Route::get('/dashboard', [ReportController::class, 'dashboard'])->name('reports.dashboard');
        Route::get('/projects', [ReportController::class, 'projectReports'])->name('reports.projects');
        Route::get('/tasks', [ReportController::class, 'taskReports'])->name('reports.tasks');
        Route::get('/time', [ReportController::class, 'timeReports'])->name('reports.time');
    });
});
