use bevy::prelude::*;

#[derive(Default)]
struct Cell;

struct Board<Cell>
where
    Cell: Default,
{
    cells: Vec<Cell>,
    stride: usize,
}

impl<Cell> Board<Cell>
where
    Cell: Default,
{
    fn new(stride: usize) -> Self {
        Self {
            cells: (0..stride.pow(2)).map(|_| Cell::default()).collect(),
            stride,
        }
    }
}

fn main() {
    let mut app = App::new();
    app.add_plugins(DefaultPlugins);
    #[cfg(feature = "debug")]
    app.add_plugins(bevy_inspector_egui::quick::WorldInspectorPlugin::new());
    app.add_systems(Startup, setup);
    app.add_systems(Update, || {});
    app.insert_resource(State { board: Board::new(8) });
    app.run();
}

#[derive(Resource)]
struct State {
    board: Board<Cell>,
}

fn setup(
    mut commands: Commands,
    mut materials: ResMut<Assets<ColorMaterial>>,
    mut meshes: ResMut<Assets<Mesh>>,
    state: Res<State>,
) {
    commands.spawn(Camera2d);

    let cell_height = 50.0;
    let cell_padding = 5.0;
    let cell_width = 50.0;

    let cell = meshes.add(Rectangle::new(cell_width, cell_height));
    let color = materials.add(Color::hsl(120.0, 0.5, 0.5));

    for row in 0..state.board.stride {
        for col in 0..state.board.stride {
            let total_width = state.board.stride as f32 * (cell_width + cell_padding) - cell_padding;
            let total_height = state.board.stride as f32 * (cell_height + cell_padding) - cell_padding;
            let x = col as f32 * (cell_width + cell_padding) - total_width / 2.0 + cell_width / 2.0;
            let y = row as f32 * (cell_height + cell_padding) - total_height / 2.0 + cell_height / 2.0;
            commands.spawn((
                Mesh2d(cell.clone()),
                MeshMaterial2d(color.clone()),
                Transform::from_xyz(x, y, 0.0),
            ));
        }
    }
}
