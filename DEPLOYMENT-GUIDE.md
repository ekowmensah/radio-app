# Deployment Guide - Hope FM Radio App

## Two Deployment Options

### Option 1: XAMPP Localhost (http://localhost/radioapp)
### Option 2: cPanel Live Server (https://hopefm999.radcast.online)

---

## 🏠 XAMPP Localhost Deployment

### Quick Deploy
```bash
deploy-xampp.bat
```

### What it does:
- Builds with `/radioapp/` base path
- Copies files to project root
- Ready at: http://localhost/radioapp

---

## 🌐 cPanel Live Server Deployment

### Step 1: Build for cPanel
```bash
build-cpanel.bat
```

### Step 2: Upload Files

**Upload from `dist` folder to cPanel `public_html`:**
- ✅ `index.html`
- ✅ `assets/` (entire folder)
- ✅ `logo.svg`
- ✅ `radio-icon.svg`

**Upload from project root:**
- ✅ `.htaccess-cpanel` → Rename to `.htaccess` on server

### Step 3: Verify

Visit: **https://hopefm999.radcast.online**

---

## 📝 File Structure Comparison

### XAMPP (localhost/radioapp)
```
c:/xampp/htdocs/radioapp/
├── index.html (paths: /radioapp/assets/...)
├── .htaccess (RewriteBase /radioapp/)
├── assets/
├── logo.svg
└── radio-icon.svg
```

### cPanel (root domain)
```
public_html/
├── index.html (paths: /assets/...)
├── .htaccess (RewriteBase /)
├── assets/
├── logo.svg
└── radio-icon.svg
```

---

## 🔧 Manual Configuration

If you need to manually switch between environments:

### For XAMPP:
1. Edit `vite.config.ts`: `base: '/radioapp/'`
2. Use `.htaccess` (already configured)
3. Run: `npm run build`
4. Run: `deploy-xampp.bat`

### For cPanel:
1. Edit `vite.config.ts`: `base: '/'`
2. Use `.htaccess-cpanel` (rename to .htaccess)
3. Run: `npm run build`
4. Upload `dist/` contents to public_html

---

## ⚡ Quick Reference

| Environment | Base Path | Access URL |
|------------|-----------|------------|
| XAMPP | `/radioapp/` | http://localhost/radioapp |
| cPanel | `/` | https://hopefm999.radcast.online |

---

## 🐛 Troubleshooting

### Blank Page on cPanel
- ✅ Check browser console (F12) for 404 errors
- ✅ Verify `.htaccess` uploaded correctly
- ✅ Ensure paths in index.html are `/assets/` not `/radioapp/assets/`
- ✅ Clear browser cache

### Blank Page on XAMPP
- ✅ Run `deploy-xampp.bat` to rebuild
- ✅ Check paths are `/radioapp/assets/`
- ✅ Verify XAMPP Apache is running

### Program Schedule Not Updating
- ✅ Edit `src/App.tsx` PROGRAMS array
- ✅ Rebuild: `deploy-xampp.bat` or `build-cpanel.bat`
- ✅ Re-upload to cPanel if needed

---

## 📞 Support

For issues, check:
1. Browser console (F12)
2. cPanel Error Logs
3. File permissions (644 for files, 755 for folders)
