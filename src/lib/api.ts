import { supabase } from './supabase';
import { 
  Project, 
  CreateProject, 
  Todo, 
  CreateTodo, 
  DailyLog, 
  CreateDailyLog,
  TodoFilters,
  DailyLogFilters,
  ProjectSchema,
  TodoSchema,
  DailyLogSchema,
  CreateProjectSchema,
  CreateTodoSchema,
  CreateDailyLogSchema
} from './types';

// Project API
export const listProjects = async (search?: string): Promise<Project[]> => {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%, external_ref.ilike.%${search}%`);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(project => ProjectSchema.parse(project));
};

export const createProject = async (payload: CreateProject): Promise<Project> => {
  const validatedPayload = CreateProjectSchema.parse(payload);
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      name: validatedPayload.name,
      external_ref: validatedPayload.code,
      // Note: location and template_id would need additional table structure
    }])
    .select()
    .single();

  if (error) throw error;
  
  return ProjectSchema.parse(data);
};

// Todo API
export const listTodos = async (projectId: string, filters?: TodoFilters): Promise<Todo[]> => {
  let query = supabase
    .from('to_dos')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  if (filters?.due_date) {
    query = query.eq('due_date', filters.due_date);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(todo => TodoSchema.parse(todo));
};

export const createTodo = async (projectId: string, payload: CreateTodo): Promise<Todo> => {
  const validatedPayload = CreateTodoSchema.parse(payload);
  
  const { data, error } = await supabase
    .from('to_dos')
    .insert([{
      ...validatedPayload,
      project_id: projectId,
    }])
    .select()
    .single();

  if (error) throw error;
  
  return TodoSchema.parse(data);
};

// Daily Log API
export const listDailyLogs = async (projectId: string, filters?: DailyLogFilters): Promise<DailyLog[]> => {
  let query = supabase
    .from('daily_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (filters?.entry_type) {
    query = query.eq('entry_type', filters.entry_type);
  }
  if (filters?.todo_id) {
    query = query.eq('todo_id', filters.todo_id);
  }
  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(log => DailyLogSchema.parse(log));
};

export const createDailyLog = async (projectId: string, payload: CreateDailyLog): Promise<DailyLog> => {
  const validatedPayload = CreateDailyLogSchema.parse(payload);
  
  const { data, error } = await supabase
    .from('daily_logs')
    .insert([{
      ...validatedPayload,
      project_id: projectId,
    }])
    .select()
    .single();

  if (error) throw error;
  
  return DailyLogSchema.parse(data);
};

export const updateProject = async (projectId: string, payload: Partial<CreateProject>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: payload.name,
      external_ref: payload.code,
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  
  return ProjectSchema.parse(data);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
};