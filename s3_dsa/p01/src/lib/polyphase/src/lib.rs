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
    #[cfg(feature = "init_merge")]
    let mut run = runs.last_mut().unwrap();

    for &curr in data.iter() {
        #[cfg(not(feature = "init_merge"))]
        // TODO: unused variable: reverse
        runs.push(vec![curr]);

        #[cfg(feature = "init_merge")]
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

type Tape<T> = Vec<Vec<T>>;

fn write_to_tape<T>(series: Tape<T>, dist: &mut [usize], tapes: &mut [Tape<T>])
where
    T: Clone,
{
    let mut iter = series.iter();
    for (i, fib) in dist.iter_mut().enumerate() {
        while *fib != 0 {
            if let Some(s) = iter.next() {
                tapes[i].push(s.clone());
            } else {
                tapes[i].push(vec![]);
            }
            *fib -= 1;
        }
    }
}

/// @see: https://en.wikipedia.org/wiki/Polyphase_merge_sort
pub fn sort(input_path: &std::path::Path, output_path: &std::path::Path, reverse: bool, tape_count: usize) {
    if tape_count >= 8 {
        log::warn!("balanced_merge_sort() may perform better at 8 or more tapes");
    }

    let mut series: Tape<i32> = vec![
        #[cfg(feature = "init_merge")]
        vec![],
    ];

    let input_file = std::fs::File::open(input_path).unwrap();
    process_file(input_file, CHUNK_SIZE, |buffer| {
        let data: &[i32] = bytemuck::try_cast_slice(buffer).unwrap();
        process_chunk(&mut series, data, reverse);
    });
    log::debug!("series={series:?}");

    let mut dist = nacci::get_dist(series.len(), tape_count);
    log::debug!("dist={dist:?}");

    let mut tapes: Vec<Tape<i32>> = vec![vec![]; tape_count];
    write_to_tape(series, &mut dist, &mut tapes);
    log::debug!("tapes={tapes:?}");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_dummy_series() {
        let mut dist = vec![1, 2, 4];
        let series: Tape<i32> = vec![vec![6], vec![3, 20], vec![15], vec![13], vec![8, 10, 17], vec![1]];
        let tape_count: usize = 4;

        let mut tapes: Vec<Tape<i32>> = vec![vec![]; tape_count];
        write_to_tape(series, &mut dist, &mut tapes);
        assert_eq!(
            tapes,
            vec![
                vec![vec![6]],
                vec![vec![3, 20], vec![15]],
                vec![vec![13], vec![8, 10, 17], vec![1], vec![]],
                vec![],
            ]
        );
    }

    #[test]
    fn get_series() {
        let mut series: Tape<i32> = vec![
            #[cfg(feature = "init_merge")]
            vec![],
        ];

        let data: &[i32] = &[5, 4, 3, 7, 6, 9];
        process_chunk(&mut series, data, true);

        #[cfg(feature = "init_merge")]
        assert_eq!(series, vec![vec![5, 4, 3], vec![7, 6], vec![9]]);

        #[cfg(not(feature = "init_merge"))]
        assert_eq!(series, vec![vec![5], vec![4], vec![3], vec![7], vec![6], vec![9]]);
    }
}
