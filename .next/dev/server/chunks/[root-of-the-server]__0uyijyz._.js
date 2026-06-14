module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';
const DEFAULT_SITE_URL = 'https://chat.khatiwadasandesh.com.np/';
const DEFAULT_SITE_NAME = 'Sandesh Portal';
// THE FIX: Direct, strict system rules injected into the pipeline backend
const HARDCODED_SYSTEM_PROMPT = {
    role: 'system',
    content: 'You are the conversational heart of Sandesh AI. You must ALWAYS communicate strictly in English. Never use boring, generic, or robotic canned responses like "I don\'t have access to real-time data" or generic bullet-point templates. If you lack real-time data or news, be direct, conversational, witty, and deeply authentic instead of giving a generic overview. Keep your tone minimal, sharp, and intellectual.'
};
async function POST(request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
        const referer = process.env.YOUR_SITE_URL || DEFAULT_SITE_URL;
        const siteName = process.env.YOUR_SITE_NAME ? encodeURIComponent(process.env.YOUR_SITE_NAME) : DEFAULT_SITE_NAME;
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing OPENROUTER_API_KEY in environment variables.'
            }, {
                status: 500
            });
        }
        let body;
        try {
            body = await request.json();
        } catch  {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid JSON payload.'
            }, {
                status: 400
            });
        }
        // Clean and clean incoming context history
        let cleanMessages = Array.isArray(body.messages) ? body.messages.filter((message)=>{
            return message !== null && typeof message === 'object' && (message.role === 'system' || message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string' && message.content.trim().length > 0;
        }) : [];
        // Ensure our custom persona overrides any conflicting client states
        // Strip any older system initializations and prepend our rigid ruleset
        cleanMessages = cleanMessages.filter((m)=>m.role !== 'system');
        const finalPayloadMessages = [
            HARDCODED_SYSTEM_PROMPT,
            ...cleanMessages
        ].slice(-17); // 1 system + up to 16 history entries
        if (cleanMessages.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'At least one valid message is required.'
            }, {
                status: 400
            });
        }
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
        const targetUrl = `${cleanBaseUrl}/chat/completions`;
        const upstreamResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': referer,
                'X-OpenRouter-Title': siteName,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: finalPayloadMessages,
                stream: false,
                temperature: 0.7,
                top_p: 0.9
            })
        });
        if (!upstreamResponse.ok) {
            const errorText = await upstreamResponse.text().catch(()=>'Unable to read OpenRouter error body.');
            console.error(`OpenRouter upstream returned error ${upstreamResponse.status}:`, errorText);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'OpenRouter request failed.',
                detail: errorText
            }, {
                status: upstreamResponse.status
            });
        }
        const data = await upstreamResponse.json();
        const assistantText = data.choices?.[0]?.message?.content || 'No response returned from Nemotron.';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: assistantText,
            usage: data.usage || null
        });
    } catch (error) {
        console.error('OpenRouter Route Level Crash:', error);
        const detail = error instanceof Error ? error.message : 'Unexpected server error.';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unable to complete the chat request due to an internal loop crash.',
            detail
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0uyijyz._.js.map