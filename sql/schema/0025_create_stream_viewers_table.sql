-- +goose Up
CREATE TABLE stream_viewers (
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  viewer_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (stream_id, date)
);

-- +goose Down
DROP TABLE IF EXISTS stream_viewers;
