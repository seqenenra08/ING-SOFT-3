/**
 * Venues / SGE service.
 * Prioridad: Supabase → REST API → mock local.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { venues, rentalRequests, contracts, payments, events, maintenanceTickets } from '../data/venuesData';
import type { Venue, RentalRequest, Contract, Payment, Event, MaintenanceTicket } from '../data/venuesData';

export const venuesService = {
  // ── Venues ───────────────────────────────────────────────────────────────────
  async getVenues(): Promise<Venue[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('venues').select('*, venue_images(*), venue_amenities(*), venue_rules(*)');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Venue[];
    }
    if (!isApiConfigured()) return venues;
    return api.get<Venue[]>('/venues');
  },

  async getVenueById(id: string): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('venues')
        .select('*, venue_images(*), venue_amenities(*), venue_rules(*)')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Venue;
    }
    if (!isApiConfigured()) {
      const v = venues.find(v => v.id === id);
      if (!v) throw new Error(`Venue ${id} not found`);
      return v;
    }
    return api.get<Venue>(`/venues/${id}`);
  },

  async createVenue(payload: Omit<Venue, 'id'>): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('venues').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return data as unknown as Venue;
    }
    return api.post<Venue>('/venues', payload);
  },

  async updateVenue(id: string, payload: Partial<Venue>): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('venues').update(payload).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data as unknown as Venue;
    }
    return api.put<Venue>(`/venues/${id}`, payload);
  },

  async toggleAvailability(id: string): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data: current } = await supabase!.from('venues').select('available').eq('id', id).single();
      const { data, error } = await supabase!
        .from('venues')
        .update({ available: !current?.available })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Venue;
    }
    return api.patch<Venue>(`/venues/${id}/availability`);
  },

  // ── Rental Requests ───────────────────────────────────────────────────────────
  async getRequests(): Promise<RentalRequest[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('v_rental_requests').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as RentalRequest[];
    }
    if (!isApiConfigured()) return rentalRequests;
    return api.get<RentalRequest[]>('/requests');
  },

  async getRequestById(id: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('v_rental_requests').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data as unknown as RentalRequest;
    }
    if (!isApiConfigured()) {
      const r = rentalRequests.find(r => r.id === id);
      if (!r) throw new Error(`Request ${id} not found`);
      return r;
    }
    return api.get<RentalRequest>(`/requests/${id}`);
  },

  async createRequest(payload: Omit<RentalRequest, 'id' | 'requestNumber' | 'submittedAt' | 'status'>): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('rental_requests').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return data as unknown as RentalRequest;
    }
    return api.post<RentalRequest>('/requests', payload);
  },

  async approveRequest(id: string, notes?: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('rental_requests')
        .update({ status: 'aprobada', notes })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as RentalRequest;
    }
    return api.patch<RentalRequest>(`/requests/${id}/approve`, { notes });
  },

  async rejectRequest(id: string, reason: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('rental_requests')
        .update({ status: 'rechazada', rejection_reason: reason })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as RentalRequest;
    }
    return api.patch<RentalRequest>(`/requests/${id}/reject`, { reason });
  },

  // ── Contracts ─────────────────────────────────────────────────────────────────
  async getContracts(): Promise<Contract[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('contracts').select('*, contract_clauses(*)');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Contract[];
    }
    if (!isApiConfigured()) return contracts;
    return api.get<Contract[]>('/contracts');
  },

  async getContractById(id: string): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('contracts').select('*, contract_clauses(*)').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data as unknown as Contract;
    }
    if (!isApiConfigured()) {
      const c = contracts.find(c => c.id === id);
      if (!c) throw new Error(`Contract ${id} not found`);
      return c;
    }
    return api.get<Contract>(`/contracts/${id}`);
  },

  async signContract(id: string): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .update({ status: 'activo', signed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Contract;
    }
    return api.patch<Contract>(`/contracts/${id}/sign`);
  },

  async legalReview(id: string, status: 'aprobado' | 'rechazado', notes?: string): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .update({ legal_review_status: status, legal_review_notes: notes })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Contract;
    }
    return api.patch<Contract>(`/contracts/${id}/legal-review`, { status, notes });
  },

  // ── Payments ──────────────────────────────────────────────────────────────────
  async getPayments(): Promise<Payment[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('payments').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Payment[];
    }
    if (!isApiConfigured()) return payments;
    return api.get<Payment[]>('/payments');
  },

  async registerPayment(payload: Omit<Payment, 'id' | 'paymentNumber' | 'registeredAt'>): Promise<Payment> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('payments').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return data as unknown as Payment;
    }
    return api.post<Payment>('/payments', payload);
  },

  // ── Events ────────────────────────────────────────────────────────────────────
  async getEvents(): Promise<Event[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('events').select('*, event_incidents(*)');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Event[];
    }
    if (!isApiConfigured()) return events;
    return api.get<Event[]>('/events');
  },

  async registerHandover(id: string, notes?: string): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .update({ handover_completed: true, handover_date: new Date().toISOString().split('T')[0], handover_notes: notes })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Event;
    }
    return api.patch<Event>(`/events/${id}/handover`, { notes, date: new Date().toISOString().split('T')[0] });
  },

  async registerReturn(id: string, notes?: string, incidents?: string[]): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .update({ return_completed: true, return_date: new Date().toISOString().split('T')[0], return_notes: notes })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      if (incidents?.length) {
        await supabase!.from('event_incidents').insert(incidents.map(desc => ({ event_id: id, description: desc })));
      }
      return data as unknown as Event;
    }
    return api.patch<Event>(`/events/${id}/return`, { notes, incidents, date: new Date().toISOString().split('T')[0] });
  },

  // ── Maintenance ───────────────────────────────────────────────────────────────
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('maintenance_tickets').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as MaintenanceTicket[];
    }
    if (!isApiConfigured()) return maintenanceTickets;
    return api.get<MaintenanceTicket[]>('/maintenance');
  },

  async createTicket(payload: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'reportedAt' | 'status'>): Promise<MaintenanceTicket> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('maintenance_tickets').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return data as unknown as MaintenanceTicket;
    }
    return api.post<MaintenanceTicket>('/maintenance', payload);
  },

  async resolveTicket(id: string, notes: string, cost?: number): Promise<MaintenanceTicket> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('maintenance_tickets')
        .update({ status: 'cerrado', resolution_notes: notes, cost, resolved_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as MaintenanceTicket;
    }
    return api.patch<MaintenanceTicket>(`/maintenance/${id}/resolve`, { notes, cost });
  },
};

export const venuesService = {
  // ── Venues ───────────────────────────────────────────────────────────────────
  async getVenues(): Promise<Venue[]> {
    if (!isApiConfigured()) return venues;
    return api.get<Venue[]>('/venues');
  },

  async getVenueById(id: string): Promise<Venue> {
    if (!isApiConfigured()) {
      const v = venues.find(v => v.id === id);
      if (!v) throw new Error(`Venue ${id} not found`);
      return v;
    }
    return api.get<Venue>(`/venues/${id}`);
  },

  async createVenue(payload: Omit<Venue, 'id'>): Promise<Venue> {
    return api.post<Venue>('/venues', payload);
  },

  async updateVenue(id: string, payload: Partial<Venue>): Promise<Venue> {
    return api.put<Venue>(`/venues/${id}`, payload);
  },

  async toggleAvailability(id: string): Promise<Venue> {
    return api.patch<Venue>(`/venues/${id}/availability`);
  },

  // ── Rental Requests ───────────────────────────────────────────────────────────
  async getRequests(): Promise<RentalRequest[]> {
    if (!isApiConfigured()) return rentalRequests;
    return api.get<RentalRequest[]>('/requests');
  },

  async getRequestById(id: string): Promise<RentalRequest> {
    if (!isApiConfigured()) {
      const r = rentalRequests.find(r => r.id === id);
      if (!r) throw new Error(`Request ${id} not found`);
      return r;
    }
    return api.get<RentalRequest>(`/requests/${id}`);
  },

  async createRequest(payload: Omit<RentalRequest, 'id' | 'requestNumber' | 'submittedAt' | 'status'>): Promise<RentalRequest> {
    return api.post<RentalRequest>('/requests', payload);
  },

  async approveRequest(id: string, notes?: string): Promise<RentalRequest> {
    return api.patch<RentalRequest>(`/requests/${id}/approve`, { notes });
  },

  async rejectRequest(id: string, reason: string): Promise<RentalRequest> {
    return api.patch<RentalRequest>(`/requests/${id}/reject`, { reason });
  },

  // ── Contracts ─────────────────────────────────────────────────────────────────
  async getContracts(): Promise<Contract[]> {
    if (!isApiConfigured()) return contracts;
    return api.get<Contract[]>('/contracts');
  },

  async getContractById(id: string): Promise<Contract> {
    if (!isApiConfigured()) {
      const c = contracts.find(c => c.id === id);
      if (!c) throw new Error(`Contract ${id} not found`);
      return c;
    }
    return api.get<Contract>(`/contracts/${id}`);
  },

  async signContract(id: string): Promise<Contract> {
    return api.patch<Contract>(`/contracts/${id}/sign`);
  },

  async legalReview(id: string, status: 'aprobado' | 'rechazado', notes?: string): Promise<Contract> {
    return api.patch<Contract>(`/contracts/${id}/legal-review`, { status, notes });
  },

  // ── Payments ──────────────────────────────────────────────────────────────────
  async getPayments(): Promise<Payment[]> {
    if (!isApiConfigured()) return payments;
    return api.get<Payment[]>('/payments');
  },

  async registerPayment(payload: Omit<Payment, 'id' | 'paymentNumber' | 'registeredAt'>): Promise<Payment> {
    return api.post<Payment>('/payments', payload);
  },

  // ── Events ────────────────────────────────────────────────────────────────────
  async getEvents(): Promise<Event[]> {
    if (!isApiConfigured()) return events;
    return api.get<Event[]>('/events');
  },

  async registerHandover(id: string, notes?: string): Promise<Event> {
    return api.patch<Event>(`/events/${id}/handover`, { notes, date: new Date().toISOString().split('T')[0] });
  },

  async registerReturn(id: string, notes?: string, incidents?: string[]): Promise<Event> {
    return api.patch<Event>(`/events/${id}/return`, { notes, incidents, date: new Date().toISOString().split('T')[0] });
  },

  // ── Maintenance ───────────────────────────────────────────────────────────────
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    if (!isApiConfigured()) return maintenanceTickets;
    return api.get<MaintenanceTicket[]>('/maintenance');
  },

  async createTicket(payload: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'reportedAt' | 'status'>): Promise<MaintenanceTicket> {
    return api.post<MaintenanceTicket>('/maintenance', payload);
  },

  async resolveTicket(id: string, notes: string, cost?: number): Promise<MaintenanceTicket> {
    return api.patch<MaintenanceTicket>(`/maintenance/${id}/resolve`, { notes, cost });
  },
};
