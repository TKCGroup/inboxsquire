-- Migration: Create user_settings automatically when a user signs up
-- This ensures every new user has a user_settings record with default values

-- Function to create user_settings for new users
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, classification_threshold)
  VALUES (NEW.id, 70);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER create_user_settings_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_settings TO anon, authenticated;
GRANT ALL ON public.processed_emails TO anon, authenticated;
GRANT ALL ON public.blocklist TO anon, authenticated; 