/// @see: https://en.wikipedia.org/wiki/Generalizations_of_Fibonacci_numbers#Fibonacci_numbers_of_higher_order
pub struct Nacci {
    // TODO: replace usize with T
    cache: Vec<usize>,
    index: usize,
    length: usize,
    total: usize,
}

impl Nacci {
    pub fn new(order: usize, length: usize) -> Option<Self> {
        if order < 2 {
            // TODO: https://en.wikipedia.org/wiki/Negafibonacci_coding
            return None;
        }
        let mut cache = vec![0; order];
        cache[order - 1] = 1;
        Some(Self {
            cache,
            index: 0,
            length,
            total: 1,
        })
    }
}

impl Iterator for Nacci {
    type Item = usize;

    fn collect<B: FromIterator<Self::Item>>(self) -> B
    where
        Self: Sized,
    {
        FromIterator::from_iter(self)
    }

    fn next(&mut self) -> Option<Self::Item> {
        if self.length == 0 {
            return None;
        }
        self.length -= 1;
        let result = self.cache[self.index];
        self.cache[self.index] = self.total;
        self.index = (self.index + 1) % self.cache.len();
        self.total = self.total * 2 - result;
        Some(result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert!(Nacci::new(1, 16).is_none());
        assert_eq!(
            Nacci::new(2, 16).unwrap().collect::<Vec<_>>(),
            vec![0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]
        );
        assert_eq!(
            Nacci::new(3, 16).unwrap().collect::<Vec<_>>(),
            vec![0, 0, 1, 1, 2, 4, 7, 13, 24, 44, 81, 149, 274, 504, 927, 1705]
        );
        assert_eq!(
            Nacci::new(4, 16).unwrap().collect::<Vec<_>>(),
            vec![0, 0, 0, 1, 1, 2, 4, 8, 15, 29, 56, 108, 208, 401, 773, 1490]
        );
        assert_eq!(Nacci::new(5, 0).unwrap().collect::<Vec<usize>>(), vec![]);
    }
}
