import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lotoks',
    multipleStatements: true,
  });

  console.log('Connected to MySQL. Seeding database...\n');

  // 1. Create default admin
  const passwordHash = await bcrypt.hash('admin123', 12);
  await connection.execute(
    `INSERT IGNORE INTO admins (email, password_hash, name, role) VALUES (?, ?, ?, ?)`,
    ['admin@lotoks.com', passwordHash, 'Super Admin', 'super_admin']
  );
  console.log('✓ Default admin created: admin@lotoks.com / admin123');

  // 2. Insert requirement sets
  const sets = [
    {
      service_type: 'visa',
      name: 'Visa Sponsorship',
      description: 'Required for Schengen short-stay visas (Type C) and long-stay national visas (Type D). Requirements vary slightly by destination country and visit purpose.',
    },
    {
      service_type: 'education',
      name: 'Education & Scholarship',
      description: 'Required documents for undergraduate, postgraduate, and scholarship applications to institutions worldwide.',
    },
    {
      service_type: 'jobs',
      name: 'Job Placement',
      description: 'Required documentation for international job placement services, including skilled worker and professional positions.',
    },
    {
      service_type: 'residence',
      name: 'Permanent Residence',
      description: 'Documentation requirements for permanent residence applications through investment, family reunification, or long-term residency pathways.',
    },
  ];

  for (const set of sets) {
    await connection.execute(
      `INSERT IGNORE INTO requirement_sets (service_type, name, description) VALUES (?, ?, ?)`,
      [set.service_type, set.name, set.description]
    );
  }
  console.log('✓ Requirement sets created');

  // 3. Insert categories and documents for each set
  const requirementsData: Record<string, Array<{ category_key: string; category_name: string; display_order: number; documents: Array<{ doc_key: string; label: string; description: string; required: boolean; display_order: number }> }>> = {
    visa: [
      {
        category_key: 'identity',
        category_name: 'Identity & Personal Documents',
        display_order: 1,
        documents: [
          { doc_key: 'passport', label: 'Valid International Passport', description: 'Must be valid for at least 6 months beyond your intended stay', required: true, display_order: 1 },
          { doc_key: 'passport_photos', label: 'Passport-sized Photographs (2)', description: 'Recent colour photographs on white background, 35mm x 45mm', required: true, display_order: 2 },
          { doc_key: 'birth_certificate', label: 'Birth Certificate', description: 'Official government-issued birth certificate', required: true, display_order: 3 },
          { doc_key: 'national_id', label: 'National ID Card', description: 'Government-issued national identification card', required: true, display_order: 4 },
        ],
      },
      {
        category_key: 'financial',
        category_name: 'Financial Documents',
        display_order: 2,
        documents: [
          { doc_key: 'bank_statements', label: 'Bank Statements (last 6 months)', description: 'Original bank statements showing sufficient funds for your stay', required: true, display_order: 1 },
          { doc_key: 'employment_letter', label: 'Employment/Sponsorship Letter', description: 'Letter from employer or sponsor confirming financial responsibility', required: true, display_order: 2 },
          { doc_key: 'tax_returns', label: 'Tax Returns (last 2 years)', description: 'Income tax returns or equivalent proof of income', required: false, display_order: 3 },
          { doc_key: 'property_docs', label: 'Property Ownership Documents', description: 'Proof of property ownership if applicable', required: false, display_order: 4 },
        ],
      },
      {
        category_key: 'purpose',
        category_name: 'Purpose of Visit',
        display_order: 3,
        documents: [
          { doc_key: 'invitation_letter', label: 'Invitation Letter', description: 'Letter from host/inviting party in the destination country', required: false, display_order: 1 },
          { doc_key: 'travel_itinerary', label: 'Travel Itinerary', description: 'Round-trip flight reservation and accommodation details', required: true, display_order: 2 },
          { doc_key: 'travel_insurance', label: 'Travel Health Insurance', description: 'Valid travel medical insurance covering the entire stay', required: true, display_order: 3 },
          { doc_key: 'cover_letter', label: 'Cover Letter', description: 'Personal letter explaining the purpose of your visit', required: true, display_order: 4 },
        ],
      },
    ],
    education: [
      {
        category_key: 'academic',
        category_name: 'Academic Documents',
        display_order: 1,
        documents: [
          { doc_key: 'transcripts', label: 'Academic Transcripts', description: 'Official transcripts from all previously attended institutions', required: true, display_order: 1 },
          { doc_key: 'certificates', label: 'Degree Certificates/Diplomas', description: 'Certified copies of all completed degree certificates or diplomas', required: true, display_order: 2 },
          { doc_key: 'recommendation_letters', label: 'Recommendation Letters (2-3)', description: 'Academic or professional recommendation letters', required: true, display_order: 3 },
          { doc_key: 'statement_of_purpose', label: 'Statement of Purpose', description: 'Personal essay explaining your academic goals and motivations', required: true, display_order: 4 },
          { doc_key: 'cv_resume', label: 'CV/Resume (Academic)', description: 'Detailed curriculum vitae highlighting academic achievements', required: true, display_order: 5 },
        ],
      },
      {
        category_key: 'language',
        category_name: 'Language Proficiency',
        display_order: 2,
        documents: [
          { doc_key: 'english_test', label: 'English Proficiency Test Score', description: 'IELTS, TOEFL, or equivalent (minimum scores vary by institution)', required: true, display_order: 1 },
          { doc_key: 'other_language_test', label: 'Other Language Test Scores', description: 'Additional language proficiency tests if required by the programme', required: false, display_order: 2 },
        ],
      },
      {
        category_key: 'identity_edu',
        category_name: 'Identity Documents',
        display_order: 3,
        documents: [
          { doc_key: 'passport_edu', label: 'Valid International Passport', description: 'Must be valid for at least 6 months beyond intended study period', required: true, display_order: 1 },
          { doc_key: 'passport_photos_edu', label: 'Passport-sized Photographs (4)', description: 'Recent colour photographs', required: true, display_order: 2 },
          { doc_key: 'birth_certificate_edu', label: 'Birth Certificate', description: 'Official government-issued certificate', required: true, display_order: 3 },
        ],
      },
      {
        category_key: 'financial_edu',
        category_name: 'Financial Documents',
        display_order: 4,
        documents: [
          { doc_key: 'bank_statements_edu', label: 'Bank Statements (last 6 months)', description: 'Proof of sufficient funds for tuition and living expenses', required: true, display_order: 1 },
          { doc_key: 'scholarship_docs', label: 'Scholarship Application (if applicable)', description: 'Any scholarship-specific application forms or essays', required: false, display_order: 2 },
          { doc_key: 'sponsorship_letter', label: 'Sponsorship Letter (if applicable)', description: 'Letter from sponsor confirming financial support', required: false, display_order: 3 },
        ],
      },
    ],
    jobs: [
      {
        category_key: 'professional',
        category_name: 'Professional Documents',
        display_order: 1,
        documents: [
          { doc_key: 'cv_resume_job', label: 'Professional CV/Resume', description: 'Updated professional CV highlighting work experience and skills', required: true, display_order: 1 },
          { doc_key: 'cover_letter_job', label: 'Cover Letter', description: 'Tailored cover letter for the position you are applying for', required: true, display_order: 2 },
          { doc_key: 'certifications', label: 'Professional Certifications', description: 'Copies of relevant professional certifications and licences', required: false, display_order: 3 },
          { doc_key: 'portfolio', label: 'Portfolio (if applicable)', description: 'Work samples or portfolio for creative positions', required: false, display_order: 4 },
        ],
      },
      {
        category_key: 'experience',
        category_name: 'Work Experience',
        display_order: 2,
        documents: [
          { doc_key: 'employment_history', label: 'Employment History', description: 'Detailed employment history with dates and responsibilities', required: true, display_order: 1 },
          { doc_key: 'reference_letters', label: 'Reference Letters (2)', description: 'Professional reference letters from previous employers', required: true, display_order: 2 },
          { doc_key: 'pay_slips', label: 'Recent Pay Slips (last 3 months)', description: 'Proof of current employment and income', required: false, display_order: 3 },
        ],
      },
      {
        category_key: 'qualifications',
        category_name: 'Qualifications',
        display_order: 3,
        documents: [
          { doc_key: 'degree_certificates_job', label: 'Degree Certificates/Diplomas', description: 'Certified copies of educational qualifications', required: true, display_order: 1 },
          { doc_key: 'transcripts_job', label: 'Academic Transcripts', description: 'Official transcripts from educational institutions', required: false, display_order: 2 },
          { doc_key: 'language_cert_job', label: 'Language Proficiency Certificate', description: 'Proof of language proficiency if required for the position', required: false, display_order: 3 },
        ],
      },
      {
        category_key: 'identity_job',
        category_name: 'Identity Documents',
        display_order: 4,
        documents: [
          { doc_key: 'passport_job', label: 'Valid International Passport', description: 'Valid passport for international placement', required: true, display_order: 1 },
          { doc_key: 'national_id_job', label: 'National ID Card', description: 'Government-issued identification', required: true, display_order: 2 },
          { doc_key: 'passport_photos_job', label: 'Passport-sized Photographs (2)', description: 'Recent colour photographs', required: true, display_order: 3 },
        ],
      },
    ],
    residence: [
      {
        category_key: 'identity_res',
        category_name: 'Identity Documents',
        display_order: 1,
        documents: [
          { doc_key: 'passport_res', label: 'Valid International Passport', description: 'Valid passport with sufficient blank pages', required: true, display_order: 1 },
          { doc_key: 'birth_certificate_res', label: 'Birth Certificate', description: 'Official government-issued birth certificate (apostilled if required)', required: true, display_order: 2 },
          { doc_key: 'passport_photos_res', label: 'Passport-sized Photographs (4)', description: 'Recent colour photographs meeting destination country specifications', required: true, display_order: 3 },
          { doc_key: 'national_id_res', label: 'National ID Card', description: 'Government-issued national identification', required: true, display_order: 4 },
        ],
      },
      {
        category_key: 'financial_res',
        category_name: 'Financial & Investment Documents',
        display_order: 2,
        documents: [
          { doc_key: 'bank_statements_res', label: 'Bank Statements (last 12 months)', description: 'Comprehensive bank statements showing financial history', required: true, display_order: 1 },
          { doc_key: 'tax_returns_res', label: 'Tax Returns (last 3-5 years)', description: 'Complete tax returns or equivalent financial records', required: true, display_order: 2 },
          { doc_key: 'investment_proof', label: 'Proof of Investments', description: 'Documentation of investments, properties, or business interests', required: false, display_order: 3 },
          { doc_key: 'pension_statements', label: 'Pension/Retirement Statements', description: 'Retirement account statements if applicable', required: false, display_order: 4 },
          { doc_key: 'source_of_funds', label: 'Source-of-Funds Declaration', description: 'Notarised declaration explaining the source of your funds', required: true, display_order: 5 },
        ],
      },
      {
        category_key: 'legal',
        category_name: 'Legal Documents',
        display_order: 3,
        documents: [
          { doc_key: 'police_clearance', label: 'Police Clearance Certificate', description: 'Police clearance from country of origin and all countries where you have lived for 6+ months', required: true, display_order: 1 },
          { doc_key: 'medical_report', label: 'Medical Examination Report', description: 'Comprehensive medical examination by an approved physician', required: true, display_order: 2 },
          { doc_key: 'marriage_certificate', label: 'Marriage Certificate (if applicable)', description: 'Certified marriage certificate for family-based applications', required: false, display_order: 3 },
          { doc_key: 'children_docs', label: 'Children\'s Documents', description: 'Birth certificates and custody documents for dependent children', required: false, display_order: 4 },
        ],
      },
    ],
  };

  for (const [serviceType, categories] of Object.entries(requirementsData)) {
    const [setRows] = await connection.execute(
      `SELECT id FROM requirement_sets WHERE service_type = ?`,
      [serviceType]
    );
    const set = (setRows as any[])[0];
    if (!set) continue;

    for (const cat of categories) {
      await connection.execute(
        `INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)`,
        [set.id, cat.category_key, cat.category_name, cat.display_order]
      );

      const [catRows] = await connection.execute(
        `SELECT id FROM categories WHERE set_id = ? AND category_key = ?`,
        [set.id, cat.category_key]
      );
      const category = (catRows as any[])[0];
      if (!category) continue;

      for (const doc of cat.documents) {
        await connection.execute(
          `INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)`,
          [category.id, doc.doc_key, doc.label, doc.description, doc.required, doc.display_order]
        );
      }
    }
  }
  console.log('✓ Requirement categories and documents seeded');

  // 4. Insert sample listings
  const sampleListings = [
    { title: 'Registered Nurse', type: 'job', country: 'UK', employer: 'NHS United Kingdom', description: 'We are seeking qualified registered nurses to join the NHS. Positions available across various departments in England, Scotland, and Wales.', requirements: 'BSc Nursing, valid license, 2+ years experience, IELTS 7.0', benefits: 'Competitive salary, relocation assistance, visa sponsorship', status: 'active' },
    { title: 'MSc Computer Science', type: 'education', country: 'Australia', employer: 'University of Melbourne', description: 'Full scholarship opportunity for MSc Computer Science at one of Australia\'s top universities.', requirements: 'BSc Computer Science or related, 3.5+ GPA, IELTS 6.5', benefits: 'Full tuition, stipend, accommodation allowance', status: 'active' },
    { title: 'Software Engineer', type: 'job', country: 'Canada', employer: 'Tech Corp Canada', description: 'Senior software engineer position with a leading tech company in Toronto.', requirements: '5+ years experience, BS/MS in CS, proficiency in Python/Java', benefits: 'Competitive salary, health benefits, stock options, visa sponsorship', status: 'active' },
    { title: 'PhD Scholarship', type: 'education', country: 'USA', employer: 'Stanford University', description: 'Fully funded PhD position in Artificial Intelligence and Machine Learning.', requirements: 'Master\'s degree in related field, research experience, GRE scores', benefits: 'Full tuition waiver, stipend $45k/yr, research budget', status: 'active' },
    { title: 'Civil Engineer', type: 'job', country: 'Australia', employer: 'BuildCorp Australia', description: 'Experienced civil engineer needed for infrastructure projects in Sydney and Melbourne.', requirements: 'BEng Civil, 5+ years exp, PE license preferred', benefits: 'Excellent salary, relocation package, permanent residency sponsorship', status: 'active' },
    { title: 'MBA Scholarship', type: 'education', country: 'UK', employer: 'London Business School', description: 'Full-tuition MBA scholarship for outstanding candidates from emerging economies.', requirements: 'Bachelor\'s degree, 3+ years work exp, GMAT 700+, IELTS 7.0', benefits: 'Full tuition, living stipend, mentorship program', status: 'active' },
  ];

  for (const listing of sampleListings) {
    const [adminRows] = await connection.execute(`SELECT id FROM admits LIMIT 1`);
    const adminId = 1;
    await connection.execute(
      `INSERT INTO listings (title, type, country, employer, description, requirements, benefits, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [listing.title, listing.type, listing.country, listing.employer, listing.description, listing.requirements, listing.benefits, listing.status, adminId]
    );
  }
  console.log('✓ Sample listings created');

  // 5. Insert sample payments
  const samplePayments = [
    { application_id: null, user_id: null, amount: 299.00, currency: 'USD', method: 'paypal', status: 'completed', transaction_ref: 'PP-2026-001' },
    { application_id: null, user_id: null, amount: 499.00, currency: 'USD', method: 'stripe', status: 'pending', transaction_ref: 'STR-2026-001' },
    { application_id: null, user_id: null, amount: 199.00, currency: 'USD', method: 'paystack', status: 'failed', transaction_ref: 'PS-2026-001' },
    { application_id: null, user_id: null, amount: 399.00, currency: 'USD', method: 'paypal', status: 'completed', transaction_ref: 'PP-2026-002' },
    { application_id: null, user_id: null, amount: 599.00, currency: 'USD', method: 'stripe', status: 'completed', transaction_ref: 'STR-2026-002' },
    { application_id: null, user_id: null, amount: 149.00, currency: 'USD', method: 'bank', status: 'completed', transaction_ref: 'BNK-2026-001' },
  ];

  for (const payment of samplePayments) {
    await connection.execute(
      `INSERT INTO payments (application_id, user_id, amount, currency, method, status, transaction_ref) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [payment.application_id, payment.user_id, payment.amount, payment.currency, payment.method, payment.status, payment.transaction_ref]
    );
  }
  console.log('✓ Sample payments created');

  await connection.end();
  console.log('\n✔ Database seeded successfully!');
  console.log('   Admin Login: admin@lotoks.com / admin123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
