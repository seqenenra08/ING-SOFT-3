/**
 * Barrel export for the services layer.
 */
export { api, getToken, setToken, removeToken, isApiConfigured } from './api';
export type { ApiError } from './api';

export { authService } from './authService';
export type { AuthUser, AuthResponse, LoginPayload, RegisterPayload, UserRole } from './authService';

export { studentsService } from './studentsService';
export type { Student } from './studentsService';

export { programsService } from './programsService';
export type { Program } from './programsService';

export { venuesService } from './venuesService';

export { educatorsService } from './educatorsService';
export type { Educator } from './educatorsService';
