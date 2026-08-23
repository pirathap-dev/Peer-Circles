-- ==========================================================================
-- Seed data: sample support communities
-- ==========================================================================
-- Run AFTER schema.sql. Safe to re-run (uses ON CONFLICT to skip duplicates).
-- ==========================================================================

INSERT INTO communities (name, description, location) VALUES
    ('Student Support', 'Students supporting students through academic pressure, exams, and campus life.', 'Colombo'),
    ('Anxiety Support', 'A welcoming space to share coping strategies and encouragement for anxiety.', 'Kandy'),
    ('Stress Management', 'A supportive community for managing everyday stress and building resilience.', 'Kandy'),
    ('Grief Support', 'A compassionate community for those navigating loss and grief together.', 'Galle'),
    ('Work & Life Stress', 'Peer support for balancing work pressures, burnout, and personal life.', 'Colombo'),
    ('Parenting Support', 'Parents connecting with parents to share encouragement and experiences.', 'Jaffna'),
    ('General Peer Support', 'An open community for anyone seeking connection and peer encouragement.', 'Colombo')
ON CONFLICT DO NOTHING;
