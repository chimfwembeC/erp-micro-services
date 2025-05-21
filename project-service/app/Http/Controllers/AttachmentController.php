<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AttachmentController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Store a newly created attachment for a project.
     */
    public function storeProjectAttachment(Request $request, Project $project)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'description' => 'nullable|string|max:255',
        ]);

        return $this->storeAttachment($request, $project);
    }

    /**
     * Store a newly created attachment for a task.
     */
    public function storeTaskAttachment(Request $request, Task $task)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'description' => 'nullable|string|max:255',
        ]);

        return $this->storeAttachment($request, $task);
    }

    /**
     * Store an attachment for any attachable model.
     */
    private function storeAttachment(Request $request, $attachable)
    {
        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('attachments/' . class_basename($attachable) . '/' . $attachable->id, $filename, 'public');

        $attachment = new Attachment([
            'filename' => $filename,
            'original_filename' => $originalFilename,
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'user_id' => Auth::id(),
            'description' => $request->input('description'),
        ]);

        $attachable->attachments()->save($attachment);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Attachment uploaded successfully',
                'attachment' => $attachment,
            ]);
        }

        return back()->with('success', 'Attachment uploaded successfully');
    }

    /**
     * Display the specified attachment.
     */
    public function show(Attachment $attachment)
    {
        // Check if the user has permission to view this attachment
        // This is a simple check, you might want to implement more complex permission logic
        if (!$this->canAccessAttachment($attachment)) {
            abort(403, 'Unauthorized');
        }

        return response()->file(Storage::disk('public')->path($attachment->file_path));
    }

    /**
     * Remove the specified attachment from storage.
     */
    public function destroy(Attachment $attachment)
    {
        // Check if the user has permission to delete this attachment
        if (!$this->canAccessAttachment($attachment)) {
            abort(403, 'Unauthorized');
        }

        // Delete the file from storage
        Storage::disk('public')->delete($attachment->file_path);

        // Delete the attachment record
        $attachment->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Attachment deleted successfully']);
        }

        return back()->with('success', 'Attachment deleted successfully');
    }

    /**
     * Check if the current user can access the attachment.
     */
    private function canAccessAttachment(Attachment $attachment): bool
    {
        $user = Auth::user();

        // Admin can access all attachments
        if ($user->hasRole('admin')) {
            return true;
        }

        // User can access their own attachments
        if ($attachment->user_id === $user->id) {
            return true;
        }

        // Check if the user has access to the parent model
        $attachable = $attachment->attachable;

        if ($attachable instanceof Project) {
            // Project manager or team member can access project attachments
            return $attachable->user_id === $user->id;
        }

        if ($attachable instanceof Task) {
            // Task creator, assignee, or project manager can access task attachments
            return $attachable->created_by === $user->id ||
                $attachable->assigned_to === $user->id ||
                $attachable->project->user_id === $user->id;
        }

        return false;
    }
}
