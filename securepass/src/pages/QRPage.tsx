import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Smartphone,
  ScanLine,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

export default function QRPage() {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const registrationUrl = `${window.location.origin}/register`;

  const copyUrl = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "securepass-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>SecurePass QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: system-ui, sans-serif; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            p { color: #666; margin-bottom: 32px; }
            .url { font-size: 12px; color: #999; margin-top: 24px; word-break: break-all; max-width: 300px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🛡️ SECUREPASS</h1>
          <p>Scan to Register</p>
          ${data}
          <p class="url">${registrationUrl}</p>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
          <QrCode className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">QR Code Access</h1>
          <p className="text-sm text-slate-500">
            Fast & contactless visitor registration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-slate-800">
              Scan to Register
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Display at entrance or security desk
            </p>
          </div>

          <div
            ref={qrRef}
            className="p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200"
          >
            <QRCodeSVG
              value={registrationUrl}
              size={220}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#1e293b"
            />
          </div>

          {/* URL Display */}
          <div className="mt-6 w-full">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <input
                readOnly
                value={registrationUrl}
                className="flex-1 bg-transparent text-xs text-slate-600 focus:outline-none truncate"
              />
              <button
                onClick={copyUrl}
                className={`p-2 rounded-lg transition-all ${
                  copied
                    ? "bg-emerald-100 text-emerald-600"
                    : "hover:bg-slate-200 text-slate-400"
                }`}
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 w-full">
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={printQR}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">How It Works</h3>
            <div className="space-y-5">
              {[
                {
                  icon: ScanLine,
                  title: "Scan QR Code",
                  desc: "Visitors scan the QR code using their smartphone camera",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Smartphone,
                  title: "Open Registration",
                  desc: "The registration page opens directly in their mobile browser",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: UserPlus,
                  title: "Complete Check-In",
                  desc: "Security personnel completes the registration process",
                  color: "bg-emerald-100 text-emerald-600",
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.color}`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < 2 && (
                      <div className="absolute left-1/2 top-full w-0.5 h-5 bg-slate-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Print the QR code and display it at eye level near the entrance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Laminate the printed QR code for durability
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Test the QR code with multiple devices before deployment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Ensure adequate lighting for easy scanning
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}