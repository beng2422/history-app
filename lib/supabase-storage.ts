import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadImage(file: File) {
  const supabase = createClientComponentClient()
  
  // Create a unique file name
  const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`
  
  // Upload the file to Supabase storage
  const { data, error } = await supabase
    .storage
    .from('historical-images')
    .upload(fileName, file)
    
  if (error) {
    throw error
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('historical-images')
    .getPublicUrl(fileName)
    
  return publicUrl
} 