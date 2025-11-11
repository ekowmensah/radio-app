# cPanel Deployment Guide

## Files Built Successfully!

Your app is now ready for cPanel deployment with the correct paths.

## Step-by-Step Deployment Instructions

### 1. Upload Files to cPanel

Upload the following files from the `dist` folder to your cPanel **public_html** directory:

```
dist/
├── index.html          → Upload to public_html/
├── assets/             → Upload entire folder to public_html/assets/
├── logo.svg            → Upload to public_html/
└── radio-icon.svg      → Upload to public_html/
```

### 2. Upload .htaccess File

Also upload the `.htaccess` file from the project root to `public_html/`:
```
.htaccess → Upload to public_html/
```

### 3. File Structure on cPanel

After uploading, your public_html should look like:
```
public_html/
├── index.html
├── .htaccess
├── logo.svg
├── radio-icon.svg
└── assets/
    ├── index-BgdRWLNU.css
    └── index-BAAFukLY.js
```

### 4. Access Your App

Visit: **https://yourdomain.com**

## If Uploading to a Subdirectory

If you want to access at `yourdomain.com/radio` instead:

1. Create a folder in public_html (e.g., `radio`)
2. Upload all files to `public_html/radio/`
3. Update `vite.config.ts` with `base: '/radio/'`
4. Update `.htaccess` RewriteBase to `/radio/`
5. Rebuild with `npm run build`

## Troubleshooting

### Blank Page Issues:
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Ensure .htaccess is uploaded
- Check file permissions (644 for files, 755 for folders)

### 404 Errors:
- Verify .htaccess is in the correct location
- Check that mod_rewrite is enabled in cPanel

### Assets Not Loading:
- Clear browser cache
- Check that assets folder uploaded completely
- Verify file paths in index.html

## For Local XAMPP Testing

To test locally again, run:
```
deploy-xampp.bat
```
(This will reconfigure for localhost/radioapp)

## Need Help?

- Check cPanel File Manager to verify uploads
- Use cPanel Error Log to see server errors
- Contact your hosting provider if mod_rewrite issues persist
