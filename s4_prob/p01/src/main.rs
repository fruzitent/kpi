pub struct Variation<T: Copy + Ord>(std::collections::BTreeMap<T, usize>);

impl<T: Copy + Ord> Variation<T> {
    fn new(items: &[T]) -> Self {
        Self(items.iter().fold(Default::default(), |mut map, &item| {
            *map.entry(item).or_insert(0) += 1;
            map
        }))
    }
}

impl Variation<ordered_float::OrderedFloat<f32>> {
    pub fn new_f32(items: &[f32]) -> Self {
        Self::new(
            &items
                .iter()
                .copied()
                .map(ordered_float::OrderedFloat)
                .collect::<Vec<_>>(),
        )
    }
}

fn main() {
    #[rustfmt::skip]
    const ITEMS: &[i32] = &[
        75, 85, 84, 81, 84, 80, 82, 76, 75, 77,
        80, 82, 81, 84, 85, 77, 76, 84, 83, 87,
        78, 77, 88, 86, 87, 79, 80, 79, 78, 87,
        76, 81, 83, 85, 78, 76, 83, 81, 84, 88,
    ];
    let series = Variation::new(ITEMS);

    let mut builder = tabled::builder::Builder::new();
    for (i, (key, value)) in series.0.iter().enumerate() {
        builder.push_column([format!("x_{i}"), key.to_string(), value.to_string()]);
    }

    let mut table = builder.build();
    table.with(tabled::settings::Style::modern());
    println!("{table}");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        #[rustfmt::skip]
        const ITEMS: &[f32] = &[
            0.87, 0.94, 0.99, 0.90, 0.90, 0.87, 0.85, 0.87,
            0.90, 0.94, 0.87, 0.87, 0.82, 0.90, 0.94, 0.90,
            0.85, 0.85, 0.87, 0.94, 0.81, 0.82, 0.87, 0.97,
            0.90, 0.94, 0.85, 0.81, 0.87, 0.85, 0.90, 0.82,
            0.99, 0.90, 0.94, 0.82, 0.97, 0.81, 0.85, 0.87,
        ];
        let series = Variation::new_f32(ITEMS);
        const EXPECTED: &[(f32, usize)] = &[
            (0.81, 3),
            (0.82, 4),
            (0.85, 6),
            (0.87, 9),
            (0.90, 8),
            (0.94, 6),
            (0.97, 2),
            (0.99, 2),
        ];
        for (value, count) in EXPECTED.iter() {
            assert_eq!(*series.0.get(value.into()).unwrap(), *count);
        }
    }
}
