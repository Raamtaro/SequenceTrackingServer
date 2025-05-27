/**
 * Contains the seed data for seed.ts.
 */

type SequenceDefinition = {
    name: string;
    description?: string;
    poses: string[];
}

const sharedStanding = [
    "Surya Namaskar A",
    "Surya Namaskar B",
    "Padangusthasana",
    "Padahastasana",
    "Utthita Trikonasana",
    "Parivrtta Trikonasana",
    "Utthita Parsvakonasana",
    "Parivrtta Parsvakonasana",
    "Prasarita Padottanasana A",
    "Prasarita Padottanasana B",
    "Prasarita Padottanasana C",
    "Prasarita Padottanasana D",
    "Parsvottanasana",
]

const sharedFinishing = [
    //Finishing Poses, common to all series
    "Urdhva Dhanurasana",
    "Paschimottanasana",
    "Salamba Sarvangasana",
    "Halasana",
    "Karnapidasana",
    "Urdva Padmasana",
    "Pindasana",
    "Matsyasana",
    "Uttana Padasana",
    "Sirsasana",
    "Baddha Padmasana",
    "Yoga Mudra Asana",
    "Padmasana",
    "Utpluthih",
    "Savasana"
]

const primaryPoses = [
    //Primary Specific Poses begin here
    "Utthita Hasta Padangusthasana",
    "Ardha Baddha Padmottanasana",
    "Uttkatasana",
    "Virabhadrasana I",
    "Virabhadrasana II",
    "Dandasana",
    "Paschimottanasana A",
    "Paschimottanasana B",
    "Paschimottanasana C",
    "Purvottanasana",
    "Ardha Baddha Padma Paschimottanasana",
    "Triang Mukha Eka Pada Paschimottanasana",
    "Janu Sirsasana A",
    "Janu Sirsasana B",
    "Janu Sirsasana C",
    "Marichyasana A",
    "Marichyasana B",
    "Marichyasana C",
    "Marichyasana D",
    "Navasana",
    "Bujapidasana",
    "Kurmasana",
    "Supta Kurmasana",
    "Garbha Pindasana",
    "Kukkutasana",
    "Baddha Konasana A",
    "Baddha Konasana B",
    "Baddha Konasana C",
    "Upavistha Konasana A",
    "Upavistha Konasana B",
    "Supta Konasana",
    "Supta Padangusthasana",
    "Ubhaya Padangusthasana",
    "Urdva Mukha Paschimottanasana",
    "Setu Bandhasana",    
]

const intermediatePoses = [
    //Intermediate Specific Poses begin here
    "Pasasana",
    "Krounchasana",
    "Shalabhasana A",
    "Shalabhasana B",
    "Bhekasana",
    "Dhanurasana",
    "Parsva Dhanurasana",
    "Ustrasana",
    "Laghu Vajrasana",
    "Kapotasana A",
    "Kapotasana B",
    "Supta Vajrasana",
    "Bakasana A",
    "Bakasana B",
    "Bharadvajasana",
    "Ardha Matsyendrasana",
    "Eka Pada Sirsasana",
    "Dwi Pada Sirsasana",
    "Tittibhasana A",    
    "Tittibhasana B",
    "Tittibhasana C",   
    "Pincha Mayurasana",
    "Karandavasana",
    "Mayurasana",
    "Nakrasana",
    "Vatayanasana",
    "Parighasana",
    "Gomukhasana A",
    "Gomukhasana B",
    "Supta Urdhva Pada Vajrasana",
    "Muka Hasta Sirsasana A",
    "Muka Hasta Sirsasana B",
    "Muka Hasta Sirsasana C",
    "Baddha Hasta Sirsasana A",
    "Baddha Hasta Sirsasana B",
    "Baddha Hasta Sirsasana C",
    "Baddha Hasta Sirsasana D",
]

export const primarySeries: SequenceDefinition = {
    name: "Ashtanga Primary Series",
    description: "The first series of Ashtanga Yoga, also known as Yoga Chikitsa (Yoga Therapy).",
    poses: [
        ...sharedStanding,
        ...primaryPoses,
        ...sharedFinishing
    ]
}


export const intermediateSeries: SequenceDefinition = {
    name: "Ashtanga Intermediate Series",
    description: "The second series of Ashtanga Yoga, also known as Nadi Shodhana (Nerve Purification).",
    poses: [
        ...sharedStanding,
        ...intermediatePoses,
        ...sharedFinishing
    ]
}