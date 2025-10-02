# 📁 Modular Page Structure

Each page is now **completely independent** with its own files. Work on one page without affecting others!

## 🏗️ **Folder Structure**

```
pages/
├── homepage/
│   ├── index.html          # Homepage HTML
│   ├── homepage.css        # Homepage-specific styles
│   └── homepage.js         # Homepage-specific scripts
├── products/
│   ├── products.html       # Products page HTML
│   ├── products.css        # Products-specific styles
│   └── products.js         # Products-specific scripts
├── blog/
│   ├── blog.html           # Blog page HTML
│   ├── blog.css            # Blog-specific styles
│   └── blog.js             # Blog-specific scripts
├── about/
│   ├── about.html          # About page HTML
│   ├── about.css           # About-specific styles
│   └── about.js            # About-specific scripts
├── contact/
│   ├── contact.html        # Contact page HTML
│   ├── contact.css         # Contact-specific styles
│   └── contact.js          # Contact-specific scripts
├── benefits/
│   ├── moringa-benefits.html # Benefits page HTML
│   ├── benefits.css        # Benefits-specific styles
│   └── benefits.js           # Benefits-specific scripts
├── usage-guide/
│   ├── how-to-use-moringa.html # Usage guide HTML
│   ├── usage-guide.css     # Usage guide-specific styles
│   └── usage-guide.js      # Usage guide-specific scripts
├── shipping/
│   ├── shipping-returns.html # Shipping page HTML
│   ├── shipping.css        # Shipping-specific styles
│   └── shipping.js         # Shipping-specific scripts
└── faq/
    ├── faq.html            # FAQ page HTML
    ├── faq.css             # FAQ-specific styles
    └── faq.js              # FAQ-specific scripts

shared/
├── css/
│   └── style.css           # Shared base styles
├── js/
│   └── script.js           # Shared base scripts
└── images/                 # Shared images
```

## 🎯 **Benefits of This Structure**

### ✅ **Independent Development**
- Work on one page without affecting others
- Each page has its own CSS and JS files
- No conflicts between different pages

### ✅ **Easy Maintenance**
- Find all files for a specific page in one folder
- Make changes to one page without breaking others
- Clear separation of concerns

### ✅ **Scalable**
- Add new pages easily
- Each page can have unique functionality
- Shared assets in `shared/` folder

## 🚀 **How to Work with This Structure**

### **To edit a specific page:**
1. Go to `pages/[page-name]/` folder
2. Edit the HTML, CSS, or JS files in that folder
3. Changes only affect that specific page

### **To add a new page:**
1. Create new folder in `pages/`
2. Add HTML, CSS, and JS files
3. Copy shared assets if needed

### **To update shared elements:**
- Update `shared/css/style.css` for global styles
- Update `shared/js/script.js` for global scripts
- Update `shared/images/` for shared images

## 📝 **File Naming Convention**

- **HTML**: `[page-name].html`
- **CSS**: `[page-name].css`
- **JS**: `[page-name].js`

## 🔄 **Migration Complete**

All existing pages have been moved to this new structure. Each page is now completely independent!
