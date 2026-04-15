"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, Trash2 } from "lucide-react";

interface AutomationActionsProps {
  automationId: string;
  status: string;
}

export function AutomationActions({
  automationId,
  status,
}: AutomationActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "pause" | "resume" | "deactivate") => {
    setLoading(true);
    try {
      await fetch(`/api/automations/${automationId}/${action}`, {
        method: "POST",
      });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === "ACTIVE" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("pause")}
          disabled={loading}
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
      )}
      {status === "PAUSED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("resume")}
          disabled={loading}
        >
          <Play className="w-4 h-4 mr-1" />
          Resume
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("deactivate")}
        disabled={loading}
        className="text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
