const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function missingVariableMessage(variableName: string) {
  return `${variableName} is required to use Supabase auth. Add it to your environment variables before loading the app.`
}

export function getSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error(missingVariableMessage('NEXT_PUBLIC_SUPABASE_URL'))
  }

  if (!supabasePublishableKey) {
    throw new Error(
      `${missingVariableMessage('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')} You can also use NEXT_PUBLIC_SUPABASE_ANON_KEY for compatibility.`
    )
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  }
}
