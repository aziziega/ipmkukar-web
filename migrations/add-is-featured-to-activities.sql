-- Migration: Add is_featured column to activities table
-- Date: 2026-06-11
-- Description: Adds is_featured BOOLEAN column to mark featured activities for landing page

-- Add is_featured column to activities table
ALTER TABLE activities
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create index for faster filtering of featured activities
CREATE INDEX idx_activities_is_featured ON activities(is_featured);

-- Update comment
COMMENT ON COLUMN activities.is_featured IS 'Whether this activity should be featured on the landing page';

-- Optional: Update existing published activities to be featured
-- Uncomment the line below if you want to feature some existing activities
-- UPDATE activities SET is_featured = true WHERE is_published = true LIMIT 3;
