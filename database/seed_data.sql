-- Seed data for tools table
INSERT INTO tools (name, category, version, available, description) VALUES
-- Programming Languages
('Python', 'language', '3.11', TRUE, 'General-purpose programming language'),
('JavaScript', 'language', 'ES2023', TRUE, 'Web development language'),
('Java', 'language', '17', TRUE, 'Object-oriented programming language'),
('C++', 'language', '20', TRUE, 'Systems programming language'),
('R', 'language', '4.3', TRUE, 'Statistical computing language'),

-- Python Libraries
('PyTorch', 'library', '2.1.0', TRUE, 'Deep learning framework'),
('TensorFlow', 'library', '2.15.0', TRUE, 'Machine learning framework'),
('OpenCV', 'library', '4.8.0', TRUE, 'Computer vision library'),
('NumPy', 'library', '1.24.0', TRUE, 'Numerical computing'),
('Pandas', 'library', '2.0.0', TRUE, 'Data analysis'),
('Scikit-learn', 'library', '1.3.0', TRUE, 'Machine learning'),
('Matplotlib', 'library', '3.7.0', TRUE, 'Data visualization'),
('Flask', 'framework', '3.0.0', TRUE, 'Web framework'),
('FastAPI', 'framework', '0.109.0', TRUE, 'Modern web framework'),

-- JavaScript Libraries
('React', 'framework', '18.2.0', TRUE, 'UI library'),
('Node.js', 'runtime', '20.0.0', TRUE, 'JavaScript runtime'),
('Express', 'framework', '4.18.0', TRUE, 'Web framework'),

-- Hardware/Tools
('NVIDIA RTX 3080', 'hardware', 'GPU', TRUE, '10GB VRAM for ML training'),
('Arduino Uno', 'hardware', 'R3', TRUE, 'Microcontroller board'),
('Raspberry Pi', 'hardware', '4B', TRUE, 'Single-board computer'),
('3D Printer', 'hardware', 'Ender 3', TRUE, 'FDM 3D printer'),

-- Development Tools
('Git', 'tool', '2.42', TRUE, 'Version control'),
('Docker', 'tool', '24.0', TRUE, 'Containerization'),
('VS Code', 'tool', '1.85', TRUE, 'Code editor'),
('Jupyter', 'tool', '7.0', TRUE, 'Interactive notebooks'),
('PostgreSQL', 'database', '15', TRUE, 'Relational database'),
('MongoDB', 'database', '7.0', TRUE, 'NoSQL database');
