"use client";

import { toast } from "sonner";

// Toast utility for button actions
export function notifyAction(action: string, description?: string) {
  toast(action, {
    description,
    duration: 3000,
  });
}

export function notifySuccess(action: string, description?: string) {
  toast.success(action, {
    description,
    duration: 3000,
  });
}

export function notifyError(action: string, description?: string) {
  toast.error(action, {
    description,
    duration: 4000,
  });
}

export function notifyInfo(action: string, description?: string) {
  toast.info(action, {
    description,
    duration: 3000,
  });
}
