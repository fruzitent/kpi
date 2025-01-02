use bevy::prelude::*;

enum CellKind {
    Black,
    White,
}

#[derive(Default)]
struct Cell {
    kind: Option<CellKind>,
}

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
        assert!(stride >= 4 && stride % 2 == 0);
        Self {
            cells: (0..stride.pow(2)).map(|_| Cell::default()).collect(),
            stride,
        }
    }
}

impl<Cell> std::ops::Index<usize> for Board<Cell>
where
    Cell: Default,
{
    type Output = [Cell];

    fn index(&self, index: usize) -> &Self::Output {
        &self.cells[index * self.stride..(index + 1) * self.stride]
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
    mut state: ResMut<State>,
) {
    commands.spawn(Camera2d);

    let block_height = 50.0;
    let block_padding = 5.0;
    let block_width = 50.0;
    let disk_radius = (50.0 - block_padding) / 2.0;

    let block = meshes.add(Rectangle::new(block_width, block_height));
    let disk = meshes.add(Circle::new(disk_radius));

    let black = materials.add(Color::hsl(0.0, 0.0, 0.0));
    let green = materials.add(Color::hsl(120.0, 0.5, 0.5));
    let white = materials.add(Color::hsl(0.0, 1.0, 1.0));

    let half_stride = state.board.stride / 2;
    let top_left = (half_stride - 1) * state.board.stride + (half_stride - 1);
    let top_right = (half_stride - 1) * state.board.stride + half_stride;
    let bottom_left = half_stride * state.board.stride + (half_stride - 1);
    let bottom_right = half_stride * state.board.stride + half_stride;
    state.board.cells[top_left].kind = Some(CellKind::White);
    state.board.cells[top_right].kind = Some(CellKind::Black);
    state.board.cells[bottom_left].kind = Some(CellKind::Black);
    state.board.cells[bottom_right].kind = Some(CellKind::White);

    for row in 0..state.board.stride {
        for col in 0..state.board.stride {
            let total_width = state.board.stride as f32 * (block_width + block_padding) - block_padding;
            let total_height = state.board.stride as f32 * (block_height + block_padding) - block_padding;
            let x = col as f32 * (block_width + block_padding) - total_width / 2.0 + block_width / 2.0;
            let y = row as f32 * (block_height + block_padding) - total_height / 2.0 + block_height / 2.0;

            commands.spawn((
                Mesh2d(block.clone()),
                MeshMaterial2d(green.clone()),
                Transform::from_xyz(x, -y, 0.0),
            ));

            let cell = &state.board[row][col];
            if cell.kind.is_none() {
                continue;
            }

            commands.spawn((
                Mesh2d(disk.clone()),
                MeshMaterial2d(match cell.kind {
                    Some(CellKind::Black) => black.clone(),
                    Some(CellKind::White) => white.clone(),
                    None => unreachable!(),
                }),
                Transform::from_xyz(x, -y, 1.0),
            ));
        }
    }
}
