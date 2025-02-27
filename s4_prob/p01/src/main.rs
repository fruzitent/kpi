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

pub trait IntoOrd<T> {
    fn into_ord(self) -> T;
}

impl IntoOrd<i32> for i32 {
    fn into_ord(self) -> i32 {
        self
    }
}

impl IntoOrd<ordered_float::OrderedFloat<f32>> for f32 {
    fn into_ord(self) -> ordered_float::OrderedFloat<f32> {
        self.into()
    }
}

pub struct Variation<T: Copy + Ord>(std::collections::BTreeMap<T, usize>);

impl<T: Copy + Ord> Variation<T> {
    // TODO: https://en.wikipedia.org/wiki/Histogram#Number_of_bins_and_width
    fn get_count(&self, total: usize) -> usize {
        let count = total.isqrt();
        log::debug!("n = {count}");
        count
    }

    fn get_first_key(&self) -> Option<T> {
        self.0.first_key_value().map(|(key, _)| *key)
    }

    fn get_last_key(&self) -> Option<T> {
        self.0.last_key_value().map(|(key, _)| *key)
    }

    fn get_step(&self, count: usize) -> T
    where
        T: num_traits::cast::FromPrimitive
            + std::fmt::Display
            + std::ops::Div<Output = T>
            + std::ops::Sub<Output = T>,
    {
        let x_1 = self.get_first_key().unwrap();
        let x_k = self.get_last_key().unwrap();
        let step = (x_k - x_1) / T::from_usize(count).unwrap();
        log::debug!("h = (x_k - x_1) / m = ({x_k} - {x_1}) / {count} = {step}");
        step
    }

    fn get_total(&self) -> usize {
        let total = self.0.values().sum();
        log::debug!("n = {total}");
        total
    }
}

impl<T: Copy + Ord, U: Copy + IntoOrd<T>> From<&[U]> for Variation<T> {
    fn from(items: &[U]) -> Self {
        Self(items.iter().fold(Default::default(), |mut map, &item| {
            *map.entry(item.into_ord()).or_insert(0) += 1;
            map
        }))
    }
}

impl<T: Copy + Ord + std::fmt::Display> std::fmt::Display for Variation<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut builder = tabled::builder::Builder::new();
        for (i, (key, value)) in self.0.iter().enumerate() {
            builder.push_column([format!("x_{i}"), key.to_string(), value.to_string()]);
        }
        let mut table = builder.build();
        table.with(tabled::settings::Style::modern());
        write!(f, "{table}")
    }
}

fn main() {
    setup_logger().unwrap();

    #[rustfmt::skip]
    const ITEMS: &[i32] = &[
        75, 85, 84, 81, 84, 80, 82, 76, 75, 77,
        80, 82, 81, 84, 85, 77, 76, 84, 83, 87,
        78, 77, 88, 86, 87, 79, 80, 79, 78, 87,
        76, 81, 83, 85, 78, 76, 83, 81, 84, 88,
    ];
    let series = Variation::from(ITEMS);
    let total = series.get_total();
    let count = series.get_count(total);
    let step = series.get_step(count);
    println!("{series}");
}

#[cfg(test)]
mod tests {
    use super::*;

    macro_rules! assert_delta {
        ($x:expr, $y:expr, $d:expr) => {
            if !($x - $y < $d || $y - $x < $d) {
                panic!();
            }
        };
    }

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
        let series = Variation::from(ITEMS);
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
        let total = series.get_total();
        assert_eq!(total, 40);
        let count = series.get_count(total);
        assert_eq!(count, 6);
        let step = series.get_step(count);
        assert_delta!(step.0, 0.03, 1e-3);
    }
}
