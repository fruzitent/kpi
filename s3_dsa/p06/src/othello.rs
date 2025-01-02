pub enum CellKind {
    Black,
    White,
}

#[derive(Default)]
pub struct Cell {
    pub kind: Option<CellKind>,
}

pub struct Board<Cell>
where
    Cell: Default,
{
    pub cells: Vec<Cell>,
    pub stride: usize,
}

impl<Cell> Board<Cell>
where
    Cell: Default,
{
    pub fn new(stride: usize) -> Self {
        assert!(stride >= 4 && stride % 2 == 0);
        Self {
            cells: (0..stride.pow(2)).map(|_| Cell::default()).collect(),
            stride,
        }
    }
}

impl<Cell> std::ops::Index<usize> for Board<Cell>
where
    Cell: Default,
{
    type Output = [Cell];

    fn index(&self, index: usize) -> &Self::Output {
        &self.cells[index * self.stride..(index + 1) * self.stride]
    }
}
