CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE TABLE IF NOT EXISTS motion_events (
 time timestamptz NOT NULL, id uuid NOT NULL, session uuid NOT NULL,
 kind text NOT NULL, value double precision, PRIMARY KEY(time,id)
);
SELECT create_hypertable('motion_events',by_range('time'),if_not_exists=>TRUE);
CREATE INDEX IF NOT EXISTS motion_session_time ON motion_events(session,time DESC);
