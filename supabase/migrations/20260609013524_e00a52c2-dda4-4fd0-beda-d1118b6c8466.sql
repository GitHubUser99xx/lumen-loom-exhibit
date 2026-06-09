
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  confirmation_token TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.subscribers TO service_role;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- No client-facing policies: all access goes through the public API route using the service role.
CREATE INDEX subscribers_email_idx ON public.subscribers (lower(email));
