<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskCommentNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = new Comment([
            'content' => $request->input('content'),
            'parent_id' => $request->input('parent_id'),
            'user_id' => Auth::id(),
        ]);

        $task->comments()->save($comment);

        // Send notification to task owner and assignee (if different from commenter)
        $this->sendCommentNotifications($comment, $task);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment->load('user'),
            ]);
        }

        return back()->with('success', 'Comment added successfully');
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, Comment $comment)
    {
        // Check if the user is authorized to update this comment
        if ($comment->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->input('content'),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comment updated successfully',
                'comment' => $comment->fresh()->load('user'),
            ]);
        }

        return back()->with('success', 'Comment updated successfully');
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment)
    {
        // Check if the user is authorized to delete this comment
        if ($comment->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized');
        }

        $comment->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Comment deleted successfully']);
        }

        return back()->with('success', 'Comment deleted successfully');
    }

    /**
     * Send notifications to relevant users about a new comment.
     */
    private function sendCommentNotifications(Comment $comment, Task $task)
    {
        $currentUser = Auth::user();
        $notifiableUsers = collect();

        // Add task creator if not the commenter
        if ($task->created_by !== $currentUser->id) {
            $notifiableUsers->push(User::find($task->created_by));
        }

        // Add task assignee if not the commenter and if task is assigned
        if ($task->assigned_to && $task->assigned_to !== $currentUser->id) {
            $notifiableUsers->push(User::find($task->assigned_to));
        }

        // If this is a reply, add the parent comment author if not the commenter
        if ($comment->parent_id) {
            $parentComment = Comment::find($comment->parent_id);
            if ($parentComment && $parentComment->user_id !== $currentUser->id) {
                $notifiableUsers->push(User::find($parentComment->user_id));
            }
        }

        // Send notifications to unique users
        $notifiableUsers->unique('id')->each(function ($user) use ($comment, $task, $currentUser) {
            $user->notify(new TaskCommentNotification($comment, $task, $currentUser));
        });
    }
}
