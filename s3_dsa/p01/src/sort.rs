const CHUNK_SIZE: usize = 4096;

fn process_chunk(file: std::fs::File, chunk_size: usize, callback: fn(buffer: &[u8])) {
    let mut reader = std::io::BufReader::with_capacity(chunk_size, file);
    loop {
        let mut buffer = vec![0; chunk_size].into_boxed_slice();
        let length = std::io::Read::read(&mut reader, &mut buffer).unwrap();
        if length == 0 {
            break;
        }
        callback(&buffer[..length]);
    }
}

/// @see: https://en.wikipedia.org/wiki/Polyphase_merge_sort
pub fn polyphase_merge_sort(input_path: &std::path::Path, output_path: &std::path::Path, tape_count: usize) {
    if tape_count >= 8 {
        log::warn!("balanced_merge_sort() may perform better at 8 or more tapes");
    }
    let input_file = std::fs::File::open(input_path).unwrap();
    process_chunk(input_file, CHUNK_SIZE, |buffer| {
        let data: &[i32] = bytemuck::try_cast_slice(buffer).unwrap();
        println!("{data:?}");
    })
}
