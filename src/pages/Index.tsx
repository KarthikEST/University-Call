import { CallWidget } from "@/components/CallWidget";
import hexaLogo from "@/assets/hexa-logo.webp";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-12 animate-fade-in-up">
          <img 
            src={hexaLogo} 
            alt="Hexa AI - Voice Assistant" 
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {/* Headline */}
        <div className="text-center mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Talk to <span className="text-primary">Hexa</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Experience our intelligent multilingual voice assistant. Enter your phone number to get started.
          </p>
        </div>

        {/* Call Widget */}
        <div className="w-full" style={{ animationDelay: "0.2s" }}>
          <CallWidget 
            onCallInitiated={(phone) => console.log("Call initiated to:", phone)} 
          />
        </div>

        {/* Footer text */}
        <p className="mt-8 text-sm text-muted-foreground text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          By proceeding, you agree to receive a call from our AI assistant
        </p>
      </div>
    </div>
  );
};

export default Index;
