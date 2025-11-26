export const doctors = [
  {
    id: 1,
    name: "Dr. Mario Rossi",
    specialization: "Cardiologo",
    city: "Roma",
    address: "Via Roma 123",
    rating: 4.8,
    reviewsCount: 120,
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg",
    services: ["Visita cardiologica", "Elettrocardiogramma", "Ecocardiogramma"],
    bio: "Specialista in cardiologia con oltre 20 anni di esperienza.",
    price: 120
  },
  {
    id: 2,
    name: "Dr.ssa Giulia Bianchi",
    specialization: "Dermatologo",
    city: "Milano",
    address: "Corso Milano 45",
    rating: 4.9,
    reviewsCount: 85,
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
    services: ["Visita dermatologica", "Mappatura nei", "Trattamento acne"],
    bio: "Esperta in dermatologia clinica ed estetica.",
    price: 100
  },
  {
    id: 3,
    name: "Dr. Luca Verdi",
    specialization: "Dentista",
    city: "Napoli",
    address: "Piazza Plebiscito 1",
    rating: 4.7,
    reviewsCount: 200,
    image: "https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg",
    services: ["Igiene dentale", "Sbiancamento", "Impianti"],
    bio: "Studio dentistico all'avanguardia nel cuore di Napoli.",
    price: 80
  },
  {
    id: 4,
    name: "Dr.ssa Anna Neri",
    specialization: "Ginecologo",
    city: "Torino",
    address: "Via Po 10",
    rating: 5.0,
    reviewsCount: 50,
    image: "https://img.freepik.com/free-photo/female-doctor-lab-coat-white-isolated-confident-smile_343596-6556.jpg",
    services: ["Visita ginecologica", "Ecografia", "Pap test"],
    bio: "Attenta alle esigenze delle donne in ogni fase della vita.",
    price: 130
  },
  {
    id: 5,
    name: "Dr. Marco Gialli",
    specialization: "Ortopedico",
    city: "Roma",
    address: "Via Appia Nuova 500",
    rating: 4.5,
    reviewsCount: 90,
    image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
    services: ["Visita ortopedica", "Infiltrazioni", "Traumatologia"],
    bio: "Specializzato in chirurgia del ginocchio e della spalla.",
    price: 150
  }
];

export const cities = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Bologna"];

export const specializations = [
  { name: "Cardiologo", icon: "heartbeat" },
  { name: "Dermatologo", icon: "user-md" },
  { name: "Dentista", icon: "tooth" },
  { name: "Ginecologo", icon: "user-md" },
  { name: "Ortopedico", icon: "bone" },
  { name: "Oculista", icon: "eye" },
  { name: "Pediatra", icon: "baby" },
  { name: "Psicologo", icon: "brain" }
];
