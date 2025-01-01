use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, || {})
        .add_systems(Update, || {})
        .run();
}
