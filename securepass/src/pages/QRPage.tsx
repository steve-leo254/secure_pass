import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Smartphone,
  Shield,
  ArrowRight,
  Printer,
} from 'lucide-react';

const QRCodePage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

  const registrationUrl = `${window.location.origin}/visitor-register`;

  const qrSizes = { small: 160, medium: 240, large: 320 };

  const copyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.querySelector('#qr-code-svg svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const dim = 1024;
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, dim, dim);
        const pad = 112;
        ctx.drawImage(img, pad, pad, dim - pad * 2, dim - pad * 2);

        // Add text
        ctx.fillStyle = '#1e1b4b';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SECUREPASS', dim / 2, 70);
        ctx.font = '20px Inter, sans-serif';
        ctx.fillStyle = '#6366f1';
        ctx.fillText('Scan to Register', dim / 2, dim - 40);

        const a = document.createElement('a');
        a.download = 'securepass-qr-code.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const svg = document.querySelector('#qr-code-svg svg');
    if (!svg) return;
    const svgHtml = new XMLSerializer().serializeToString(svg);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SECUREPASS QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; margin: 0; }
            .logo { font-size: 32px; font-weight: 900; color: #1e1b4b; margin-bottom: 8px; }
            .sub { font-size: 14px; color: #6366f1; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 3px; }
            .qr { padding: 24px; border: 3px solid #e2e8f0; border-radius: 20px; }
            .scan { font-size: 18px; color: #334155; margin-top: 24px; font-weight: 600; }
            .url { font-size: 11px; color: #94a3b8; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="logo">SECUREPASS</div>
          <div class="sub">Visitor Registration</div>
          <div class="qr">${svgHtml}</div>
          <div class="scan">📱 Scan to Register Your Visit</div>
          <div class="url">${registrationUrl}</div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800">QR Code Access</h2>
        <p className="text-sm text-slate-400 mt-1">
          Display this QR code at the entrance for contactless visitor self-registration
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-scale-in overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="p-8 text-center">
            {/* Size selector */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 w-fit mx-auto mb-6">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    size === s
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div
              id="qr-code-svg"
              className="inline-flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border-2 border-slate-100 mb-6 transition-all duration-300"
            >
              {/* Mini logo above QR */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-extrabold text-slate-800 tracking-tight">
                  SECUREPASS
                </span>
              </div>

              <QRCodeSVG
                value={registrationUrl}
                size={qrSizes[size]}
                level="H"
                includeMargin={false}
                fgColor="#1e1b4b"
                bgColor="#ffffff"
              />

              <p className="text-xs text-indigo-600 font-semibold mt-4 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Scan to Register
              </p>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Visitor Self-Registration
            </h3>
            <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
              Visitors scan this QR code with their phone camera to register
              themselves before entering
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={downloadQR}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={printQR}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={copyLink}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5 animate-fade-in">
          {/* How it works */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-indigo-600" />
              </div>
              How It Works
            </h3>
            <div className="space-y-5">
              {[
                {
                  step: 1,
                  title: 'Display at Entrance',
                  desc: 'Print or show the QR code on a screen at your security desk or entrance gate',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  step: 2,
                  title: 'Visitor Scans QR',
                  desc: 'The visitor opens their phone camera and scans the code — no app needed',
                  color: 'from-violet-500 to-purple-500',
                },
                {
                  step: 3,
                  title: 'Self-Registration',
                  desc: 'They fill in their details on a beautiful mobile form with guided steps',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  step: 4,
                  title: 'Security Confirms',
                  desc: 'The record appears on your dashboard instantly for verification',
                  color: 'from-emerald-500 to-teal-500',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}
                  >
                    {item.step}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-semibold text-slate-700 text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URL */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
            <h4 className="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Direct Registration Link
            </h4>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-indigo-100">
              <code className="flex-1 text-xs text-slate-600 truncate font-mono">
                {registrationUrl}
              </code>
              <button
                onClick={copyLink}
                className="text-indigo-500 hover:text-indigo-700 transition-colors shrink-0"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3">
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Preview the registration page
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
            <h4 className="font-bold text-amber-800 text-sm mb-2">
              💡 Tips for Best Results
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
                Print the QR code on A4 or larger for easy scanning
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
                Place it at eye level near the entrance
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
                Ensure good lighting for reliable scanning
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
                Test the QR code periodically to verify it works
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;