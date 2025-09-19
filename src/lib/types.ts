import { z } from 'zod';

// Project schemas
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.string().default('open'),
  external_ref: z.string().nullable(),
  created_at: z.string(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  code: z.string().min(1, 'Project code is required'),
  location: z.string().min(1, 'Location is required'),
  template_id: z.string().optional(),
});

// Todo schemas
export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  notes: z.string().nullable(),
  status: z.string().default('incomplete'),
  priority: z.string().default('none'),
  due_date: z.string().nullable(),
  assigned_to: z.string().uuid().nullable(),
  project_id: z.string().uuid(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  status: z.string().default('incomplete'),
  priority: z.string().default('none'),
  due_date: z.string().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

// Daily Log schemas
export const DailyLogSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  entry_type: z.string().default('note'),
  project_id: z.string().uuid(),
  todo_id: z.string().uuid().nullable(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const CreateDailyLogSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  entry_type: z.string().default('note'),
  todo_id: z.string().uuid().nullable().optional(),
});

// Filter schemas
export const TodoFiltersSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().optional(),
});

export const DailyLogFiltersSchema = z.object({
  entry_type: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  todo_id: z.string().uuid().optional(),
});

// Type exports
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type DailyLog = z.infer<typeof DailyLogSchema>;
export type CreateDailyLog = z.infer<typeof CreateDailyLogSchema>;
export type TodoFilters = z.infer<typeof TodoFiltersSchema>;
export type DailyLogFilters = z.infer<typeof DailyLogFiltersSchema>;