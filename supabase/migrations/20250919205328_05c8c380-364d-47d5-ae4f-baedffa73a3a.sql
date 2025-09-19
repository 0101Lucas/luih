-- Add UPDATE and DELETE policies for projects table
CREATE POLICY "dev update projects" 
ON public.projects 
FOR UPDATE 
USING (true);

CREATE POLICY "dev delete projects" 
ON public.projects 
FOR DELETE 
USING (true);

-- Also add the regular user policies for update/delete when authentication is implemented
CREATE POLICY "update my projects" 
ON public.projects 
FOR UPDATE 
USING (is_project_member(id));

CREATE POLICY "delete my projects" 
ON public.projects 
FOR DELETE 
USING (is_project_member(id));