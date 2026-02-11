#!/bin/bash
# Script to fix Add to Cart buttons in blog posts
# This script finds blog posts with product links and converts them to cart buttons

BLOG_DIR="blog"
CART_JS_ADDED=false

# Function to add cart.js if not present
add_cart_js() {
    local file="$1"
    if ! grep -q "cart.js" "$file"; then
        # Find </body> tag and add cart.js before it
        if grep -q "</body>" "$file"; then
            sed -i.bak 's|</body>|<script src="../../scripts/global/cart.js"></script>\n</body>|' "$file"
            rm -f "${file}.bak"
            echo "Added cart.js to $file"
        fi
    fi
}

# Function to replace product links with cart buttons
replace_product_links() {
    local file="$1"
    local changed=false
    
    # Replace "Add to Cart" links for Moringa Powder
    if grep -q 'href="https://nutrithrive.com.au/products/product-detail.html".*Add to Cart' "$file"; then
        sed -i.bak 's|<a href="https://nutrithrive.com.au/products/product-detail.html"[^>]*>Add to Cart</a>|<button type="button" onclick="addProductToCartAndRedirect('\''moringa-powder'\'', '\''Moringa Powder'\'', 10.50, '\''https://i.imgur.com/PgvCFY0.png'\'')" style="background: #16a34a; color: white; padding: 10px 20px; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">Add to Cart</button>|g' "$file"
        rm -f "${file}.bak"
        changed=true
    fi
    
    # Replace "Buy Now" links for Moringa Powder  
    if grep -q 'href="https://nutrithrive.com.au/products/product-detail.html".*Buy Now' "$file"; then
        sed -i.bak 's|<a href="https://nutrithrive.com.au/products/product-detail.html"[^>]*>Buy Now</a>|<button type="button" onclick="addProductToCartAndRedirect('\''moringa-powder'\'', '\''Moringa Powder'\'', 10.50, '\''https://i.imgur.com/PgvCFY0.png'\'')" style="background: #175c36; color: white; padding: 0.8rem 2rem; border: none; border-radius: 50px; font-weight: 600; cursor: pointer;">Buy Now</button>|g' "$file"
        rm -f "${file}.bak"
        changed=true
    fi
    
    if [ "$changed" = true ]; then
        add_cart_js "$file"
        echo "Fixed buttons in $file"
    fi
}

# Process all blog HTML files
for file in "$BLOG_DIR"/*.html; do
    if [ -f "$file" ] && [ "$(basename "$file")" != "index.html" ]; then
        replace_product_links "$file"
    fi
done

echo "Done fixing blog buttons!"
