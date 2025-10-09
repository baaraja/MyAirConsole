import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateUserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Le nom est requis').optional(),
  email: z.string().email('Email invalide'),
  role: z.nativeEnum(Role),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.nativeEnum(Role).default(Role.USER),
});

export const deleteUserSchema = z.object({
  id: z.string().cuid(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
