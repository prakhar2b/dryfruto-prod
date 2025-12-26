# Seed data for DryFruto website
import uuid

LOGO_URL = "https://customer-assets.emergentagent.com/job_70b8c44d-b0eb-46ab-b798-c90870274405/artifacts/5olvlaa7_WhatsApp%20Image%202025-12-26%20at%2013.46.33.jpeg"

site_settings = {
    "id": "site_settings",
    "businessName": "DryFruto",
    "slogan": "Live With Health",
    "logo": LOGO_URL,
    "phone": "9870990795",
    "email": "info@dryfruto.com",
    "address": "123, Main Street, New Delhi, India",
    "whatsappLink": "https://wa.me/919870990795"
}

categories = [
    {
        "id": str(uuid.uuid4()),
        "name": "Nuts & Dry Fruits",
        "slug": "nuts-dry-fruits",
        "image": "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Dates",
        "slug": "dates",
        "image": "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mix Dry Fruits",
        "slug": "mix-dry-fruits",
        "image": "https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Makhana",
        "slug": "makhana",
        "image": "https://images.pexels.com/photos/7446005/pexels-photo-7446005.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/7446005/pexels-photo-7446005.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Seeds",
        "slug": "seeds",
        "image": "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Gift Boxes",
        "slug": "gift-boxes",
        "image": "https://images.pexels.com/photos/264892/pexels-photo-264892.jpeg?auto=compress&cs=tinysrgb&w=600",
        "icon": "https://images.pexels.com/photos/264892/pexels-photo-264892.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
]

products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Premium California Almonds",
        "slug": "premium-california-almonds",
        "category": "nuts-dry-fruits",
        "type": "Almonds",
        "basePrice": 145,
        "image": "https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=500",
            "https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF001",
        "shortDescription": "Premium quality California almonds, rich in nutrients and perfect for daily consumption.",
        "description": "Our Premium California Almonds are carefully selected from the finest orchards. These almonds are known for their superior taste, perfect crunch, and high nutritional value. Rich in Vitamin E, protein, and healthy fats, they make an excellent addition to your daily diet.",
        "benefits": [
            "Rich in Vitamin E and antioxidants",
            "Supports heart health with healthy fats",
            "High protein content for muscle building",
            "Natural source of fiber for digestive health",
            "Helps in weight management"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Jumbo Cashews Premium",
        "slug": "jumbo-cashews-premium",
        "category": "nuts-dry-fruits",
        "type": "Cashews",
        "basePrice": 185,
        "image": "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF002",
        "shortDescription": "Large, creamy jumbo cashews with a rich buttery taste.",
        "description": "Our Jumbo Cashews are the finest quality whole cashews, carefully graded for size and taste. These premium cashews have a naturally sweet, buttery flavor and satisfying crunch that makes them perfect for snacking or cooking.",
        "benefits": [
            "Excellent source of magnesium and zinc",
            "Promotes healthy brain function",
            "Supports bone health",
            "Boosts immunity naturally",
            "Good for eye health"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Roasted Salted Cashews",
        "slug": "roasted-salted-cashews",
        "category": "nuts-dry-fruits",
        "type": "Roasted Cashews",
        "basePrice": 210,
        "image": "https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF003",
        "shortDescription": "Perfectly roasted cashews with a hint of Himalayan salt.",
        "description": "Our Roasted Salted Cashews are dry roasted to perfection and lightly seasoned with premium Himalayan salt. The roasting process enhances the natural sweetness of cashews while the salt adds a savory edge.",
        "benefits": [
            "Satisfying crunchy snack",
            "Great source of plant protein",
            "Contains heart-healthy fats",
            "Rich in copper and manganese",
            "Perfect for on-the-go energy"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Walnut Kernels",
        "slug": "premium-walnut-kernels",
        "category": "nuts-dry-fruits",
        "type": "Walnuts",
        "basePrice": 250,
        "image": "https://images.pexels.com/photos/4033327/pexels-photo-4033327.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/4033327/pexels-photo-4033327.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF004",
        "shortDescription": "Light halves walnut kernels, perfect for brain health.",
        "description": "Our Premium Walnut Kernels are carefully shelled and graded to give you the best quality walnuts. Known as the brain food, these walnuts are rich in omega-3 fatty acids and antioxidants.",
        "benefits": [
            "Excellent source of omega-3 fatty acids",
            "Supports brain health and cognitive function",
            "Anti-inflammatory properties",
            "Promotes healthy sleep patterns",
            "Good for skin health"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Afghan Black Raisins",
        "slug": "afghan-black-raisins",
        "category": "nuts-dry-fruits",
        "type": "Raisins",
        "basePrice": 85,
        "image": "https://images.pexels.com/photos/4033329/pexels-photo-4033329.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/4033329/pexels-photo-4033329.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF005",
        "shortDescription": "Premium Afghan black raisins, naturally sweet and juicy.",
        "description": "Our Afghan Black Raisins are sun-dried grapes from the finest vineyards of Afghanistan. These raisins are naturally sweet, plump, and juicy, making them perfect for snacking and cooking.",
        "benefits": [
            "Natural source of iron",
            "Boosts energy instantly",
            "Good for digestive health",
            "Helps in bone strengthening",
            "Natural sweetener alternative"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Mix Dry Fruits",
        "slug": "premium-mix-dry-fruits",
        "category": "mix-dry-fruits",
        "type": "Mix dry fruits",
        "basePrice": 165,
        "image": "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF006",
        "shortDescription": "Perfect blend of almonds, cashews, raisins, and more.",
        "description": "Our Premium Mix Dry Fruits is a carefully curated blend of the finest dry fruits including almonds, cashews, raisins, walnuts, and dates. This nutritious mix provides a complete package of health benefits.",
        "benefits": [
            "Complete nutritional package",
            "Variety of flavors and textures",
            "Convenient and healthy snacking",
            "Balanced energy source",
            "Perfect for gift giving"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pista Akbari Premium",
        "slug": "pista-akbari-premium",
        "category": "nuts-dry-fruits",
        "type": "Pistachios",
        "basePrice": 195,
        "image": "https://images.pexels.com/photos/6157057/pexels-photo-6157057.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/6157057/pexels-photo-6157057.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF007",
        "shortDescription": "Large Akbari pistachios with vibrant green color.",
        "description": "Our Pista Akbari are the finest quality Iranian pistachios known for their large size, vibrant green color, and distinctive flavor. These premium pistachios are perfect for snacking and culinary use.",
        "benefits": [
            "Excellent source of protein",
            "Rich in fiber for digestion",
            "Contains healthy fats",
            "Good for eye health",
            "Supports weight management"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Makhana Plain Premium",
        "slug": "makhana-plain-premium",
        "category": "makhana",
        "type": "Makhana",
        "basePrice": 175,
        "image": "https://images.pexels.com/photos/7446005/pexels-photo-7446005.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/7446005/pexels-photo-7446005.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF008",
        "shortDescription": "Light and crunchy fox nuts, perfect for healthy snacking.",
        "description": "Our Premium Makhana (Fox Nuts) are handpicked and processed to retain their natural goodness. These light, crunchy puffs are a popular healthy snack that can be roasted with minimal oil or eaten as is.",
        "benefits": [
            "Low calorie healthy snack",
            "Rich in calcium and phosphorus",
            "Good for diabetics",
            "Anti-aging properties",
            "Aids in weight loss"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Dried Figs (Anjeer)",
        "slug": "premium-dried-figs",
        "category": "nuts-dry-fruits",
        "type": "Dried Fig",
        "basePrice": 220,
        "image": "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF009",
        "shortDescription": "Soft and sweet Turkish dried figs, naturally delicious.",
        "description": "Our Premium Dried Figs are sourced from Turkey and are known for their soft texture and natural sweetness. These figs are sun-dried to preserve their nutrients and can be eaten as snacks or added to various dishes.",
        "benefits": [
            "Excellent source of dietary fiber",
            "Rich in potassium for heart health",
            "Contains calcium for strong bones",
            "Natural remedy for constipation",
            "Good source of antioxidants"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pumpkin Seeds Raw",
        "slug": "pumpkin-seeds-raw",
        "category": "seeds",
        "type": "Pumpkin Seeds",
        "basePrice": 125,
        "image": "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF010",
        "shortDescription": "Raw green pumpkin seeds, packed with zinc and magnesium.",
        "description": "Our Raw Pumpkin Seeds are hulled and ready to eat. These nutrient-dense seeds are an excellent source of zinc, magnesium, and plant-based protein. Perfect for adding to salads, smoothies, or eating as a snack.",
        "benefits": [
            "Excellent source of zinc",
            "High in magnesium",
            "Supports prostate health",
            "Good for sleep quality",
            "Rich in antioxidants"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Sunflower Seeds Raw",
        "slug": "sunflower-seeds-raw",
        "category": "seeds",
        "type": "Sunflower Seeds",
        "basePrice": 95,
        "image": "https://images.pexels.com/photos/4750269/pexels-photo-4750269.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/4750269/pexels-photo-4750269.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF011",
        "shortDescription": "Nutrient-rich sunflower seeds, great for heart health.",
        "description": "Our Raw Sunflower Seeds are a nutritional powerhouse packed with vitamin E, selenium, and healthy fats. These versatile seeds can be sprinkled on salads, added to baked goods, or enjoyed as a standalone snack.",
        "benefits": [
            "Rich in Vitamin E",
            "Contains selenium for immunity",
            "Supports healthy skin",
            "Good for cholesterol management",
            "Anti-inflammatory benefits"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Medjool Dates Premium",
        "slug": "medjool-dates-premium",
        "category": "dates",
        "type": "Dates",
        "basePrice": 320,
        "image": "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=500",
        "images": [
            "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=500"
        ],
        "sku": "DRF012",
        "shortDescription": "Large, soft Medjool dates with caramel-like sweetness.",
        "description": "Our Premium Medjool Dates are known as the 'King of Dates' for their large size, soft texture, and rich caramel-like taste. These dates are perfect for snacking, baking, and as a natural sweetener.",
        "benefits": [
            "Natural energy booster",
            "Rich in potassium and fiber",
            "Excellent for bone health",
            "Supports digestive health",
            "Natural sweetener alternative"
        ],
        "features": ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    }
]

hero_slides = [
    {
        "id": str(uuid.uuid4()),
        "title": "Premium Quality Dry Fruits",
        "subtitle": "Live With Health",
        "description": "Discover our handpicked selection of premium dry fruits, nuts, and seeds",
        "image": "https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
        "cta": "Shop Now"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Festival Gift Hampers",
        "subtitle": "Celebrate with Health",
        "description": "Beautiful gift boxes perfect for every occasion",
        "image": "https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
        "cta": "View Collection"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Healthy Seeds & Makhana",
        "subtitle": "Nature's Best",
        "description": "Explore our range of nutrient-rich seeds and fox nuts",
        "image": "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
        "cta": "Explore Now"
    }
]

testimonials = [
    {
        "id": str(uuid.uuid4()),
        "name": "Priya Sharma",
        "review": "Excellent quality dry fruits! I've been ordering from DryFruto for over a year now. The almonds and cashews are always fresh and delicious.",
        "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Rajesh Kumar",
        "review": "Best place for premium dry fruits. The packaging is excellent and delivery is always on time. Highly recommended!",
        "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Anita Patel",
        "review": "The gift boxes are perfect for occasions. Ordered for Diwali and everyone loved them. Great quality products!",
        "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mohammed Ali",
        "review": "Fresh and premium quality nuts. The Makhana is especially good - crispy and tasty. Will order again!",
        "avatar": "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Sunita Verma",
        "review": "Amazing customer service and product quality. The dates are the best I've ever had. Thank you DryFruto!",
        "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Vikram Singh",
        "review": "Top-notch quality with amazing flavor. The mix dry fruits pack is perfect for daily snacking. Highly satisfied!",
        "avatar": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
]

gift_boxes = [
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Gift Hamper",
        "image": "https://images.pexels.com/photos/5945770/pexels-photo-5945770.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 1499
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Festive Delight Box",
        "image": "https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 1999
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Corporate Gift Set",
        "image": "https://images.pexels.com/photos/264892/pexels-photo-264892.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 2499
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Royal Collection Box",
        "image": "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 3499
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Anniversary Special",
        "image": "https://images.pexels.com/photos/5945759/pexels-photo-5945759.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 2999
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Diwali Gift Box",
        "image": "https://images.pexels.com/photos/4033321/pexels-photo-4033321.jpeg?auto=compress&cs=tinysrgb&w=500",
        "price": 1799
    }
]
