import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
  );
}

export function GenericScreenSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 px-5 pt-14">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-28 px-5 pt-14">
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-28 w-full rounded-xl mb-3" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function InvestmentsSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-28 px-5 pt-14">
      <Skeleton className="h-8 w-48 mb-4" />
      <Card className="p-5 mb-6">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </Card>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-28 px-5 pt-14">
      <Skeleton className="h-56 w-full rounded-2xl mb-4" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-24 mb-6" />
      <Card className="p-4 mb-4">
        <SectionHeaderSkeleton />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </Card>
      <div className="flex gap-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function TransactionHistorySkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-28 px-5 pt-14">
      <Skeleton className="h-8 w-56 mb-4" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-44 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CartOrCheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-28 px-5 pt-14">
      <Skeleton className="h-8 w-40 mb-4" />
      <div className="space-y-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-32" />
      </Card>
      <div className="mt-6">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default GenericScreenSkeleton;

// Additional skeletons for every main screen (frontend-only variants)
export function WelcomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] flex flex-col items-center justify-center p-6">
      <Skeleton className="h-16 w-16 rounded-full mb-4" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <div className="flex gap-3 w-full max-w-md">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-40 mb-6" />
      <Card className="p-5">
        <Skeleton className="h-10 w-full rounded-xl mb-3" />
        <Skeleton className="h-10 w-full rounded-xl mb-3" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>
    </div>
  );
}

export function SignUpSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-40 mb-6" />
      <Card className="p-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl mb-3" />
        ))}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>
    </div>
  );
}

export function OTPSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-48 mb-6" />
      <Card className="p-5">
        <div className="flex items-center justify-between gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-xl mt-6" />
      </Card>
    </div>
  );
}

export function ProfileSetupSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-56 mb-6" />
      <Card className="p-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl mb-3" />
        ))}
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>
    </div>
  );
}

export function FeatureWalkthroughSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-52 mb-6" />
      <Card className="p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </Card>
      <div className="mt-6 flex justify-between">
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-48 mb-6" />
      <Card className="p-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-12 rounded-xl" />
          </div>
        ))}
      </Card>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-28">
      <Skeleton className="h-8 w-40 mb-4" />
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </Card>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SendMoneySkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-48 mb-6" />
      <Card className="p-5">
        <Skeleton className="h-10 w-full rounded-xl mb-3" />
        <Skeleton className="h-10 w-full rounded-xl mb-3" />
        <Skeleton className="h-10 w-full rounded-xl mb-6" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </Card>
    </div>
  );
}

export function InvestmentConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-56 mb-6" />
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-xl" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-xl mt-4" />
      </Card>
    </div>
  );
}

export function ErrorScreenSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-48 mb-4" />
      <Card className="p-5">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Card>
    </div>
  );
}

export function AiChatSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] px-5 pt-14 pb-24">
      <Skeleton className="h-8 w-40 mb-4" />
      <Card className="p-5 mb-4">
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}