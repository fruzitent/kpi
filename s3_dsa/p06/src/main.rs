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
    app.add_systems(Startup, (setup, setup_camera));
    app.add_systems(Update, || {});
    app.insert_resource(State { board: Board::new(8) });
    app.run();
}

#[derive(Resource)]
struct State {
    board: Board<Cell>,
}

fn setup(mut commands: Commands, mut state: ResMut<State>) {
    let half_stride = state.board.stride / 2;
    let top_left = (half_stride - 1) * state.board.stride + (half_stride - 1);
    let top_right = (half_stride - 1) * state.board.stride + half_stride;
    let bottom_left = half_stride * state.board.stride + (half_stride - 1);
    let bottom_right = half_stride * state.board.stride + half_stride;
    state.board.cells[top_left].kind = Some(CellKind::White);
    state.board.cells[top_right].kind = Some(CellKind::Black);
    state.board.cells[bottom_left].kind = Some(CellKind::Black);
    state.board.cells[bottom_right].kind = Some(CellKind::White);
    commands
        .spawn(Node {
            align_items: AlignItems::Center,
            display: Display::Grid,
            height: Val::Percent(100.0),
            justify_items: JustifyItems::Center,
            width: Val::Percent(100.0),
            ..Default::default()
        })
        .with_children(|builder| spawn_board(builder, &state));
}

fn spawn_board(builder: &mut ChildBuilder, state: &State) {
    builder
        .spawn(Node {
            aspect_ratio: Some(1.0),
            column_gap: Val::Vh(1.0),
            display: Display::Grid,
            grid_template_columns: RepeatedGridTrack::flex(state.board.stride as u16, 1.0),
            grid_template_rows: RepeatedGridTrack::flex(state.board.stride as u16, 1.0),
            height: Val::Percent(80.0),
            row_gap: Val::Vh(1.0),
            ..Default::default()
        })
        .with_children(|builder| {
            for row in 0..state.board.stride {
                for col in 0..state.board.stride {
                    let index = row * state.board.stride + col;
                    spawn_cell(builder, &state.board.cells[index]);
                }
            }
        });
}

fn spawn_cell(builder: &mut ChildBuilder, cell: &Cell) {
    builder.spawn((
        Node::default(),
        BackgroundColor(match cell.kind {
            Some(CellKind::Black) => Color::hsl(0.0, 0.0, 0.0),
            Some(CellKind::White) => Color::hsl(0.0, 1.0, 1.0),
            None => Color::hsl(120.0, 0.5, 0.5),
        }),
    ));
}

#[derive(Component)]
struct MainCamera;

fn setup_camera(mut commands: Commands) {
    commands.spawn((Camera2d, MainCamera));
}
