<?php

namespace App\Listeners;

use App\Events\AiChatMessage;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AiChatMessageListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AiChatMessage $event): void
    {
        // Only process messages for Bery AI
        if ($event->contactId !== 'bery-ai') {
            return;
        }

        $response = $this->getAiResponse($event->message, $event->userId);

        // Broadcast the response back to the user
        broadcast(new AiChatMessage(
            $event->userId,
            $event->message,
            $event->contactId,
            $response
        ))->toOthers();
    }

    /**
     * Get AI response based on message content.
     */
    private function getAiResponse(string $message, int $userId): string
    {
        $lowerMessage = strtolower($message);

        // Handle balance enquiries
        if (str_contains($lowerMessage, 'balance') ||
            str_contains($lowerMessage, 'money') ||
            str_contains($lowerMessage, 'wallet')) {

            $user = User::find($userId);
            if ($user) {
                $balance = $user->wallet_balance ?? 0;
                return "Your current balance is:\n\n💵 Total: $" . number_format($balance, 2) . "\n\nWould you like to see your transaction history or investment portfolio?";
            } else {
                return "Sorry, I couldn't retrieve your balance information. Please try again.";
            }
        }

        // Other AI responses
        if (str_contains($lowerMessage, 'invest')) {
            return 'Great question! We have several investment options:\n\n📊 Fixed Deposit: 6% APY (Low risk)\n💰 Lending Pool: 10% APY (Medium risk)\n📈 Equity Pool: 15% APY (High risk)\n🚀 Venture Capital: 30% APY (High risk/reward)\n🏢 Real Estate: 12% APY (Medium risk)\n\nWhich interests you most?';
        } elseif (str_contains($lowerMessage, 'send') || str_contains($lowerMessage, 'transfer')) {
            return 'To send money:\n\n1. Tap \'Send\' on your wallet\n2. Select recipient or enter wallet ID\n3. Enter amount in USD or Bery\n4. Confirm transaction\n\nYou can send to any Bery user instantly with zero fees! Need help with a specific transfer?';
        } elseif (str_contains($lowerMessage, 'marketplace') || str_contains($lowerMessage, 'buy') || str_contains($lowerMessage, 'shop')) {
            return 'The Bery Marketplace has:\n\n🛍️ Products: Electronics, home goods, fashion & more\n💼 Services: Design, development, marketing, video editing\n\nAll payments accepted in Bery (₿) or USD. Want me to show you featured items?';
        } elseif (str_contains($lowerMessage, 'bery') || str_contains($lowerMessage, 'currency')) {
            return 'Bery (₿) is the platform\'s native currency!\n\n💱 Exchange Rate: 1 USD = 8.9 ₿\n✅ Use for all marketplace purchases\n⚡ Instant transfers, zero fees\n🌍 Accepted globally on Bery\n\nYou can convert USD to Bery anytime from your wallet!';
        } elseif (str_contains($lowerMessage, 'hi') || str_contains($lowerMessage, 'hello') || str_contains($lowerMessage, 'hey')) {
            return 'Hi there! 👋 I\'m Bery AI, your financial assistant.\n\nI can help you with:\n• Account & balance info\n• Investment recommendations\n• Transaction support\n• Marketplace guidance\n• Currency conversions\n\nWhat would you like to know?';
        } elseif (str_contains($lowerMessage, 'help') || str_contains($lowerMessage, 'support')) {
            return 'I\'m here to help! You can ask me about:\n\n💰 Wallet & balances\n📊 Investments & returns\n💸 Sending & receiving money\n🛒 Marketplace purchases\n₿ Bery currency info\n🌍 Platform features\n\nJust ask your question and I\'ll do my best to help!';
        } else {
            return 'I\'m here to help with your Bery account! You can ask me about:\n\n• Your balance & wallet\n• Investment opportunities\n• Sending money\n• The marketplace\n• Bery currency\n\nWhat would you like to know?';
        }
    }
}
