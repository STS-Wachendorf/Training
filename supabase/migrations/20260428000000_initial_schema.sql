-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'trainer', 'member', 'waiting');
CREATE TYPE public.attendance_status AS ENUM ('confirmed', 'declined', 'maybe');

-- Create tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role public.user_role DEFAULT 'waiting' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.group_members (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE public.training_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.training_templates(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  topic TEXT,
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.attendance (
  training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.attendance_status NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (training_id, user_id)
);

-- Trigger to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'waiting');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.trainings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Groups Policies
CREATE POLICY "Users can view groups they are members of" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all groups" ON public.groups
  FOR ALL USING (public.is_admin());

-- Group Members Policies
CREATE POLICY "Users can view their own membership" ON public.group_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all group memberships" ON public.group_members
  FOR ALL USING (public.is_admin());

-- Training Templates Policies
CREATE POLICY "Users can view templates for their groups" ON public.training_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = training_templates.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all training templates" ON public.training_templates
  FOR ALL USING (public.is_admin());

-- Trainings Policies
CREATE POLICY "Users can view trainings for their groups" ON public.trainings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.training_templates tt
      JOIN public.group_members gm ON tt.group_id = gm.group_id
      WHERE tt.id = trainings.template_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all trainings" ON public.trainings
  FOR ALL USING (public.is_admin());

-- Attendance Policies
CREATE POLICY "Users can manage their own attendance" ON public.attendance
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all attendance" ON public.attendance
  FOR ALL USING (public.is_admin());
