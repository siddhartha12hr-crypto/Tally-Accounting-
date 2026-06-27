-- ================================
-- PREMIUM CONTENT & COURSE MANAGEMENT SCHEMA
-- For Tally Accounting Hub Pro Mobile App
-- ================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- COURSES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail VARCHAR(500),
    instructor_name VARCHAR(255) NOT NULL,
    instructor_bio TEXT,
    instructor_image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(50) DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced, Expert
    duration VARCHAR(50), -- e.g., "18h 30m"
    total_lessons INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    
    -- Pricing
    is_free BOOLEAN DEFAULT FALSE,
    original_price DECIMAL(10,2) DEFAULT 0,
    discounted_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    sale_active BOOLEAN DEFAULT FALSE,
    sale_start_date TIMESTAMP,
    sale_end_date TIMESTAMP,
    
    -- Access Control
    is_published BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    requirements TEXT[], -- Array of requirements
    what_you_will_learn TEXT[], -- Array of learning outcomes
    target_audience TEXT[], -- Array of target audience
    language VARCHAR(50) DEFAULT 'English',
    subtitles VARCHAR(50)[],
    
    -- Stats
    total_students INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Admin
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    
    CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    CONSTRAINT valid_price CHECK (original_price >= 0),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Indexes for courses
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_featured ON courses(is_featured);
CREATE INDEX idx_courses_price ON courses(original_price);
CREATE INDEX idx_courses_rating ON courses(rating DESC);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- ================================
-- VIDEOS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    video_type VARCHAR(50) DEFAULT 'mp4', -- mp4, youtube, vimeo
    duration VARCHAR(50), -- e.g., "45:30"
    duration_seconds INTEGER,
    thumbnail VARCHAR(500),
    
    -- Ordering
    section_name VARCHAR(255), -- e.g., "Introduction", "Advanced Concepts"
    order_index INTEGER NOT NULL,
    
    -- Access Control
    is_preview BOOLEAN DEFAULT FALSE, -- Free preview for all users
    is_free BOOLEAN DEFAULT FALSE, -- Completely free video
    requires_purchase BOOLEAN DEFAULT TRUE,
    
    -- Individual Video Pricing (optional)
    video_price DECIMAL(10,2) DEFAULT 0,
    discount_price DECIMAL(10,2),
    
    -- Metadata
    resolution VARCHAR(20), -- 720p, 1080p, 4K
    file_size_mb DECIMAL(10,2),
    downloadable BOOLEAN DEFAULT FALSE,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_video_price CHECK (video_price >= 0),
    CONSTRAINT valid_order CHECK (order_index >= 0)
);

-- Indexes for videos
CREATE INDEX idx_videos_course_id ON videos(course_id);
CREATE INDEX idx_videos_order ON videos(course_id, order_index);
CREATE INDEX idx_videos_preview ON videos(is_preview);
CREATE INDEX idx_videos_free ON videos(is_free);

-- ================================
-- PURCHASES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Purchase Details
    purchase_type VARCHAR(50) NOT NULL, -- one-time, subscription, lifetime
    amount_paid DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    
    -- Payment Info
    payment_method VARCHAR(50), -- razorpay, stripe, paypal, upi
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded, cancelled
    transaction_id VARCHAR(255) UNIQUE,
    payment_gateway_response JSONB,
    
    -- Subscription Details (if applicable)
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Refund Info
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    coupon_code VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_purchase_type CHECK (purchase_type IN ('one-time', 'subscription', 'lifetime')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    UNIQUE(user_id, course_id, created_at) -- Prevent duplicate purchases at same time
);

-- Indexes for purchases
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_course_id ON purchases(course_id);
CREATE INDEX idx_purchases_status ON purchases(payment_status);
CREATE INDEX idx_purchases_date ON purchases(created_at DESC);
CREATE INDEX idx_purchases_transaction ON purchases(transaction_id);

-- ================================
-- ENROLLMENTS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Progress Tracking
    progress INTEGER DEFAULT 0, -- percentage (0-100)
    completed_videos JSONB DEFAULT '[]'::JSONB, -- Array of video IDs
    last_watched_video UUID REFERENCES videos(id),
    last_watched_position INTEGER DEFAULT 0, -- seconds
    
    -- Completion
    is_completed BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(500),
    
    -- Stats
    total_watch_time_minutes INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100),
    UNIQUE(user_id, course_id)
);

-- Indexes for enrollments
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_completed ON enrollments(is_completed);

-- ================================
-- REVENUE TABLE
-- ================================
CREATE TABLE IF NOT EXISTS revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    
    -- Revenue Details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    revenue_type VARCHAR(50), -- course, subscription, video
    
    -- Date Tracking
    revenue_date DATE DEFAULT CURRENT_DATE,
    revenue_month INTEGER,
    revenue_year INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Indexes for revenue
CREATE INDEX idx_revenue_date ON revenue(revenue_date DESC);
CREATE INDEX idx_revenue_month ON revenue(revenue_year, revenue_month);
CREATE INDEX idx_revenue_course ON revenue(course_id);

-- ================================
-- REVIEWS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Review Content
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(user_id, course_id) -- One review per user per course
);

-- Indexes for reviews
CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- ================================
-- COUPONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Discount Details
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2), -- Max discount for percentage type
    min_purchase DECIMAL(10,2), -- Minimum purchase amount
    
    -- Validity
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Usage Limits
    max_uses INTEGER, -- Total uses allowed
    max_uses_per_user INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    
    -- Applicable To
    applicable_courses UUID[], -- Array of course IDs (null = all courses)
    applicable_categories VARCHAR(100)[], -- Array of categories
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_discount_type CHECK (discount_type IN ('percentage', 'fixed')),
    CONSTRAINT valid_discount_value CHECK (discount_value > 0)
);

-- Indexes for coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- ================================
-- COUPON USAGE TABLE
-- ================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
    discount_applied DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for coupon usage
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);

-- ================================
-- WISHLISTS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Indexes for wishlists
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- ================================
-- NOTIFICATIONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- purchase, enrollment, completion, promotion
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ================================
-- TRIGGERS
-- ================================

-- Update courses.updated_at on update
CREATE OR REPLACE FUNCTION update_course_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_timestamp
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_course_timestamp();

-- Update videos.updated_at on update
CREATE TRIGGER trigger_update_video_timestamp
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_course_timestamp();

-- Update enrollments.updated_at on update
CREATE TRIGGER trigger_update_enrollment_timestamp
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_timestamp();

-- Automatically create enrollment when purchase is completed
CREATE OR REPLACE FUNCTION create_enrollment_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
        INSERT INTO enrollments (user_id, course_id, enrolled_at)
        VALUES (NEW.user_id, NEW.course_id, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, course_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_enrollment_on_purchase
    AFTER UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION create_enrollment_on_purchase();

-- Update course statistics when review is added/updated
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE course_id = NEW.course_id AND is_approved = TRUE),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE course_id = NEW.course_id AND is_approved = TRUE)
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_rating
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_course_rating();

-- Update course total_students when enrollment is created
CREATE OR REPLACE FUNCTION update_course_students()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses
    SET total_students = (SELECT COUNT(*) FROM enrollments WHERE course_id = NEW.course_id)
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_students
    AFTER INSERT ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_students();

-- Create revenue record when purchase is completed
CREATE OR REPLACE FUNCTION create_revenue_record()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
        INSERT INTO revenue (
            purchase_id, user_id, course_id, amount, currency, 
            revenue_type, revenue_date, revenue_month, revenue_year
        )
        VALUES (
            NEW.id, NEW.user_id, NEW.course_id, NEW.amount_paid, NEW.currency,
            NEW.purchase_type, CURRENT_DATE, 
            EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
            EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_revenue_record
    AFTER INSERT OR UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION create_revenue_record();

-- ================================
-- VIEWS
-- ================================

-- View for popular courses
CREATE OR REPLACE VIEW popular_courses AS
SELECT 
    c.*,
    COUNT(DISTINCT p.id) as purchase_count,
    COUNT(DISTINCT e.id) as enrollment_count
FROM courses c
LEFT JOIN purchases p ON c.id = p.course_id AND p.payment_status = 'completed'
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE c.is_published = TRUE AND c.is_archived = FALSE
GROUP BY c.id
ORDER BY purchase_count DESC, c.rating DESC
LIMIT 20;

-- View for revenue analytics
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
    DATE_TRUNC('month', revenue_date) as month,
    SUM(amount) as total_revenue,
    COUNT(*) as total_sales,
    AVG(amount) as average_sale,
    currency
FROM revenue
GROUP BY DATE_TRUNC('month', revenue_date), currency
ORDER BY month DESC;

-- View for course completion rates
CREATE OR REPLACE VIEW course_completion_rates AS
SELECT 
    c.id,
    c.title,
    COUNT(DISTINCT e.user_id) as total_enrolled,
    COUNT(DISTINCT CASE WHEN e.is_completed = TRUE THEN e.user_id END) as total_completed,
    ROUND(
        (COUNT(DISTINCT CASE WHEN e.is_completed = TRUE THEN e.user_id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT e.user_id), 0) * 100), 2
    ) as completion_rate
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- ================================
-- SAMPLE DATA (for development)
-- ================================

-- Insert sample free course
INSERT INTO courses (
    title, description, instructor_name, category, difficulty_level,
    duration, total_lessons, is_free, is_published, thumbnail
) VALUES (
    'Introduction to Accounting',
    'Learn the basics of accounting and bookkeeping',
    'Prof. Sharma',
    'Accounting Basics',
    'Beginner',
    '2h 30m',
    10,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400'
) ON CONFLICT DO NOTHING;

-- Insert sample premium course
INSERT INTO courses (
    title, description, instructor_name, category, difficulty_level,
    duration, total_lessons, is_free, original_price, discounted_price,
    currency, sale_active, is_published, thumbnail
) VALUES (
    'Tally Prime Mastery',
    'Complete Tally Prime course from beginner to expert',
    'CA Anil Kumar',
    'Tally Prime Tutorials',
    'Intermediate',
    '18h 30m',
    64,
    FALSE,
    4999,
    3999,
    'INR',
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
) ON CONFLICT DO NOTHING;

-- ================================
-- GRANTS
-- ================================

-- Grant privileges (adjust based on your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_db_user;

-- ================================
-- SCHEMA COMPLETE
-- ================================

SELECT 'Premium content schema created successfully!' AS status;
