if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>a(e,n),d={module:{uri:n},exports:t,require:r};s[n]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Group 32.png",revision:"10c65957943ede0b10200cc28caac0ef"},{url:"/Logo-ISO-14001.png",revision:"5329d20e3b721e65763c69bb9f45df69"},{url:"/Logo-ISO-45001.jpg",revision:"fd50378e7a230647c1f6b3d3a600bea7"},{url:"/_next/static/1FhnPxL0zQpJq1JghvKC3/_buildManifest.js",revision:"0c175449bfb57e2394975365757e8060"},{url:"/_next/static/1FhnPxL0zQpJq1JghvKC3/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/2852872c-304323d344ff1d1e.js",revision:"304323d344ff1d1e"},{url:"/_next/static/chunks/5629-e53127f1ab67f6d8.js",revision:"e53127f1ab67f6d8"},{url:"/_next/static/chunks/5675-46b0182a740430bc.js",revision:"46b0182a740430bc"},{url:"/_next/static/chunks/636.24efb11d490f21d4.js",revision:"24efb11d490f21d4"},{url:"/_next/static/chunks/72a30a16.88fa0c25e6f6c388.js",revision:"88fa0c25e6f6c388"},{url:"/_next/static/chunks/75fc9c18-02b28d24f737c2ca.js",revision:"02b28d24f737c2ca"},{url:"/_next/static/chunks/7856.189e6f26e87d9814.js",revision:"189e6f26e87d9814"},{url:"/_next/static/chunks/ad7f724d-b7be9ddcc22d5969.js",revision:"b7be9ddcc22d5969"},{url:"/_next/static/chunks/e78312c5-197a50abe7be1634.js",revision:"197a50abe7be1634"},{url:"/_next/static/chunks/framework-ca706bf673a13738.js",revision:"ca706bf673a13738"},{url:"/_next/static/chunks/main-2a40bf14d4849667.js",revision:"2a40bf14d4849667"},{url:"/_next/static/chunks/pages/404-575b98fbae139037.js",revision:"575b98fbae139037"},{url:"/_next/static/chunks/pages/_app-1b589e94b441f0f1.js",revision:"1b589e94b441f0f1"},{url:"/_next/static/chunks/pages/_error-e4216aab802f5810.js",revision:"e4216aab802f5810"},{url:"/_next/static/chunks/pages/absensi-7b8232282b6d5d55.js",revision:"7b8232282b6d5d55"},{url:"/_next/static/chunks/pages/dashboard-ec8792fe7b635e45.js",revision:"ec8792fe7b635e45"},{url:"/_next/static/chunks/pages/director/approval-1fa5f017a8dda5e4.js",revision:"1fa5f017a8dda5e4"},{url:"/_next/static/chunks/pages/director/approvalMr-168f3b5e5c331a52.js",revision:"168f3b5e5c331a52"},{url:"/_next/static/chunks/pages/director/approvalMr/%5Bid%5D-e328a9cb7669754c.js",revision:"e328a9cb7669754c"},{url:"/_next/static/chunks/pages/director/approvalPo-912f089f8c6fa6c5.js",revision:"912f089f8c6fa6c5"},{url:"/_next/static/chunks/pages/director/approvalSo-5f71553682e59ff8.js",revision:"5f71553682e59ff8"},{url:"/_next/static/chunks/pages/director/approvalSr-d32630f2f0b20b9c.js",revision:"d32630f2f0b20b9c"},{url:"/_next/static/chunks/pages/director/approvalSr/%5Bid%5D-24788cb5686441a4.js",revision:"24788cb5686441a4"},{url:"/_next/static/chunks/pages/engineering/bill-of-material-6345414be2e58c76.js",revision:"6345414be2e58c76"},{url:"/_next/static/chunks/pages/engineering/drawing-305e847205c9ea36.js",revision:"305e847205c9ea36"},{url:"/_next/static/chunks/pages/engineering/equipment-part-2fb24de364677019.js",revision:"2fb24de364677019"},{url:"/_next/static/chunks/pages/engineering/material-7f0d6f6ccfd49e68.js",revision:"7f0d6f6ccfd49e68"},{url:"/_next/static/chunks/pages/engineering/material-type-c19749121eebd4f2.js",revision:"c19749121eebd4f2"},{url:"/_next/static/chunks/pages/engineering/sumary-report-e74f7998341ffb71.js",revision:"e74f7998341ffb71"},{url:"/_next/static/chunks/pages/finance-accounting/cashier-05c4609a85d9ebdf.js",revision:"05c4609a85d9ebdf"},{url:"/_next/static/chunks/pages/finance-accounting/chart-of-accounts-c3ad589f9f9242e5.js",revision:"c3ad589f9f9242e5"},{url:"/_next/static/chunks/pages/finance-accounting/due-payment-c41c7369173593a5.js",revision:"c41c7369173593a5"},{url:"/_next/static/chunks/pages/finance-accounting/general-ledger-dc30e5540847f2b9.js",revision:"dc30e5540847f2b9"},{url:"/_next/static/chunks/pages/finance-accounting/journal-fc8cdfca08f79008.js",revision:"fc8cdfca08f79008"},{url:"/_next/static/chunks/pages/finance-accounting/kontra-bon-b3a160bfd9ee206a.js",revision:"b3a160bfd9ee206a"},{url:"/_next/static/chunks/pages/finance-accounting/posting-32dcaa862362d518.js",revision:"32dcaa862362d518"},{url:"/_next/static/chunks/pages/general-affair/delivery-order-fc2cace75f010662.js",revision:"fc2cace75f010662"},{url:"/_next/static/chunks/pages/general-affair/equipment-part-c31b175a16d069e1.js",revision:"c31b175a16d069e1"},{url:"/_next/static/chunks/pages/general-affair/material-98cfb79c13f962c1.js",revision:"98cfb79c13f962c1"},{url:"/_next/static/chunks/pages/general-affair/material-remaind-use-05bfe4da8c7d3fa3.js",revision:"05bfe4da8c7d3fa3"},{url:"/_next/static/chunks/pages/general-affair/material-type-4570a0d56ce5886e.js",revision:"4570a0d56ce5886e"},{url:"/_next/static/chunks/pages/general-affair/outgoing-material-382e9c6ab1cd3040.js",revision:"382e9c6ab1cd3040"},{url:"/_next/static/chunks/pages/general-affair/purchase-receive-c4af9f86db498ab9.js",revision:"c4af9f86db498ab9"},{url:"/_next/static/chunks/pages/general-affair/warehouse-188dc30a620f27e2.js",revision:"188dc30a620f27e2"},{url:"/_next/static/chunks/pages/hrd-ga/departement-86a92903323e2c7b.js",revision:"86a92903323e2c7b"},{url:"/_next/static/chunks/pages/hrd-ga/employe-7cdf2e32ba764974.js",revision:"7cdf2e32ba764974"},{url:"/_next/static/chunks/pages/hrd-ga/register-new-user-d626e7321588d4f6.js",revision:"d626e7321588d4f6"},{url:"/_next/static/chunks/pages/hrd-ga/time-sheet-60cd543ba25e1dc3.js",revision:"60cd543ba25e1dc3"},{url:"/_next/static/chunks/pages/index-385f73a75a2d993d.js",revision:"385f73a75a2d993d"},{url:"/_next/static/chunks/pages/marketing/customer-76cffaa2d3b2a24d.js",revision:"76cffaa2d3b2a24d"},{url:"/_next/static/chunks/pages/marketing/customer-po-9b7ab2b96d004837.js",revision:"9b7ab2b96d004837"},{url:"/_next/static/chunks/pages/marketing/customer/%5Bid%5D-546d05c901137910.js",revision:"546d05c901137910"},{url:"/_next/static/chunks/pages/marketing/job-status-21ff67c050bc4bc9.js",revision:"21ff67c050bc4bc9"},{url:"/_next/static/chunks/pages/marketing/material-stok-8be0e887b6446058.js",revision:"8be0e887b6446058"},{url:"/_next/static/chunks/pages/marketing/quotation-0ea0aa641ef06a1c.js",revision:"0ea0aa641ef06a1c"},{url:"/_next/static/chunks/pages/marketing/quotation/%5Bid%5D-bca18823a0cf0efc.js",revision:"bca18823a0cf0efc"},{url:"/_next/static/chunks/pages/marketing/work-order-release-eef8ac7c58af7305.js",revision:"eef8ac7c58af7305"},{url:"/_next/static/chunks/pages/master-data/activity-e8feb974d16f2975.js",revision:"e8feb974d16f2975"},{url:"/_next/static/chunks/pages/master-data/customer-ced175a1fbba6e67.js",revision:"ced175a1fbba6e67"},{url:"/_next/static/chunks/pages/master-data/departement-a48c94e02eaacc23.js",revision:"a48c94e02eaacc23"},{url:"/_next/static/chunks/pages/master-data/employe-563979242a38320c.js",revision:"563979242a38320c"},{url:"/_next/static/chunks/pages/master-data/equipment-part-5089f4fbcd4ed6a5.js",revision:"5089f4fbcd4ed6a5"},{url:"/_next/static/chunks/pages/master-data/holiday-9e4bc4d9964c5b4d.js",revision:"9e4bc4d9964c5b4d"},{url:"/_next/static/chunks/pages/master-data/material-984767876d500568.js",revision:"984767876d500568"},{url:"/_next/static/chunks/pages/master-data/material-type-b5d8a37361265eed.js",revision:"b5d8a37361265eed"},{url:"/_next/static/chunks/pages/master-data/supplier-908e246c2b8ca96c.js",revision:"908e246c2b8ca96c"},{url:"/_next/static/chunks/pages/master-data/worker-center-856bbd66fcd4a2c4.js",revision:"856bbd66fcd4a2c4"},{url:"/_next/static/chunks/pages/production/activity-74b444ba061894b8.js",revision:"74b444ba061894b8"},{url:"/_next/static/chunks/pages/production/dispatch-2317d3896da2e7b6.js",revision:"2317d3896da2e7b6"},{url:"/_next/static/chunks/pages/production/equipment-part-38d1514db4ea51f8.js",revision:"38d1514db4ea51f8"},{url:"/_next/static/chunks/pages/production/time-schedule-5dba4c08eb98df09.js",revision:"5dba4c08eb98df09"},{url:"/_next/static/chunks/pages/production/worker-center-8aff81d7eee37d8d.js",revision:"8aff81d7eee37d8d"},{url:"/_next/static/chunks/pages/public/absensi-404f9723e08383c1.js",revision:"404f9723e08383c1"},{url:"/_next/static/chunks/pages/public/cash-advance-d809853a579950f7.js",revision:"d809853a579950f7"},{url:"/_next/static/chunks/pages/public/delivery-order-f4a5aeb44d4d8921.js",revision:"f4a5aeb44d4d8921"},{url:"/_next/static/chunks/pages/public/employe-ed2c0e1753d74808.js",revision:"ed2c0e1753d74808"},{url:"/_next/static/chunks/pages/public/master-material-d2f2d932b29e1dc3.js",revision:"d2f2d932b29e1dc3"},{url:"/_next/static/chunks/pages/public/mr-d2cd1932dfa28fde.js",revision:"d2cd1932dfa28fde"},{url:"/_next/static/chunks/pages/public/spj-cash-advance-42a5eb8fdf1b7a02.js",revision:"42a5eb8fdf1b7a02"},{url:"/_next/static/chunks/pages/public/spkl-7c4928ec4229c95b.js",revision:"7c4928ec4229c95b"},{url:"/_next/static/chunks/pages/public/sr-b65e4575ff862723.js",revision:"b65e4575ff862723"},{url:"/_next/static/chunks/pages/public/time-sheet-c149dba0292ab397.js",revision:"c149dba0292ab397"},{url:"/_next/static/chunks/pages/public/work-order-release-d023e26902851ce7.js",revision:"d023e26902851ce7"},{url:"/_next/static/chunks/pages/purchasing-logistic/approval-mr-b62bf268953b8faa.js",revision:"b62bf268953b8faa"},{url:"/_next/static/chunks/pages/purchasing-logistic/approval-mr/%5Bid%5D-547b34627afba3f4.js",revision:"547b34627afba3f4"},{url:"/_next/static/chunks/pages/purchasing-logistic/approval-sr-009b8714f6953e6a.js",revision:"009b8714f6953e6a"},{url:"/_next/static/chunks/pages/purchasing-logistic/approval-sr/%5Bid%5D-f581ab9ef5d2aa5b.js",revision:"f581ab9ef5d2aa5b"},{url:"/_next/static/chunks/pages/purchasing-logistic/delivery-order-7d13e59d8c0353ff.js",revision:"7d13e59d8c0353ff"},{url:"/_next/static/chunks/pages/purchasing-logistic/direct-mr-e20d56d08b7ebd14.js",revision:"e20d56d08b7ebd14"},{url:"/_next/static/chunks/pages/purchasing-logistic/direct-sr-6e0ecc9cb17682e5.js",revision:"6e0ecc9cb17682e5"},{url:"/_next/static/chunks/pages/purchasing-logistic/equipment-part-18323716c4261e46.js",revision:"18323716c4261e46"},{url:"/_next/static/chunks/pages/purchasing-logistic/list-dirrect-purchase-7c6f11ef200c9646.js",revision:"7c6f11ef200c9646"},{url:"/_next/static/chunks/pages/purchasing-logistic/list-dirrect-service-26310d522ed5b303.js",revision:"26310d522ed5b303"},{url:"/_next/static/chunks/pages/purchasing-logistic/list-po-7a53be0eb558fd2d.js",revision:"7a53be0eb558fd2d"},{url:"/_next/static/chunks/pages/purchasing-logistic/list-so-d8647361fb41ee2b.js",revision:"d8647361fb41ee2b"},{url:"/_next/static/chunks/pages/purchasing-logistic/material-51964a283534e8e1.js",revision:"51964a283534e8e1"},{url:"/_next/static/chunks/pages/purchasing-logistic/material-remaind-use-26c1090914fd50c5.js",revision:"26c1090914fd50c5"},{url:"/_next/static/chunks/pages/purchasing-logistic/material-type-f594fef624ccc0cf.js",revision:"f594fef624ccc0cf"},{url:"/_next/static/chunks/pages/purchasing-logistic/outgoing-material-0decd6f6d0f74404.js",revision:"0decd6f6d0f74404"},{url:"/_next/static/chunks/pages/purchasing-logistic/purchase-mr-8eafd422823ffb09.js",revision:"8eafd422823ffb09"},{url:"/_next/static/chunks/pages/purchasing-logistic/purchase-mr/%5Bid%5D-210bc2dc1e0f9569.js",revision:"210bc2dc1e0f9569"},{url:"/_next/static/chunks/pages/purchasing-logistic/purchase-order-84f63392bec1089b.js",revision:"84f63392bec1089b"},{url:"/_next/static/chunks/pages/purchasing-logistic/purchase-receive-dca39d0687fe042a.js",revision:"dca39d0687fe042a"},{url:"/_next/static/chunks/pages/purchasing-logistic/purchase-sr-1f1f5128ad1143af.js",revision:"1f1f5128ad1143af"},{url:"/_next/static/chunks/pages/purchasing-logistic/service-order-88a13d2d73fa1783.js",revision:"88a13d2d73fa1783"},{url:"/_next/static/chunks/pages/purchasing-logistic/spj-purchase-204518e34e7374e9.js",revision:"204518e34e7374e9"},{url:"/_next/static/chunks/pages/purchasing-logistic/supplier-bd7e43ee3fb851de.js",revision:"bd7e43ee3fb851de"},{url:"/_next/static/chunks/pages/purchasing-logistic/warehouse-03a8d16feda0119d.js",revision:"03a8d16feda0119d"},{url:"/_next/static/chunks/pages/report/material-name-info-6f183e4e57c95271.js",revision:"6f183e4e57c95271"},{url:"/_next/static/chunks/pages/report/material-stok-3bbb7568a2695d8d.js",revision:"3bbb7568a2695d8d"},{url:"/_next/static/chunks/pages/user/account-efa6ce42d4e222b5.js",revision:"efa6ce42d4e222b5"},{url:"/_next/static/chunks/pages/utility/chart-of-accounts-59fb8cac87ddaddd.js",revision:"59fb8cac87ddaddd"},{url:"/_next/static/chunks/pages/utility/holiday-setting-505e8547bac94914.js",revision:"505e8547bac94914"},{url:"/_next/static/chunks/pages/utility/register-new-user-3a1cbdc26b9a2ecb.js",revision:"3a1cbdc26b9a2ecb"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-1739dbd160a91758.js",revision:"1739dbd160a91758"},{url:"/_next/static/css/fd58585840ebe4c5.css",revision:"fd58585840ebe4c5"},{url:"/_next/static/media/404.5657f10c.svg",revision:"c12d98d1f19f1b793e15f7d8b7881839"},{url:"/_next/static/media/Logo-ISO-14001.c00d3b09.png",revision:"5329d20e3b721e65763c69bb9f45df69"},{url:"/_next/static/media/Logo-ISO-45001.2c449a98.png",revision:"f2281c09faed42ee685b06c5ab9fd18d"},{url:"/_next/static/media/dwitama.36e111a2.png",revision:"15242583c0bf18a561c1dce24ef361b9"},{url:"/_next/static/media/logo-ISO-9001.4661189c.png",revision:"3312839f8b7dc6be42abede9e1eda95a"},{url:"/android-chrome-192x192.png",revision:"8b1c3e93eb1391dfe97f9ccbb039723f"},{url:"/android-chrome-512x512.png",revision:"53b1cdc09cb465fa5cc5919ca751ff87"},{url:"/apple-touch-icon.png",revision:"4378f6f00ef60bfaa1acb454252f734d"},{url:"/favicon-16x16-japa.jpeg",revision:"6383dd2d729d19d457e3c1780e7b3773"},{url:"/favicon-16x16.png",revision:"db6714003b56d6798f2169404392c396"},{url:"/favicon-16x161.png",revision:"ad5e2f8371d5decc76c9a7a18e4bda60"},{url:"/favicon-32x32.png",revision:"10675438a01e937baf682558f164cfec"},{url:"/favicons.ico",revision:"e5b423d13e810f2ce209191247b083f3"},{url:"/icon-192x192.png",revision:"4378f6f00ef60bfaa1acb454252f734d"},{url:"/icon-256x256.png",revision:"13456ab671d8e3637e479164e2042519"},{url:"/icon-384x384.png",revision:"9c539c4ee56f6af7fbb24e608ad95f6c"},{url:"/icon-512x512.png",revision:"15a9c222b84e32e0da031f151745cab8"},{url:"/japa-indomata.jpg",revision:"c87468b5e52f75d8bd9814fcd2b14fb3"},{url:"/logo-ISO-9001.png",revision:"3312839f8b7dc6be42abede9e1eda95a"},{url:"/manifest.json",revision:"b04ff82e8e4b329e2d0451f7c7d13a33"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/s.png",revision:"2c0335453964c82a38d53f6630b85011"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
