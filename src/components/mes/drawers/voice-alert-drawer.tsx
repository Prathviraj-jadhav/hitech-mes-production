"use client";

import * as React from "react";
import { Mic, PhoneCall, Volume2, ShieldAlert, CheckCircle2, ChevronRight, X, PhoneMissed, PhoneForwarded } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/mes/toast";

export function VoiceAlertDrawer() {
  const [open, setOpen] = React.useState(false);
  const [callState, setCallState] = React.useState<"dialing" | "connected" | "ended">("dialing");
  const [transcript, setTranscript] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setCallState("dialing");
      setTranscript([]);

      setTimeout(() => {
        setCallState("connected");
        setTranscript([
          "AI: Hello, this is the Hi-Tech MES Alert System. Am I speaking with the Plant Manager?"
        ]);
      }, 2000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "You: Yes, speaking."]);
      }, 4000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "AI: We have a critical exception on K1 Assembly. HDG-2 bath temperature has dropped below 435°C. Immediate intervention is required to prevent galvanizing defects."]);
      }, 6000);
      
      setTimeout(() => {
        setTranscript(prev => [...prev, "You: Understood. Acknowledge the alert and dispatch maintenance team."]);
      }, 9000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "AI: Acknowledged. I have logged this exception and notified the maintenance supervisor. Ending call."]);
      }, 12000);

      setTimeout(() => {
        setCallState("ended");
        notifySuccess("Action Taken", "Maintenance team dispatched via voice command.");
      }, 14000);
    };

    window.addEventListener("mes:trigger-voice-alert", handleOpen);
    return () => window.removeEventListener("mes:trigger-voice-alert", handleOpen);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto bg-card border-l border-primary/20">
        
        {/* Header - Dialing State */}
        <div className={cn(
          "p-6 text-center transition-colors duration-500",
          callState === "dialing" ? "bg-muted" : callState === "connected" ? "bg-primary/10" : "bg-muted"
        )}>
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center relative mb-4">
             {callState === "connected" && (
                <>
                  <span className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></span>
                  <span className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></span>
                </>
             )}
             <div className={cn(
               "w-16 h-16 rounded-full flex items-center justify-center relative z-10",
               callState === "connected" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
             )}>
                {callState === "ended" ? <PhoneMissed className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
             </div>
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-foreground">AI Voice Alert Agent</h2>
          <p className="text-sm font-mono mt-1 text-muted-foreground">
            {callState === "dialing" && "Initiating Secure Call..."}
            {callState === "connected" && <span className="text-primary font-bold">00:14 · Live Connection</span>}
            {callState === "ended" && "Call Ended"}
          </p>
        </div>

        {/* Action Buttons */}
        {callState === "connected" && (
          <div className="flex justify-center gap-6 py-4 border-b border-border">
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border bg-card hover:bg-muted">
                <Volume2 className="h-5 w-5" />
             </Button>
             <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full shadow-md" onClick={() => setCallState("ended")}>
                <X className="h-5 w-5" />
             </Button>
          </div>
        )}

        {/* Live Transcript Area */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Live Transcript
            </span>
            <Badge variant="outline" className="text-[10px] uppercase">Llama 3 Voice</Badge>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {transcript.map((line, idx) => {
              const isAI = line.startsWith("AI:");
              return (
                <div key={idx} className={cn("flex flex-col gap-1", isAI ? "items-start" : "items-end")}>
                  <div className={cn(
                    "px-3 py-2 text-sm rounded-lg max-w-[85%]",
                    isAI ? "bg-muted/50 border border-border text-foreground" : "bg-primary text-primary-foreground"
                  )}>
                    {line.replace(/^(AI:|You:)\s*/, "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status */}
        {callState === "ended" && (
          <div className="p-5 mt-auto">
             <Button className="w-full font-bold" onClick={() => setOpen(false)}>
               Close Intervention Log
             </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
