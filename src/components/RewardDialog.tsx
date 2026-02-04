"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, ArrowRight, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearSignupResponse } from "@/lib/store/slices/authSlice";

interface RewardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  awardedPoints: number;
  pointsDescription?: string;
}

export default function RewardDialog({
  isOpen,
  onClose,
  awardedPoints,
  pointsDescription,
}: RewardDialogProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLearnMore = () => {
    setIsRedirecting(true);
    dispatch(clearSignupResponse());
    router.push("/reward-system");
  };

  const handleClose = () => {
    setIsRedirecting(true);
    dispatch(clearSignupResponse());
    onClose();
    // Redirection is handled in RegisterForm's onClose now
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isRedirecting && !open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-green-50 to-white border border-green-100 shadow-xl rounded-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-indigo-500 shadow-md">
            {awardedPoints > 0 ? (
              <Gift className="h-8 w-8 text-white" />
            ) : (
              <Star className="h-8 w-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-green-700">
            {awardedPoints > 0
              ? "🎉 Welcome Bonus!"
              : "✅ Registration Successful!"}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-1">
            {awardedPoints > 0 ? (
              <>
                You’ve just earned{" "}
                <strong className="text-green-700 font-semibold">
                  {awardedPoints} points
                </strong>{" "}
                for joining us!
              </>
            ) : (
              "Your account has been created successfully. Welcome to the community!"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {awardedPoints > 0 ? (
            <div className="rounded-xl bg-gradient-to-r from-green-50 to-indigo-50 p-5 text-center border border-green-100 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6 text-green-500 fill-current" />
                <span className="text-3xl font-extrabold text-green-600">
                  {awardedPoints} Points
                </span>
              </div>
              {pointsDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {pointsDescription}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-green-50 p-5 text-center border border-green-100">
              <p className="text-sm text-green-800">
                You can now log in to start exploring our products and
                supporting local farmers.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border border-green-200"
              >
                ✓ Success
              </Badge>
              <span>Account active and ready to use</span>
            </div>
            {awardedPoints > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 border border-green-200"
                >
                  Redeemable
                </Badge>
                <span>Use these points for discounts on future purchases</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-5">
            <Button
              onClick={handleClose}
              disabled={isRedirecting}
              className="w-full bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 h-12"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Login...
                </>
              ) : (
                <>
                  Go to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {awardedPoints > 0 && (
              <Button
                variant="ghost"
                onClick={handleLearnMore}
                disabled={isRedirecting}
                className="text-green-700 hover:bg-green-50 h-10"
              >
                Learn More About Points
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
