
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'officer', 'member');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES (separate, secure) ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'super_admin') $$;

-- ============ ORGANIZATIONS ============
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  county TEXT,
  town TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- ============ CHAMAS ============
CREATE TABLE public.chamas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  project_name TEXT,
  officer_name TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chamas ENABLE ROW LEVEL SECURITY;

-- ============ OFFICER ASSIGNMENTS ============
CREATE TABLE public.chama_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chama_id UUID NOT NULL REFERENCES public.chamas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chama_id, user_id)
);
ALTER TABLE public.chama_officers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_chama_officer(_user_id UUID, _chama_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.chama_officers WHERE user_id = _user_id AND chama_id = _chama_id)
$$;

-- ============ MEMBERS ============
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chama_id UUID NOT NULL REFERENCES public.chamas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  member_number TEXT,
  phone_number TEXT,
  id_number TEXT,
  photo_url TEXT,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_members_chama ON public.members(chama_id);
CREATE INDEX idx_members_user ON public.members(user_id);

-- ============ MEETING SESSIONS ============
CREATE TABLE public.meeting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chama_id UUID NOT NULL REFERENCES public.chamas(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  meeting_number INTEGER,
  venue TEXT,
  time TEXT,
  bus_no TEXT,
  elder TEXT,
  zona TEXT,
  zona_ward TEXT,
  field_officer TEXT,
  notes TEXT,
  auditor_comment TEXT,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ
);
ALTER TABLE public.meeting_sessions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_sessions_chama ON public.meeting_sessions(chama_id);

-- ============ MEMBER RECORDS ============
CREATE TABLE public.member_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  savings_shares_bf NUMERIC NOT NULL DEFAULT 0,
  loan_balance_bf NUMERIC NOT NULL DEFAULT 0,
  total_repaid NUMERIC NOT NULL DEFAULT 0,
  principal NUMERIC NOT NULL DEFAULT 0,
  loan_interest NUMERIC NOT NULL DEFAULT 0,
  shares_this_month NUMERIC NOT NULL DEFAULT 0,
  welfare NUMERIC NOT NULL DEFAULT 0,
  savings_shares_cf NUMERIC GENERATED ALWAYS AS (savings_shares_bf + shares_this_month) STORED,
  loan_cf NUMERIC GENERATED ALWAYS AS (loan_balance_bf - principal) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, member_id)
);
ALTER TABLE public.member_records ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_records_session ON public.member_records(session_id);
CREATE INDEX idx_records_member ON public.member_records(member_id);

-- ============ SESSION SUMMARY ============
CREATE TABLE public.session_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  -- Section C: Money In
  total_repaid NUMERIC NOT NULL DEFAULT 0,
  advance_paid NUMERIC NOT NULL DEFAULT 0,
  fines_and_charges NUMERIC NOT NULL DEFAULT 0,
  welfare NUMERIC NOT NULL DEFAULT 0,
  pass_books NUMERIC NOT NULL DEFAULT 0,
  transfer NUMERIC NOT NULL DEFAULT 0,
  prev_banking NUMERIC NOT NULL DEFAULT 0,
  others NUMERIC NOT NULL DEFAULT 0,
  grand_total_c NUMERIC GENERATED ALWAYS AS
    (total_repaid + advance_paid + fines_and_charges + welfare + pass_books + transfer + prev_banking + others) STORED,
  -- Section D: Money Out
  principal_withdrawals NUMERIC NOT NULL DEFAULT 0,
  loans NUMERIC NOT NULL DEFAULT 0,
  advance NUMERIC NOT NULL DEFAULT 0,
  welfare_risk NUMERIC NOT NULL DEFAULT 0,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  pass_books_d NUMERIC NOT NULL DEFAULT 0,
  loan_form NUMERIC NOT NULL DEFAULT 0,
  others_d NUMERIC NOT NULL DEFAULT 0,
  grand_total_d NUMERIC GENERATED ALWAYS AS
    (principal_withdrawals + loans + advance + welfare_risk + service_fee + pass_books_d + loan_form + others_d) STORED,
  -- Section E: Overdraft
  overdraft_bf NUMERIC NOT NULL DEFAULT 0,
  od_paid NUMERIC NOT NULL DEFAULT 0,
  balance_od NUMERIC GENERATED ALWAYS AS (overdraft_bf - od_paid) STORED,
  total_banking NUMERIC NOT NULL DEFAULT 0,
  -- Section F
  bank_withdrawal NUMERIC NOT NULL DEFAULT 0,
  total_in_bank NUMERIC NOT NULL DEFAULT 0,
  total_overdraft NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.session_summary ENABLE ROW LEVEL SECURITY;

-- ============ ADVANCES (Section A) ============
CREATE TABLE public.advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL DEFAULT 1,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;

-- ============ LOANS GIVEN (Section B) ============
CREATE TABLE public.loans_given (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.loans_given ENABLE ROW LEVEL SECURITY;

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============ TRIGGERS ============
-- Auto-create profile + assign first user as super_admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_super_admin(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Super admin manages profiles" ON public.profiles FOR ALL
  USING (public.is_super_admin(auth.uid()));

-- user_roles (NEVER allow self-assign)
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin manages roles" ON public.user_roles FOR ALL
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- organizations
CREATE POLICY "Authenticated read orgs" ON public.organizations FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "Super admin manages orgs" ON public.organizations FOR ALL
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- chamas
CREATE POLICY "View chamas: admin/officer/member" ON public.chamas FOR SELECT
  USING (
    public.is_super_admin(auth.uid())
    OR public.is_chama_officer(auth.uid(), id)
    OR EXISTS (SELECT 1 FROM public.members m WHERE m.chama_id = chamas.id AND m.user_id = auth.uid())
  );
CREATE POLICY "Super admin manages chamas" ON public.chamas FOR ALL
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- chama_officers
CREATE POLICY "View own assignments" ON public.chama_officers FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin manages assignments" ON public.chama_officers FOR ALL
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- members
CREATE POLICY "View members of accessible chamas" ON public.members FOR SELECT
  USING (
    public.is_super_admin(auth.uid())
    OR public.is_chama_officer(auth.uid(), chama_id)
    OR user_id = auth.uid()
  );
CREATE POLICY "Admin/officer manage members" ON public.members FOR ALL
  USING (public.is_super_admin(auth.uid()) OR public.is_chama_officer(auth.uid(), chama_id))
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_chama_officer(auth.uid(), chama_id));

-- meeting_sessions
CREATE POLICY "View sessions of accessible chamas" ON public.meeting_sessions FOR SELECT
  USING (
    public.is_super_admin(auth.uid())
    OR public.is_chama_officer(auth.uid(), chama_id)
    OR EXISTS (SELECT 1 FROM public.members m WHERE m.chama_id = meeting_sessions.chama_id AND m.user_id = auth.uid())
  );
CREATE POLICY "Officer creates sessions" ON public.meeting_sessions FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_chama_officer(auth.uid(), chama_id));
CREATE POLICY "Officer updates unlocked sessions" ON public.meeting_sessions FOR UPDATE
  USING (
    public.is_super_admin(auth.uid())
    OR (public.is_chama_officer(auth.uid(), chama_id) AND is_locked = FALSE)
  );
CREATE POLICY "Super admin deletes sessions" ON public.meeting_sessions FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- Helper: session accessible
CREATE OR REPLACE FUNCTION public.can_access_session(_user_id UUID, _session_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_super_admin(_user_id) OR EXISTS (
    SELECT 1 FROM public.meeting_sessions s
    WHERE s.id = _session_id AND public.is_chama_officer(_user_id, s.chama_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.session_is_locked(_session_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT is_locked FROM public.meeting_sessions WHERE id = _session_id $$;

-- member_records
CREATE POLICY "View own records or accessible sessions" ON public.member_records FOR SELECT
  USING (
    public.is_super_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.meeting_sessions s
      WHERE s.id = session_id AND public.is_chama_officer(auth.uid(), s.chama_id)
    )
    OR EXISTS (
      SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()
    )
  );
CREATE POLICY "Officer manages records on unlocked sessions" ON public.member_records FOR ALL
  USING (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE))
  WITH CHECK (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE));

-- session_summary / advances / loans_given - same pattern
CREATE POLICY "View summary if can access" ON public.session_summary FOR SELECT
  USING (public.can_access_session(auth.uid(), session_id)
         OR EXISTS (SELECT 1 FROM public.meeting_sessions s JOIN public.members m ON m.chama_id = s.chama_id
                    WHERE s.id = session_id AND m.user_id = auth.uid()));
CREATE POLICY "Manage summary" ON public.session_summary FOR ALL
  USING (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE))
  WITH CHECK (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE));

CREATE POLICY "View advances if can access" ON public.advances FOR SELECT
  USING (public.can_access_session(auth.uid(), session_id)
         OR EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "Manage advances" ON public.advances FOR ALL
  USING (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE))
  WITH CHECK (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE));

CREATE POLICY "View loans_given if can access" ON public.loans_given FOR SELECT
  USING (public.can_access_session(auth.uid(), session_id)
         OR EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "Manage loans_given" ON public.loans_given FOR ALL
  USING (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE))
  WITH CHECK (public.can_access_session(auth.uid(), session_id) AND (public.is_super_admin(auth.uid()) OR public.session_is_locked(session_id) = FALSE));

-- notifications
CREATE POLICY "View own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Update own notifications" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
