pub struct App {
    g: egui_graphs::Graph,
    perf: perf::Perf,
}

impl App {
    pub fn new(_cc: &eframe::CreationContext<'_>) -> Self {
        Self {
            g: egui_graphs::Graph::from(&petgraph::stable_graph::StableGraph::new()),
            perf: perf::Perf::default(),
        }
    }
}

impl eframe::App for App {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.add(&mut egui_graphs::GraphView::new(&mut self.g));
        });
        egui::SidePanel::right("info").show(ctx, |ui| {
            ui.add(&mut self.perf);
        });
        self.perf.update();
    }
}
