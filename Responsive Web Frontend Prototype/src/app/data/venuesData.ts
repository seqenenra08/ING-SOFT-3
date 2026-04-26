export type VenueType = 'auditorio' | 'teatro' | 'salon_cultural' | 'sala_exposiciones' | 'espacio_abierto';
export type RequestStatus = 'borrador' | 'enviada' | 'en_revision' | 'aprobada' | 'rechazada' | 'pendiente_pago' | 'pagada' | 'evento_programado' | 'completado';
export type MaintenanceStatus = 'abierto' | 'en_progreso' | 'cerrado';
export type ContractStatus = 'borrador' | 'en_revision_juridica' | 'aprobado' | 'firmado' | 'vigente' | 'finalizado';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  capacity: number;
  area: number; // m2
  address: string;
  neighborhood: string;
  zone: string;
  description: string;
  amenities: string[];
  rules: string[];
  images: string[];
  hourlyRate: number;
  dailyRate: number;
  available: boolean;
  features: {
    hasAC: boolean;
    hasParking: boolean;
    hasKitchen: boolean;
    hasSoundSystem: boolean;
    hasProjector: boolean;
    hasStage: boolean;
    accessibility: boolean;
  };
}

export interface RentalRequest {
  id: string;
  requestNumber: string;
  venueId: string;
  venueName: string;
  clientId: string;
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  clientPhone: string;
  eventName: string;
  eventType: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  contractId?: string;
  paymentId?: string;
  notes?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  requestId: string;
  venueId: string;
  venueName: string;
  clientName: string;
  clientDocument: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: ContractStatus;
  createdAt: string;
  signedAt?: string;
  legalReviewStatus?: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  legalReviewNotes?: string;
  legalReviewedBy?: string;
  legalReviewedAt?: string;
  clauses: string[];
  documents: string[];
}

export interface Payment {
  id: string;
  paymentNumber: string;
  contractId: string;
  contractNumber: string;
  clientName: string;
  amount: number;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  paymentDate: string;
  receiptNumber?: string;
  invoiceNumber?: string;
  status: 'pendiente' | 'parcial' | 'completado';
  registeredBy: string;
  registeredAt: string;
  notes?: string;
}

export interface Event {
  id: string;
  requestId: string;
  contractId: string;
  venueName: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  handoverCompleted: boolean;
  handoverDate?: string;
  handoverNotes?: string;
  returnCompleted: boolean;
  returnDate?: string;
  returnNotes?: string;
  incidents?: string[];
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  venueId: string;
  venueName: string;
  type: 'preventivo' | 'correctivo';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: MaintenanceStatus;
  assignedTo?: string;
  assignedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  cost?: number;
  attachments?: string[];
}

// Mock Venues Data
export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'Auditorio Principal Centro Cultural',
    type: 'auditorio',
    capacity: 350,
    area: 420,
    address: 'Carrera 5 #6-05',
    neighborhood: 'San Antonio',
    zone: 'Centro',
    description: 'Auditorio equipado con sistema de sonido profesional, iluminación escénica y aire acondicionado. Ideal para conferencias, presentaciones culturales y eventos corporativos.',
    amenities: ['Sistema de sonido profesional', 'Iluminación escénica', 'Aire acondicionado', 'Escenario elevado', 'Camerinos', 'Proyector HD', 'Pantalla gigante', 'Estacionamiento 40 vehículos'],
    rules: ['No fumar', 'No consumir alimentos ni bebidas en la sala', 'Respetar horarios de montaje y desmontaje', 'Contratar póliza de responsabilidad civil'],
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2'],
    hourlyRate: 280000,
    dailyRate: 1800000,
    available: true,
    features: {
      hasAC: true,
      hasParking: true,
      hasKitchen: false,
      hasSoundSystem: true,
      hasProjector: true,
      hasStage: true,
      accessibility: true
    }
  },
  {
    id: 'v2',
    name: 'Teatro Municipal Jorge Isaacs',
    type: 'teatro',
    capacity: 180,
    area: 280,
    address: 'Calle 8 #3-14',
    neighborhood: 'Granada',
    zone: 'Centro',
    description: 'Teatro íntimo con excelente acústica y visibilidad desde todos los puntos. Perfecto para teatro, danza, música de cámara y presentaciones artísticas.',
    amenities: ['Sistema acústico especializado', 'Iluminación teatral', 'Telón motorizado', 'Foso de orquesta', 'Cabina de sonido', 'Camerinos con espejos', 'Aire acondicionado'],
    rules: ['No permitido consumo de alimentos', 'Silencio absoluto durante ensayos', 'Uso obligatorio de calzado adecuado en escenario', 'Prohibido fumar'],
    images: ['https://images.unsplash.com/photo-1503095396549-807759245b35', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf'],
    hourlyRate: 320000,
    dailyRate: 2200000,
    available: true,
    features: {
      hasAC: true,
      hasParking: false,
      hasKitchen: false,
      hasSoundSystem: true,
      hasProjector: false,
      hasStage: true,
      accessibility: true
    }
  },
  {
    id: 'v3',
    name: 'Salón Sebastián de Belalcázar',
    type: 'salon_cultural',
    capacity: 120,
    area: 180,
    address: 'Avenida Colombia #8-30',
    neighborhood: 'Santa Rosa',
    zone: 'Norte',
    description: 'Salón versátil con mobiliario flexible para talleres, conferencias, exposiciones pequeñas y reuniones culturales. Equipamiento audiovisual completo.',
    amenities: ['Aire acondicionado', 'Proyector y pantalla', 'Sistema de audio básico', 'Sillas y mesas móviles', 'WiFi de alta velocidad', 'Cocina auxiliar', 'Baños privados'],
    rules: ['Capacidad máxima estrictamente respetada', 'Devolver mobiliario a configuración original', 'No fijar elementos en paredes sin autorización'],
    images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'],
    hourlyRate: 150000,
    dailyRate: 900000,
    available: true,
    features: {
      hasAC: true,
      hasParking: true,
      hasKitchen: true,
      hasSoundSystem: true,
      hasProjector: true,
      hasStage: false,
      accessibility: true
    }
  },
  {
    id: 'v4',
    name: 'Sala de Exposiciones Lucy Tejada',
    type: 'sala_exposiciones',
    capacity: 80,
    area: 220,
    address: 'Carrera 4 #7-22',
    neighborhood: 'San Antonio',
    zone: 'Centro',
    description: 'Sala con iluminación especializada para exposiciones de arte, fotografía y muestras culturales. Sistema de rieles para montaje flexible.',
    amenities: ['Iluminación museográfica LED', 'Sistema de rieles y paneles', 'Climatización controlada', 'Vitrinas de seguridad', 'Vigilancia 24/7', 'Seguro incluido'],
    rules: ['Montaje supervisado por curador de sala', 'Prohibido uso de clavos directos en muros', 'Obras aseguradas obligatoriamente', 'Desmontaje puntual'],
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262', 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73'],
    hourlyRate: 0,
    dailyRate: 1200000,
    available: true,
    features: {
      hasAC: true,
      hasParking: false,
      hasKitchen: false,
      hasSoundSystem: false,
      hasProjector: false,
      hasStage: false,
      accessibility: true
    }
  },
  {
    id: 'v5',
    name: 'Plaza Cultural del Peñón',
    type: 'espacio_abierto',
    capacity: 500,
    area: 850,
    address: 'Calle 5 con Carrera 8',
    neighborhood: 'El Peñón',
    zone: 'Sur',
    description: 'Espacio al aire libre con tarima desmontable para eventos masivos, festivales, conciertos, ferias y actividades comunitarias.',
    amenities: ['Tarima de 8x12m', 'Tomas eléctricas trifásicas', 'Baños públicos cercanos', 'Iluminación perimetral', 'Acceso vehicular carga/descarga'],
    rules: ['Requiere permiso de Espacio Público', 'Contratación de seguridad privada obligatoria', 'Plan de contingencia y primeros auxilios', 'Limpieza post-evento incluida'],
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'],
    hourlyRate: 0,
    dailyRate: 2500000,
    available: true,
    features: {
      hasAC: false,
      hasParking: true,
      hasKitchen: false,
      hasSoundSystem: false,
      hasProjector: false,
      hasStage: true,
      accessibility: true
    }
  }
];

// Mock Rental Requests
export const rentalRequests: RentalRequest[] = [
  {
    id: 'r1',
    requestNumber: 'SGE-2026-001',
    venueId: 'v1',
    venueName: 'Auditorio Principal Centro Cultural',
    clientId: 'c1',
    clientName: 'Fundación Cultural Pereira Vive',
    clientDocument: '900.123.456-7',
    clientEmail: 'contacto@calivive.org',
    clientPhone: '3201234567',
    eventName: 'Festival Internacional de Poesía',
    eventType: 'Cultural',
    eventDescription: 'Lectura poética con invitados internacionales, panel de discusión y firma de libros.',
    startDate: '2026-05-15',
    endDate: '2026-05-15',
    startTime: '18:00',
    endTime: '22:00',
    attendees: 300,
    status: 'aprobada',
    submittedAt: '2026-04-10T09:30:00',
    reviewedAt: '2026-04-12T14:20:00',
    reviewedBy: 'María González',
    contractId: 'ct1'
  },
  {
    id: 'r2',
    requestNumber: 'SGE-2026-002',
    venueId: 'v3',
    venueName: 'Salón Sebastián de Belalcázar',
    clientId: 'c2',
    clientName: 'Universidad del Valle',
    clientDocument: '890.399.010-6',
    clientEmail: 'extension@univalle.edu.co',
    clientPhone: '3157891234',
    eventName: 'Taller de Escritura Creativa',
    eventType: 'Educativo',
    eventDescription: 'Taller intensivo de 3 días con escritores invitados, dirigido a estudiantes y público general.',
    startDate: '2026-04-25',
    endDate: '2026-04-27',
    startTime: '09:00',
    endTime: '17:00',
    attendees: 80,
    status: 'en_revision',
    submittedAt: '2026-04-18T11:45:00',
    notes: 'Requiere mobiliario en círculo para sesiones de retroalimentación'
  },
  {
    id: 'r3',
    requestNumber: 'SGE-2026-003',
    venueId: 'v2',
    venueName: 'Teatro Municipal Jorge Isaacs',
    clientId: 'c3',
    clientName: 'Compañía de Danza Contemporánea',
    clientDocument: '805.123.789-2',
    clientEmail: 'info@danzacali.com',
    clientPhone: '3009876543',
    eventName: 'Estreno "Memorias del Pacífico"',
    eventType: 'Artístico',
    eventDescription: 'Obra de danza contemporánea inspirada en tradiciones del Pacífico colombiano.',
    startDate: '2026-06-08',
    endDate: '2026-06-09',
    startTime: '19:30',
    endTime: '21:30',
    attendees: 180,
    status: 'pagada',
    submittedAt: '2026-03-20T16:00:00',
    reviewedAt: '2026-03-22T10:15:00',
    reviewedBy: 'Carlos Méndez',
    contractId: 'ct2',
    paymentId: 'p1'
  },
  {
    id: 'r4',
    requestNumber: 'SGE-2026-004',
    venueId: 'v4',
    venueName: 'Sala de Exposiciones Lucy Tejada',
    clientId: 'c4',
    clientName: 'Colectivo Artístico Pacífico Visual',
    clientDocument: '79.456.123',
    clientEmail: 'pacificovisual@gmail.com',
    clientPhone: '3184567890',
    eventName: 'Exposición "Raíces y Color"',
    eventType: 'Exposición',
    eventDescription: 'Muestra colectiva de artistas afrocolombianos que exploran identidad y territorio.',
    startDate: '2026-07-01',
    endDate: '2026-07-30',
    startTime: '08:00',
    endTime: '18:00',
    attendees: 50,
    status: 'enviada',
    submittedAt: '2026-04-19T14:30:00'
  },
  {
    id: 'r5',
    requestNumber: 'SGE-2026-005',
    venueId: 'v5',
    venueName: 'Plaza Cultural del Peñón',
    clientId: 'c5',
    clientName: 'Junta de Acción Comunal El Peñón',
    clientDocument: '900.567.234-1',
    clientEmail: 'jacpenon@gmail.com',
    clientPhone: '3123456789',
    eventName: 'Festival Comunitario de Hip Hop',
    eventType: 'Comunitario',
    eventDescription: 'Festival de hip hop con batalla de freestyle, graffiti en vivo y talleres para jóvenes.',
    startDate: '2026-05-10',
    endDate: '2026-05-10',
    startTime: '14:00',
    endTime: '22:00',
    attendees: 400,
    status: 'rechazada',
    submittedAt: '2026-04-15T10:00:00',
    reviewedAt: '2026-04-17T09:30:00',
    reviewedBy: 'Ana Rodríguez',
    rejectionReason: 'No se presentó plan de contingencia ni seguridad privada requerida para eventos masivos'
  }
];

// Mock Contracts
export const contracts: Contract[] = [
  {
    id: 'ct1',
    contractNumber: 'CON-2026-001',
    requestId: 'r1',
    venueId: 'v1',
    venueName: 'Auditorio Principal Centro Cultural',
    clientName: 'Fundación Cultural Pereira Vive',
    clientDocument: '900.123.456-7',
    startDate: '2026-05-15',
    endDate: '2026-05-15',
    totalAmount: 1120000,
    status: 'aprobado',
    createdAt: '2026-04-12T15:00:00',
    legalReviewStatus: 'aprobado',
    legalReviewedBy: 'Dr. Jorge Ramírez',
    legalReviewedAt: '2026-04-13T11:20:00',
    clauses: [
      'El arrendatario se compromete a respetar los horarios establecidos',
      'Cualquier daño será responsabilidad del arrendatario',
      'Se requiere póliza de responsabilidad civil vigente',
      'El pago debe realizarse 5 días antes del evento'
    ],
    documents: ['contrato_firmado.pdf', 'poliza_rc.pdf']
  },
  {
    id: 'ct2',
    contractNumber: 'CON-2026-002',
    requestId: 'r3',
    venueId: 'v2',
    venueName: 'Teatro Municipal Jorge Isaacs',
    clientName: 'Compañía de Danza Contemporánea',
    clientDocument: '805.123.789-2',
    startDate: '2026-06-08',
    endDate: '2026-06-09',
    totalAmount: 4400000,
    status: 'firmado',
    createdAt: '2026-03-22T11:00:00',
    signedAt: '2026-03-25T16:30:00',
    legalReviewStatus: 'aprobado',
    legalReviewedBy: 'Dra. Patricia Silva',
    legalReviewedAt: '2026-03-23T14:00:00',
    clauses: [
      'Incluye 2 días de alquiler más 1 día de montaje',
      'El teatro proporciona personal técnico de sonido e iluminación',
      'Ensayos generales permitidos el día anterior',
      'Se incluye seguro de obras y equipos'
    ],
    documents: ['contrato_firmado.pdf', 'rider_tecnico.pdf', 'seguro_evento.pdf']
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: 'p1',
    paymentNumber: 'PAG-2026-001',
    contractId: 'ct2',
    contractNumber: 'CON-2026-002',
    clientName: 'Compañía de Danza Contemporánea',
    amount: 4400000,
    paymentMethod: 'transferencia',
    paymentDate: '2026-03-30',
    receiptNumber: 'REC-2026-001',
    invoiceNumber: 'FAC-2026-001',
    status: 'completado',
    registeredBy: 'Sandra Pérez',
    registeredAt: '2026-03-30T10:15:00',
    notes: 'Pago completo realizado según lo acordado'
  }
];

// Mock Events
export const events: Event[] = [
  {
    id: 'e1',
    requestId: 'r3',
    contractId: 'ct2',
    venueName: 'Teatro Municipal Jorge Isaacs',
    eventName: 'Estreno "Memorias del Pacífico"',
    eventDate: '2026-06-08',
    startTime: '19:30',
    endTime: '21:30',
    status: 'programado',
    handoverCompleted: false,
    returnCompleted: false
  }
];

// Mock Maintenance Tickets
export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'm1',
    ticketNumber: 'MNT-2026-001',
    venueId: 'v1',
    venueName: 'Auditorio Principal Centro Cultural',
    type: 'preventivo',
    priority: 'media',
    title: 'Mantenimiento trimestral sistema de aire acondicionado',
    description: 'Revisión, limpieza de filtros y recarga de refrigerante según cronograma preventivo.',
    reportedBy: 'Juan Martínez',
    reportedAt: '2026-04-15T08:00:00',
    status: 'abierto',
    assignedTo: 'Técnicos AC Profesional',
    assignedAt: '2026-04-15T09:30:00'
  },
  {
    id: 'm2',
    ticketNumber: 'MNT-2026-002',
    venueId: 'v2',
    venueName: 'Teatro Municipal Jorge Isaacs',
    type: 'correctivo',
    priority: 'alta',
    title: 'Falla en sistema de iluminación escénica',
    description: 'Dos reflectores LED del puente superior no encienden. Requiere revisión urgente antes del evento del 8 de junio.',
    reportedBy: 'Carlos Rivas',
    reportedAt: '2026-04-18T14:20:00',
    status: 'en_progreso',
    assignedTo: 'Electrónica Escénica SAS',
    assignedAt: '2026-04-18T15:00:00',
    cost: 850000
  },
  {
    id: 'm3',
    ticketNumber: 'MNT-2026-003',
    venueId: 'v3',
    venueName: 'Salón Sebastián de Belalcázar',
    type: 'correctivo',
    priority: 'baja',
    title: 'Reparación de sillas con daños menores',
    description: 'Cinco sillas presentan tornillos flojos y tapicería con pequeñas rasgaduras.',
    reportedBy: 'Diana López',
    reportedAt: '2026-04-10T11:00:00',
    status: 'cerrado',
    assignedTo: 'Mantenimiento interno',
    assignedAt: '2026-04-10T12:00:00',
    resolvedAt: '2026-04-12T16:00:00',
    resolutionNotes: 'Sillas reparadas y tapizado restaurado. Trabajo completado.',
    cost: 120000
  }
];
