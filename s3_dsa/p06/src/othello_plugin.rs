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
    board: othello::Board,
}

fn setup(mut commands: Commands, state: Res<State>) {
    commands
        .spawn((
            Name::new("App"),
            Node {
                align_items: AlignItems::Center,
                display: Display::Grid,
                height: Val::Percent(100.0),
                justify_items: JustifyItems::Center,
                width: Val::Percent(100.0),
                ..Default::default()
            },
        ))
        .with_children(|builder| spawn_board(builder, &state));
}

fn spawn_board(builder: &mut ChildBuilder, state: &State) {
    builder
        .spawn((
            Name::new("Board"),
            Node {
                aspect_ratio: Some(1.0),
                column_gap: Val::Vh(1.0),
                display: Display::Grid,
                grid_template_columns: RepeatedGridTrack::flex(state.board.stride as u16, 1.0),
                grid_template_rows: RepeatedGridTrack::flex(state.board.stride as u16, 1.0),
                height: Val::Percent(80.0),
                row_gap: Val::Vh(1.0),
                ..Default::default()
            },
        ))
        .with_children(|parent| {
            for row in 0..state.board.stride {
                for col in 0..state.board.stride {
                    let square = &state.board[row][col];
                    spawn_square(parent, square);
                }
            }
        });
}

fn spawn_square(builder: &mut ChildBuilder, square: &othello::Square) {
    builder
        .spawn((
            Name::new("Square"),
            Node {
                padding: UiRect::all(Val::Vh(0.5)),
                ..Default::default()
            },
            BackgroundColor(Color::hsl(120.0, 0.5, 0.5)),
        ))
        .with_children(|parent| {
            if let Some(disk) = square {
                spawn_disk(parent, disk);
            }
        });
}

fn spawn_disk(builder: &mut ChildBuilder, disk: &othello::Disk) {
    builder.spawn((
        Name::new("Disk"),
        Node {
            height: Val::Percent(100.0),
            width: Val::Percent(100.0),
            ..Default::default()
        },
        Button,
        BackgroundColor(match disk.side {
            othello::Side::Dark => Color::hsl(0.0, 0.0, 0.0),
            othello::Side::Light => Color::hsl(0.0, 1.0, 1.0),
        }),
        BorderRadius::all(Val::Percent(50.0)),
    ));
}
