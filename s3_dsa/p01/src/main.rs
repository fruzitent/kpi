mod nacci;
mod sort;

fn setup_logger() -> Result<(), fern::InitError> {
    fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                "[{} {} {}:{}] {}",
                humantime::format_rfc3339_seconds(std::time::SystemTime::now()),
                record.level(),
                record.file().unwrap(),
                record.line().unwrap(),
                message
            ))
        })
        .level(log::LevelFilter::Debug)
        .chain(std::io::stdout())
        .apply()?;
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    setup_logger()?;

    let input_path = std::path::Path::new("./input.bin");
    let output_path = std::path::Path::new("./output.bin");

    if !input_path.exists() {
        let mut rng = nanorand::tls_rng();
        let data: Vec<u8> = (0..2u32.pow(8)).map(|_| nanorand::Rng::generate(&mut rng)).collect();
        let mut input_file = std::fs::File::create(&input_path)?;
        std::io::Write::write_all(&mut input_file, &data)?;
    }

    sort::polyphase_merge_sort(input_path, output_path, false, 3);
    Ok(())
}
