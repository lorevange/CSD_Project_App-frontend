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
    price: 120,
    reviews: [
      { id: 1, user: "Luigi B.", date: "2023-10-15", rating: 5, comment: "Dottore molto competente e gentile. Consigliatissimo!" },
      { id: 2, user: "Maria R.", date: "2023-09-20", rating: 4, comment: "Visita accurata, ma un po' di attesa." },
      { id: 3, user: "Giovanni V.", date: "2023-08-05", rating: 5, comment: "Mi ha salvato la vita. Grazie dottore." }
    ]
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
    price: 100,
    reviews: [
      { id: 1, user: "Anna M.", date: "2023-11-01", rating: 5, comment: "Molto professionale e attenta." },
      { id: 2, user: "Paolo C.", date: "2023-10-25", rating: 5, comment: "Studio pulito e accogliente." }
    ]
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
    price: 80,
    reviews: [
      { id: 1, user: "Sofia L.", date: "2023-10-10", rating: 5, comment: "Mano leggerissima, non ho sentito nulla!" },
      { id: 2, user: "Marco P.", date: "2023-09-15", rating: 4, comment: "Prezzi onesti e buon servizio." }
    ]
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
    price: 130,
    reviews: [
      { id: 1, user: "Chiara F.", date: "2023-11-05", rating: 5, comment: "Fantastica, mi ha messo subito a mio agio." }
    ]
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
    price: 150,
    reviews: [
      { id: 1, user: "Roberto D.", date: "2023-10-20", rating: 4, comment: "Bravo medico, ma difficile trovare parcheggio." },
      { id: 2, user: "Elena S.", date: "2023-09-30", rating: 5, comment: "Risolto il mio problema al ginocchio." }
    ]
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
  { name: "Psicologo", icon: "brain" },
  { name: "Nutrizionista", icon: "apple" },
  { name: "Urologo", icon: "user-md" },
  { name: "Otorinolaringoiatra", icon: "stethoscope" }
];
