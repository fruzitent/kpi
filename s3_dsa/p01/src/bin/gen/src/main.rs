fn main() {
    let input_path = std::path::Path::new("./input.bin");
    let mut rng = nanorand::tls_rng();
    let data: Vec<u8> = (0..2u32.pow(8)).map(|_| nanorand::Rng::generate(&mut rng)).collect();
    let mut input_file = std::fs::File::create(input_path).unwrap();
    std::io::Write::write_all(&mut input_file, &data).unwrap();
}
