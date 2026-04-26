// Mock data with Colombian context for Plataforma Lucy Tejada

export const programsData = [
  {
    id: '1',
    name: 'Ballet Clásico',
    category: 'Danza',
    description: 'Aprende los fundamentos del ballet clásico con técnica profesional.',
    duration: '6 meses',
    schedule: 'Martes y Jueves 4:00 PM - 6:00 PM',
    educator: 'Diana Vargas',
    level: 'Principiante',
    capacity: 15,
    enrolled: 12,
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
    startDate: '2026-05-01',
    endDate: '2026-10-31'
  },
  {
    id: '2',
    name: 'Danza Folklórica Colombiana',
    category: 'Danza',
    description: 'Explora la riqueza de nuestras danzas tradicionales: cumbia, bambuco, joropo y más.',
    duration: '4 meses',
    schedule: 'Lunes y Miércoles 5:00 PM - 7:00 PM',
    educator: 'Julián Pérez',
    level: 'Todos los niveles',
    capacity: 20,
    enrolled: 18,
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop',
    startDate: '2026-05-15',
    endDate: '2026-09-15'
  },
  {
    id: '3',
    name: 'Guitarra Acústica',
    category: 'Música',
    description: 'Domina la guitarra desde cero: acordes, ritmos y tu primera canción.',
    duration: '8 meses',
    schedule: 'Sábados 10:00 AM - 12:00 PM',
    educator: 'Roberto Gómez',
    level: 'Principiante',
    capacity: 10,
    enrolled: 8,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
    startDate: '2026-04-20',
    endDate: '2026-12-20'
  },
  {
    id: '4',
    name: 'Coro Infantil',
    category: 'Música',
    description: 'Desarrolla tu voz y canta en conjunto. Para niños de 8 a 14 años.',
    duration: '10 meses',
    schedule: 'Viernes 3:00 PM - 5:00 PM',
    educator: 'María Fernanda Silva',
    level: 'Niños',
    capacity: 25,
    enrolled: 22,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    startDate: '2026-03-01',
    endDate: '2026-12-15'
  },
  {
    id: '5',
    name: 'Teatro de Improvisación',
    category: 'Teatro',
    description: 'Desarrolla creatividad, confianza y espontaneidad en el escenario.',
    duration: '5 meses',
    schedule: 'Miércoles 6:00 PM - 8:00 PM',
    educator: 'Andrés Castaño',
    level: 'Intermedio',
    capacity: 12,
    enrolled: 10,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    startDate: '2026-05-10',
    endDate: '2026-10-10'
  },
  {
    id: '6',
    name: 'Actuación para Principiantes',
    category: 'Teatro',
    description: 'Introducción al arte dramático: expresión corporal, voz y personaje.',
    duration: '6 meses',
    schedule: 'Lunes y Viernes 5:00 PM - 7:00 PM',
    educator: 'Carolina Ruiz',
    level: 'Principiante',
    capacity: 15,
    enrolled: 14,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    startDate: '2026-04-25',
    endDate: '2026-10-25'
  },
  {
    id: '7',
    name: 'Pintura al Óleo',
    category: 'Artes Visuales',
    description: 'Técnicas clásicas y contemporáneas de pintura al óleo.',
    duration: '7 meses',
    schedule: 'Martes 2:00 PM - 5:00 PM',
    educator: 'Luis Fernando Torres',
    level: 'Intermedio',
    capacity: 12,
    enrolled: 9,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    startDate: '2026-04-15',
    endDate: '2026-11-15'
  },
  {
    id: '8',
    name: 'Dibujo Artístico',
    category: 'Artes Visuales',
    description: 'Fundamentos del dibujo: proporción, perspectiva, luz y sombra.',
    duration: '5 meses',
    schedule: 'Jueves 4:00 PM - 6:00 PM',
    educator: 'Patricia Moreno',
    level: 'Principiante',
    capacity: 18,
    enrolled: 15,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    startDate: '2026-05-05',
    endDate: '2026-10-05'
  }
];

export const studentsData = [
  {
    id: '1',
    nombre: 'Camila',
    apellido: 'Rodríguez',
    documento: '1001234567',
    email: 'camila.rodriguez@email.com',
    telefono: '320 456 7890',
    direccion: 'Carrera 5 #23-45, Pereira',
    fechaNacimiento: '2008-03-15',
    acudiente: 'María Rodríguez',
    telefonoAcudiente: '315 234 5678',
    programas: ['1', '7'],
    estado: 'Activo'
  },
  {
    id: '2',
    nombre: 'Sebastián',
    apellido: 'Muñoz',
    documento: '1001234568',
    email: 'sebastian.munoz@email.com',
    telefono: '321 567 8901',
    direccion: 'Calle 10 #15-30, Pereira',
    fechaNacimiento: '2010-07-22',
    acudiente: 'Jorge Muñoz',
    telefonoAcudiente: '316 345 6789',
    programas: ['3', '4'],
    estado: 'Activo'
  },
  {
    id: '3',
    nombre: 'Valentina',
    apellido: 'García',
    documento: '1001234569',
    email: 'valentina.garcia@email.com',
    telefono: '322 678 9012',
    direccion: 'Avenida 3 #8-20, Pereira',
    fechaNacimiento: '2009-11-05',
    acudiente: 'Laura García',
    telefonoAcudiente: '317 456 7890',
    programas: ['2', '5'],
    estado: 'Activo'
  }
];

export const educatorsData = [
  {
    id: '1',
    nombre: 'Diana',
    apellido: 'Vargas',
    especialidad: 'Danza Clásica',
    email: 'diana.vargas@lucytejada.edu.co',
    telefono: '318 234 5678',
    programas: ['1'],
    grupos: 3,
    estudiantes: 35
  },
  {
    id: '2',
    nombre: 'Roberto',
    apellido: 'Gómez',
    especialidad: 'Música',
    email: 'roberto.gomez@lucytejada.edu.co',
    telefono: '319 345 6789',
    programas: ['3'],
    grupos: 2,
    estudiantes: 18
  },
  {
    id: '3',
    nombre: 'Andrés',
    apellido: 'Castaño',
    especialidad: 'Teatro',
    email: 'andres.castano@lucytejada.edu.co',
    telefono: '320 456 7890',
    programas: ['5', '6'],
    grupos: 4,
    estudiantes: 42
  }
];

export const attendanceData = [
  {
    studentId: '1',
    studentName: 'Camila Rodríguez',
    sessions: [
      { date: '2026-04-01', status: 'Presente' },
      { date: '2026-04-03', status: 'Presente' },
      { date: '2026-04-08', status: 'Ausente' },
      { date: '2026-04-10', status: 'Presente' }
    ]
  }
];

export const evaluationsData = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Camila Rodríguez',
    programId: '1',
    programName: 'Ballet Clásico',
    date: '2026-04-10',
    fortalezas: 'Excelente postura y disciplina. Muestra compromiso constante.',
    oportunidades: 'Trabajar flexibilidad en piernas y mejorar equilibrio en piruetas.',
    observaciones: 'Progreso notable en las últimas semanas.',
    recomendaciones: 'Practicar estiramientos diarios 15 minutos.'
  }
];

export const notificationsData = [
  {
    id: '1',
    type: 'success',
    title: 'Inscripción confirmada',
    message: 'Te has inscrito exitosamente en Ballet Clásico',
    date: '2026-04-15 10:30',
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Próxima sesión',
    message: 'Recuerda tu clase de Ballet Clásico mañana a las 4:00 PM',
    date: '2026-04-14 18:00',
    read: true
  },
  {
    id: '3',
    type: 'warning',
    title: 'Nueva evaluación disponible',
    message: 'Tu educador ha publicado una evaluación. Revísala en tu perfil.',
    date: '2026-04-13 15:45',
    read: true
  }
];

export const scheduleData = [
  {
    day: 'Lunes',
    sessions: [
      { time: '5:00 PM - 7:00 PM', program: 'Danza Folklórica Colombiana', group: 'Grupo A', location: 'Sala 1' },
      { time: '5:00 PM - 7:00 PM', program: 'Actuación para Principiantes', group: 'Grupo B', location: 'Sala 3' }
    ]
  },
  {
    day: 'Martes',
    sessions: [
      { time: '2:00 PM - 5:00 PM', program: 'Pintura al Óleo', group: 'Grupo A', location: 'Taller 2' },
      { time: '4:00 PM - 6:00 PM', program: 'Ballet Clásico', group: 'Grupo A', location: 'Sala Principal' }
    ]
  },
  {
    day: 'Miércoles',
    sessions: [
      { time: '5:00 PM - 7:00 PM', program: 'Danza Folklórica Colombiana', group: 'Grupo A', location: 'Sala 1' },
      { time: '6:00 PM - 8:00 PM', program: 'Teatro de Improvisación', group: 'Grupo A', location: 'Sala 3' }
    ]
  },
  {
    day: 'Jueves',
    sessions: [
      { time: '4:00 PM - 6:00 PM', program: 'Ballet Clásico', group: 'Grupo A', location: 'Sala Principal' },
      { time: '4:00 PM - 6:00 PM', program: 'Dibujo Artístico', group: 'Grupo A', location: 'Taller 1' }
    ]
  },
  {
    day: 'Viernes',
    sessions: [
      { time: '3:00 PM - 5:00 PM', program: 'Coro Infantil', group: 'Grupo A', location: 'Sala de Música' },
      { time: '5:00 PM - 7:00 PM', program: 'Actuación para Principiantes', group: 'Grupo B', location: 'Sala 3' }
    ]
  },
  {
    day: 'Sábado',
    sessions: [
      { time: '10:00 AM - 12:00 PM', program: 'Guitarra Acústica', group: 'Grupo A', location: 'Sala de Música' }
    ]
  }
];

export const kpiData = {
  totalStudents: 287,
  activePrograms: 24,
  totalEducators: 18,
  attendanceRate: 92.5,
  enrollmentGrowth: 15.3,
  completionRate: 87.2
};

export const chartData = {
  enrollmentByCategory: [
    { name: 'Danza', value: 98, color: '#3b82f6' },
    { name: 'Música', value: 76, color: '#8b5cf6' },
    { name: 'Teatro', value: 65, color: '#ec4899' },
    { name: 'Artes Visuales', value: 48, color: '#f59e0b' }
  ],
  monthlyEnrollment: [
    { month: 'Ene', students: 245 },
    { month: 'Feb', students: 258 },
    { month: 'Mar', students: 271 },
    { month: 'Abr', students: 287 }
  ],
  attendanceTrend: [
    { week: 'Sem 1', rate: 89 },
    { week: 'Sem 2', rate: 91 },
    { week: 'Sem 3', rate: 93 },
    { week: 'Sem 4', rate: 92.5 }
  ]
};
