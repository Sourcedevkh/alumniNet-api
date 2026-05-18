const getCertificateSuccessHtml = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Successful</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; }
        </style>
    </head>
    <body class="bg-slate-50 flex items-center justify-center min-h-screen p-4">
    
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100 transform transition-all scale-100 animate-fade-in">
            
            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
                <svg class="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
    
            <h1 class="text-2xl font-bold text-slate-800 mb-2">Scan Successful!</h1>
            <p class="text-emerald-600 font-semibold text-sm bg-emerald-50 inline-block px-3 py-1 rounded-full mb-6">
                ✓ Verified Authentic
            </p>
    
            <div class="bg-slate-50 rounded-xl p-5 text-left mb-6 border border-slate-100">
                <h3 class="font-bold text-slate-700 text-sm mb-1">What happens next?</h3>
                <p class="text-slate-600 text-sm leading-relaxed">
                    Your official graduation certificate layout has been securely generated and sent directly to your registered email address inbox.
                </p>
            </div>
    
            <div class="flex items-start gap-3 text-left p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-8">
                <span class="text-xl">📩</span>
                <div>
                    <p class="text-xs font-semibold text-blue-900">Check Your Inbox</p>
                    <p class="text-xs text-blue-700 mt-0.5">Please check your email on your phone or computer to download and print your official high-resolution PDF document.</p>
                </div>
            </div>
    
            <div class="border-t border-slate-100 pt-4">
                <p class="text-xs text-slate-400">&copy; ${new Date().getFullYear()} AlumniNet. All rights reserved.</p>
            </div>
    
        </div>
    
    </body>
    </html>
    `;
};

module.exports = getCertificateSuccessHtml;