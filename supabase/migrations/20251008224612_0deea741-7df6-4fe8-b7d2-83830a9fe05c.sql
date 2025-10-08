-- Create storage bucket for word images
INSERT INTO storage.buckets (id, name, public)
VALUES ('word-images', 'word-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'word-images');

-- Allow anyone to upload images
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'word-images');

-- Allow anyone to update images
CREATE POLICY "Allow Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'word-images');

-- Allow anyone to delete images
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'word-images');