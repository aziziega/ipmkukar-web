# Supabase Storage Setup for Organizational Structure Photos

This document provides instructions for setting up the Supabase Storage bucket for organizational structure photos.

## Prerequisites
- Supabase project created
- Admin access to Supabase Dashboard

## Setup Instructions

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `struktur-photos`
   - **Public bucket**: ✅ Enable (photos need to be publicly accessible)
   - **File size limit**: 2 MB (optional but recommended)
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

5. Click **"Create bucket"**

### 2. Configure Bucket Policies

The bucket needs to be publicly readable but only writable by authenticated admins (via service role key).

#### Option A: Using Supabase Dashboard UI

1. Go to **Storage** → **Policies** → Select `struktur-photos` bucket
2. Create a new policy for **SELECT** operations:
   - **Name**: "Public read access"
   - **Policy definition**: 
     ```sql
     true
     ```
   - **Target roles**: `public`, `anon`

3. For INSERT/UPDATE/DELETE operations, we'll use service role key in the API (already configured in code)

#### Option B: Using SQL Editor

Run this SQL in the Supabase SQL Editor:

```sql
-- Allow public read access to struktur-photos bucket
CREATE POLICY "Public read access for struktur photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'struktur-photos');

-- Note: Write operations (INSERT, UPDATE, DELETE) are handled via 
-- service role key in the API routes, so no additional policies needed
```

### 3. Verify Setup

Test the bucket by:
1. Using the admin dashboard to edit organizational structure
2. Uploading a test photo for any position
3. Checking if the photo is accessible via the public URL
4. Verifying the photo displays correctly on both admin and public pages

### 4. File Naming Convention

Photos are automatically named with the following pattern:
```
{position}-{timestamp}-{random}.{extension}
```

Examples:
- `ketua_umum-1686123456789-abc123def.jpg`
- `wakil_ketua-1686123456789-xyz789ghi.png`

### 5. Bucket Settings Summary

| Setting | Value |
|---------|-------|
| Bucket Name | `struktur-photos` |
| Public Access | Yes (read-only) |
| Max File Size | 2 MB |
| Allowed Types | JPEG, PNG, WebP |
| Write Access | Service role only |

### 6. Environment Variables Required

Ensure these environment variables are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 7. Troubleshooting

**Issue**: Photos not uploading
- Check service role key is correctly set
- Verify bucket name matches `struktur-photos`
- Check file size is under 2MB

**Issue**: Photos not displaying
- Verify bucket is set to public
- Check SELECT policy is enabled
- Ensure public URL is being used (not signed URL)

**Issue**: 403 Forbidden errors
- Check bucket policies are correctly configured
- Verify service role key has admin permissions

## Related Files

- Storage helper: `lib/supabase-storage-struktur.ts`
- Admin API: `app/api/admin/struktur/route.ts`
- Database migration: `migrations/add-photo-fields-to-organizational-structure.sql`
