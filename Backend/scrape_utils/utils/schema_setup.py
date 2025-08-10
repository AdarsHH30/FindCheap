def choose_schema(query: str, max_products: int):
    schemas = {
        "amazon": {
            "name": "AmazonProducts",
            "baseSelector": "div.s-card-container",
            "fields": [
                {"name": "title", "selector": "a h2 span", "type": "text"},
                {
                    "name": "price",
                    "selector": "span.a-price > span.a-offscreen",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a.a-link-normal.s-no-outline",
                    "type": "attribute",
                    "attribute": "href",
                },
                {"name": "rating", "selector": "span.a-icon-alt", "type": "text"},
                {
                    "name": "reviews",
                    "selector": "span.a-size-base.s-underline-text",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": "img.s-image",
                    "type": "attribute",
                    "attribute": "src",
                },
            ],
            "limit": max_products,
        },
        "flipkart": {
            "name": "FlipkartProducts",
            "baseSelector": "[data-id]",
            "fields": [
                {
                    "name": "title",
                    "selector": "a.wjcEIp, a[title], ._4rR01T, .s1Q9rs, .B_NuCI,.KzDlHZ",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": "._30jeq3, ._1_WHN1, .Nx9bqj",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "rating",
                    "selector": "._3LWZlK, .XQDdHH",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": "span._2_R_DZ, .review-count",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": "img",
                    "type": "attribute",
                    "attribute": "src",
                },
            ],
            "limit": max_products,
        },
        "snapdeal": {
            "name": "SnapdealProducts",
            "baseSelector": ".product-tuple-listing",
            "fields": [
                {"name": "title", "selector": ".product-title", "type": "text"},
                {
                    "name": "price",
                    "selector": ".lfloat.product-price",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": ".dp-widget-link",
                    "type": "attribute",
                    "attribute": "href",
                },
                {"name": "rating", "selector": ".filled-star", "type": "text"},
                {
                    "name": "reviews",
                    "selector": ".product-rating-count",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": ".product-image img",
                    "type": "attribute",
                    "attribute": "src",
                },
            ],
            "limit": max_products,
        },
        "jiomart": {
            "name": "JioMartProducts",
            "baseSelector": ".plp-card-container",
            "fields": [
                {
                    "name": "title",
                    "selector": ".plp-card-details-name,.plp-card-details-name line-clamp jm-body-xs jm-fc-primary-grey-80",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": ".plp-card-details-price span.jm-heading-xxs",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".plp-card-details-price .line-through",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".plp-card-details-discount .jm-badge",
                    "type": "text",
                },
                {
                    "name": "image",
                    "selector": ".plp-card-image img",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "bank_offer",
                    "selector": ".payment_tag .jm-badge-offer",
                    "type": "text",
                },
                {
                    "name": "exchange_offer",
                    "selector": ".plp-exchange-offer .jm-badge-offer",
                    "type": "text",
                },
                {
                    "name": "limited_deal",
                    "selector": ".deal_of_day",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
        "meesho": {
            "name": "MeeshoProducts",
            "baseSelector": ".ProductListItem__GridCol-sc-1baba2g-0",
            "fields": [
                {
                    "name": "title",
                    "selector": ".NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5",
                    "type": "text",
                },
                {"name": "price", "selector": "h5", "type": "text"},
                {
                    "name": "original_price",
                    "selector": ".sc-eDvSVe.drXXNP",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "image",
                    "selector": "img.AvifImage__ImageWrapper-sc-1055enk-0",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "rating",
                    "selector": ".Rating__StyledPill-sc-12htng8-1 span",
                    "type": "text",
                },
                {
                    "name": "reviews",
                    "selector": ".NewProductCardstyled__RatingCount-sc-6y2tys-22",
                    "type": "text",
                },
                {"name": "delivery", "selector": ".sc-jcMfQk span", "type": "text"},
            ],
            "limit": max_products,
        },
        "myntra": {
            "name": "MyntraProducts",
            "baseSelector": ".product-base",
            "fields": [
                {
                    "name": "brand",
                    "selector": ".product-brand",
                    "type": "text",
                },
                {
                    "name": "title",
                    "selector": ".product-product",
                    "type": "text",
                },
                {
                    "name": "price",
                    "selector": ".product-discountedPrice",
                    "type": "text",
                },
                {
                    "name": "original_price",
                    "selector": ".product-strike",
                    "type": "text",
                },
                {
                    "name": "discount",
                    "selector": ".product-discountPercentage",
                    "type": "text",
                },
                {
                    "name": "link",
                    "selector": "a",
                    "type": "attribute",
                    "attribute": "href",
                },
                {
                    "name": "image",
                    "selector": ".img-responsive",
                    "type": "attribute",
                    "attribute": "src",
                },
                {
                    "name": "sizes",
                    "selector": ".product-sizes",
                    "type": "text",
                },
            ],
            "limit": max_products,
        },
    }
    return schemas[query]
