-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION create_tv_show_schedule_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Saturday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Sunday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Monday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Tuesday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Wednesday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Thursday');
  INSERT INTO tv_show_schedules (tv_show_id, day) VALUES (NEW.id, 'Friday');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER create_tv_show_schedule
AFTER INSERT ON tv_shows
FOR EACH ROW EXECUTE FUNCTION create_tv_show_schedule_function();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS create_tv_show_schedule ON tv_shows;
DROP FUNCTION IF EXISTS create_tv_show_schedule_function();
-- +goose StatementEnd

-- Note: Use `StatementBegin` and `StatementEnd` for complex statements with semicolons.
-- See: https://stackoverflow.com/a/20944498
