<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ServiceAuthController extends Controller
{
    /**
     * Generate a token for service-to-service authentication.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServiceToken(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'service_id' => 'required|string',
                'service_secret' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find the service by ID
            $service = Service::where('service_id', $request->service_id)->first();

            if (!$service || !hash_equals($service->service_secret, $request->service_secret)) {
                Log::warning('Invalid service credentials', [
                    'service_id' => $request->service_id,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'message' => 'Invalid service credentials'
                ], 401);
            }

            // Create a token for the service with specific abilities
            $abilities = ['service:' . $service->name];
            
            // Add any additional abilities based on service permissions
            if ($service->permissions) {
                $abilities = array_merge($abilities, $service->permissions);
            }

            // Create the token
            $token = $service->createToken('service-token', $abilities);
            
            // Calculate expiration time
            $expiresAt = now()->addMinutes(config('sanctum.expiration', 60));

            // Log the token creation
            Log::info('Service token created', [
                'service_id' => $service->id,
                'service_name' => $service->name,
                'ip' => $request->ip(),
                'expires_at' => $expiresAt,
            ]);

            return response()->json([
                'token' => $token->plainTextToken,
                'expires_at' => $expiresAt,
                'service' => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'abilities' => $abilities,
                ],
                'message' => 'Service token created successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Service token creation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'service_id' => $request->service_id ?? 'not provided',
            ]);

            return response()->json([
                'message' => 'An error occurred during service token creation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate a service token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateServiceToken(Request $request)
    {
        try {
            // Get the token model
            $tokenModel = $request->user()->currentAccessToken();

            if (!$tokenModel) {
                return response()->json(['valid' => false], 401);
            }

            // Check if the token has the service ability
            $abilities = $tokenModel->abilities;
            $isServiceToken = false;

            foreach ($abilities as $ability) {
                if (strpos($ability, 'service:') === 0) {
                    $isServiceToken = true;
                    break;
                }
            }

            if (!$isServiceToken) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Not a service token'
                ], 403);
            }

            // Log the successful validation
            Log::info('Service token validation successful', [
                'token_id' => $tokenModel->id,
                'service' => $request->user()->name,
                'abilities' => $abilities,
            ]);

            return response()->json([
                'valid' => true,
                'service' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'abilities' => $abilities,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Service token validation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'valid' => false,
                'message' => 'An error occurred during service token validation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
