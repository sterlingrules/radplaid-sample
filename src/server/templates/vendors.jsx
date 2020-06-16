import { META_TITLE, META_DESCRIPTION, SEARCH_PARAMS } from './../../app/constants.jsx'

export const DEFAULT_HEADER = `
	<title>${META_TITLE}</title>

	<meta name="description" content="${META_DESCRIPTION}" />

	<meta name="apple-itunes-app" content="app-id=${process.env.APPLE_APP_ID}" />

	<meta property="fb:app_id" content="${process.env.FACEBOOK_APP_ID}" />
	<meta property="og:url" content="${process.env.BASE_CLIENT_URL}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="${META_TITLE}" />
	<meta property="og:description" content="${META_DESCRIPTION}" />
	<meta property="og:image" content="${process.env.BASE_CLIENT_URL}/img/og.jpg?${new Date().getTime()}" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@getradplaid" />
	<meta name="twitter:creator" content="@getradplaid" />
	<meta name="twitter:url" content="${process.env.BASE_CLIENT_URL}" />
	<meta name="twitter:title" content="${META_TITLE}" />
	<meta name="twitter:description" content="${META_DESCRIPTION}" />
	<meta name="twitter:image" content="${process.env.BASE_CLIENT_URL}/img/og.jpg?${new Date().getTime()}" />

	<link rel="canonical" href="${process.env.BASE_CLIENT_URL}" />
`

export const BRANCH_IO = `
	<script>
	(function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);
	branch.init("${process.env.BRANCH_IO_KEY}");
	</script>
`

export const MIXPANEL = `
	<!-- start Mixpanel --><script>(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,
	0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
	for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
	MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
	mixpanel.init("${process.env.MIXPANEL_KEY}");</script><!-- end Mixpanel -->
`

export const FACEBOOK_PIXEL = `
	<!-- Facebook Pixel Code -->
	<script>
		!function(f,b,e,v,n,t,s)
		{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};
		if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
		n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t,s)}(window,document,'script',
		'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '${process.env.FACEBOOK_PIXEL_ID}');
		fbq('track', 'PageView');
	</script>
	<!-- End Facebook Pixel Code -->
`

export const FACEBOOK_SDK = `
	<div id="fb-root"></div>
	<!-- <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.3&appId=${process.env.FACEBOOK_APP_ID}&autoLogAppEvents=1"></script> -->
	<script>
		window.fbAsyncInit = function() {
			FB.init({
				appId: '${process.env.FACEBOOK_APP_ID}',
				cookie: true,
				xfbml: true,
				version: 'v3.3'
			});

			FB.AppEvents.logPageView();
		};

		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
`

export const SENTRY_SDK = `
	<script defer src="https://browser.sentry-cdn.com/5.4.3/bundle.min.js" crossorigin="anonymous"></script>
`

export const GOOGLE_ANALYTICS = `
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', '${process.env.GA_ID}');
	${process.env.GA_CONVERSION_ID ?
		`gtag('config', '${process.env.GA_CONVERSION_ID}');` :
		''
	}
	</script>
`

export const SURVICATE = `
	<!-- Start of Survicate (www.survicate.com) code -->
	<script>
		(function (w) {
			var s = document.createElement('script');
			s.src = '//survey.survicate.com/workspaces/${process.env.SURVICATE_ID}/web_surveys.js';
			s.async = true;
			var e = document.getElementsByTagName('script')[0];
			e.parentNode.insertBefore(s, e);
		})(window);
	</script>
	<!-- End of Survicate code -->
`

export const DRIFT = `
	<!-- Start of Async Drift Code -->
	<script>
	"use strict";

	!function() {
	  var t = window.driftt = window.drift = window.driftt || [];
	  if (!t.init) {
		if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
		t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
		t.factory = function(e) {
		  return function() {
			var n = Array.prototype.slice.call(arguments);
			return n.unshift(e), t.push(n), t;
		  };
		}, t.methods.forEach(function(e) {
		  t[e] = t.factory(e);
		}), t.load = function(t) {
		  var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
		  o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
		  var i = document.getElementsByTagName("script")[0];
		  i.parentNode.insertBefore(o, i);
		};
	  }
	}();
	drift.SNIPPET_VERSION = '0.3.1';
	drift.load('${process.env.DRIFT_ID}');
	drift.on('ready', function (api) { return api.widget.hide() })
	</script>
	<!-- End of Async Drift Code -->
`

export const ONE_SIGNAL = `
	<script async defer src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"></script>
	<script>
		var OneSignal = window.OneSignal || [];

		function promptAndSubscribeUser() {
			window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
				if (!isEnabled) {
					console.log('showing native prompt')
					window.OneSignal.showNativePrompt();
				}
			});
		}

		OneSignal.push(function() {
			OneSignal.init({
				appId: "${process.env.ONE_SIGNAL_APP_ID}",
				subdomainName: "${process.env.ONE_SIGNAL_LABEL}.os.tc",
				notifyButton: {
					enable: false,
				},
				welcomeNotification: {
					title: "Thanks for subscribing!",
					message: "We'll keep you posted on your local music scene.",
				},
			});

			// In milliseconds, time to wait before prompting user.
			// This time is relative to right after the user
			// presses <ENTER> on the address bar and navigates to your page
			var notificationPromptDelay = 30000;

			// Use navigation timing to find out when the page actually
			// loaded instead of using setTimeout() only which can be
			// delayed by script execution
			var navigationStart = window.performance.timing.navigationStart;

			// Get current time
			var timeNow = Date.now();

			// Prompt the user if enough time has elapsed
			setTimeout(promptAndSubscribeUser, Math.max(notificationPromptDelay - (timeNow - navigationStart), 0));
		});
	</script>
`
