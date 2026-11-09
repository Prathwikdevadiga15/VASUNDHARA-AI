INSERT INTO roles(name) VALUES ('citizen'),('officer'),('researcher'),('ngo'),('super_admin') ON CONFLICT DO NOTHING;
INSERT INTO permissions(code) VALUES
 ('report:create'),('report:read_own'),('report:read_assigned'),('report:verify'),('incident:update'),
 ('dataset:read'),('research:create'),('project:manage'),('volunteer:manage'),('alert:read'),
 ('document:upload'),('admin:users'),('admin:audit') ON CONFLICT DO NOTHING;
-- No fake environmental data is seeded. Load real datasets through data-pipeline/.
