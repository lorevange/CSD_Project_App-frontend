export const doctors = [
  {
    id: 1,
    name: "Dr. Mario Rossi",
    specialization: {
      it: "Cardiologo",
      en: "Cardiologist"
    },
    city: "Roma",
    address: "Via Roma 123",
    latitude: 41.890251,
    longitude: 12.492373,
    rating: 4.8,
    reviewsCount: 120,
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg",
    services: {
      it: ["Visita cardiologica", "Elettrocardiogramma", "Ecocardiogramma"],
      en: ["Cardiology Visit", "Electrocardiogram", "Echocardiogram"]
    },
    bio: {
      it: "Specialista in cardiologia con oltre 20 anni di esperienza.",
      en: "Cardiology specialist with over 20 years of experience."
    },
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
    specialization: {
      it: "Dermatologo",
      en: "Dermatologist"
    },
    city: "Milano",
    address: "Corso Milano 45",
    latitude: 45.464203,
    longitude: 9.189982,
    rating: 4.9,
    reviewsCount: 85,
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
    services: {
      it: ["Visita dermatologica", "Mappatura nei", "Trattamento acne"],
      en: ["Dermatological Visit", "Mole Mapping", "Acne Treatment"]
    },
    bio: {
      it: "Esperta in dermatologia clinica ed estetica.",
      en: "Expert in clinical and aesthetic dermatology."
    },
    price: 100,
    reviews: [
      { id: 1, user: "Anna M.", date: "2023-11-01", rating: 5, comment: "Molto professionale e attenta." },
      { id: 2, user: "Paolo C.", date: "2023-10-25", rating: 5, comment: "Studio pulito e accogliente." }
    ]
  },
  {
    id: 3,
    name: "Dr. Luca Verdi",
    specialization: {
      it: "Dentista",
      en: "Dentist"
    },
    city: "Napoli",
    address: "Piazza Plebiscito 1",
    latitude: 40.835933,
    longitude: 14.248782,
    rating: 4.7,
    reviewsCount: 200,
    image: "https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg",
    services: {
      it: ["Igiene dentale", "Sbiancamento", "Impianti"],
      en: ["Dental Hygiene", "Whitening", "Implants"]
    },
    bio: {
      it: "Studio dentistico all'avanguardia nel cuore di Napoli.",
      en: "State-of-the-art dental practice in the heart of Naples."
    },
    price: 80,
    reviews: [
      { id: 1, user: "Sofia L.", date: "2023-10-10", rating: 5, comment: "Mano leggerissima, non ho sentito nulla!" },
      { id: 2, user: "Marco P.", date: "2023-09-15", rating: 4, comment: "Prezzi onesti e buon servizio." }
    ]
  },
  {
    id: 4,
    name: "Dr.ssa Anna Neri",
    specialization: {
      it: "Ginecologo",
      en: "Gynecologist"
    },
    city: "Torino",
    address: "Via Po 10",
    latitude: 45.068370,
    longitude: 7.683070,
    rating: 5.0,
    reviewsCount: 50,
    image: "https://img.freepik.com/free-photo/female-doctor-lab-coat-white-isolated-confident-smile_343596-6556.jpg",
    services: {
      it: ["Visita ginecologica", "Ecografia", "Pap test"],
      en: ["Gynecological Visit", "Ultrasound", "Pap Smear"]
    },
    bio: {
      it: "Attenta alle esigenze delle donne in ogni fase della vita.",
      en: "Attentive to women's needs at every stage of life."
    },
    price: 130,
    reviews: [
      { id: 1, user: "Chiara F.", date: "2023-11-05", rating: 5, comment: "Fantastica, mi ha messo subito a mio agio." }
    ]
  },
  {
    id: 5,
    name: "Dr. Marco Gialli",
    specialization: {
      it: "Ortopedico",
      en: "Orthopedist"
    },
    city: "Roma",
    address: "Via Appia Nuova 500",
    latitude: 41.868770,
    longitude: 12.528340,
    rating: 4.5,
    reviewsCount: 90,
    image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
    services: {
      it: ["Visita ortopedica", "Infiltrazioni", "Traumatologia"],
      en: ["Orthopedic Visit", "Injections", "Traumatology"]
    },
    bio: {
      it: "Specializzato in chirurgia del ginocchio e della spalla.",
      en: "Specialized in knee and shoulder surgery."
    },
    price: 150,
    reviews: [
      { id: 1, user: "Roberto D.", date: "2023-10-20", rating: 4, comment: "Bravo medico, ma difficile trovare parcheggio." },
      { id: 2, user: "Elena S.", date: "2023-09-30", rating: 5, comment: "Risolto il mio problema al ginocchio." }
    ]
  }
];

export const cities = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Bologna"];

export const specializations = [
  { name: { it: "Cardiologo", en: "Cardiologist" }, icon: "heartbeat" },
  { name: { it: "Dermatologo", en: "Dermatologist" }, icon: "user-md" },
  { name: { it: "Dentista", en: "Dentist" }, icon: "tooth" },
  { name: { it: "Ginecologo", en: "Gynecologist" }, icon: "user-md" },
  { name: { it: "Ortopedico", en: "Orthopedist" }, icon: "bone" },
  { name: { it: "Oculista", en: "Ophthalmologist" }, icon: "eye" },
  { name: { it: "Pediatra", en: "Pediatrician" }, icon: "baby" },
  { name: { it: "Psicologo", en: "Psychologist" }, icon: "brain" },
  { name: { it: "Nutrizionista", en: "Nutritionist" }, icon: "apple" },
  { name: { it: "Urologo", en: "Urologist" }, icon: "user-md" },
  { name: { it: "Otorinolaringoiatra", en: "Otolaryngologist" }, icon: "stethoscope" }
];
