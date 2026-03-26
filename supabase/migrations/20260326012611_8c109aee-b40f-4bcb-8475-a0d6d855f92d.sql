
-- Create representantes table
CREATE TABLE public.representantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cedula TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cargo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create residentes table
CREATE TABLE public.residentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cedula TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('Masculino', 'Femenino')),
  discapacidad BOOLEAN NOT NULL DEFAULT false,
  situacion_economica TEXT NOT NULL CHECK (situacion_economica IN ('Leve', 'Grave')),
  hijos INTEGER NOT NULL DEFAULT 0,
  agregado_por UUID REFERENCES public.representantes(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.representantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residentes ENABLE ROW LEVEL SECURITY;

-- Public access policies (community app without auth)
CREATE POLICY "Anyone can read representantes" ON public.representantes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert representantes" ON public.representantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete representantes" ON public.representantes FOR DELETE USING (true);

CREATE POLICY "Anyone can read residentes" ON public.residentes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert residentes" ON public.residentes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update residentes" ON public.residentes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete residentes" ON public.residentes FOR DELETE USING (true);
