use bevy::prelude::*;

use crate::othello;

pub struct OthelloPlugin;

impl Plugin for OthelloPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup);
        app.add_systems(Update, update_square);
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
                    let index = row * state.board.stride + col;
                    let square = &state.board.squares[index];
                    spawn_square(parent, square, index);
                }
            }
        });
}

#[derive(Component)]
struct Index(usize);

#[derive(Component)]
struct Square;

fn spawn_square(builder: &mut ChildBuilder, square: &othello::Square, index: usize) {
    builder
        .spawn((
            Square,
            Name::new("Square"),
            Button,
            Node {
                padding: UiRect::all(Val::Vh(0.5)),
                ..Default::default()
            },
            BackgroundColor(Color::hsl(120.0, 0.5, 0.5)),
            BorderColor(Color::hsl(60.0, 0.5, 0.5)),
            Index(index),
        ))
        .with_children(|parent| {
            if let Some(disk) = square {
                spawn_disk(parent, disk);
            }
        });
}

fn update_square(
    mut commands: Commands,
    mut query: Query<(Entity, &Index, &Interaction, &mut Node), (Changed<Interaction>, With<Square>)>,
    mut state: ResMut<State>,
) {
    for (entity, index, interaction, mut node) in query.iter_mut() {
        match interaction {
            Interaction::Pressed => {
                commands.entity(entity).with_children(|builder| {
                    let square = &mut state.board.squares[index.0];
                    if square.is_none() {
                        *square = Some(othello::Disk {
                            side: othello::Side::Dark,
                        });
                        spawn_disk(builder, square.as_ref().unwrap());
                    }
                });
            }
            Interaction::Hovered => {
                node.border = UiRect::all(Val::Vh(0.75));
            }
            Interaction::None => {
                node.border = UiRect::all(Val::Vh(0.0));
            }
        }
    }
}

fn spawn_disk(builder: &mut ChildBuilder, disk: &othello::Disk) {
    builder.spawn((
        Name::new("Disk"),
        Node {
            height: Val::Percent(100.0),
            width: Val::Percent(100.0),
            ..Default::default()
        },
        BackgroundColor(match disk.side {
            othello::Side::Dark => Color::hsl(0.0, 0.0, 0.0),
            othello::Side::Light => Color::hsl(0.0, 1.0, 1.0),
        }),
        BorderRadius::all(Val::Percent(50.0)),
    ));
}
