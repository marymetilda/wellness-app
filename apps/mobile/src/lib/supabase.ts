import 'react-native-url-polyfill/auto'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltkohpmktixttzscadzw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a29ocG1rdGl4dHR6c2NhZHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODE1ODMsImV4cCI6MjA5NTM1NzU4M30.92Gsm510kaVSQSgg2CrsYLuGvTZVw8sMKbDw4-EKDBw'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)