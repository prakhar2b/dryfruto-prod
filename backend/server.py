from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        await db.site_settings.insert_one(DEFAULT_SITE_SETTINGS.copy())
        logging.info("Initialized site settings with defaults")
        return DEFAULT_SITE_SETTINGS.copy()
    return settings

# ============== MODELS ==============

# Status Check Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Category Models
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    image: str
    icon: str

class CategoryCreate(BaseModel):
    name: str
    slug: str
    image: str
    icon: str

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = None

# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    category: str
    type: str
    basePrice: float
    image: str
    images: List[str] = []
    sku: str
    shortDescription: str
    description: str
    benefits: List[str] = []
    features: List[str] = ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    priceVariants: dict = {}  # e.g., {"100g": 145, "250g": 350, "500g": 650, "1kg": 1200}

class ProductCreate(BaseModel):
    name: str
    slug: str
    category: str
    type: str
    basePrice: float
    image: str
    images: List[str] = []
    sku: str
    shortDescription: str
    description: str
    benefits: List[str] = []
    features: List[str] = ["Healthy Heart", "High Nutrition", "Gluten Free", "Cholesterol Free"]
    priceVariants: dict = {}

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    basePrice: Optional[float] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    sku: Optional[str] = None
    shortDescription: Optional[str] = None
    description: Optional[str] = None
    benefits: Optional[List[str]] = None
    features: Optional[List[str]] = None
    priceVariants: Optional[dict] = None

# Hero Slide Models
class HeroSlide(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    description: str
    image: str
    cta: str

class HeroSlideCreate(BaseModel):
    title: str
    subtitle: str
    description: str
    image: str
    cta: str

class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    cta: Optional[str] = None

# Testimonial Models
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    review: str
    avatar: str

class TestimonialCreate(BaseModel):
    name: str
    review: str
    avatar: str

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    review: Optional[str] = None
    avatar: Optional[str] = None

# Gift Box Models
class GiftBox(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image: str
    price: float

class GiftBoxCreate(BaseModel):
    name: str
    image: str
    price: float

class GiftBoxUpdate(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None

# Site Settings Model
class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    businessName: str = "DryFruto"
    slogan: str = "Live With Health"
    logo: str = ""
    phone: str = "9870990795"
    email: str = "info@dryfruto.com"
    careerEmail: str = "careers@dryfruto.com"
    address: str = "123, Main Street, New Delhi, India"
    whatsappLink: str = "https://wa.me/919870990795"
    facebookLink: str = ""
    instagramLink: str = ""
    twitterLink: str = ""
    youtubeLink: str = ""
    bulkOrderProductTypes: List[str] = ["Dry Fruits", "Nuts", "Seeds", "Berries", "Gift Boxes", "Mixed Products"]
    bulkOrderBenefits: List[str] = [
        "Direct sourcing from farms ensures freshness",
        "Minimum order quantity: 10 kg",
        "Special rates for orders above 100 kg",
        "Custom packaging with your branding",
        "Regular supply contracts available",
        "Quality testing certificates provided"
    ]
    # About Us Page Settings
    aboutHeroSubtitle: str = "Your trusted partner for premium quality dry fruits, nuts, and seeds since 2014."
    aboutStoryParagraphs: List[str] = [
        "DryFruto was born from a simple belief – everyone deserves access to pure, high-quality dry fruits at fair prices. What started as a small family business has grown into a trusted name in the dry fruits industry.",
        "We work directly with farmers and suppliers to bring you the freshest products without any middlemen. Our commitment to quality and customer satisfaction has helped us build lasting relationships with thousands of families across India.",
        "Today, we continue our journey with the same passion and dedication, bringing health and happiness to every household through our carefully curated selection of dry fruits, nuts, seeds, and berries."
    ]
    aboutStoryImage: str = "https://images.unsplash.com/photo-1596591868264-6d8f43c0e648?w=600"
    aboutStats: List[dict] = [
        {"number": "10+", "label": "Years of Experience"},
        {"number": "50K+", "label": "Happy Customers"},
        {"number": "100+", "label": "Premium Products"},
        {"number": "500+", "label": "Cities Served"}
    ]
    aboutVision: str = "To be India's most trusted and preferred destination for premium dry fruits, making healthy eating accessible and affordable for every household. We envision a future where quality nutrition is not a luxury but a way of life for all."
    aboutVisionPoints: List[str] = [
        "Be the #1 dry fruits brand in India",
        "Reach every corner of the country",
        "Promote healthy living through quality products"
    ]
    aboutMission: str = "To deliver the finest quality dry fruits sourced directly from farms, ensuring freshness, purity, and value for our customers. We are committed to ethical sourcing, sustainable practices, and exceptional customer service."
    aboutMissionPoints: List[str] = [
        "Source directly from trusted farmers",
        "Maintain highest quality standards",
        "Provide excellent customer experience"
    ]
    aboutValues: List[dict] = [
        {"title": "Quality First", "desc": "We source only the finest dry fruits from trusted farms across the globe."},
        {"title": "Natural & Pure", "desc": "No artificial additives, preservatives, or chemicals in our products."},
        {"title": "Trust & Transparency", "desc": "Honest pricing and complete transparency in our business practices."},
        {"title": "Fresh Delivery", "desc": "Carefully packed and delivered fresh to your doorstep."}
    ]
    aboutWhyChooseUs: List[dict] = [
        {"name": "Quality Assurance", "desc": "Every product goes through strict quality checks before reaching you."},
        {"name": "Customer Support", "desc": "Dedicated team to assist you with any queries or concerns."},
        {"name": "Logistics", "desc": "Efficient delivery network ensuring timely and safe delivery."}
    ]
    # Theme Settings
    theme: dict = {
        "colors": {
            "primary": "#3d2518",
            "primaryLight": "#4d2f20",
            "accent": "#f59e0b",
            "accentHover": "#d97706",
            "background": "#fffbeb",
            "backgroundAlt": "#fef3c7",
            "text": "#1f2937",
            "textLight": "#6b7280",
            "white": "#ffffff",
            "success": "#16a34a",
            "error": "#dc2626"
        },
        "typography": {
            "fontFamily": "Inter, system-ui, sans-serif",
            "headingFont": "Inter, system-ui, sans-serif",
            "baseFontSize": "16px",
            "h1Size": "3rem",
            "h2Size": "2rem",
            "h3Size": "1.5rem"
        },
        "header": {
            "background": "#3d2518",
            "text": "#ffffff",
            "navText": "#ffffff",
            "navHover": "#f59e0b"
        },
        "footer": {
            "background": "#3d2518",
            "text": "#fef3c7",
            "linkColor": "#f59e0b"
        },
        "buttons": {
            "primaryBg": "#f59e0b",
            "primaryText": "#ffffff",
            "primaryHover": "#d97706",
            "secondaryBg": "#3d2518",
            "secondaryText": "#ffffff",
            "secondaryHover": "#2d1810",
            "borderRadius": "0.5rem"
        },
        "cards": {
            "background": "#ffffff",
            "border": "#e5e7eb",
            "shadow": "0 1px 3px rgba(0,0,0,0.1)",
            "borderRadius": "1rem"
        }
    }
    # Page-specific CSS styles
    pageStyles: dict = {}

class SiteSettingsUpdate(BaseModel):
    businessName: Optional[str] = None
    slogan: Optional[str] = None
    logo: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    careerEmail: Optional[str] = None
    address: Optional[str] = None
    whatsappLink: Optional[str] = None
    facebookLink: Optional[str] = None
    instagramLink: Optional[str] = None
    twitterLink: Optional[str] = None
    youtubeLink: Optional[str] = None
    bulkOrderProductTypes: Optional[List[str]] = None
    bulkOrderBenefits: Optional[List[str]] = None
    # About Us Page Settings
    aboutHeroSubtitle: Optional[str] = None
    aboutStoryParagraphs: Optional[List[str]] = None
    aboutStoryImage: Optional[str] = None
    aboutStats: Optional[List[dict]] = None
    aboutVision: Optional[str] = None
    aboutVisionPoints: Optional[List[str]] = None
    aboutMission: Optional[str] = None
    aboutMissionPoints: Optional[List[str]] = None
    aboutValues: Optional[List[dict]] = None
    aboutWhyChooseUs: Optional[List[dict]] = None
    # Theme Settings
    theme: Optional[dict] = None
    # Page-specific CSS styles
    pageStyles: Optional[dict] = None

# Form Submission Models
class BulkOrderSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = ""
    name: str
    company: str = ""
    email: str = ""
    phone: str
    productType: str
    quantity: str
    message: str = ""
    createdAt: str = ""
    status: str = "new"  # new, contacted, completed

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = ""
    email: str
    createdAt: str = ""

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "DryFruto API"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint for Docker container"""
    try:
        # Simple database connectivity check
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# ----- Status Check Routes -----
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ----- Category Routes -----
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    category_obj = Category(**category.model_dump())
    await db.categories.insert_one(category_obj.model_dump())
    return category_obj

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category: CategoryUpdate):
    update_data = {k: v for k, v in category.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.categories.update_one({"id": category_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    updated = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return Category(**updated)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# ----- Product Routes -----
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.model_dump())
    await db.products.insert_one(product_obj.model_dump())
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductUpdate):
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**updated)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ----- Hero Slide Routes -----
@api_router.get("/hero-slides", response_model=List[HeroSlide])
async def get_hero_slides():
    slides = await db.hero_slides.find({}, {"_id": 0}).to_list(100)
    return slides

@api_router.post("/hero-slides", response_model=HeroSlide)
async def create_hero_slide(slide: HeroSlideCreate):
    slide_obj = HeroSlide(**slide.model_dump())
    await db.hero_slides.insert_one(slide_obj.model_dump())
    return slide_obj

@api_router.put("/hero-slides/{slide_id}", response_model=HeroSlide)
async def update_hero_slide(slide_id: str, slide: HeroSlideUpdate):
    update_data = {k: v for k, v in slide.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.hero_slides.update_one({"id": slide_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    updated = await db.hero_slides.find_one({"id": slide_id}, {"_id": 0})
    return HeroSlide(**updated)

@api_router.delete("/hero-slides/{slide_id}")
async def delete_hero_slide(slide_id: str):
    result = await db.hero_slides.delete_one({"id": slide_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    return {"message": "Hero slide deleted"}

# ----- Testimonial Routes -----
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    testimonial_obj = Testimonial(**testimonial.model_dump())
    await db.testimonials.insert_one(testimonial_obj.model_dump())
    return testimonial_obj

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial: TestimonialUpdate):
    update_data = {k: v for k, v in testimonial.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return Testimonial(**updated)

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted"}

# ----- Gift Box Routes -----
@api_router.get("/gift-boxes", response_model=List[GiftBox])
async def get_gift_boxes():
    gift_boxes = await ensure_collection_data("gift_boxes", get_default_gift_boxes)
    return gift_boxes

@api_router.post("/gift-boxes", response_model=GiftBox)
async def create_gift_box(gift_box: GiftBoxCreate):
    gift_box_obj = GiftBox(**gift_box.model_dump())
    await db.gift_boxes.insert_one(gift_box_obj.model_dump())
    return gift_box_obj

@api_router.put("/gift-boxes/{gift_box_id}", response_model=GiftBox)
async def update_gift_box(gift_box_id: str, gift_box: GiftBoxUpdate):
    update_data = {k: v for k, v in gift_box.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.gift_boxes.update_one({"id": gift_box_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gift box not found")
    updated = await db.gift_boxes.find_one({"id": gift_box_id}, {"_id": 0})
    return GiftBox(**updated)

@api_router.delete("/gift-boxes/{gift_box_id}")
async def delete_gift_box(gift_box_id: str):
    result = await db.gift_boxes.delete_one({"id": gift_box_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gift box not found")
    return {"message": "Gift box deleted"}

# ----- Site Settings Routes -----
@api_router.get("/site-settings", response_model=SiteSettings)
async def get_site_settings():
    settings = await ensure_site_settings()
    return SiteSettings(**settings)

@api_router.put("/site-settings", response_model=SiteSettings)
async def update_site_settings(settings: SiteSettingsUpdate):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Upsert the settings
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {"$set": update_data},
        upsert=True
    )
    updated = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    return SiteSettings(**updated)

# ----- Seed Data Route -----
@api_router.post("/seed-data")
async def seed_data_endpoint():
    """Reset database with default data"""
    try:
        # Clear all collections
        await db.categories.delete_many({})
        await db.products.delete_many({})
        await db.hero_slides.delete_many({})
        await db.testimonials.delete_many({})
        await db.gift_boxes.delete_many({})
        
        # Get fresh default data
        categories = get_default_categories()
        products = get_default_products()
        hero_slides = get_default_hero_slides()
        testimonials = get_default_testimonials()
        gift_boxes = get_default_gift_boxes()
        
        # Insert all default data
        if categories:
            await db.categories.insert_many(categories)
        if products:
            await db.products.insert_many(products)
        if hero_slides:
            await db.hero_slides.insert_many(hero_slides)
        if testimonials:
            await db.testimonials.insert_many(testimonials)
        if gift_boxes:
            await db.gift_boxes.insert_many(gift_boxes)
        
        # Reset site settings
        await db.site_settings.update_one(
            {"id": "site_settings"},
            {"$set": DEFAULT_SITE_SETTINGS.copy()},
            upsert=True
        )
        
        logging.info("Data seeded successfully via API")
        
        return {
            "message": "Data seeded successfully",
            "categories": len(categories),
            "products": len(products),
            "heroSlides": len(hero_slides),
            "testimonials": len(testimonials),
            "giftBoxes": len(gift_boxes)
        }
    except Exception as e:
        logging.error(f"Seed data error: {e}")
        raise HTTPException(status_code=500, detail=f"Error seeding data: {str(e)}")

# ============== FILE UPLOAD ==============

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload an image file and return its URL"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
        
        # Generate unique filename
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        
        # Save file
        file_path = UPLOAD_DIR / unique_filename
        content = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Return the URL path
        return {"url": f"/api/uploads/{unique_filename}", "filename": unique_filename}
    
    except Exception as e:
        logging.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded files"""
    from starlette.responses import FileResponse
    
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

# ============== FORM SUBMISSIONS ==============

# Bulk Order Submissions
@api_router.post("/bulk-orders")
async def create_bulk_order(submission: BulkOrderSubmission):
    submission_dict = submission.model_dump()
    submission_dict["id"] = str(uuid.uuid4())
    submission_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.bulk_orders.insert_one(submission_dict)
    return {"message": "Bulk order inquiry submitted successfully", "id": submission_dict["id"]}

@api_router.get("/bulk-orders")
async def get_bulk_orders():
    orders = await db.bulk_orders.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return orders

@api_router.put("/bulk-orders/{order_id}")
async def update_bulk_order_status(order_id: str, status: str):
    await db.bulk_orders.update_one({"id": order_id}, {"$set": {"status": status}})
    return {"message": "Status updated"}

@api_router.delete("/bulk-orders/{order_id}")
async def delete_bulk_order(order_id: str):
    await db.bulk_orders.delete_one({"id": order_id})
    return {"message": "Deleted"}

# Newsletter Subscriptions
@api_router.post("/newsletter")
async def subscribe_newsletter(subscription: NewsletterSubscription):
    # Check if email already exists
    existing = await db.newsletter.find_one({"email": subscription.email})
    if existing:
        return {"message": "Email already subscribed", "exists": True}
    
    sub_dict = subscription.model_dump()
    sub_dict["id"] = str(uuid.uuid4())
    sub_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.newsletter.insert_one(sub_dict)
    return {"message": "Successfully subscribed to newsletter", "id": sub_dict["id"]}

@api_router.get("/newsletter")
async def get_newsletter_subscriptions():
    subs = await db.newsletter.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return subs

@api_router.delete("/newsletter/{sub_id}")
async def delete_newsletter_subscription(sub_id: str):
    await db.newsletter.delete_one({"id": sub_id})
    return {"message": "Deleted"}

# ============== THEME EXPORT ==============

@api_router.get("/export-theme")
async def export_theme():
    """Export all site settings, content, and theme data as JSON"""
    import json
    from starlette.responses import Response
    
    # Get all collections data
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    hero_slides = await db.hero_slides.find({}, {"_id": 0}).to_list(100)
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    gift_boxes = await db.gift_boxes.find({}, {"_id": 0}).to_list(100)
    
    # Create export object
    export_data = {
        "exportVersion": "1.0",
        "exportDate": datetime.now(timezone.utc).isoformat(),
        "themeName": settings.get("businessName", "MyTheme") if settings else "MyTheme",
        "siteSettings": settings or SiteSettings().model_dump(),
        "categories": categories,
        "products": products,
        "heroSlides": hero_slides,
        "testimonials": testimonials,
        "giftBoxes": gift_boxes
    }
    
    # Return as downloadable JSON
    json_str = json.dumps(export_data, indent=2, default=str)
    
    return Response(
        content=json_str,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename={export_data['themeName']}_theme_export.json"
        }
    )

@api_router.post("/import-theme")
async def import_theme(import_data: dict):
    """Import theme data from JSON"""
    try:
        # Import site settings
        if "siteSettings" in import_data:
            settings = import_data["siteSettings"]
            settings["id"] = "site_settings"
            await db.site_settings.replace_one(
                {"id": "site_settings"},
                settings,
                upsert=True
            )
        
        # Import categories
        if "categories" in import_data and import_data["categories"]:
            await db.categories.delete_many({})
            await db.categories.insert_many(import_data["categories"])
        
        # Import products
        if "products" in import_data and import_data["products"]:
            await db.products.delete_many({})
            await db.products.insert_many(import_data["products"])
        
        # Import hero slides
        if "heroSlides" in import_data and import_data["heroSlides"]:
            await db.hero_slides.delete_many({})
            await db.hero_slides.insert_many(import_data["heroSlides"])
        
        # Import testimonials
        if "testimonials" in import_data and import_data["testimonials"]:
            await db.testimonials.delete_many({})
            await db.testimonials.insert_many(import_data["testimonials"])
        
        # Import gift boxes
        if "giftBoxes" in import_data and import_data["giftBoxes"]:
            await db.gift_boxes.delete_many({})
            await db.gift_boxes.insert_many(import_data["giftBoxes"])
        
        return {"message": "Theme imported successfully", "success": True}
    except Exception as e:
        logging.error(f"Import error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
