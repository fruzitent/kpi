use bevy::prelude::*;

use crate::othello;

pub struct OthelloPlugin;

impl Plugin for OthelloPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup);
        app.insert_resource(State {
            board: othello::Board::new(8),
        });
    }
}

#[derive(Resource)]
struct State {
    board: othello::Board<othello::Cell>,
}

fn setup(mut commands: Commands, mut state: ResMut<State>) {
    let half_stride = state.board.stride / 2;
    let top_left = (half_stride - 1) * state.board.stride + (half_stride - 1);
    let top_right = (half_stride - 1) * state.board.stride + half_stride;
    let bottom_left = half_stride * state.board.stride + (half_stride - 1);
    let bottom_right = half_stride * state.board.stride + half_stride;
    state.board.cells[top_left].kind = Some(othello::CellKind::White);
    state.board.cells[top_right].kind = Some(othello::CellKind::Black);
    state.board.cells[bottom_left].kind = Some(othello::CellKind::Black);
    state.board.cells[bottom_right].kind = Some(othello::CellKind::White);
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

fn spawn_cell(builder: &mut ChildBuilder, cell: &othello::Cell) {
    builder.spawn((
        Node::default(),
        BackgroundColor(match cell.kind {
            Some(othello::CellKind::Black) => Color::hsl(0.0, 0.0, 0.0),
            Some(othello::CellKind::White) => Color::hsl(0.0, 1.0, 1.0),
            None => Color::hsl(120.0, 0.5, 0.5),
        }),
    ));
}
