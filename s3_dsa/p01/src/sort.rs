use crate::nacci;

const CHUNK_SIZE: usize = 4096;

fn comparator<T>(a: T, b: T, reverse: bool) -> bool
where
    T: Ord,
{
    if reverse {
        a > b
    } else {
        a < b
    }
}

fn process_file<F>(file: std::fs::File, chunk_size: usize, mut callback: F)
where
    F: FnMut(&[u8]),
{
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

fn process_chunk(runs: &mut Vec<Vec<i32>>, data: &[i32], reverse: bool) {
    let mut run = runs.last_mut().unwrap();
    for &curr in data {
        match run.last() {
            Some(&prev) => {
                if comparator(prev, curr, reverse) {
                    run.push(curr);
                } else {
                    runs.push(vec![curr]);
                    run = runs.last_mut().unwrap();
                }
            }
            None => {
                run.push(curr);
            }
        }
    }
}

/// @see: https://en.wikipedia.org/wiki/Polyphase_merge_sort
pub fn polyphase_merge_sort(
    input_path: &std::path::Path,
    output_path: &std::path::Path,
    reverse: bool,
    tape_count: usize,
) {
    if tape_count >= 8 {
        log::warn!("balanced_merge_sort() may perform better at 8 or more tapes");
    }
    let mut runs: Vec<Vec<i32>> = vec![vec![]];

    let input_file = std::fs::File::open(input_path).unwrap();
    process_file(input_file, CHUNK_SIZE, |buffer| {
        let data: &[i32] = bytemuck::try_cast_slice(buffer).unwrap();
        process_chunk(&mut runs, data, reverse);
    });

    let dist = nacci::get_dist(runs.len(), tape_count);
    println!("{dist:?}");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_records() {
        let mut runs: Vec<Vec<i32>> = vec![vec![]];
        let data: &[i32] = &[5, 4, 3, 7, 6, 9];
        process_chunk(&mut runs, data, true);
        assert_eq!(runs, vec![vec![5, 4, 3], vec![7, 6], vec![9]]);
    }
}
