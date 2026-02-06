import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, GraduationCap, Users } from "lucide-react";

type CallState = "idle" | "calling" | "success" | "error";
type CallType = "admission" | "alumni";

interface CallWidgetProps {
  onCallInitiated?: (phoneNumber: string) => void;
}

export function CallWidget({ onCallInitiated }: CallWidgetProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [selectedCallType, setSelectedCallType] = useState<CallType | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "calling") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const initiateCall = async (number: string, callType: CallType) => {
    setCallState("calling");
    setCallDuration(0);

    try {
      let url: string;
      let payload: any;

      if (callType === "admission") {
        url = "https://hexaweb.haloocom.in/ubt/make-call";
        payload = {
          phoneNumber: number,
          campaignId: "TestCampaign",
          listId: "123",
          customer_name: "rohith",
        };
      } else {
        // alumni
        url = "https://hexaweb.haloocom.in/ubt2/make-call";
        payload = {
          phoneNumber: number,
          campaignId: "MockInterview",
          customer_name: "Ahmed",
          listId: "456",
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Call triggered:", data);
      setCallState("success");
      setStatusMessage("Call initiated successfully!");
      onCallInitiated?.(number);
    } catch (error) {
      console.error("Error initiating call:", error);
      setCallState("error");
      setStatusMessage("Error initiating the call. Please try again.");
    }
  };

  const handleCallTypeSelect = async (callType: CallType) => {
    setSelectedCallType(callType);
    
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setStatusMessage("Please enter a valid phone number.");
      return;
    }

    setStatusMessage("Initiating call...");
    await initiateCall(phoneNumber, callType);
  };

  const handleCallNow = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setStatusMessage("Please enter a valid phone number.");
      return;
    }

    if (!selectedCallType) {
      setStatusMessage("Please select Admission or Alumni.");
      return;
    }

    setStatusMessage("Initiating call...");
    await initiateCall(phoneNumber, selectedCallType);
  };

  const handleReset = () => {
    setPhoneNumber("");
    setCallState("idle");
    setStatusMessage("");
    setCallDuration(0);
    setSelectedCallType(null);
  };

  if (callState === "success") {
    return (
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="bg-card rounded-xl p-8 shadow-card border border-border text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Thank you for contacting!</h3>
          <p className="text-muted-foreground mb-6">Our team will connect with you shortly.</p>
          <Button variant="outline" onClick={handleReset}>
            Make Another Call
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-card border border-border/50">
        {callState === "idle" ? (
          <div className="space-y-3">
            {/* Call Type Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={() => handleCallTypeSelect("admission")}
                variant={selectedCallType === "admission" ? "default" : "outline"}
                className="h-14 flex items-center justify-center gap-2 font-semibold"
              >
                <GraduationCap className="w-5 h-5" />
                Admission
              </Button>
              <Button
                onClick={() => handleCallTypeSelect("alumni")}
                variant={selectedCallType === "alumni" ? "default" : "outline"}
                className="h-14 flex items-center justify-center gap-2 font-semibold"
              >
                <Users className="w-5 h-5" />
                Alumni
              </Button>
            </div>

            {/* Phone Input Row */}
            <div className="flex items-stretch">
              <PhoneInput
                international
                defaultCountry="IN"
                countryCallingCodeEditable={false}
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || "")}
                className="flex-1"
              />
              <Button
                onClick={handleCallNow}
                disabled={!phoneNumber || !selectedCallType}
                className="h-14 rounded-l-none rounded-r-lg px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        ) : callState === "calling" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium">Calling... {callDuration}s</p>
          </div>
        ) : callState === "error" ? (
          <div className="text-center py-4">
            <p className="text-destructive mb-4">{statusMessage}</p>
            <Button variant="outline" onClick={handleReset}>
              Try Again
            </Button>
          </div>
        ) : null}

        {statusMessage && callState === "idle" && (
          <p
            className={`text-sm text-center mt-3 ${
              statusMessage.includes("Error") || statusMessage.includes("Invalid") || statusMessage.includes("valid") || statusMessage.includes("select")
                ? "text-destructive"
                : "text-primary"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
