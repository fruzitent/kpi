fn main() {
    let path = std::path::Path::new("./input.bin");
    let size = usize::pow(2, 30);

    let mut data = vec![0; size];
    let mut rng = nanorand::tls_rng();
    nanorand::Rng::fill_bytes(&mut rng, &mut data);

    let mut file = std::fs::File::create(path).unwrap();
    std::io::Write::write_all(&mut file, &data).unwrap();
}
