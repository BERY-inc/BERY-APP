<?php

namespace App\Http\Controllers;

use App\Events\AiChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AiChatController extends Controller
{
    /**
     * Send a message to AI chat
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'contact_id' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $message = $request->input('message');
        $contactId = $request->input('contact_id');

        // Fire the event to trigger the listener
        event(new AiChatMessage($user->id, $message, $contactId));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'user_id' => $user->id,
                'message' => $message,
                'contact_id' => $contactId,
                'timestamp' => now()->toISOString(),
            ]
        ]);
    }
}
