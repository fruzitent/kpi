pub struct Perf {
    fps: f32,
    frames: u32,
    timestamp: std::time::Instant,
}

impl Perf {
    pub fn update(&mut self) {
        self.frames += 1;
        let now = std::time::Instant::now();
        let elapsed = now.duration_since(self.timestamp);
        if elapsed.as_secs_f32() >= 1.0 {
            self.timestamp = now;
            self.fps = self.frames as f32 / elapsed.as_secs_f32();
            self.frames = 0;
        }
    }
}

impl Default for Perf {
    fn default() -> Self {
        Self {
            fps: 0.0,
            frames: 0,
            timestamp: std::time::Instant::now(),
        }
    }
}

#[cfg(feature = "egui")]
impl egui::Widget for &mut Perf {
    fn ui(self, ui: &mut egui::Ui) -> egui::Response {
        ui.label(format!("fps: {fps:.02}", fps = self.fps))
    }
}
