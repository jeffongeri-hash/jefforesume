import { createClient } from '@supabase/supabase-js';
// Read-only public client for the TLDR Drone project's gallery media (publishable key).
export const supabase = createClient(
  'https://jdljpoxxtmmfbudifxtr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbGpwb3h4dG1tZmJ1ZGlmeHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzM1MzUsImV4cCI6MjA5MzUwOTUzNX0.PDJVGrNHZHALMLac2DzWqlGOqt3wuLul6plFoQEyPio',
  { auth: { persistSession: false, autoRefreshToken: false, storageKey: 'drone-gallery' } }
) as any;
