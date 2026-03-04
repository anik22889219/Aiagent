# Eker AI Control Center — Netlify দিয়ে GitHub থেকে Live Deploy (সুন্দর ইন্সটল গাইড)

নিচের ধাপগুলো অনুসরণ করে আপনি GitHub রিপোকে Netlify-এ কনফিগার করে লাইভ সাইট পাবেন। নির্দেশগুলো স্বচ্ছ ও কমান্ডসমেত দেওয়া আছে — প্রয়োজনে কপি করে চালান।

## ১) প্রস্তুতি
- নিশ্চিত করুন আপনার `frontend` ফোল্ডারে React অ্যাপ আছে এবং `package.json`-এ `build` স্ক্রিপ্ট রয়েছে (`npm run build`)।
- ব্যাকএন্ড API যদি আলাদা সার্ভারে চলে, তাহলে তার URL পরিবেশভেরিয়েবলে দিন (`REACT_APP_API_URL`)।

## ২) Netlify-তে সাইন ইন / সাইন আপ
1. https://app.netlify.com এ যান এবং GitHub অ্যাকাউন্ট দিয়ে লগইন করুন।
2. "New site from Git" বাটনে ক্লিক করুন।

## ৩) রিপোজিটরি নির্বাচন ও কনফিগারেশন
1. Git provider হিসেবে `GitHub` নির্বাচন করুন এবং Netlify-কে রিপো অ্যাক্সেস দিতে অনুমতি দিন।
2. আপনার GitHub রিপো সিলেক্ট করুন (উদাহরণ: `your-username/eker-ai-control-center`)।
3. Build settings:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/build`

> আমি `netlify.toml` ফাইলও রিপোতে রেখেছি — Netlify সাধারণত এটাকে রিড করে, কিন্তু আপনি UI-থেকে একই কনফিগারেশনও দিতে পারেন।

## ৪) Environment variables
- যদি আপনার ফ্রন্টএন্ড `REACT_APP_API_URL` ব্যবহার করে থাকে, সেটি Netlify site settings → Build & deploy → Environment → Environment variables এ যোগ করুন:
  - `REACT_APP_API_URL` = `https://your-backend.example.com` (আপনার ব্যাকএন্ড-url)
- যদি JWT secret বা অন্য গোপনীয়তা কেবল ব্যাকএন্ডে লাগে, Netlify-এ রাখবেন না — শুধুমাত্র ফ্রন্টএন্ডের দরকারি API URL দিন।

## ৫) Single Page App (SPA) রাউটিং
- SPA রিকোয়েস্টগুলো `index.html` এ রিডাইরেক্ট করার জন্য `frontend/public/_redirects` ফাইল যোগ করা আছে:
```
/*    /index.html   200
```
এই ফাইলটি Netlify build-এ কপি হবে এবং সঠিকভাবে ফ্রন্টএন্ড রাউটিং কাজ করবে।

## ৬) প্রথম Deploy
- সবকিছু কনফিগার করার পর Netlify automatic build শুরু করবে। প্রথম ডিপ্লয় সফল হলে Netlify আপনাকে একটি সাবডোমেইন দিবে যেমন `adoring-euler-12345.netlify.app`।
- আপনি চাইলে Site settings → Domain management থেকে কাস্টম ডোমেইন যোগ করতে পারেন।

## ৭) Deploy Badge & README ইন্টিগ্রেশন
- আপনি README.md-এ Netlify build badge যোগ করতে পারেন (Netlify UI থেকে badge URL কপি করে) — উদাহরণ:

```
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)
```

## ৮) লোকালেই দ্রুত পরীক্ষা করতে চাইলে
- ফ্রন্টএন্ড লোকালি রান:

```bash
cd frontend
npm install
npm start
```
- ব্যাকএন্ড লোকালি চালু থাকলে `REACT_APP_API_URL=http://localhost:5000` সেট করে ব্রাউজ করতে পারেন।

## ৯) সমস্যা সমাধান (Troubleshooting)
- Build failed হলে Netlify Deploy log দেখুন — সাধারণত `npm install` বা `build` কমান্ডে এরর থাকে।
- যদি প্যাকেজ ইন্সটল নাও হয় (CI পরিবেশে), Netlify UI থেকে Node version (Environment → Build image settings) মিলিয়ে নিন অথবা `engine` সেট করুন `package.json`-এ।

---
**সফল ডিপ্লয় হলে আমাকে বলুন — আমি README-এ Netlify badge যোগ করে দেব এবং প্রয়োজনে কাস্টম ডোমেইন সেটআপের ধাপও সাজিয়ে দিব।**
