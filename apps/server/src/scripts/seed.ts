import { db } from "../db";
import { hashPassword } from "../common";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await db.file.deleteMany({});
  await db.post.deleteMany({});
  await db.bKP.deleteMany({});
  await db.course.deleteMany({});
  await db.major.deleteMany({});
  await db.refreshToken.deleteMany({});
  await db.user.deleteMany({});

  // Create users
  console.log("👤 Creating users...");
  await db.user.create({
    data: {
      username: "superadmin",
      passwordHash: hashPassword("password123"),
      name: "Super Admin",
      role: "SUPERADMIN",
    },
  });

  await db.user.create({
    data: {
      username: "admin",
      passwordHash: hashPassword("password123"),
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const user1 = await db.user.create({
    data: {
      username: "student1",
      passwordHash: hashPassword("password123"),
      name: "John Doe",
      role: "USER",
    },
  });

  const user2 = await db.user.create({
    data: {
      username: "student2",
      passwordHash: hashPassword("password123"),
      name: "Jane Smith",
      role: "USER",
    },
  });

  const user3 = await db.user.create({
    data: {
      username: "student3",
      passwordHash: hashPassword("password123"),
      name: "Alice Johnson",
      role: "USER",
    },
  });

  console.log(`✅ Created ${5} users`);

  // Create majors
  console.log("🎓 Creating majors...");
  const ifMajor = await db.major.create({
    data: {
      name: "Teknik Informatika",
    },
  });

  const rkaMajor = await db.major.create({
    data: {
      name: "Rekayasa Kecerdasan Artifisial",
    },
  });

  const rplMajor = await db.major.create({
    data: {
      name: "Rekayasa Perangkat Lunak",
    },
  });

  console.log(`✅ Created ${3} majors`);

  // Create courses for Teknik Informatika
  console.log("📚 Creating courses...");
  const courses = await Promise.all([
    // Teknik Informatika courses
    db.course.create({
      data: {
        code: "IF184701",
        name: "Pemrograman Dasar",
        type: "REQUIRED",
        sks: 4,
        majorId: ifMajor.id,
        cloList: [
          "Mahasiswa mampu memahami konsep dasar pemrograman",
          "Mahasiswa mampu membuat program sederhana",
          "Mahasiswa mampu menyelesaikan masalah dengan algoritma",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "IF184702",
        name: "Struktur Data",
        type: "REQUIRED",
        sks: 3,
        majorId: ifMajor.id,
        cloList: [
          "Mahasiswa mampu memahami berbagai struktur data",
          "Mahasiswa mampu mengimplementasikan struktur data",
          "Mahasiswa mampu memilih struktur data yang tepat",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "IF184801",
        name: "Basis Data",
        type: "REQUIRED",
        sks: 3,
        majorId: ifMajor.id,
        cloList: [
          "Mahasiswa mampu merancang basis data",
          "Mahasiswa mampu menggunakan SQL",
          "Mahasiswa mampu normalisasi basis data",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "IF184901",
        name: "Machine Learning",
        type: "ELECTIVE",
        sks: 3,
        majorId: ifMajor.id,
        cloList: [
          "Mahasiswa mampu memahami konsep machine learning",
          "Mahasiswa mampu mengimplementasikan algoritma ML",
          "Mahasiswa mampu mengevaluasi model ML",
        ],
      },
    }),

    // Sistem Informasi courses
    db.course.create({
      data: {
        code: "RKA184701",
        name: "Sistem Informasi Manajemen",
        type: "REQUIRED",
        sks: 3,
        majorId: rkaMajor.id,
        cloList: [
          "Mahasiswa mampu memahami konsep SIM",
          "Mahasiswa mampu menganalisis kebutuhan bisnis",
          "Mahasiswa mampu merancang sistem informasi",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "RKA184702",
        name: "Analisis dan Perancangan Sistem",
        type: "REQUIRED",
        sks: 4,
        majorId: rkaMajor.id,
        cloList: [
          "Mahasiswa mampu melakukan analisis sistem",
          "Mahasiswa mampu membuat requirement specification",
          "Mahasiswa mampu merancang sistem",
        ],
      },
    }),

    // Sains Data courses
    db.course.create({
      data: {
        code: "RPL184701",
        name: "Statistika untuk Sains Data",
        type: "REQUIRED",
        sks: 3,
        majorId: rplMajor.id,
        cloList: [
          "Mahasiswa mampu memahami konsep statistika",
          "Mahasiswa mampu melakukan analisis statistik",
          "Mahasiswa mampu menginterpretasi hasil analisis",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "RPL184702",
        name: "Data Mining",
        type: "REQUIRED",
        sks: 3,
        majorId: rplMajor.id,
        cloList: [
          "Mahasiswa mampu memahami teknik data mining",
          "Mahasiswa mampu melakukan preprocessing data",
          "Mahasiswa mampu mengekstrak knowledge dari data",
        ],
      },
    }),
    db.course.create({
      data: {
        code: "RPL184801",
        name: "Big Data Analytics",
        type: "ELECTIVE",
        sks: 3,
        majorId: rplMajor.id,
        cloList: [
          "Mahasiswa mampu memahami konsep big data",
          "Mahasiswa mampu menggunakan tools big data",
          "Mahasiswa mampu melakukan analisis big data",
        ],
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // Create a sample BKP entry
  console.log("📋 Creating BKP entries...");
  await db.bKP.create({
    data: {
      userId: user1.id,
      status: "PROPOSAL",
      Proposal: {
        companyName: "Tech Innovations Inc.",
        position: "Software Engineering Intern",
        jobDescription: "Developing web applications using modern frameworks",
        jobLink: "https://example.com/careers/intern",
        bkpType: "MAGANG_BERDAMPAK",
        period: "2024/2025-01",
        monthDuration: 6,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-07-31"),
        studentNotes:
          "I am very interested in this internship opportunity to develop my skills in web development.",
      },
      ProposalApproval: {},
      BKPRegistration: {
        additionalDocuments: [],
      },
      RegistrationApproval: {},
      WeeklyReports: {
        WeeklyReportList: [],
      },
      FieldAssessment: {},
      Grading: {
        components: [],
      },
    },
  });

  await db.bKP.create({
    data: {
      userId: user2.id,
      status: "WAITING_PROPOSAL_APPROVAL",
      Proposal: {
        companyName: "Data Analytics Corp",
        position: "Data Analyst Intern",
        jobDescription: "Working with big data and analytics tools",
        jobLink: "https://example.com/careers/data-analyst",
        bkpType: "MAGANG_MANDIRI",
        period: "2024/2025-01",
        monthDuration: 5,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-07-31"),
        studentNotes:
          "I want to gain experience in data analytics and visualization.",
        submittedAt: new Date(),
      },
      ProposalApproval: {},
      BKPRegistration: {
        additionalDocuments: [],
      },
      RegistrationApproval: {},
      WeeklyReports: {
        WeeklyReportList: [],
      },
      FieldAssessment: {},
      Grading: {
        components: [],
      },
    },
  });

  console.log(`✅ Created ${2} BKP entries`);

  console.log("\n✨ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  - Users: 5 (1 superadmin, 1 admin, 3 students)");
  console.log("  - Majors: 3");
  console.log("  - Courses: 9");
  console.log("  - BKP entries: 2");
  console.log("\n🔑 Login credentials (all users have password: password123):");
  console.log("  - superadmin / password123");
  console.log("  - admin / password123");
  console.log("  - student1 / password123");
  console.log("  - student2 / password123");
  console.log("  - student3 / password123");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await db.$disconnect();
    process.exit(1);
  });
