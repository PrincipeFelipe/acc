import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xtmzmfekecudnjrkqnol.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bXptZmVrZWN1ZG5qcmtxbm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDgyMDAsImV4cCI6MjA4Mzk4NDIwMH0.XL46tKrsjT6JgHYGesCmVKcnGxuksvf1ySAPU2B4btc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
