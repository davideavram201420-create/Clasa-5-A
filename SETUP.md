# Clasa 5 A Website - Setup Guide

## 🔥 Firebase Setup (To sync announcements across all devices)

To make announcements visible on all devices (phone, PC, laptop, tablet), follow these steps:

### Step 1: Create Firebase Project

1. Go to https://firebase.google.com/
2. Click "Get Started" → "Add Project"
3. Project name: `clasa-5a-website`
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### Step 2: Get Firebase Configuration

1. In your Firebase project, click the **Web icon** (&lt;/&gt;)
2. App nickname: `Clasa 5A Web App`
3. Click "Register app"
4. Copy the `firebaseConfig` object

### Step 3: Enable Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose location: **Europe (eur3)**
4. Start in **Test mode** (for now)
5. Click "Enable"

### Step 4: Update Security Rules

1. In Realtime Database, go to **Rules** tab
2. Replace with:

```json
{
  "rules": {
    "announcements": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click "Publish"

### Step 5: Update script.js

1. Open `script.js`
2. Find the `firebaseConfig` object (lines 4-11)
3. Replace it with YOUR config from Step 2

### Step 6: Deploy

Upload all files to:
- **Netlify** (recommended): https://netlify.com
- **GitHub Pages**: https://pages.github.com
- **Vercel**: https://vercel.com

---

## ✨ Features

✅ **Cross-Device Sync** - Announcements appear on ALL devices in real-time
✅ **Delete Announcements** - Admins can remove announcements with 🗑️ button
✅ **Responsive Design** - Works perfectly on phone, tablet, laptop, PC
✅ **Admin Mode** - Secure password protection
✅ **Real-time Updates** - Changes sync instantly

---

## 🎯 Quick Start (Without Firebase)

If you don't want to set up Firebase yet:
1. The website will work with **localStorage** (single device only)
2. Announcements will only be visible on the device where they were created
3. To get cross-device sync, complete the Firebase setup above

---

## 📱 Testing on Different Devices

Once deployed with Firebase:
1. Open website on your **phone**
2. Open website on your **PC**
3. Login as admin and create announcement
4. **Both devices will update instantly!** 🎉

---

## 🔐 Admin Password

`Davr1889?!`

---

## 🆘 Need Help?

If Firebase seems complicated, you can:
1. Deploy to Netlify first (announcements work on single device)
2. Ask your teacher/parent to help with Firebase setup
3. Or just use localStorage for now - it still works great!

---

Created with ❤️ for Clasa 5 A
