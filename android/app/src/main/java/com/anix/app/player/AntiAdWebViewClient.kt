package com.anix.app.player

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.net.Uri
import android.util.Log
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * Sandboxed Anti-Ad WebView Client for VIP Stream Engine
 * Handles third-party embeds (Abyss, Mux, Demux, ECDN).
 * 
 * Strict Protections:
 * 1. Blocks popup tabs & windows (via settings.setSupportMultipleWindows(false)).
 * 2. Overrides shouldOverrideUrlLoading to strictly reject any redirect or popunder
 *    that doesn't match the authorized base media domain.
 * 3. Injects custom JS stylesheet and DOM mutators on onPageFinished to neutralize
 *    ad overlays, fake play buttons, invisible transparent click-interceptors,
 *    and prevents window.open / alert hijackings.
 */
class AntiAdWebViewClient(
    private val allowedHostDomain: String,
    private val isVipUser: Boolean,
    private val onAdBlocked: (blockedUrl: String) -> Unit = {}
) : WebViewClient() {

    companion object {
        private const val TAG = "AntiAdSandbox"
        
        // Known intrusive advertising, telemetry & pop-under domains
        private val BLOCKED_AD_DOMAINS = listOf(
            "adsterra.com", "popads.net", "propellerads.com", "exoclick.com",
            "doubleclick.net", "google-analytics.com", "clickadu.com", "onclickprediction.com",
            "trafficjunky.com", "adnxs.com", "adtrue.com", "syndication.exoclick.com",
            "juicyads.com", "coinhive.com", "mgid.com", "outbrain.com", "taboola.com"
        )

        // CSS rules injected to vaporize clickjacking overlays and fake player controls
        private val AD_STRIP_CSS = """
            iframe[id*='google'], iframe[src*='ad'], div[class*='ad-'], div[id*='ad-'],
            div[class*='banner'], div[id*='banner'], .overlay-ad, .popup-ad,
            div[style*='z-index: 2147483647'], div[style*='position: fixed'],
            div[onclick*='window.open'], a[target='_blank'][href*='http'],
            .fake-play-btn, #fake-player, [data-ad], .native-ad-container {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                pointer-events: none !important;
                opacity: 0 !important;
            }
            body, html {
                overflow: hidden !important;
            }
            video {
                z-index: 999999 !important;
                position: relative !important;
                pointer-events: auto !important;
            }
        """.trimIndent().replace("\n", " ")

        // Injected JavaScript sandbox script
        private val AD_SHIELD_JS = """
            (function() {
                // 1. Kill window.open pop-unders and alerts
                window.open = function(url) {
                    console.log('ANIX Sandbox blocked window.open popup: ' + url);
                    return null;
                };
                window.alert = function() { return null; };
                window.confirm = function() { return false; };
                window.prompt = function() { return null; };

                // 2. Inject CSS style block into document head
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = "$AD_STRIP_CSS";
                if (document.head) {
                    document.head.appendChild(style);
                } else {
                    document.documentElement.appendChild(style);
                }

                // 3. Remove transparent interceptor layers
                function purgeClickTraps() {
                    var allDivs = document.querySelectorAll('div, a');
                    for (var i = 0; i < allDivs.length; i++) {
                        var el = allDivs[i];
                        var z = window.getComputedStyle(el).zIndex;
                        if (z && parseInt(z) > 1000 && !el.querySelector('video')) {
                            el.remove();
                        }
                    }
                }
                purgeClickTraps();
                setInterval(purgeClickTraps, 1500);

                // 4. Force video autoplay and un-mute if requested
                var vids = document.getElementsByTagName('video');
                for (var j = 0; j < vids.length; j++) {
                    vids[j].setAttribute('playsinline', '');
                    vids[j].setAttribute('webkit-playsinline', '');
                    vids[j].controls = true;
                }
                console.log('ANIX VIP Anti-Ad Sandbox successfully activated.');
            })();
        """.trimIndent()
    }

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url?.toString() ?: return false
        val uri = Uri.parse(url)
        val host = uri.host ?: ""

        // If VIP and host does not match the embed video provider host domain, BLOCK IT!
        if (isVipUser) {
            val isAuthorized = allowedHostDomain.isNotEmpty() && 
                    (host.equals(allowedHostDomain, ignoreCase = true) || 
                     host.endsWith(".$allowedHostDomain", ignoreCase = true))

            if (!isAuthorized) {
                Log.w(TAG, "BLOCKED unauthorized redirect: $url (Host: $host)")
                onAdBlocked(url)
                return true // Cancel navigation, stay in video sandbox
            }
        }

        // Check against known ad blacklist
        for (adDomain in BLOCKED_AD_DOMAINS) {
            if (host.contains(adDomain, ignoreCase = true)) {
                Log.w(TAG, "BLOCKED Ad Network domain: $host")
                onAdBlocked(url)
                return true
            }
        }

        // Allow legitimate media requests on same host
        return false
    }

    override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
        val url = request?.url?.toString() ?: return null
        val host = request.url?.host ?: ""

        if (isVipUser) {
            for (adDomain in BLOCKED_AD_DOMAINS) {
                if (host.contains(adDomain, ignoreCase = true)) {
                    Log.d(TAG, "Ad request intercepted & silenced: $url")
                    return WebResourceResponse("text/plain", "utf-8", 204, "No Content", null, null)
                }
            }
        }

        return super.shouldInterceptRequest(view, request)
    }

    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        super.onPageStarted(view, url, favicon)
        if (isVipUser && view != null) {
            view.evaluateJavascript(AD_SHIELD_JS, null)
        }
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        if (isVipUser && view != null) {
            view.evaluateJavascript(AD_SHIELD_JS, null)
        }
    }
}
