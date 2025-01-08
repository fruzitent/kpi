use bevy::prelude::*;

mod othello;
mod othello_plugin;

fn main() {
    let mut app = App::new();
    app.add_plugins(DefaultPlugins);
    #[cfg(feature = "debug")]
    app.add_plugins(bevy_inspector_egui::quick::WorldInspectorPlugin::new());
    app.add_plugins(othello_plugin::OthelloPlugin {});
    app.add_systems(Startup, setup_camera);
    app.run();
}

#[derive(Component)]
struct MainCamera;

fn setup_camera(mut commands: Commands) {
    commands.spawn((Camera2d, MainCamera));
}
