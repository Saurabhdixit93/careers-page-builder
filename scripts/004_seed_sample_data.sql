-- Seed sample data for testing
-- This creates a sample company and jobs

-- Note: This assumes a user with this ID exists
-- In production, this would be replaced with actual user IDs

-- Sample company data (you'll need to replace the user_id with a real one after signup)
-- For now, we'll create dummy data that can be viewed publicly

DO $$
DECLARE
  sample_company_id UUID;
BEGIN
  -- Insert sample company
  INSERT INTO companies (
    user_id,
    slug,
    name,
    tagline,
    description,
    logo_url,
    banner_url,
    culture_video_url,
    primary_color,
    secondary_color,
    sections,
    is_published
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Placeholder user_id
    'techcorp',
    'TechCorp Industries',
    'Building the future of technology',
    'TechCorp is a leading technology company focused on creating innovative solutions that transform industries. We believe in the power of technology to make the world a better place.',
    '/placeholder.svg?height=120&width=120',
    '/placeholder.svg?height=400&width=1200',
    NULL,
    '#3b82f6',
    '#1e40af',
    '[
      {"id": "about", "type": "about", "title": "About Us", "content": "We are a team of passionate technologists building products that matter.", "order": 0},
      {"id": "culture", "type": "culture", "title": "Life at TechCorp", "content": "Innovation, collaboration, and growth define our culture.", "order": 1},
      {"id": "benefits", "type": "benefits", "title": "Benefits", "content": "Competitive salary, health insurance, flexible work, and more.", "order": 2}
    ]'::jsonb,
    true
  )
  RETURNING id INTO sample_company_id;

  -- Insert sample jobs
  INSERT INTO jobs (
    company_id,
    title,
    department,
    location,
    job_type,
    experience_level,
    description,
    responsibilities,
    qualifications,
    benefits,
    is_active
  ) VALUES
  (
    sample_company_id,
    'Senior Frontend Engineer',
    'Engineering',
    'San Francisco, CA',
    'Full-time',
    'Senior Level',
    'We are looking for a Senior Frontend Engineer to join our team and help build the next generation of our product.',
    E'• Lead frontend architecture decisions\n• Mentor junior developers\n• Build scalable React applications\n• Collaborate with design and backend teams',
    E'• 5+ years of frontend development experience\n• Expert in React, TypeScript, and modern web technologies\n• Strong understanding of web performance\n• Experience with testing and CI/CD',
    E'• Competitive salary and equity\n• Health, dental, and vision insurance\n• Flexible work arrangements\n• Learning and development budget',
    true
  ),
  (
    sample_company_id,
    'Product Designer',
    'Design',
    'Remote',
    'Full-time',
    'Mid Level',
    'Join our design team to create beautiful and intuitive user experiences for millions of users.',
    E'• Design user interfaces and experiences\n• Conduct user research and testing\n• Create design systems and components\n• Collaborate with engineers and product managers',
    E'• 3+ years of product design experience\n• Proficiency in Figma or similar tools\n• Strong portfolio demonstrating UX/UI skills\n• Understanding of frontend development',
    E'• Competitive salary\n• Remote-first culture\n• Health insurance\n• Annual company retreats',
    true
  ),
  (
    sample_company_id,
    'Backend Engineer',
    'Engineering',
    'New York, NY',
    'Full-time',
    'Mid Level',
    'Help us build robust and scalable backend systems that power our platform.',
    E'• Design and implement APIs\n• Optimize database queries\n• Ensure system reliability and performance\n• Work with DevOps on infrastructure',
    E'• 3+ years of backend development experience\n• Strong knowledge of Node.js, Python, or Go\n• Experience with databases (PostgreSQL, MongoDB)\n• Understanding of microservices architecture',
    E'• Competitive compensation\n• Health benefits\n• Hybrid work model\n• Stock options',
    true
  ),
  (
    sample_company_id,
    'Marketing Manager',
    'Marketing',
    'Los Angeles, CA',
    'Full-time',
    'Senior Level',
    'Lead our marketing efforts to grow brand awareness and drive customer acquisition.',
    E'• Develop and execute marketing strategies\n• Manage marketing campaigns across channels\n• Analyze campaign performance\n• Lead a team of marketing specialists',
    E'• 5+ years of marketing experience\n• Proven track record in B2B/B2C marketing\n• Strong analytical and communication skills\n• Experience with marketing automation tools',
    E'• Competitive salary\n• Performance bonuses\n• Health insurance\n• Professional development opportunities',
    true
  ),
  (
    sample_company_id,
    'Data Scientist',
    'Data',
    'Remote',
    'Full-time',
    'Mid Level',
    'Leverage data to drive insights and build machine learning models that improve our products.',
    E'• Build predictive models and algorithms\n• Analyze large datasets\n• Collaborate with engineering teams\n• Present findings to stakeholders',
    E'• 3+ years of data science experience\n• Strong programming skills (Python, R)\n• Experience with ML frameworks (TensorFlow, PyTorch)\n• Statistical analysis expertise',
    E'• Competitive salary\n• Remote work flexibility\n• Learning budget\n• Conference attendance',
    true
  );

END $$;
