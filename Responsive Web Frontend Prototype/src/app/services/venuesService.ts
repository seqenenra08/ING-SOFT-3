/**
 * Venues / SGE service.
 * Prioridad: Supabase → REST API → mock local.
 *
 * MAPEO: frontend usa camelCase, la BD usa snake_case.
 * Las funciones toDb* y fromDb* hacen la traducción en ambas direcciones.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { venues, rentalRequests, contracts, payments, events, maintenanceTickets } from '../data/venuesData';
import type { Venue, RentalRequest, Contract, Payment, Event, MaintenanceTicket } from '../data/venuesData';

// ── Mappers Venue ─────────────────────────────────────────────────────────────
function fromDbVenue(row: any): Venue {
  return {
    id:           row.id,
    name:         row.name,
    type:         row.type,
    capacity:     row.capacity,
    area:         Number(row.area_m2) || 0,
    address:      row.address,
    neighborhood: row.neighborhood ?? '',
    zone:         row.zone ?? '',
    description:  row.description ?? '',
    hourlyRate:   Number(row.hourly_rate) || 0,
    dailyRate:    Number(row.daily_rate)  || 0,
    available:    row.available ?? true,
    features: {
      hasAC:         row.has_ac          ?? false,
      hasParking:    row.has_parking     ?? false,
      hasKitchen:    row.has_kitchen     ?? false,
      hasSoundSystem:row.has_sound_system ?? false,
      hasProjector:  row.has_projector   ?? false,
      hasStage:      row.has_stage       ?? false,
      accessibility: row.accessibility   ?? false,
    },
    images:    (row.venue_images   ?? []).map((i: any) => i.url),
    amenities: (row.venue_amenities ?? []).map((a: any) => a.amenity),
    rules:     (row.venue_rules    ?? []).map((r: any) => r.rule),
  };
}

function toDbVenue(v: Partial<Venue>): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (v.name         !== undefined) db.name          = v.name;
  if (v.type         !== undefined) db.type          = v.type;
  if (v.address      !== undefined) db.address       = v.address;
  if (v.neighborhood !== undefined) db.neighborhood  = v.neighborhood;
  if (v.zone         !== undefined) db.zone          = v.zone;
  if (v.capacity     !== undefined) db.capacity      = v.capacity;
  if (v.area         !== undefined) db.area_m2       = v.area;
  if (v.hourlyRate   !== undefined) db.hourly_rate   = v.hourlyRate;
  if (v.dailyRate    !== undefined) db.daily_rate    = v.dailyRate;
  if (v.description  !== undefined) db.description   = v.description;
  if (v.available    !== undefined) db.available     = v.available;
  if (v.features) {
    db.has_ac          = v.features.hasAC          ?? false;
    db.has_parking     = v.features.hasParking     ?? false;
    db.has_kitchen     = v.features.hasKitchen     ?? false;
    db.has_sound_system= v.features.hasSoundSystem ?? false;
    db.has_projector   = v.features.hasProjector   ?? false;
    db.has_stage       = v.features.hasStage       ?? false;
    db.accessibility   = v.features.accessibility  ?? false;
  }
  return db;
}

// ── Mappers RentalRequest ─────────────────────────────────────────────────────
function fromDbRequest(row: any): RentalRequest {
  return {
    id:              row.id,
    requestNumber:   row.request_number,
    venueId:         row.venue_id,
    venueName:       row.venue_name ?? row.venue_display_name ?? '',
    clientId:        row.reviewed_by ?? '',
    clientName:      row.client_name ?? '',
    clientDocument:  row.client_document ?? '',
    clientEmail:     row.client_email ?? '',
    clientPhone:     row.client_phone ?? '',
    eventName:       row.event_name ?? '',
    eventType:       row.event_type ?? '',
    eventDescription:'',
    startDate:       row.event_date ?? '',
    endDate:         row.event_date ?? '',
    startTime:       row.start_time ?? '',
    endTime:         row.end_time   ?? '',
    attendees:       row.attendees  ?? 0,
    status:          row.status,
    submittedAt:     row.submitted_at ?? '',
    reviewedAt:      row.reviewed_at  ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    notes:           row.notes ?? undefined,
  };
}

// ── Mappers Contract ──────────────────────────────────────────────────────────
function fromDbContract(row: any): Contract {
  return {
    id:               row.id,
    contractNumber:   row.contract_number,
    requestId:        row.request_id  ?? '',
    venueId:          row.venue_id    ?? '',
    venueName:        row.venue_name  ?? '',
    clientName:       row.client_name ?? '',
    clientDocument:   row.client_document ?? '',
    startDate:        row.start_date  ?? '',
    endDate:          row.end_date    ?? '',
    totalAmount:      Number(row.total_amount) || 0,
    status:           row.status,
    createdAt:        row.created_at  ?? '',
    signedAt:         row.signed_at   ?? undefined,
    legalReviewStatus:row.legal_review_status ?? 'pendiente',
    legalReviewNotes: row.legal_review_notes  ?? undefined,
    clauses:          (row.contract_clauses ?? []).map((c: any) => c.clause_text),
    documents:        [],
  };
}

// ── Mappers Payment ───────────────────────────────────────────────────────────
function fromDbPayment(row: any): Payment {
  return {
    id:            row.id,
    paymentNumber: row.payment_number,
    contractId:    row.contract_id   ?? '',
    contractNumber:row.contract_number ?? '',
    clientName:    row.client_name   ?? '',
    amount:        Number(row.amount) || 0,
    paymentMethod: row.payment_method,
    paymentDate:   row.payment_date  ?? '',
    receiptNumber: row.receipt_number ?? undefined,
    invoiceNumber: row.invoice_number ?? undefined,
    status:        row.status,
    registeredBy:  row.registered_by  ?? '',
    registeredAt:  row.registered_at  ?? '',
    notes:         row.notes ?? undefined,
  };
}

// ── Mappers Event ─────────────────────────────────────────────────────────────
function fromDbEvent(row: any): Event {
  return {
    id:                row.id,
    requestId:         row.request_id  ?? '',
    contractId:        row.contract_id ?? '',
    venueName:         row.venue_name  ?? '',
    eventName:         row.event_name  ?? '',
    eventDate:         row.event_date  ?? '',
    startTime:         row.start_time  ?? '',
    endTime:           row.end_time    ?? '',
    status:            row.status,
    handoverCompleted: row.handover_completed ?? false,
    handoverDate:      row.handover_date  ?? undefined,
    handoverNotes:     row.handover_notes ?? undefined,
    returnCompleted:   row.return_completed ?? false,
    returnDate:        row.return_date  ?? undefined,
    returnNotes:       row.return_notes ?? undefined,
    incidents:         (row.event_incidents ?? []).map((i: any) => i.description),
  };
}

// ── Mappers MaintenanceTicket ─────────────────────────────────────────────────
function fromDbTicket(row: any): MaintenanceTicket {
  return {
    id:              row.id,
    ticketNumber:    row.ticket_number,
    venueId:         row.venue_id    ?? '',
    venueName:       row.venue_name  ?? '',
    type:            row.type,
    priority:        row.priority,
    title:           row.title,
    description:     row.description ?? '',
    reportedBy:      row.reported_by ?? '',
    reportedAt:      row.created_at  ?? '',
    status:          row.status,
    assignedTo:      row.assigned_to  ?? undefined,
    resolvedAt:      row.resolved_at  ?? undefined,
    resolutionNotes: row.resolution_notes ?? undefined,
    cost:            row.cost ? Number(row.cost) : undefined,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const genId = (prefix: string) =>
  `${prefix}-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

export const venuesService = {
  // ── Venues ───────────────────────────────────────────────────────────────────
  async getVenues(): Promise<Venue[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('venues')
        .select('*, venue_images(*), venue_amenities(*), venue_rules(*)');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbVenue);
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
      return fromDbVenue(data);
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
      const { data, error } = await supabase!
        .from('venues')
        .insert([toDbVenue(payload as Venue)])
        .select('*, venue_images(*), venue_amenities(*), venue_rules(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbVenue(data);
    }
    return api.post<Venue>('/venues', payload);
  },

  async updateVenue(id: string, payload: Partial<Venue>): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('venues')
        .update(toDbVenue(payload))
        .eq('id', id)
        .select('*, venue_images(*), venue_amenities(*), venue_rules(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbVenue(data);
    }
    return api.put<Venue>(`/venues/${id}`, payload);
  },

  async toggleAvailability(id: string): Promise<Venue> {
    if (isSupabaseConfigured()) {
      const { data: current } = await supabase!
        .from('venues').select('available').eq('id', id).single();
      const { data, error } = await supabase!
        .from('venues')
        .update({ available: !current?.available })
        .eq('id', id)
        .select('*, venue_images(*), venue_amenities(*), venue_rules(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbVenue(data);
    }
    return api.patch<Venue>(`/venues/${id}/availability`);
  },

  async deleteVenue(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('venues').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    return api.delete(`/venues/${id}`);
  },

  // ── Rental Requests ───────────────────────────────────────────────────────────
  async getRequests(): Promise<RentalRequest[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_rental_requests').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbRequest);
    }
    if (!isApiConfigured()) return rentalRequests;
    return api.get<RentalRequest[]>('/requests');
  },

  async getRequestById(id: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_rental_requests').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return fromDbRequest(data);
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
      const { data, error } = await supabase!
        .from('rental_requests')
        .insert([{
          request_number:  genId('SGE'),
          venue_id:        (payload as any).venueId        ?? null,
          venue_name:      (payload as any).venueName      ?? '',
          client_name:     payload.clientName              ?? '',
          client_email:    payload.clientEmail             ?? '',
          client_phone:    payload.clientPhone             ?? '',
          client_document: payload.clientDocument          ?? '',
          client_org:      (payload as any).clientOrg      ?? null,
          event_type:      payload.eventType               ?? '',
          event_name:      payload.eventName               ?? '',
          event_date:      payload.startDate               ?? null,
          start_time:      payload.startTime               ?? null,
          end_time:        payload.endTime                 ?? null,
          attendees:       payload.attendees               ?? 0,
          notes:           (payload as any).notes         ?? null,
          status:          'enviada',
        }])
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbRequest(data);
    }
    return api.post<RentalRequest>('/requests', payload);
  },

  async approveRequest(id: string, notes?: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('rental_requests')
        .update({ status: 'aprobada', notes, reviewed_at: new Date().toISOString() })
        .eq('id', id)
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbRequest(data);
    }
    return api.patch<RentalRequest>(`/requests/${id}/approve`, { notes });
  },

  async rejectRequest(id: string, reason: string): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('rental_requests')
        .update({ status: 'rechazada', rejection_reason: reason, reviewed_at: new Date().toISOString() })
        .eq('id', id)
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbRequest(data);
    }
    return api.patch<RentalRequest>(`/requests/${id}/reject`, { reason });
  },

  /**
   * Cambia el estado de una solicitud a cualquier valor del enum request_status.
   * Si el nuevo estado es 'rechazada' o 'cancelada', se exige un motivo.
   * Si se pasa a un estado no terminal, se borra el motivo de rechazo previo.
   */
  async updateRequestStatus(
    id: string,
    status: string,
    options?: { reason?: string; notes?: string }
  ): Promise<RentalRequest> {
    if (isSupabaseConfigured()) {
      const payload: Record<string, unknown> = {
        status,
        reviewed_at: new Date().toISOString(),
      };
      if (status === 'rechazada' || status === 'cancelada') {
        payload.rejection_reason = options?.reason ?? null;
      } else {
        // Al reabrir/avanzar, limpiamos motivo de rechazo previo
        payload.rejection_reason = null;
      }
      if (options?.notes !== undefined) payload.notes = options.notes;

      const { data, error } = await supabase!
        .from('rental_requests')
        .update(payload)
        .eq('id', id)
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbRequest(data);
    }
    return api.patch<RentalRequest>(`/requests/${id}/status`, { status, ...options });
  },

  // ── Contracts ─────────────────────────────────────────────────────────────────
  async getContracts(): Promise<Contract[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .select('*, contract_clauses(*)');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbContract);
    }
    if (!isApiConfigured()) return contracts;
    return api.get<Contract[]>('/contracts');
  },

  async getContractById(id: string): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .select('*, contract_clauses(*)')
        .eq('id', id).single();
      if (error) throw new Error(error.message);
      return fromDbContract(data);
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
        .select('*, contract_clauses(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbContract(data);
    }
    return api.patch<Contract>(`/contracts/${id}/sign`);
  },

  async createContract(payload: Partial<Contract>): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .insert([{
          contract_number:  genId('CON'),
          request_id:       (payload as any).requestId ?? null,
          venue_id:         (payload as any).venueId   ?? null,
          venue_name:       payload.venueName       ?? '',
          client_name:      payload.clientName      ?? '',
          client_document:  payload.clientDocument  ?? '',
          start_date:       payload.startDate       ?? null,
          end_date:         payload.endDate         ?? null,
          total_amount:     payload.totalAmount     ?? 0,
          status:           payload.status          ?? 'borrador',
        }])
        .select('*, contract_clauses(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbContract(data);
    }
    return api.post<Contract>('/contracts', payload);
  },

  async updateContract(id: string, payload: Partial<Contract>): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const db: Record<string, unknown> = {};
      if (payload.clientName     !== undefined) db.client_name     = payload.clientName;
      if (payload.clientDocument !== undefined) db.client_document = payload.clientDocument;
      if (payload.venueName      !== undefined) db.venue_name      = payload.venueName;
      if ((payload as any).venueId !== undefined) db.venue_id      = (payload as any).venueId;
      if (payload.startDate      !== undefined) db.start_date      = payload.startDate;
      if (payload.endDate        !== undefined) db.end_date        = payload.endDate;
      if (payload.totalAmount    !== undefined) db.total_amount    = payload.totalAmount;
      if (payload.status         !== undefined) db.status          = payload.status;
      const { data, error } = await supabase!
        .from('contracts').update(db).eq('id', id)
        .select('*, contract_clauses(*)').single();
      if (error) throw new Error(error.message);
      return fromDbContract(data);
    }
    return api.put<Contract>(`/contracts/${id}`, payload);
  },

  async deleteContract(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('contracts').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    return api.delete(`/contracts/${id}`);
  },

  async legalReview(id: string, status: 'aprobado' | 'rechazado', notes?: string): Promise<Contract> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('contracts')
        .update({ legal_review_status: status, legal_review_notes: notes, legal_reviewed_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, contract_clauses(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbContract(data);
    }
    return api.patch<Contract>(`/contracts/${id}/legal-review`, { status, notes });
  },

  // ── Payments ──────────────────────────────────────────────────────────────────
  async getPayments(): Promise<Payment[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('payments').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbPayment);
    }
    if (!isApiConfigured()) return payments;
    return api.get<Payment[]>('/payments');
  },

  async registerPayment(payload: Omit<Payment, 'id' | 'paymentNumber' | 'registeredAt'>): Promise<Payment> {
    if (isSupabaseConfigured()) {
      // Look up contract_id from contract_number if provided
      let contractId: string | null = (payload as any).contractId ?? null;
      if (!contractId && payload.contractNumber) {
        const { data: ct } = await supabase!
          .from('contracts')
          .select('id')
          .eq('contract_number', payload.contractNumber)
          .maybeSingle();
        contractId = ct?.id ?? null;
      }

      const { data, error } = await supabase!
        .from('payments')
        .insert([{
          payment_number:  genId('PAG'),
          contract_id:     contractId,
          contract_number: payload.contractNumber ?? '',
          client_name:     payload.clientName     ?? '',
          amount:          payload.amount,
          payment_method:  payload.paymentMethod  ?? 'transferencia',
          payment_date:    payload.paymentDate     ?? new Date().toISOString().split('T')[0],
          receipt_number:  payload.receiptNumber  ?? null,
          invoice_number:  payload.invoiceNumber  ?? null,
          status:          payload.status         ?? 'pendiente',
          notes:           payload.notes          ?? null,
        }])
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbPayment(data);
    }
    return api.post<Payment>('/payments', payload);
  },

  // ── Events ────────────────────────────────────────────────────────────────────
  async getEvents(): Promise<Event[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .select('*, event_incidents(*)');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbEvent);
    }
    if (!isApiConfigured()) return events;
    return api.get<Event[]>('/events');
  },

  async createEvent(payload: Partial<Event>): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .insert([{
          request_id:  (payload as any).requestId  ?? null,
          contract_id: (payload as any).contractId ?? null,
          venue_name:  payload.venueName  ?? '',
          event_name:  payload.eventName  ?? '',
          event_date:  payload.eventDate  ?? null,
          start_time:  payload.startTime  ?? '08:00',
          end_time:    payload.endTime    ?? '18:00',
          status:      payload.status     ?? 'programado',
        }])
        .select('*, event_incidents(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbEvent(data);
    }
    return api.post<Event>('/events', payload);
  },

  async updateEventStatus(id: string, status: string): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events').update({ status })
        .eq('id', id).select('*, event_incidents(*)').single();
      if (error) throw new Error(error.message);
      return fromDbEvent(data);
    }
    return api.patch<Event>(`/events/${id}`, { status });
  },

  async deleteEvent(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('events').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    return api.delete(`/events/${id}`);
  },

  async registerHandover(id: string, notes?: string): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .update({
          handover_completed: true,
          handover_date:  new Date().toISOString().split('T')[0],
          handover_notes: notes,
        })
        .eq('id', id)
        .select('*, event_incidents(*)')
        .single();
      if (error) throw new Error(error.message);
      return fromDbEvent(data);
    }
    return api.patch<Event>(`/events/${id}/handover`, { notes, date: new Date().toISOString().split('T')[0] });
  },

  async registerReturn(id: string, notes?: string, incidents?: string[]): Promise<Event> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('events')
        .update({
          return_completed: true,
          return_date:  new Date().toISOString().split('T')[0],
          return_notes: notes,
        })
        .eq('id', id)
        .select('*, event_incidents(*)')
        .single();
      if (error) throw new Error(error.message);
      if (incidents?.length) {
        await supabase!.from('event_incidents')
          .insert(incidents.map(desc => ({ event_id: id, description: desc })));
      }
      return fromDbEvent(data);
    }
    return api.patch<Event>(`/events/${id}/return`, { notes, incidents, date: new Date().toISOString().split('T')[0] });
  },

  // ── Maintenance ───────────────────────────────────────────────────────────────
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('maintenance_tickets').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbTicket);
    }
    if (!isApiConfigured()) return maintenanceTickets;
    return api.get<MaintenanceTicket[]>('/maintenance');
  },

  async createTicket(payload: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'reportedAt' | 'status'>): Promise<MaintenanceTicket> {
    if (isSupabaseConfigured()) {
      // Look up venue_id from venue name if provided
      let venueId: string | null = (payload as any).venueId ?? null;
      if (!venueId && payload.venueName) {
        const { data: vn } = await supabase!
          .from('venues')
          .select('id')
          .ilike('name', payload.venueName)
          .maybeSingle();
        venueId = vn?.id ?? null;
      }

      const { data, error } = await supabase!
        .from('maintenance_tickets')
        .insert([{
          ticket_number: genId('TKT'),
          venue_id:      venueId,
          venue_name:    payload.venueName    ?? '',
          type:          payload.type,
          priority:      payload.priority,
          title:         payload.title,
          description:   payload.description  ?? '',
          reported_by:   payload.reportedBy   ?? '',
          assigned_to:   payload.assignedTo   ?? null,
        }])
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbTicket(data);
    }
    return api.post<MaintenanceTicket>('/maintenance', payload);
  },

  async resolveTicket(id: string, notes: string, cost?: number): Promise<MaintenanceTicket> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('maintenance_tickets')
        .update({
          status:           'cerrado',
          resolution_notes: notes,
          cost:             cost ?? null,
          resolved_at:      new Date().toISOString(),
        })
        .eq('id', id)
        .select().single();
      if (error) throw new Error(error.message);
      return fromDbTicket(data);
    }
    return api.patch<MaintenanceTicket>(`/maintenance/${id}/resolve`, { notes, cost });
  },
};
