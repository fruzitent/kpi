#[rustfmt::skip]
const ITEMS: &[usize] = &[
    75, 85, 84, 81, 84, 80, 82, 76, 75, 77,
    80, 82, 81, 84, 85, 77, 76, 84, 83, 87,
    78, 77, 88, 86, 87, 79, 80, 79, 78, 87,
    76, 81, 83, 85, 78, 76, 83, 81, 84, 88,
];

fn main() {
    let mut map = std::collections::BTreeMap::new();
    for item in ITEMS.iter() {
        *map.entry(item).or_insert(0) += 1;
    }
    for (key, value) in map.iter() {
        println!("{key}: {value}")
    }
}
