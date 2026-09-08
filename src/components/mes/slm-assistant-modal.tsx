"use client";

import * as React from "react";
import { X, Sparkles, Send, BrainCircuit, ShieldCheck, Database, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMESPrefs } from "@/lib/mes/store";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: React.ReactNode;
  timestamp: string;
}

export function SLMAssistantModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { activePlant, activeRole } = useMESPrefs();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "sys-1",
          role: "system",
          content: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <ShieldCheck className="h-4 w-4" /> Secure On-Premise SLM Initialized
              </div>
              <div className="text-xs text-muted-foreground">
                Hi-Tech Radiators Private AI (Gemma 2B) · Llama.cpp backend
                <br/>Access Level: {activeRole.toUpperCase()} · Context: Plant {activePlant}
              </div>
            </div>
          ),
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "ast-1",
          role: "assistant",
          content: "Hello. I am the Hi-Tech Radiators AI Assistant. I can help you analyze production data, troubleshoot machine faults, search SOPs, and provide insights based on our MES data. How can I assist you today?",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    }
  }, [open, messages.length, activeRole, activePlant]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
      timestamp: new Date().toLocaleTimeString(),
    }]);

    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("oee") || lower.includes("performance")) {
        aiResponse = `The current OEE for Plant ${activePlant} is running at 82.4%. Performance is steady, but Availability took a 4% hit on Shift A due to a minor breakdown on HDG-2.`;
      } else if (lower.includes("scrap") || lower.includes("quality")) {
        aiResponse = `I've analyzed the quality logs. There's an unexplained 2% spike in scrap on Line 1. The mass-balance anomaly detector suggests a discrepancy between reported consumption and output. Would you like me to flag this for the Quality Engineer?`;
      } else if (lower.includes("maintenance") || lower.includes("breakdown")) {
        aiResponse = `Maintenance schedules are currently drifting. M-K1-002 is 3 days past its PM due date. This correlates with the recent micro-stoppages. I recommend scheduling maintenance immediately.`;
      } else {
        aiResponse = `As an AI operating within the Hi-Tech Radiators secure perimeter, I've analyzed your query. Based on current ${activePlant} plant data, operations are within normal parameters. I can cross-reference this with recent NCRs or maintenance logs if you'd like to dig deeper.`;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className={cn(
          "flex flex-col gap-0 p-0 sm:max-w-[450px] transition-all duration-300 ease-in-out border-primary/20",
          isExpanded ? "sm:max-w-[800px]" : ""
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>AI Assistant</SheetTitle>
          <SheetDescription>Interact with the secure on-premise AI model.</SheetDescription>
        </SheetHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                Albos AI SLM
                <span className="flex h-2 w-2 rounded-full bg-success pulse-mono" />
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Secure On-Premise Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 custom-scrollbar"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "")}>
              <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider px-1">
                {msg.role === "assistant" ? "AI Assistant" : msg.role === "user" ? "You" : "System"} · {msg.timestamp}
              </div>
              <div className={cn(
                "p-3 rounded-xl text-sm",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : msg.role === "system"
                    ? "bg-background border border-border shadow-xs text-xs font-mono"
                    : "bg-card border border-border shadow-xs rounded-tl-sm text-foreground/90 leading-relaxed"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider px-1">
                AI Assistant
              </div>
              <div className="p-3 rounded-xl rounded-tl-sm border border-border bg-card shadow-xs flex items-center gap-2 text-muted-foreground w-fit">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-medium">Processing query on-premise...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-border bg-muted/10">
            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setInput("What is the current OEE for HDG-2?")}>Analyze OEE</Button>
            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setInput("Identify unexplained scrap on Line 1")}>Quality Check</Button>
            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setInput("Are there any drifting maintenance schedules?")}>Maintenance</Button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-border bg-card">
          <div className="relative">
            <Input 
              placeholder="Ask about production, WIP, NCRs, or SOPs..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pr-12 bg-background border-border text-sm h-11"
              disabled={isTyping}
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 top-1.5 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Data never leaves network</span>
            <span className="flex items-center gap-1"><Database className="h-3 w-3" /> Connected to live MES data</span>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
