<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MarketBeryService
{
    private $baseUrl;
    private $apiKey;
    private $enabled;

    public function __construct()
    {
        $this->baseUrl = 'https://market.bery.in';
        $this->apiKey = config('services.market_bery.api_key', '');
        $this->enabled = config('services.market_bery.enabled', false);
    }

    /**
     * Send order data to Market.bery.in API
     *
     * @param Order $order
     * @return bool
     */
    public function sendOrder(Order $order)
    {
        // Check if integration is enabled
        if (!$this->enabled || empty($this->apiKey)) {
            return false;
        }

        try {
            // Prepare order data
            $orderData = $this->prepareOrderData($order);
            
            // Send request to Market.bery.in API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/api/v1/orders/sync', $orderData);

            // Log the response for debugging
            Log::info('MarketBery API Response', [
                'status' => $response->status(),
                'body' => $response->body(),
                'order_id' => $order->id
            ]);

            if ($response->successful()) {
                // Update order with sync status
                $order->update(['market_bery_synced' => true]);
                return true;
            } else {
                Log::error('MarketBery API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'order_id' => $order->id
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('MarketBery Service Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'order_id' => $order->id
            ]);
            return false;
        }
    }

    /**
     * Prepare order data for API submission
     *
     * @param Order $order
     * @return array
     */
    private function prepareOrderData(Order $order)
    {
        // Load relationships
        $order->load(['details', 'customer', 'store', 'delivery_man']);

        return [
            'id' => $order->id,
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'store_id' => $order->store_id,
            'delivery_man_id' => $order->delivery_man_id,
            'order_amount' => $order->order_amount,
            'coupon_discount_amount' => $order->coupon_discount_amount,
            'total_tax_amount' => $order->total_tax_amount,
            'store_discount_amount' => $order->store_discount_amount,
            'delivery_charge' => $order->delivery_charge,
            'order_status' => $order->order_status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'order_type' => $order->order_type,
            'coupon_code' => $order->coupon_code,
            'scheduled' => $order->scheduled,
            'schedule_at' => $order->schedule_at,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            
            // Customer information
            'customer' => $order->customer ? [
                'id' => $order->customer->id,
                'name' => $order->customer->f_name . ' ' . $order->customer->l_name,
                'email' => $order->customer->email,
                'phone' => $order->customer->phone,
            ] : null,
            
            // Store information
            'store' => $order->store ? [
                'id' => $order->store->id,
                'name' => $order->store->name,
                'email' => $order->store->email,
                'phone' => $order->store->phone,
            ] : null,
            
            // Delivery man information
            'delivery_man' => $order->delivery_man ? [
                'id' => $order->delivery_man->id,
                'name' => $order->delivery_man->f_name . ' ' . $order->delivery_man->l_name,
                'email' => $order->delivery_man->email,
                'phone' => $order->delivery_man->phone,
            ] : null,
            
            // Order details
            'order_details' => $order->details->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'item_id' => $detail->item_id,
                    'item_campaign_id' => $detail->item_campaign_id,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                    'discount_on_item' => $detail->discount_on_item,
                    'tax_amount' => $detail->tax_amount,
                    'variant' => $detail->variant,
                ];
            })->toArray(),
            
            // Delivery address
            'delivery_address' => $order->delivery_address ? json_decode($order->delivery_address, true) : null,
        ];
    }

    /**
     * Sync all orders to Market.bery.in
     *
     * @return array
     */
    public function syncAllOrders()
    {
        if (!$this->enabled || empty($this->apiKey)) {
            return ['success' => false, 'message' => 'Integration not enabled'];
        }

        $synced = 0;
        $failed = 0;
        
        // Get unsynced orders
        $orders = Order::where('market_bery_synced', false)
            ->orderBy('created_at', 'asc')
            ->limit(100) // Limit to avoid memory issues
            ->get();

        foreach ($orders as $order) {
            if ($this->sendOrder($order)) {
                $synced++;
            } else {
                $failed++;
            }
        }

        return [
            'success' => true,
            'synced' => $synced,
            'failed' => $failed,
            'total' => $orders->count()
        ];
    }
}
