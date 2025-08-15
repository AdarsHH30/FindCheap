def choose_schema(query: str, max_products: int):
    schemas = {
        "amazon": {
            "name": "AmazonProducts",
            "baseSelector": "div.s-card-container, [data-component-type='s-search-result'], .s-result-item",
            "fields": [
                {
                    "name": "title",
                    "selector": "a h2 span, h2 a span, .a-size-mini span, .a-text-normal",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": "span.a-price > span.a-offscreen, .a-price-whole, .a-offscreen, .a-price .a-offscreen",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".a-text-price .a-offscreen, .a-price.a-text-price .a-offscreen",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a.a-link-normal.s-no-outline, h2 a, .a-link-normal",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "rating",
                    "selector": "span.a-icon-alt, .a-icon-alt, [aria-label*='stars']",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": "span.a-size-base.s-underline-text, .a-size-base, a[href*='reviews']",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": "img.s-image, .s-image, img[data-image-index], img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_data_src",
                    "selector": "img.s-image, .s-image, img[data-image-index], img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "prime",
                    "selector": ".a-icon-prime, [aria-label*='Prime']",
                    "type": "text",
                },
                {
                    "name": "delivery",
                    "selector": ".a-color-base.a-text-bold, [aria-label*='delivery'], .a-text-bold",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "flipkart": {
            "name": "FlipkartProducts",
            "baseSelector": "[data-id], ._1AtVbE, ._13oc-S, .s1Q9rs, ._1fQZEK",
            "fields": [
                {
                    "name": "title",
                    "selector": "a.wjcEIp, a[title], ._4rR01T, .s1Q9rs, .B_NuCI, .KzDlHZ, ._2WkVRV, ._4rR01T",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": "._30jeq3, ._1_WHN1, .Nx9bqj, ._25b18c, .srp-toolbar-offer-price, ._30jeq3._16Jk6d",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": "._3I9_wc, ._25b18c del, .srp-toolbar-compared-price, ._3auQ3N",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": "._3Ay6Sb, ._17oij5, .UkUFwK, ._1uv9Cb",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a, ._1fQZEK a, ._13oc-S a",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "rating",
                    "selector": "._3LWZlK, .XQDdHH, ._1lRcqv, .hGSR34",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": "span._2_R_DZ, .review-count, ._38sUEc, span._13vcmD",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": "img, ._396cs4 img, ._1XmrCc img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_data_src",
                    "selector": "img, ._396cs4 img, ._1XmrCc img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "plus_member",
                    "selector": "._2Ord5o, ._31Dcoz",
                    "type": "text",
                },
                {
                    "name": "delivery",
                    "selector": "._16FRp0, ._1O0s8x, .Fz99DH",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "snapdeal": {
            "name": "SnapdealProducts",
            "baseSelector": ".product-tuple-listing, .product-tuple, .col-xs-6",
            "fields": [
                {
                    "name": "title",
                    "selector": ".product-title, .product-desc-rating .product-title, p[itemprop='name']",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": ".lfloat.product-price, .product-price, span[itemprop='price']",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".product-desc-price .strike, .lfloat strike",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".product-discount, .product-desc-price .discount",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": ".dp-widget-link, a[itemprop='url'], .product-tuple-image a",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "rating",
                    "selector": ".filled-star, .rating-stars .filled-star, [itemprop='ratingValue']",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": ".product-rating-count, .rating-avg-container .product-rating-count",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": ".product-image img, img[itemprop='image'], .product-tuple-image img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_data_src",
                    "selector": ".product-image img, img[itemprop='image'], .product-tuple-image img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "delivery",
                    "selector": ".product-delivery-time, .delivery-time",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "jiomart": {
            "name": "JioMartProducts",
            "baseSelector": ".plp-card-container, .product-item, .product-card",
            "fields": [
                {
                    "name": "title",
                    "selector": ".plp-card-details-name, .product-title, .product-name",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": ".plp-card-details-price span.jm-heading-xxs, .current-price, .selling-price",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".plp-card-details-price .line-through, .original-price, .mrp-price",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".plp-card-details-discount .jm-badge, .discount-percentage, .offer-percentage",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a, .product-link",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "image",
                    "selector": ".plp-card-image img, .product-image img, img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_lazy",
                    "selector": ".plp-card-image img, .product-image img, img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "alt_text",
                    "selector": ".plp-card-image img, .product-image img, img",
                    "type": "attribute",
                    "attribute": "alt",
                },
                {
                    "name": "sku",
                    "selector": ".jm-wishlist-btn, [data-sku]",
                    "type": "attribute",
                    "attribute": "data-sku",
                },
                {
                    "name": "rating",
                    "selector": ".rating-stars, .product-rating",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": ".rating-count, .review-count",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "meesho": {
            "name": "MeeshoProducts",
            "baseSelector": ".ProductListItem__GridCol-sc-1baba2g-0, .product-card, [data-testid='product-card']",
            "fields": [
                {
                    "name": "title",
                    "selector": ".NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5, .product-title, h3, p[title]",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": "h5, .current-price, .selling-price, .price",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".sc-eDvSVe.drXXNP, .original-price, .mrp, del",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6, .discount-percent, .offer-text",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a, .product-link",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "image",
                    "selector": "img.AvifImage__ImageWrapper-sc-1055enk-0, img, .product-image img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_data_src",
                    "selector": "img.AvifImage__ImageWrapper-sc-1055enk-0, img, .product-image img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "rating",
                    "selector": ".Rating__StyledPill-sc-12htng8-1 span, .rating-value, .star-rating",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": ".NewProductCardstyled__RatingCount-sc-6y2tys-22, .review-count, .rating-count",
                    "type": "text",
                },
                {
                    "name": "delivery",
                    "selector": ".sc-jcMfQk span, .delivery-info, .shipping-info",
                    "type": "text",
                },
                {
                    "name": "free_delivery",
                    "selector": ".free-delivery, [data-testid='free-delivery']",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "myntra": {
            "name": "MyntraProducts",
            "baseSelector": ".product-base, .product-item, [data-testid='product-base']",
            "fields": [
                {
                    "name": "brand",
                    "selector": ".product-brand, .brand-name, h3",
                    "type": "text",
                },
                {
                    "name": "title",
                    "selector": ".product-product, .product-title, .product-name, h4",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": ".product-discountedPrice, .current-price, .selling-price, .discounted-price",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".product-strike, .original-price, .mrp, .strike",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".product-discountPercentage, .discount-percent, .offer-discount",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a, .product-link",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "image",
                    "selector": "picture img.img-responsive, img.img-responsive, img, .product-image img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "image_webp",
                    "selector": "picture source, source[type='image/webp']",
                    "type": "attribute",
                    "attribute": "srcset",
                },
                {
                    "name": "image_data_src",
                    "selector": "picture img.img-responsive, img.img-responsive, img, .product-image img",
                    "type": "attribute",
                    "attribute": "data-src",
                },
                {
                    "name": "alt_text",
                    "selector": "picture img.img-responsive, img.img-responsive, img, .product-image img",
                    "type": "attribute",
                    "attribute": "alt",
                },
                {
                    "name": "title_text",
                    "selector": "picture img.img-responsive, img.img-responsive, img, .product-image img",
                    "type": "attribute",
                    "attribute": "title",
                },
                {
                    "name": "sizes",
                    "selector": ".product-sizes, .size-info, .available-sizes",
                    "type": "text",
                },
                {
                    "name": "rating",
                    "selector": ".product-rating, .rating-value, .star-rating",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": ".product-rating-count, .review-count, .rating-count",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
    }
    return schemas[query]
